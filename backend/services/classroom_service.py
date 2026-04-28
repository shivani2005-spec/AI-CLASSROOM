"""
Classroom monitoring service — wraps AI engine calls and persists results.
Supports both real audio (hybrid mode) and demo simulation.
"""

import asyncio
import random
from datetime import datetime, timezone
from typing import Optional
from models.alert_model import Alert, IssueType, EmotionState
from models.emotion_model import Emotion
from ai_engine.audio_analyzer import AudioAnalyzer
from ai_engine.abusive_detector import AbusiveDetector
from ai_engine.emotion_detector import EmotionDetector
from ai_engine.speech_to_text import SpeechToText
from services.email_service import send_alert_email
import io

# In-memory registry of active monitoring sessions {class_id: session_meta}
_active_sessions: dict[str, dict] = {}

_audio = AudioAnalyzer()
_abusive = AbusiveDetector()
_emotion = EmotionDetector()
_speech = SpeechToText()

ISSUE_ACTIONS = {
    IssueType.abusive_language: "Immediately warn students and note incident in record.",
    IssueType.excessive_noise: "Request class to settle down; consider activity change.",
    IssueType.too_quiet: "Encourage participation; check for student discomfort.",
    IssueType.angry_teacher: "Suggest teacher take a short break; admin follow-up advised.",
    IssueType.disturbance: "Investigate source of disturbance; involve corridor monitor.",
    IssueType.loud_talking: "Address individual students causing noise disruption.",
}


async def start_monitoring(class_id: str, teacher_id: str, teacher_name: str, subject: str) -> dict:
    if class_id in _active_sessions:
        return {"status": "already_monitoring", "class_id": class_id}

    _active_sessions[class_id] = {
        "teacher_id": teacher_id,
        "teacher_name": teacher_name,
        "subject": subject,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True,
        "current_db_level": 45,
        "current_emotion": "neutral",
        "current_transcript": "",
    }
    # Kick off background analysis loop
    asyncio.create_task(_analysis_loop(class_id))
    return {"status": "started", "class_id": class_id}


async def stop_monitoring(class_id: str) -> dict:
    if class_id in _active_sessions:
        _active_sessions[class_id]["is_active"] = False
        _active_sessions.pop(class_id, None)
        return {"status": "stopped", "class_id": class_id}
    return {"status": "not_found", "class_id": class_id}


async def get_live_status(class_id: str) -> Optional[dict]:
    session = _active_sessions.get(class_id)
    if not session:
        return None

    return {
        "class_id": class_id,
        "teacher_name": session["teacher_name"],
        "subject": session["subject"],
        "is_monitoring": True,
        "current_db_level": session.get("current_db_level", 45),
        "current_emotion": session.get("current_emotion", "neutral"),
        "current_transcript": session.get("current_transcript", ""),
        "discipline_score": 100.0, # Handled dynamically by client or historical data
        "recent_alerts": [],
    }


async def get_all_active_sessions() -> list:
    result = []
    for class_id, session in _active_sessions.items():
        db_level = _audio.get_demo_db()
        emotion = _emotion.detect_demo()
        result.append({
            "class_id": class_id,
            **session,
            "current_db_level": db_level,
            "current_emotion": emotion["dominant"],
            "discipline_score": _compute_discipline_score(db_level, emotion),
        })
    return result


async def get_analytics(teacher_id: Optional[str] = None) -> dict:
    """Aggregate analytics — either for a specific teacher or school-wide."""
    query = Alert.find()
    if teacher_id:
        query = Alert.find(Alert.teacher_id == teacher_id)

    alerts = await query.to_list()
    total = len(alerts)
    abusive = sum(1 for a in alerts if a.issue_type == IssueType.abusive_language)
    noise = sum(1 for a in alerts if a.issue_type in (IssueType.excessive_noise, IssueType.loud_talking))

    # Demo weekly data when DB is sparse
    weekly_data = _generate_weekly_data()
    emotion_trend = _generate_emotion_trend()
    class_rankings = await _get_class_rankings()

    return {
        "total_alerts": total,
        "abusive_incidents": abusive,
        "noise_incidents": noise,
        "avg_discipline_score": round(random.uniform(68, 95), 1),
        "weekly_data": weekly_data,
        "emotion_trend": emotion_trend,
        "class_rankings": class_rankings,
    }


async def get_notifications(limit: int = 50, teacher_id: Optional[str] = None) -> list:
    query = Alert.find().sort(-Alert.timestamp).limit(limit)
    if teacher_id:
        query = Alert.find(Alert.teacher_id == teacher_id).sort(-Alert.timestamp).limit(limit)
    alerts = await query.to_list()
    return [_serialize_alert(a) for a in alerts]


async def mark_alert_read(alert_id: str) -> bool:
    alert = await Alert.get(alert_id)
    if alert:
        alert.is_read = True
        await alert.save()
        return True
    return False


# ─── Internal helpers ────────────────────────────────────────────────────────

