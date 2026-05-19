from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=20, description="Unique username identifier")
    email: EmailStr

class UserCreate(UserBase):
    """Validation schema for incoming registration payloads."""
    password: str = Field(..., min_length=6, description="Plaintext raw user password")

class UserResponse(UserBase):
    """Data transmission schema for outgoing profile data responses."""
    id: int
    is_online: bool
    last_seen: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read standard ORM objects seamlessly