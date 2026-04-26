export const API_BASE = "/api/v1";
export const WS_URL = "ws://localhost:8000/ws/alerts";

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  PRINCIPAL: "principal",
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
  { id: "Room 101", teacher: "Priya Sharma", subject: "Physics" },
  { id: "Room 102", teacher: "Rahul Verma", subject: "Chemistry" },
  { id: "Room 201", teacher: "Anita Singh", subject: "Biology" },
  { id: "Room 202", teacher: "Rajesh Kumar", subject: "Mathematics" },
  { id: "Room 203", teacher: "Sunita Patel", subject: "English" },
  { id: "Room 204", teacher: "Vijay Gupta", subject: "History" },
];
