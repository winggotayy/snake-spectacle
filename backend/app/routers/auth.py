from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta, datetime, timezone
from typing import Annotated
from uuid import uuid4

from ..models import User, UserCreate, UserLogin, AuthResponse
from ..auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from ..db import db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    # Check if email exists
    if db.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Check if username exists
    if db.get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        id=uuid4(),
        username=user_data.username,
        email=user_data.email,
        createdAt=datetime.now(timezone.utc),
        hashed_password=hashed_password
    )
    
    db.create_user(new_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    
    return AuthResponse(user=new_user, token=access_token)

@router.post("/login", response_model=AuthResponse)
async def login(login_data: UserLogin):
    user = db.get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not user.hashed_password or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return AuthResponse(user=user, token=access_token)

@router.post("/logout")
async def logout(current_user: Annotated[User, Depends(get_current_user)]):
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
