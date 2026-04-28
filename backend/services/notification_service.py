"""
WebSocket notification service — manages subscriber connections
and broadcasts alerts to all connected HOD/admin clients.
"""

from fastapi import WebSocket
from typing import Set
import json

# Set of active WebSocket connections
_subscribers: Set[WebSocket] = set()


async def connect(websocket: WebSocket):
    await websocket.accept()
    _subscribers.add(websocket)


async def disconnect(websocket: WebSocket):
    _subscribers.discard(websocket)


async def broadcast_alert(alert_data: dict):
    """Push alert JSON to every connected client."""
    dead = set()
    message = json.dumps({"type": "NEW_ALERT", "payload": alert_data})
    for ws in _subscribers:
        try:
            await ws.send_text(message)
        except Exception:
            dead.add(ws)
    _subscribers -= dead


async def broadcast_status(status_data: dict):
    """Push a generic status update to all clients."""
    dead = set()
    message = json.dumps({"type": "STATUS_UPDATE", "payload": status_data})
    for ws in _subscribers:
        try:
            await ws.send_text(message)
        except Exception:
            dead.add(ws)
    _subscribers -= dead
