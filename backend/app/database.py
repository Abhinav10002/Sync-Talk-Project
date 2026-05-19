from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Adjust connection properties for SQLite specific multi-threading execution
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Instantiate Core Engine 
engine = create_engine(
    settings.DATABASE_URL, 
    connect_args=connect_args,
    echo=False # Switch to True if you want to inspect raw SQL statements in development
)

# Construct a Session Local Factory configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for Model Mapping Inheritance
Base = declarative_base()

def get_db():
    """
    FastAPI Dependency Provider for Database Session Lifecycles.
    Yields an active database session context and guarantees close execution.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()