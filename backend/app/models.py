from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# User Models
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class User(UserBase):
    id: UUID
    createdAt: datetime
    hashed_password: Optional[str] = Field(default=None, exclude=True)
    
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Auth Response
class AuthResponse(BaseModel):
    user: User
    token: str

# Leaderboard Models
class LeaderboardEntry(BaseModel):
    id: UUID
    userId: UUID
    username: str
    score: int = Field(..., ge=0)
    mode: str
    timestamp: datetime
    rank: Optional[int] = None
    duration: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class ScoreSubmit(BaseModel):
    score: int = Field(..., ge=0)
    mode: str
    duration: Optional[int] = None

# Game Session Models
class GameState(BaseModel):
    direction: Optional[str] = None
    snake: Optional[List[dict]] = None
    food: Optional[dict] = None
    gameOver: Optional[bool] = None

class GameSession(BaseModel):
    id: UUID
    userId: UUID
    username: str
    score: int = Field(0, ge=0)
    isActive: bool = True
    mode: str
    startedAt: datetime

    model_config = ConfigDict(from_attributes=True)

class GameSessionDetails(GameSession):
    currentScore: int = 0
    gameState: Optional[GameState] = None
    lastUpdatedAt: Optional[datetime] = None

class SessionStart(BaseModel):
    mode: str

class SessionUpdate(BaseModel):
    currentScore: Optional[int] = None
    gameState: Optional[GameState] = None
    
class SessionEnd(BaseModel):
    finalScore: int
