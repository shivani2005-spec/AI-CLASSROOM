"""
Classroom controller — delegates to classroom_service.
"""

from schemas.classroom_schema import StartMonitoringRequest
from services import classroom_service
from models.user_model import User
from typing import Optional


async def handle_start_monitoring(payload: StartMonitoringRequest, current_user: User) -> dict:
    teacher_name = current_user.name
    return await classroom_service.start_monitoring(
        class_id=payload.class_id,
        teacher_id=str(current_user.id),
        teacher_name=teacher_name,
        subject=payload.subject,
    )


async def handle_stop_monitoring(class_id: str) -> dict:
    return await classroom_service.stop_monitoring(class_id)


async def handle_live_status(class_id: str) -> dict:
    status = await classroom_service.get_live_status(class_id)
    if not status:
        return {"is_monitoring": False, "class_id": class_id}
    return status


async def handle_get_analytics(teacher_id: Optional[str] = None) -> dict:
    return await classroom_service.get_analytics(teacher_id)


async def handle_get_notifications(limit: int = 50, teacher_id: Optional[str] = None) -> list:
    return await classroom_service.get_notifications(limit, teacher_id)


async def handle_mark_read(alert_id: str) -> dict:
    success = await classroom_service.mark_alert_read(alert_id)
    return {"success": success, "alert_id": alert_id}
