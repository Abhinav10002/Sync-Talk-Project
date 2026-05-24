from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    """
    Central state broker managing live active WebSocket sockets,
    routing private messages, and broadcasting global user presence events.
    """
    def __init__(self):
        # Maps user_id (int) to their active individual WebSocket connection instance
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        """
        Accepts an incoming connection, tracks it in memory, and alerts peers.
        """
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        # Broadcast globally that this user has come online
        await self.broadcast_presence_update(user_id, is_online=True)

    async def disconnect(self, user_id: int):
        """
        Removes an active connection from memory when a client disconnects.
        """
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            # Broadcast globally that this user has gone offline
            await self.broadcast_presence_update(user_id, is_online=False)

    async def send_private_message(self, message_payload: dict, recipient_id: int) -> bool:
        """
        Routes a payload directly to a specific user's socket if they are online.
        Returns True if delivered immediately, False if the target is offline.
        """
        target_socket = self.active_connections.get(recipient_id)
        if target_socket:
            try:
                await target_socket.send_text(json.dumps(message_payload))
                return True
            except Exception:
                # Handle unexpected broken socket states gracefully
                return False
        return False

    async def broadcast_presence_update(self, user_id: int, is_online: bool):
        """
        Alerts all connected system clients instantly when a user's status updates.
        """
        payload = {
            "event": "presence_change",
            "data": {
                "user_id": user_id,
                "is_online": is_online
            }
        }
        await self.broadcast_to_all(payload)

    async def broadcast_to_all(self, payload: dict):
        """
        Helper utility running concurrent dispatches across every connected pipeline link.
        """
        message_text = json.dumps(payload)
        # Iterate over a shallow copy copy layout to avoid runtime mutation exceptions
        for connection in list(self.active_connections.values()):
            try:
                await connection.send_text(message_text)
            except Exception:
                # Stale or dead links are ignored here; handled by explicit disconnect routines
                pass

# Instantiate a single global instance of our manager to import across files
manager = ConnectionManager()