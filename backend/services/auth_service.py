"""
Auth service — business logic for signup, signin, token refresh.
"""

from models.user_model import User, UserRole
from schemas.auth_schema import SignUpRequest, SignInRequest, TokenResponse, UserResponse
from auth.password_handler import hash_password, verify_password
from auth.jwt_handler import create_access_token, create_refresh_token, verify_token_type
from fastapi import HTTPException, status


def _build_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role.value,
        subject=user.subject,
        class_assigned=user.class_assigned,
        avatar=user.avatar,
        is_active=user.is_active,
    )


async def signup_user(payload: SignUpRequest) -> dict:
    existing = await User.find_one(User.email == payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    new_user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
        subject=payload.subject,
        class_assigned=payload.class_assigned,
    )
    await new_user.insert()

    token_payload = {"sub": str(new_user.id), "role": new_user.role.value}
    return {
        "user": _build_user_response(new_user),
        "access_token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "token_type": "bearer",
    }


async def signin_user(payload: SignInRequest) -> dict:
    user = await User.find_one(User.email == payload.email)
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated",
        )

    token_payload = {"sub": str(user.id), "role": user.role.value}
    return {
        "user": _build_user_response(user),
        "access_token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "token_type": "bearer",
    }


async def refresh_tokens(refresh_token: str) -> dict:
    payload = verify_token_type(refresh_token, "refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = await User.get(payload["sub"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    token_payload = {"sub": str(user.id), "role": user.role.value}
    return {
        "access_token": create_access_token(token_payload),
        "refresh_token": create_refresh_token(token_payload),
        "token_type": "bearer",
    }
