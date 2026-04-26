"""
Classroom monitoring routes.
"""

from fastapi import APIRouter, Depends, Query
from schemas.classroom_schema import StartMonitoringRequest
from controllers.classroom_controller import (
    handle_start_monitoring, handle_stop_monitoring, handle_live_status,
    handle_get_analytics, handle_get_notifications, handle_mark_read
)
from middleware.auth_middleware import get_current_user, require_roles
from models.user_model import User, UserRole
from typing import Optional

router = APIRouter(prefix="/classroom", tags=["Classroom"])


@router.post("/start-monitoring")
async def start_monitoring(
    payload: StartMonitoringRequest,
    current_user: User = Depends(require_roles(UserRole.teacher, UserRole.admin, UserRole.principal))
):
    """Start AI monitoring for a classroom."""
    return await handle_start_monitoring(payload, current_user)


@router.post("/stop-monitoring/{class_id}")
async def stop_monitoring(
    class_id: str,
    current_user: User = Depends(require_roles(UserRole.teacher, UserRole.admin, UserRole.principal))
):
    """Stop monitoring a specific classroom."""
    return await handle_stop_monitoring(class_id)


@router.get("/live-status/{class_id}")
async def live_status(
    class_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get real-time status of a classroom session."""
    return await handle_live_status(class_id)


@router.get("/analytics")
async def analytics(
    teacher_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Retrieve analytics — optionally filtered by teacher."""
    return await handle_get_analytics(teacher_id)


@router.get("/notifications")
async def notifications(
    limit: int = Query(50, ge=1, le=200),
    teacher_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Get recent alerts/notifications."""
    return await handle_get_notifications(limit, teacher_id)


@router.patch("/notifications/{alert_id}/read")
async def mark_read(alert_id: str, current_user: User = Depends(get_current_user)):
    """Mark a notification as read."""
    return await handle_mark_read(alert_id)
