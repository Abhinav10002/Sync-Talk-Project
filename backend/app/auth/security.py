from datetime import datetime, timedelta
import bcrypt
from jose import JWTError, jwt
from app.config import settings

def hash_password(password: str) -> str:
    """
    Takes a plaintext password string, converts it to bytes, 
    hashes it with a fresh salt via bcrypt, and returns a decoded string.
    """
    password_bytes = password.encode('utf-8')
    # Generate a random salt and hash the password
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compares a plaintext password against a stored bcrypt hash string.
    Returns True if they match, False otherwise.
    """
    try:
        plain_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Generates a cryptographically signed JWT token containing session claims.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt