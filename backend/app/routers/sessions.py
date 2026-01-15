from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import uuid4
from datetime import datetime, timezone

from ..models import (
    GameSession, GameSessionDetails, SessionStart, SessionEnd, SessionUpdate, User
)
from ..db import db
from ..auth import get_current_user

router = APIRouter(
    prefix="/sessions",
    tags=["Game Sessions"],
)

@router.get("/active", response_model=dict)
async def get_active_sessions(limit: int = Query(10, ge=1, le=100)):
    sessions = db.get_active_sessions(limit=limit)
    return {"data": sessions, "total": len(sessions)} # Total might be inaccurate in real DB pagination but fine for mock

@router.get("/{session_id}", response_model=GameSessionDetails)
async def get_session(session_id: str):
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session

@router.post("/start", response_model=GameSessionDetails, status_code=status.HTTP_201_CREATED)
async def start_session(
    session_data: SessionStart,
    current_user: User = Depends(get_current_user)
):
    session_id = uuid4()
    new_session = GameSessionDetails(
        id=session_id,
        userId=current_user.id,
        username=current_user.username,
        score=0,
        isActive=True,
        mode=session_data.mode,
        startedAt=datetime.now(timezone.utc),
        currentScore=0
    )
    return db.create_session(new_session)

@router.post("/{session_id}/end", response_model=GameSessionDetails)
async def end_session(
    session_id: str,
    end_data: SessionEnd,
    current_user: User = Depends(get_current_user)
):
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    
    # Verify user owns the session
    if str(session.userId) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to end this session")
        
    updates = {
        "isActive": False,
        "score": end_data.finalScore,
        "currentScore": end_data.finalScore
    }
    
    updated_session = db.update_session(session_id, updates)
    return updated_session

@router.patch("/{session_id}/update", response_model=GameSessionDetails)
async def update_session(
    session_id: str,
    update_data: SessionUpdate,
    current_user: User = Depends(get_current_user)
):
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    # Verify user owns the session
    if str(session.userId) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized to update this session")
    
    updates = update_data.model_dump(exclude_unset=True)
    if update_data.gameState is not None:
        updates["gameState"] = update_data.gameState
        
    if updates:
        updated_session = db.update_session(session_id, updates)
        return updated_session
        
    return session
