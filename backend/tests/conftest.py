from fastapi.testclient import TestClient
import pytest
from app.main import app
from app.db import db

@pytest.fixture
def client():
    # Clear DB before each test module/session if needed, 
    # but for simplicity we'll just clear it here or assume isolation is tricky with singleton.
    # A better mock DB would allow reset.
    db.users = {}
    db.leaderboard = []
    db.sessions = {}
    return TestClient(app)

@pytest.fixture
def auth_headers(client):
    # Create a user and login to get token
    user_data = {"username": "testuser", "email": "test@example.com", "password": "password123"}
    client.post("/auth/signup", json=user_data)
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "password123"})
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}
