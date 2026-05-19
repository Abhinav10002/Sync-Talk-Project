from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.routes.deps import get_current_user

router = APIRouter(prefix="/users", tags=["User Management Directory"])

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches the complete listing of all registered users inside SyncTalk 
    except for the currently authenticated user making the request.
    """
    # Query all users excluding yourself
    users = db.query(User).filter(User.id != current_user.id).all()
    return users

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the profile data card configuration for the currently validated session worker.
    """
    return current_user