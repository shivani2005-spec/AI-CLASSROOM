"""
Principal dashboard routes — school-wide overview.
"""

from fastapi import APIRouter, Depends, Query
from controllers.principal_controller import (
    handle_get_live_all_classes, handle_get_all_alerts,
    handle_get_performance, handle_get_principal_analytics
)
from middleware.auth_middleware import require_roles
from models.user_model import User, UserRole

router = APIRouter(prefix="/principal", tags=["Principal"])


@router.get("/live-all-classes")
async def live_all_classes(
    current_user: User = Depends(require_roles(UserRole.principal, UserRole.admin))
):
    """Get live status of all actively monitored classrooms."""
    return await handle_get_live_all_classes()


@router.get("/alerts")
async def get_alerts(
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_roles(UserRole.principal, UserRole.admin))
):
    """Get all school-wide alerts for the principal."""
    return await handle_get_all_alerts(limit)


@router.get("/performance")
async def teacher_performance(
    current_user: User = Depends(require_roles(UserRole.principal, UserRole.admin))
):
    """Teacher ranking by discipline score."""
    return await handle_get_performance()


@router.get("/analytics")
async def principal_analytics(
    current_user: User = Depends(require_roles(UserRole.principal, UserRole.admin))
):
    """School-wide analytics for the principal dashboard."""
    return await handle_get_principal_analytics()
