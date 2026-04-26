"""
Attendance document — one record per student per session.
"""

from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from typing import Optional


class Attendance(Document):
    student_name: str
    student_id: Optional[str] = None
    class_id: str
    teacher_id: str
    present: bool = True
    confidence: float = 1.0           # face-detection confidence
    time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "attendance"
