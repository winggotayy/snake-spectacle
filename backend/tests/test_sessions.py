def create_session_helper(client, auth_headers):
    response = client.post(
        "/sessions/start",
        headers=auth_headers,
        json={"mode": "walls"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["isActive"] == True
    assert data["mode"] == "walls"
    return data["id"]

def test_create_session(client, auth_headers):
    create_session_helper(client, auth_headers)

def test_get_active_sessions(client, auth_headers):
    sess_id = create_session_helper(client, auth_headers)
    response = client.get("/sessions/active")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) >= 1
    assert data["data"][0]["id"] == sess_id

def test_get_session_details(client, auth_headers):
    sess_id = create_session_helper(client, auth_headers)
    response = client.get(f"/sessions/{sess_id}")
    assert response.status_code == 200
    assert response.json()["id"] == sess_id

def test_update_session(client, auth_headers):
    sess_id = create_session_helper(client, auth_headers)
    response = client.patch(
        f"/sessions/{sess_id}/update",
        headers=auth_headers,
        json={"currentScore": 50, "gameState": {"direction": "UP"}}
    )
    assert response.status_code == 200
    assert response.json()["currentScore"] == 50
    assert response.json()["gameState"]["direction"] == "UP"

def test_end_session(client, auth_headers):
    sess_id = create_session_helper(client, auth_headers)
    response = client.post(
        f"/sessions/{sess_id}/end",
        headers=auth_headers,
        json={"finalScore": 150}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["isActive"] == False
    assert data["score"] == 150
