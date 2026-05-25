from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List

from app.database import get_db
from app.models.message import Message
from app.schemas.message import MessageResponse
from app.routes.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/messages", tags=["Historical Chat Management"])

@router.get("/{recipient_id}", response_model=List[MessageResponse])
def get_chat_history(
    recipient_id: int,
    limit: int = Query(20, ge=1, le=100, description="Number of historical records to return"),
    offset: int = Query(0, ge=0, description="Number of historical records to bypass skipping forward"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the paginated private conversation history between the authenticated user and a specific peer.
    Sorts historical records chronologically from oldest to newest for direct UI placement.
    """
    # Query logic: Message must be either (Sender=Me AND Recipient=Peer) OR (Sender=Peer AND Recipient=Me)
    chat_logs = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == recipient_id),
            and_(Message.sender_id == recipient_id, Message.recipient_id == current_user.id)
        )
    ).order_by(Message.timestamp.desc())\
     .offset(offset)\
     .limit(limit)\
     .all()

    # Reverse the array list order so they show up chronologically (oldest to newest) in the chat feed view
    return chat_logs[::-1]