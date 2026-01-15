def test_get_leaderboard_empty(client):
    response = client.get("/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["data"] == []

def test_submit_score(client, auth_headers):
    response = client.post(
        "/leaderboard/submit",
        headers=auth_headers,
        json={"score": 100, "mode": "walls", "duration": 60}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["score"] == 100
    assert data["mode"] == "walls"
    assert data["rank"] == 1

def test_submit_score_unauth(client):
    response = client.post(
        "/leaderboard/submit",
        json={"score": 100, "mode": "walls", "duration": 60}
    )
    assert response.status_code == 401

def test_leaderboard_ordering(client, auth_headers):
    # Submit 3 scores
    client.post("/leaderboard/submit", headers=auth_headers, json={"score": 100, "mode": "walls"})
    client.post("/leaderboard/submit", headers=auth_headers, json={"score": 300, "mode": "walls"})
    client.post("/leaderboard/submit", headers=auth_headers, json={"score": 200, "mode": "walls"})
    
    response = client.get("/leaderboard?mode=walls")
    data = response.json()["data"]
    
    assert len(data) == 3
    assert data[0]["score"] == 300
    assert data[1]["score"] == 200
    assert data[2]["score"] == 100
    assert data[0]["rank"] == 1
    assert data[1]["rank"] == 2
    assert data[2]["rank"] == 3
