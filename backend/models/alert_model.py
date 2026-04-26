"""
Alert document — stores every classroom violation detected by the AI engine.
"""

from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from enum import Enum


class IssueType(str, Enum):
    abusive_language = "Abusive Language"
    excessive_noise = "Excessive Noise"
    too_quiet = "Too Quiet"
    angry_teacher = "Angry Teacher"
    disturbance = "Disturbance"
    loud_talking = "Loud Talking"


class EmotionState(str, Enum):
    aggressive = "Aggressive"
    disturbed = "Disturbed"
    happy = "Happy"
    neutral = "Neutral"
    stressed = "Stressed"
    fearful = "Fearful"


class Alert(Document):
    teacher_id: str
    teacher_name: str
    subject: str
    class_id: str                      # e.g. "Room 204"
    issue_type: IssueType
    abusive_word: Optional[str] = None
    loudness_level: Optional[float] = None   # dB value
    confidence: float                  # 0.0 – 1.0
    emotion_state: EmotionState = EmotionState.neutral
    suggested_action: str = ""
    is_read: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "alerts"
