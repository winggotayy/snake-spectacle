from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timezone

from ..models import LeaderboardEntry, ScoreSubmit, User, LeaderboardEntry
from ..db import db
from ..auth import get_current_user

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"],
)

@router.get("", response_model=dict)
async def get_leaderboard(
    mode: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    entries = db.get_leaderboard(mode=mode, limit=limit, offset=offset)
    total = db.get_total_scores(mode=mode)
    return {"data": entries, "total": total}

@router.post("/submit", response_model=LeaderboardEntry, status_code=status.HTTP_201_CREATED)
async def submit_score(
    score_data: ScoreSubmit,
    current_user: User = Depends(get_current_user)
):
    entry = LeaderboardEntry(
        id=uuid4(),
        userId=current_user.id,
        username=current_user.username,
        score=score_data.score,
        mode=score_data.mode,
        duration=score_data.duration,
        timestamp=datetime.now(timezone.utc)
    )
    return db.add_score(entry)
