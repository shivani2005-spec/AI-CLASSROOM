"""
Auth controller — thin layer between routes and service.
"""

from fastapi import HTTPException
from schemas.auth_schema import SignUpRequest, SignInRequest, RefreshTokenRequest
from services.auth_service import signup_user, signin_user, refresh_tokens
from models.user_model import User


async def handle_signup(payload: SignUpRequest) -> dict:
    return await signup_user(payload)


async def handle_signin(payload: SignInRequest) -> dict:
    try:
        return await signin_user(payload)
    except Exception as e:
        print(f"DEBUG ERROR in handle_signin: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e


async def handle_refresh(payload: RefreshTokenRequest) -> dict:
    return await refresh_tokens(payload.refresh_token)


async def handle_get_me(current_user: User) -> dict:
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
        "subject": current_user.subject,
        "class_assigned": current_user.class_assigned,
        "avatar": current_user.avatar,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
    }


async def handle_update_profile(current_user: User, updates: dict) -> dict:
    allowed_fields = {"name", "subject", "class_assigned", "avatar"}
    for field, value in updates.items():
        if field in allowed_fields:
            setattr(current_user, field, value)
    await current_user.save()
    return await handle_get_me(current_user)
