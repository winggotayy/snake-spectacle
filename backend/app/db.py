from typing import Dict, List, Optional
from datetime import datetime, timezone
from .models import User, LeaderboardEntry, GameSessionDetails

class MockDB:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.leaderboard: List[LeaderboardEntry] = []
        self.sessions: Dict[str, GameSessionDetails] = {}
        self._seed_data()

    def _seed_data(self):
        # Fake data
        from uuid import uuid4
        from datetime import datetime, timezone, timedelta
        
        # Common hash for 'password123'
        pwd_hash = "$2b$12$tRNTpmIt9Qq5wghU0uyN0OIe3DcWnrom2JeCjMkYo735LK54RLgMe"
        
        # 1. Users
        users_data = [
            ("SnakeMaster", "snakemaster@example.com"),
            ("NeonSlayer", "neon@example.com"),
            ("ProGamer", "hacker@example.com")
        ]
        
        created_users = []
        for username, email in users_data:
            u_id = uuid4()
            user = User(
                id=u_id,
                username=username,
                email=email,
                createdAt=datetime.now(timezone.utc),
                hashed_password=pwd_hash
            )
            self.users[str(u_id)] = user
            created_users.append(user)
            
        # 2. Leaderboard
        # SnakeMaster is good at walls
        self.add_score(LeaderboardEntry(
            id=uuid4(), userId=created_users[0].id, username=created_users[0].username,
            score=5000, mode="walls", duration=300, timestamp=datetime.now(timezone.utc) - timedelta(days=1)
        ))
        
        # NeonSlayer is good at passthrough
        self.add_score(LeaderboardEntry(
            id=uuid4(), userId=created_users[1].id, username=created_users[1].username,
            score=4500, mode="passthrough", duration=250, timestamp=datetime.now(timezone.utc) - timedelta(hours=2)
        ))
        
        # ProGamer is okay
        self.add_score(LeaderboardEntry(
            id=uuid4(), userId=created_users[2].id, username=created_users[2].username,
            score=3000, mode="walls", duration=180, timestamp=datetime.now(timezone.utc) - timedelta(days=2)
        ))
        
        # 3. Active Session for NeonSlayer
        s_id = uuid4()
        session = GameSessionDetails(
            id=s_id,
            userId=created_users[1].id,
            username=created_users[1].username,
            score=1200,
            isActive=True,
            mode="walls",
            startedAt=datetime.now(timezone.utc) - timedelta(minutes=5),
            currentScore=1200,
            gameState={"direction": "UP", "snake": [{"x": 10, "y": 10}], "food": {"x": 5, "y": 5}}
        )
        self.create_session(session)

    def get_user_by_email(self, email: str) -> Optional[User]:
        for user in self.users.values():
            if user.email == email:
                return user
        return None

    def get_user_by_username(self, username: str) -> Optional[User]:
        for user in self.users.values():
            if user.username == username:
                return user
        return None

    def create_user(self, user: User) -> User:
        self.users[str(user.id)] = user
        return user

    def add_score(self, entry: LeaderboardEntry) -> LeaderboardEntry:
        self.leaderboard.append(entry)
        # Sort leaderboard by score descending
        self.leaderboard.sort(key=lambda x: x.score, reverse=True)
        # Update ranks
        for i, item in enumerate(self.leaderboard):
            item.rank = i + 1
        return entry

    def get_leaderboard(self, mode: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[LeaderboardEntry]:
        filtered = self.leaderboard
        if mode:
            filtered = [entry for entry in filtered if entry.mode == mode]
        return filtered[offset : offset + limit]
    
    def get_total_scores(self, mode: Optional[str] = None) -> int:
        if mode:
            return len([entry for entry in self.leaderboard if entry.mode == mode])
        return len(self.leaderboard)

    def create_session(self, session: GameSessionDetails) -> GameSessionDetails:
        self.sessions[str(session.id)] = session
        return session

    def get_session(self, session_id: str) -> Optional[GameSessionDetails]:
        return self.sessions.get(session_id)

    def get_active_sessions(self, limit: int = 10) -> List[GameSessionDetails]:
        active = [s for s in self.sessions.values() if s.isActive]
        # Sort by most recently updated or created
        active.sort(key=lambda x: x.lastUpdatedAt or x.startedAt, reverse=True)
        return active[:limit]

    def update_session(self, session_id: str, updates: dict) -> Optional[GameSessionDetails]:
        if session_id in self.sessions:
            session = self.sessions[session_id]
            for key, value in updates.items():
                if hasattr(session, key):
                    setattr(session, key, value)
            session.lastUpdatedAt = datetime.now(timezone.utc)
            return session
        return None

db = MockDB()
