"""General utility helpers shared across the backend."""

from datetime import datetime, timezone


def utc_now() -> datetime:
    """Return current UTC datetime with timezone info."""
    return datetime.now(timezone.utc)


def truncate(text: str, max_len: int = 200) -> str:
    """Truncate a string to max_len characters."""
    if len(text) <= max_len:
        return text
    return text[:max_len] + "…"


def confidence_to_percent(confidence: float) -> str:
    """Convert 0.0–1.0 confidence to a display string like '94%'."""
    return f"{round(confidence * 100)}%"
