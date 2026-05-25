import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Force load the .env file from the backend directory path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    """
    Application settings configuration manager.
    Parses environment variables and provides strict typing.
    """
    ENV: str = "development"  # Can be 'development' or 'production'
    SECRET_KEY: str = "fallback_insecure_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./synctalk.db"

    class Config:
        case_sensitive = True

# Instantiate a single configuration engine object to import throughout the app
settings = Settings()

# Validate security settings for production environments
if settings.ENV == "production":
    if settings.SECRET_KEY == "fallback_insecure_secret_key":
        raise ValueError(
            "CRITICAL SECURITY ALERT: Running in 'production' environment but "
            "SECRET_KEY is still configured with the insecure local fallback. "
            "You MUST specify a secure, random SECRET_KEY environment variable."
        )

# Automatically ensure parent directory exists for SQLite database configuration
if settings.DATABASE_URL.startswith("sqlite:///"):
    db_file_path = settings.DATABASE_URL.replace("sqlite:///", "")
    # Resolve absolute path relative to BASE_DIR if it's a relative SQLite path
    if not os.path.isabs(db_file_path):
        db_file_path = os.path.abspath(os.path.join(BASE_DIR, db_file_path))
    
    db_dir = os.path.dirname(db_file_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
