"""
Emotion snapshot document — periodic classroom emotion readings.
"""

from datetime import datetime, timezone
from beanie import Document
from pydantic import Field


class Emotion(Document):
    class_id: str
    teacher_id: str
    happy: float = 0.0
    angry: float = 0.0
    stressed: float = 0.0
    neutral: float = 0.0
    fearful: float = 0.0
    dominant_emotion: str = "neutral"
    discipline_score: float = 100.0   # AI-computed score out of 100
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "emotions"
