"""
Pydantic request/response schemas for auth endpoints.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from models.user_model import UserRole


class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.student
    subject: Optional[str] = None
    class_assigned: Optional[str] = None


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    subject: Optional[str] = None
    class_assigned: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool


class RefreshTokenRequest(BaseModel):
    refresh_token: str
