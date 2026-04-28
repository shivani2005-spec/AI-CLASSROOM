export const API_BASE = "/api/v1";
export const WS_URL = "ws://localhost:8000/ws/alerts";

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  HOD: "hod",
  ADMIN: "admin",
};

export const ISSUE_COLORS = {
  "Abusive Language": "red",
  "Excessive Noise": "orange",
  "Too Quiet": "yellow",
  "Angry Teacher": "red",
  "Disturbance": "orange",
  "Loud Talking": "yellow",
};

export const EMOTION_COLORS = {
  happy: "#10b981",
  neutral: "#6b7280",
  stressed: "#f59e0b",
  angry: "#ef4444",
  fearful: "#8b5cf6",
};

export const DEMO_CLASSES = [
  { id: "Room 301", teacher: "Rajesh Sharma", subject: "TOC" },
  { id: "Room 302", teacher: "Priya Singh", subject: "CN" },
  { id: "Room 401", teacher: "Rahul Verma", subject: "DVA" },
  { id: "Room 402", teacher: "Anita Gupta", subject: "CC" },
];
