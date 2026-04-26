"""
WebSocket route — real-time alert streaming to connected dashboards.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.notification_service import connect, disconnect
import asyncio

router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/alerts")
async def alerts_websocket(websocket: WebSocket):
    """
    Persistent WebSocket connection.
    All connected principal/admin dashboards receive live alert pushes here.
    """
    await connect(websocket)
    try:
        while True:
            # Keep alive — client can send pings
            data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
            if data == "ping":
                await websocket.send_text("pong")
    except (WebSocketDisconnect, asyncio.TimeoutError):
        await disconnect(websocket)
    except Exception:
        await disconnect(websocket)
