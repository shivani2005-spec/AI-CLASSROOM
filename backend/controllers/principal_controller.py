"""
Principal controller — school-wide views and alert management.
"""

from models.alert_model import Alert
from models.user_model import User, UserRole
from services import classroom_service
import random


async def handle_get_live_all_classes() -> list:
    return await classroom_service.get_all_active_sessions()


async def handle_get_all_alerts(limit: int = 100) -> list:
    return await classroom_service.get_notifications(limit)


async def handle_get_performance() -> dict:
    teachers = await User.find(User.role == UserRole.teacher).to_list()
    performance = []
    for teacher in teachers:
        alerts = await Alert.find(Alert.teacher_id == str(teacher.id)).to_list()
        score = max(0, 100 - len(alerts) * 3 + random.randint(-5, 10))
        performance.append({
            "teacher_id": str(teacher.id),
            "teacher_name": teacher.name,
            "subject": teacher.subject or "N/A",
            "class_assigned": teacher.class_assigned or "N/A",
            "total_alerts": len(alerts),
            "discipline_score": min(100, max(0, score)),
            "ranking": 0,
        })

    # Sort by discipline score descending and assign ranking
    performance.sort(key=lambda x: x["discipline_score"], reverse=True)
    for idx, item in enumerate(performance):
        item["ranking"] = idx + 1

    return {"teachers": performance, "total_teachers": len(performance)}


async def handle_get_principal_analytics() -> dict:
    return await classroom_service.get_analytics()
