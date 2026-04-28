# AI Classroom Rating System 🎓

> **Production-grade full-stack AI classroom monitoring system** — detects noise, abusive language, emotions, and sends real-time alerts to the HOD dashboard.

---

## 📁 Project Structure

```
college-project/
├── frontend/      # React 18 + Vite + Tailwind + GSAP + Framer Motion
└── backend/       # Python FastAPI + MongoDB (Motor/Beanie) + AI Engine
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB running locally (`mongodb://localhost:27017`)

---

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Create `.env` (already included):
```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=ai_classroom_db
JWT_SECRET=your-super-secret-key
```

Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## 🔐 Demo Accounts

| Role       | Email                     | Password  |
|------------|---------------------------|-----------|
| HOD  | hod@school.com      | demo1234  |
| Teacher    | teacher@school.com        | demo1234  |

Create these via `POST /api/v1/auth/signup` or the Sign Up page.

---

## 🤖 AI Engine (Hybrid Mode)

The AI engine works in **hybrid mode** by default:
- **Real audio** — reads from microphone when `sounddevice` is available
- **Demo simulation** — realistic dB/emotion data when hardware isn't present
- **NLP** — offline bilingual (English + Hindi) abusive word detection
- **Emotion** — `librosa` voice feature analysis with demo fallback

---

## 📡 API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/auth/signup` | Public |
| POST | `/api/v1/auth/signin` | Public |
| GET | `/api/v1/auth/me` | JWT |
| POST | `/api/v1/classroom/start-monitoring` | Teacher+ |
| GET | `/api/v1/classroom/analytics` | Any |
| GET | `/api/v1/hod/live-all-classes` | HOD+ |
| GET | `/api/v1/hod/performance` | HOD+ |
| WS | `/ws/alerts` | Open |

---

## 🎨 Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing | Public |
| `/signin` | Sign In | Public |
| `/signup` | Sign Up | Public |
| `/dashboard` | Student Dashboard | Any |
| `/teacher-dashboard` | Teacher Dashboard | Teacher |
| `/hod-dashboard` | HOD Command Center | HOD |
| `/classroom-live` | Live Monitor | Teacher+ |
| `/analytics` | Analytics | Any |
| `/notifications` | Alerts Feed | Any |
| `/profile` | My Profile | Any |
| `/settings` | Settings | Any |
| `/admin` | Admin Panel | Admin |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Animations | GSAP, Framer Motion |
| Charts | Recharts |
| Backend | FastAPI, Uvicorn |
| Database | MongoDB + Motor + Beanie ODM |
| Auth | JWT (python-jose) + bcrypt |
| Real-time | FastAPI WebSockets |
| AI/NLP | librosa, SpeechRecognition, NLTK, sounddevice |

---

## 📊 Features

- ✅ Real-time audio level monitoring (dB meter)
- ✅ NLP abusive language detection (English + Hindi)
- ✅ Voice emotion analysis (angry/stressed/happy/neutral/fearful)
- ✅ Live WebSocket alert push to HOD
- ✅ JWT Auth + Role-Based Access (Student/Teacher/Principal/Admin)
- ✅ Premium glassmorphism dark UI
- ✅ GSAP hero animations + Framer Motion route transitions
- ✅ Recharts analytics dashboards
- ✅ Discipline score (0–100) per classroom
- ✅ Teacher performance rankings
- ✅ Dark/Light mode toggle
- ✅ Responsive mobile layout

---

*Built with ❤️ for smarter education.*
