from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Import all REST sub-routers down the modular directory tree
from app.routes import auth, users, messages

# Import our Real-Time duplex router module
from app.websocket import endpoint

# Explicitly import SQLAlchemy models to register table configurations with Declarative Base metadata
from app.models.user import User
from app.models.message import Message

# Instruct the database engine engine to physically compile the database schemas inside SQLite on bootup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SyncTalk API",
    description="Production-grade real-time backend engine for the SyncTalk messaging application.",
    version="1.0.0"
)

import os

# Configure Cross-Origin Resource Sharing (CORS) rules
# Essential to allow our React frontend client instances to communicate securely with this API gateway
origins = [
    "http://localhost:3000",   # Default React Create-React-App context link
    "http://localhost:5173",   # Default modern Vite development server connection link
]

# Support additional allowed origins from dynamic environment variable (comma-separated)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    custom_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    origins.extend(custom_origins)

# Ensure uniqueness of registration targets
origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API sub-routers underneath our unified /api prefix context layout path
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(messages.router, prefix="/api")

# Mount our Real-time Stateful WebSocket gateway path directly onto the core application layer
app.include_router(endpoint.router)

@app.get("/", tags=["Root Gateway"])
def read_root():
    """
    Root endpoint offering a simple landing message welcoming API clients.
    """
    return {
        "message": "Welcome to the SyncTalk API Core Service Engine!",
        "documentation": "Append /docs to your current browser URL path string to open the interactive playground."
    }

@app.get("/health", tags=["Health Diagnostics"])
def health_check():
    """
    System diagnostic check verifying service status and database configuration health.
    """
    return {
        "status": "online",
        "app_name": "SyncTalk Server Core",
        "database_configured": bool(settings.DATABASE_URL)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)