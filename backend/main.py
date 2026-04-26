"""
FastAPI application entry point.

Architecture:
  - Lifespan handler initializes MongoDB via Beanie on startup
  - CORS configured for the React frontend dev server
  - All routers mounted with /api/v1 prefix
  - SlowAPI rate limiting applied globally
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import settings
from middleware.rate_limit import limiter
from models.user_model import User
from models.alert_model import Alert
from models.emotion_model import Emotion
from models.attendance_model import Attendance

from routes.auth_routes import router as auth_router
from routes.classroom_routes import router as classroom_router
from routes.teacher_routes import router as teacher_router
from routes.principal_routes import router as principal_router
from routes.websocket_routes import router as ws_router


# ─── Lifespan — DB init and cleanup ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    client = AsyncIOMotorClient(settings.mongo_uri)
    await init_beanie(
        database=client[settings.database_name],
        document_models=[User, Alert, Emotion, Attendance],
    )
    print(f"✅ Connected to MongoDB: {settings.database_name}")
    yield
    # Shutdown
    client.close()
    print("🔌 MongoDB connection closed")


# ─── App initialization ──────────────────────────────────────────────────────

app = FastAPI(
    title="AI Classroom Rating System",
    description="Real-time classroom discipline monitoring using AI, NLP, and emotion detection.",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiter state
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Global exception handlers ───────────────────────────────────────────────

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please slow down."},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred.", "error": str(exc)},
    )


# ─── Routers ─────────────────────────────────────────────────────────────────

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(classroom_router, prefix=API_PREFIX)
app.include_router(teacher_router, prefix=API_PREFIX)
app.include_router(principal_router, prefix=API_PREFIX)
app.include_router(ws_router)   # WebSocket has no prefix


# ─── Health check ────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to AI Classroom Rating System API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "version": "1.0.0", "service": "AI Classroom API"}
