"""
Alert creation schema.
"""

from pydantic import BaseModel
from typing import Optional
from models.alert_model import IssueType, EmotionState


class CreateAlertSchema(BaseModel):
    teacher_id: str
    teacher_name: str
    subject: str
    class_id: str
    issue_type: IssueType
    abusive_word: Optional[str] = None
    loudness_level: Optional[float] = None
    confidence: float
    emotion_state: EmotionState = EmotionState.neutral
    suggested_action: str = ""
