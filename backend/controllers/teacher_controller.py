"""
Teacher controller — teacher-specific data.
"""

from models.user_model import User, UserRole
from models.alert_model import Alert
from models.emotion_model import Emotion
from services import classroom_service
from typing import Optional


async def handle_get_teacher_classes(current_user: User) -> dict:
    return {
        "teacher_id": str(current_user.id),
        "teacher_name": current_user.name,
        "subject": current_user.subject,
        "class_assigned": current_user.class_assigned,
    }


async def handle_get_teacher_reports(current_user: User) -> dict:
    alerts = await Alert.find(Alert.teacher_id == str(current_user.id)).to_list()
    emotions = await Emotion.find(Emotion.teacher_id == str(current_user.id)).sort(-Emotion.timestamp).limit(7).to_list()

    return {
        "total_alerts": len(alerts),
        "abusive_incidents": sum(1 for a in alerts if "abusive" in a.issue_type.value.lower()),
        "noise_incidents": sum(1 for a in alerts if "noise" in a.issue_type.value.lower() or "loud" in a.issue_type.value.lower()),
        "emotion_history": [
            {
                "timestamp": e.timestamp.isoformat(),
                "dominant_emotion": e.dominant_emotion,
                "discipline_score": e.discipline_score,
            }
            for e in emotions
        ],
        "analytics": await classroom_service.get_analytics(str(current_user.id)),
    }


async def handle_get_all_teachers() -> list:
    teachers = await User.find(User.role == UserRole.teacher).to_list()
    return [
        {
            "id": str(t.id),
            "name": t.name,
            "email": t.email,
            "subject": t.subject,
            "class_assigned": t.class_assigned,
        }
        for t in teachers
    ]
