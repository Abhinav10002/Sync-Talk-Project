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
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback_insecure_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./synctalk.db")

    class Config:
        case_sensitive = True

# Instantiate a single configuration engine object to import throughout the app
settings = Settings()