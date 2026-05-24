from pydantic import BaseModel

class Token(BaseModel):
    """Schema formatting the access tokens returned on login success events."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Internal validation object parsing credentials extracted directly from token payloads."""
    username: str | None = None