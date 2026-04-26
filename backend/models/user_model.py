"""
Beanie ODM document models for MongoDB collections.
"""

from datetime import datetime, timezone
from typing import Optional, List
from beanie import Document
from pydantic import Field, EmailStr
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    teacher = "teacher"
    principal = "principal"
    admin = "admin"


class User(Document):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.student
    subject: Optional[str] = None
    class_assigned: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Rajesh Sharma",
                "email": "rajesh@school.com",
                "role": "teacher",
                "subject": "Mathematics",
                "class_assigned": "204"
            }
        }
