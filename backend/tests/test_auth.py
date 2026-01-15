def test_signup(client):
    response = client.post(
        "/auth/signup",
        json={"username": "newuser", "email": "new@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == "newuser"
    assert "token" in data

def test_signup_duplicate_email(client):
    client.post(
        "/auth/signup",
        json={"username": "user1", "email": "dup@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/signup",
        json={"username": "user2", "email": "dup@example.com", "password": "password123"}
    )
    assert response.status_code == 409

def test_login(client):
    client.post(
        "/auth/signup",
        json={"username": "loginuser", "email": "login@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "token" in response.json()

def test_login_invalid(client):
    response = client.post(
        "/auth/login",
        json={"email": "nonexistent@example.com", "password": "password123"}
    )
    assert response.status_code == 401

def test_me(client, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