async def _analysis_loop(class_id: str):
    """Background coroutine — polls AI engine and saves violations."""
    from services.notification_service import broadcast_alert

    while _active_sessions.get(class_id, {}).get("is_active"):
        session = _active_sessions.get(class_id)
        if not session:
            break

        audio_bytes, db_level = _audio.capture_chunk()
        transcript = ""
        abusive_result = {"is_abusive": False, "confidence": 0, "word": None}
        emotion_result = {"dominant": "neutral", "happy": 0, "angry": 0, "stressed": 0, "neutral": 1, "fearful": 0}
        
        if audio_bytes:
            transcript_res = _speech.transcribe(audio_bytes)
            if transcript_res.get("success"):
                transcript = transcript_res.get("transcript", "")
            
            if transcript:
                abusive_result = _abusive.detect(transcript)
                
            try:
                import soundfile as sf
                data, sr = sf.read(io.BytesIO(audio_bytes))
                emotion_result = _emotion.detect_from_audio(data)
            except Exception:
                emotion_result = _emotion.detect_demo()
        else:
            db_level = _audio.get_demo_db()
            abusive_result = _abusive.detect_demo()
            emotion_result = _emotion.detect_demo()

        # Update cache for live-status polling API
        session["current_db_level"] = db_level
        session["current_emotion"] = emotion_result["dominant"]
        if transcript:
            session["current_transcript"] = transcript

        violation = _classify_violation(db_level, abusive_result, emotion_result)
        if violation:
            issue_type, confidence, abusive_word = violation
            alert = Alert(
                teacher_id=session["teacher_id"],
                teacher_name=session["teacher_name"],
                subject=session["subject"],
                class_id=class_id,
                issue_type=issue_type,
                abusive_word=abusive_word,
                loudness_level=db_level,
                confidence=confidence,
                emotion_state=_map_emotion(emotion_result["dominant"]),
                suggested_action=ISSUE_ACTIONS.get(issue_type, "Follow school protocol."),
            )
            await alert.insert()

            # Persist emotion snapshot
            emotion_doc = Emotion(
                class_id=class_id,
                teacher_id=session["teacher_id"],
                happy=emotion_result.get("happy", 0),
                angry=emotion_result.get("angry", 0),
                stressed=emotion_result.get("stressed", 0),
                neutral=emotion_result.get("neutral", 0),
                fearful=emotion_result.get("fearful", 0),
                dominant_emotion=emotion_result["dominant"],
                discipline_score=_compute_discipline_score(db_level, emotion_result),
            )
            await emotion_doc.insert()

            # Push to WebSocket subscribers
            await broadcast_alert(_serialize_alert(alert))

            # Email Alert for severe violations - Updated to send to HOD instead of mail_from
            if issue_type == IssueType.abusive_language:
                from config import settings
                await send_alert_email(
                    email_to=settings.hod_email,
                    subject=f"⚠️ CRITICAL: Abusive Language in {class_id}",
                    body=f"Teacher: {session['teacher_name']}<br>Subject: {session['subject']}<br>Detected Word: <b>{abusive_word}</b><br>Confidence: {confidence*100}%"
                )

        await asyncio.sleep(15)  # Analyze every 15 seconds


def _classify_violation(db_level, abusive_result, emotion_result):
    """Return (IssueType, confidence, word) or None if no violation."""
    if abusive_result["is_abusive"]:
        return (IssueType.abusive_language, abusive_result["confidence"], abusive_result.get("word"))
    if db_level > 72:
        return (IssueType.excessive_noise, min(0.95, db_level / 85), None)
    if db_level < 28:
        return (IssueType.too_quiet, 0.80, None)
    if emotion_result["dominant"] in ("angry", "stressed") and random.random() < 0.3:
        return (IssueType.angry_teacher, emotion_result.get("angry", 0.7), None)
    return None


def _compute_discipline_score(db_level: float, emotion: dict) -> float:
    score = 100.0
    if db_level > 70: score -= 20
    elif db_level > 60: score -= 10
    if emotion["dominant"] == "angry": score -= 15
    elif emotion["dominant"] == "stressed": score -= 8
    return max(0.0, min(100.0, round(score + random.uniform(-3, 3), 1)))


def _map_emotion(dominant: str) -> EmotionState:
    mapping = {
        "angry": EmotionState.aggressive,
        "stressed": EmotionState.stressed,
        "happy": EmotionState.happy,
        "fearful": EmotionState.fearful,
        "neutral": EmotionState.neutral,
    }
    return mapping.get(dominant, EmotionState.neutral)


def _serialize_alert(alert: Alert) -> dict:
    return {
        "id": str(alert.id),
        "teacher_name": alert.teacher_name,
        "subject": alert.subject,
        "class_id": alert.class_id,
        "issue_type": alert.issue_type.value,
        "abusive_word": alert.abusive_word,
        "loudness_level": alert.loudness_level,
        "confidence": alert.confidence,
        "emotion_state": alert.emotion_state.value,
        "suggested_action": alert.suggested_action,
        "is_read": alert.is_read,
        "timestamp": alert.timestamp.isoformat(),
    }


def _generate_weekly_data() -> list:
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return [{"day": d, "alerts": random.randint(2, 18), "discipline": random.randint(60, 98)} for d in days]


def _generate_emotion_trend() -> list:
    emotions = ["happy", "neutral", "stressed", "angry", "fearful"]
    return [{"name": e, "value": random.randint(5, 40)} for e in emotions]


async def _get_class_rankings() -> list:
    classes = [f"Room {n}" for n in [101, 102, 201, 202, 203, 204, 301, 302]]
    return sorted(
        [{"class_id": c, "discipline_score": round(random.uniform(55, 99), 1), "total_alerts": random.randint(1, 20)} for c in classes],
        key=lambda x: x["discipline_score"],
        reverse=True,
    )
