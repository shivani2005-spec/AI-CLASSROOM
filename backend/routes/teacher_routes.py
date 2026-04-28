"""
Teacher-specific routes.
"""

from fastapi import APIRouter, Depends
from controllers.teacher_controller import (
    handle_get_teacher_classes, handle_get_teacher_reports, handle_get_all_teachers
)
from middleware.auth_middleware import get_current_user, require_roles
from models.user_model import User, UserRole

router = APIRouter(prefix="/teacher", tags=["Teacher"])


@router.get("/classes")
async def get_my_classes(current_user: User = Depends(require_roles(UserRole.teacher))):
    """Get the authenticated teacher's class assignment."""
    return await handle_get_teacher_classes(current_user)


@router.get("/reports")
async def get_reports(current_user: User = Depends(require_roles(UserRole.teacher))):
    """Get discipline reports for the teacher's own classroom."""
    return await handle_get_teacher_reports(current_user)


@router.get("/all")
async def get_all_teachers(
    current_user: User = Depends(require_roles(UserRole.hod, UserRole.admin))
):
    """List all teachers — HOD and admin only."""
    return await handle_get_all_teachers()
