from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    """Validation schema for sending incoming messages via HTTP rest routes."""
    recipient_id: int
    content: str

class MessageResponse(BaseModel):
    """Output structural configuration mapping existing data rows out to UI components."""
    id: int
    sender_id: int
    recipient_id: int
    content: str
    timestamp: datetime
    is_read: bool

    class Config:
        from_attributes = True