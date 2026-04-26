"""
Authentication routes — public endpoints (no auth required).
"""

from fastapi import APIRouter, Depends
from schemas.auth_schema import SignUpRequest, SignInRequest, RefreshTokenRequest
from controllers.auth_controller import (
    handle_signup, handle_signin, handle_refresh, handle_get_me, handle_update_profile
)
from middleware.auth_middleware import get_current_user
from models.user_model import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", status_code=201)
async def signup(payload: SignUpRequest):
    """Register a new user account."""
    return await handle_signup(payload)


@router.post("/signin")
async def signin(payload: SignInRequest):
    """Authenticate and receive access + refresh tokens."""
    return await handle_signin(payload)


@router.post("/refresh")
async def refresh(payload: RefreshTokenRequest):
    """Exchange a refresh token for a new token pair."""
    return await handle_refresh(payload)


@router.post("/logout")
async def logout():
    """
    Client-side logout — instruct client to clear stored tokens.
    For stateless JWT, no server action is needed.
    """
    return {"message": "Logged out successfully. Please clear your local tokens."}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return await handle_get_me(current_user)


@router.patch("/me")
async def update_profile(updates: dict, current_user: User = Depends(get_current_user)):
    """Update profile fields (name, subject, avatar, class_assigned)."""
    return await handle_update_profile(current_user, updates)
