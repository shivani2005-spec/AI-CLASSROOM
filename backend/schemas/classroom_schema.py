"""
Pydantic schemas for classroom monitoring APIs.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.alert_model import IssueType, EmotionState


class StartMonitoringRequest(BaseModel):
    class_id: str
    teacher_id: str
    subject: str


class AlertResponse(BaseModel):
    id: str
    teacher_name: str
    subject: str
    class_id: str
    issue_type: str
    abusive_word: Optional[str]
    loudness_level: Optional[float]
    confidence: float
    emotion_state: str
    suggested_action: str
    is_read: bool
    timestamp: datetime


class EmotionSnapshot(BaseModel):
    class_id: str
    happy: float
    angry: float
    stressed: float
    neutral: float
    fearful: float
    dominant_emotion: str
    discipline_score: float
    timestamp: datetime


class LiveStatusResponse(BaseModel):
    class_id: str
    teacher_name: str
    subject: str
    is_monitoring: bool
    current_db_level: float
    current_emotion: str
    discipline_score: float
    recent_alerts: list


class AnalyticsResponse(BaseModel):
    total_alerts: int
    abusive_incidents: int
    noise_incidents: int
    avg_discipline_score: float
    weekly_data: list
    emotion_trend: list
    class_rankings: list
