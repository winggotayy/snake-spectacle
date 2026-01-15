from fastapi import FastAPI
from .routers import auth, leaderboard, sessions

app = FastAPI(
    title="Neon Snake API",
    description="Backend API for the Neon Snake arcade game application",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(leaderboard.router)
app.include_router(sessions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Neon Snake API"}
