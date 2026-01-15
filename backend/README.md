# Neon Snake - Backend API

This is the backend API for the Neon Snake arcade game, built with **FastAPI**. It handles user authentication, leaderboard management, and game session state.

## 🚀 Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Server**: Uvicorn
- **Dependency Management**: [uv](https://github.com/astral-sh/uv)
- **Validation**: Pydantic v2
- **Testing**: Pytest
- **Authentication**: JWT & Bcrypt

## 🛠️ Installation

1. **Install `uv`** (if not already installed):
   ```bash
   pip install uv
   ```

2. **Install Dependencies**:
   Navigate to the `backend` directory and sync dependencies:
   ```bash
   cd backend
   uv sync
   ```

## 🏃 Running the Server

Start the development server with auto-reload:

```bash
uv run uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`.

### 📚 API Documentation

Once the server is running, you can explore the API using the interactive documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🧪 Running Tests

Run the test suite using `pytest`:

```bash
uv run pytest
```

## 💾 Mock Database & Seed Data

Currently, the application uses an **in-memory mock database** (`app/db.py`).
**Note**: All data is lost when the server restarts.

The database is automatically seeded with the following data on startup:

### Users
| Username | Email | Password |
|----------|-------|----------|
| `SnakeMaster` | `snakemaster@example.com` | `password123` |
| `NeonSlayer` | `neon@example.com` | `password123` |
| `ProGamer` | `hacker@example.com` | `password123` |

### Leaderboard
Pre-populated with sample scores for "walls" and "passthrough" modes.

### Active Sessions
One active game session is initialized for user `NeonSlayer`.