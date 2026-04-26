import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Square, Volume2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LiveAudioMeter from "../components/LiveAudioMeter";
import EmotionChart from "../components/EmotionChart";
import AnimatedButton from "../components/AnimatedButton";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { startMonitoring, stopMonitoring, getLiveStatus } from "../api/classroomApi";
import toast from "react-hot-toast";

const DEMO_EMOTION = { happy: 0.30, neutral: 0.45, stressed: 0.12, angry: 0.08, fearful: 0.05, dominant_emotion: "neutral" };
const SAMPLES = [
  "Please open your textbooks to page 42.",
  "Can someone solve this equation?",
  "Quiet down, let's focus.",
  "Very good answer, that is correct.",
  "We will have a test next Monday.",
];

export default function ClassroomLive() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbLevel, setDbLevel] = useState(0);
  const [emotion, setEmotion] = useState(DEMO_EMOTION);
  const [transcript, setTranscript] = useState([]);
  const { unreadCount } = useNotifications();
  const classId = user?.class_assigned ? `Room ${user.class_assigned}` : "Room 204";

  useEffect(() => {
    if (!isMonitoring) { setDbLevel(0); return; }
    
    // Poll the backend every 2 seconds for real hardware capture data
    const interval = setInterval(async () => {
      try {
        const { data } = await getLiveStatus(classId);
        if (data) {
          setDbLevel(data.current_db_level || 0);
          
          const em = data.current_emotion || "neutral";
          setEmotion({
            happy: em === "happy" ? 0.6 : 0.1,
            neutral: em === "neutral" ? 0.6 : 0.1,
            stressed: em === "stressed" ? 0.6 : 0.1,
            angry: em === "angry" ? 0.6 : 0.1,
            fearful: em === "fearful" ? 0.6 : 0.1,
            dominant_emotion: em
          });

          if (data.current_transcript && data.current_transcript.trim() !== "") {
            setTranscript((prev) => {
              if (prev.length > 0 && prev[0].text === data.current_transcript) return prev;
              return [{ time: new Date().toLocaleTimeString("en-IN"), text: data.current_transcript }, ...prev.slice(0, 9)];
            });
          }
        }
      } catch (err) {
        console.error("Live poll error:", err);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isMonitoring, classId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isMonitoring) {
        await stopMonitoring(classId).catch(() => {});
        setIsMonitoring(false);
        toast.success("Monitoring stopped.");
      } else {
        await startMonitoring({ class_id: classId, teacher_id: user?.id || "demo", subject: user?.subject || "General" }).catch(() => {});
        setIsMonitoring(true);
        toast.success("Live monitoring started!");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="section-title">Live Classroom Monitor</h1>
              <p className="section-subtitle">{classId} · {user?.subject || "General"}</p>
            </div>
            <div className="flex items-center gap-3">
              {isMonitoring && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-300">LIVE</span>
                </div>
              )}
              <AnimatedButton onClick={handleToggle} loading={loading} variant={isMonitoring ? "danger" : "primary"} icon={isMonitoring ? Square : Play}>
                {isMonitoring ? "Stop" : "Start Monitor"}
              </AnimatedButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LiveAudioMeter dbLevel={dbLevel} isActive={isMonitoring} />
            <EmotionChart data={emotion} title="Live Emotion State" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 size={16} className="text-brand-400" />
              <p className="text-sm font-semibold text-white">Live Speech Transcript</p>
              {isMonitoring && <span className="badge-green animate-pulse">Recording</span>}
            </div>
            {transcript.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                {isMonitoring ? "Listening for speech…" : "Start monitoring to see live transcript."}
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {transcript.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/3">
                    <span className="text-xs text-gray-600 shrink-0 font-mono mt-0.5">{t.time}</span>
                    <p className="text-sm text-gray-300">{t.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {isMonitoring && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Current Level", value: `${dbLevel.toFixed(1)} dB`, color: dbLevel > 72 ? "text-red-400" : dbLevel < 28 ? "text-yellow-400" : "text-emerald-400" },
                { label: "Status", value: dbLevel > 72 ? "LOUD 🔊" : dbLevel < 28 ? "QUIET 🤫" : "NORMAL ✅", color: "text-white" },
                { label: "Emotion", value: (emotion.dominant_emotion || "NEUTRAL").toUpperCase(), color: "text-brand-300" },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
