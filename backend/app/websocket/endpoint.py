from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import json

from app.database import get_db
from app.config import settings
from app.models.user import User
from app.models.message import Message
from app.websocket.manager import manager

router = APIRouter(tags=["Real-time Engine Gateway"])

def get_websocket_user(token: str, db: Session) -> User | None:
    """
    Decodes query string token signatures within WebSocket handshakes.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return db.query(User).filter(User.username == username).first()
    except JWTError:
        return None

@router.websocket("/ws")
async def websocket_gateway(websocket: WebSocket, token: str = None, db: Session = Depends(get_db)):
    """
    Primary duplex router handling live text streams and presence events.
    """
    # Fallback to query parameter token extraction if not provided explicitly by position route
    if not token:
        token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Validate the user's token authentication pass
    user = get_websocket_user(token, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Initialize connection: register in manager and set database status to online
    user.is_online = True
    db.commit()
    await manager.connect(user.id, websocket)

    try:
        # Enter infinite stateful communication read-loop handler
        while True:
            # Await text strings arriving from the client UI application
            raw_data = await websocket.receive_text()
            payload = json.loads(raw_data)
            
            event_type = payload.get("event")
            event_data = payload.get("data", {})

            if event_type == "private_message":
                recipient_id = int(event_data.get("recipient_id"))
                content = event_data.get("content", "").strip()

                if recipient_id and content:
                    # 1. Persist the message record into our SQLite database archive layer
                    new_msg = Message(sender_id=user.id, recipient_id=recipient_id, content=content)
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    # 2. Format a synchronized JSON dispatch package layout
                    outbound_payload = {
                        "event": "new_message",
                        "data": {
                            "id": new_msg.id,
                            "sender_id": new_msg.sender_id,
                            "recipient_id": new_msg.recipient_id,
                            "content": new_msg.content,
                            "timestamp": new_msg.timestamp.isoformat(),
                            "is_read": new_msg.is_read
                        }
                    }

                    # Deliver live to the recipient if they are online
                    await manager.send_private_message(outbound_payload, recipient_id)
                    # Mirror echo dispatch back to the sender source tab context for confirmation feedback
                    await manager.send_private_message(outbound_payload, user.id)

            elif event_type == "typing_status":
                recipient_id = int(event_data.get("recipient_id"))
                is_typing = bool(event_data.get("is_typing"))
                
                # Forward typing status events directly to the target conversation peer
                typing_payload = {
                    "event": "typing_status",
                    "data": {
                        "sender_id": user.id,
                        "is_typing": is_typing
                    }
                }
                await manager.send_private_message(typing_payload, recipient_id)

    except WebSocketDisconnect:
        # Gracefully handle explicit exits or connection dropouts
        await manager.disconnect(user.id)
        user.is_online = False
        db.commit()
        
    except Exception as e:
        # Fallback security catch ensuring state database stability remains absolute
        await manager.disconnect(user.id)
        user.is_online = False
        db.commit()