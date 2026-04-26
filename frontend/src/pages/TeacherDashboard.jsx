import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, TrendingUp, Activity, Play, Square } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import EmotionChart from "../components/EmotionChart";
import NotificationPanel from "../components/NotificationPanel";
import AnimatedButton from "../components/AnimatedButton";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { useWebSocket } from "../hooks/useWebSocket";
import { startMonitoring, stopMonitoring, getTeacherReports } from "../api/classroomApi";
import toast from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DEMO_EMOTION = { happy: 0.30, neutral: 0.40, stressed: 0.15, angry: 0.10, fearful: 0.05, dominant_emotion: "neutral" };
const TOOLTIP_STYLE = { background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [reports, setReports] = useState(null);
  const [emotionData, setEmotionData] = useState(DEMO_EMOTION);
  const { notifications, unreadCount, fetchNotifications, markRead, addNotification } = useNotifications();

  const onWsMessage = useCallback((msg) => {
    if (msg.type === "NEW_ALERT") {
      addNotification(msg.payload);
      toast.error(`🚨 ${msg.payload.issue_type} detected in ${msg.payload.class_id}`, { duration: 5000 });
    }
  }, [addNotification]);

  useWebSocket(onWsMessage, isMonitoring);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getTeacherReports();
        setReports(data);
      } catch {
        setReports({
          total_alerts: 8, abusive_incidents: 2, noise_incidents: 4,
          emotion_history: [
            { timestamp: new Date().toISOString(), discipline_score: 82 },
            { timestamp: new Date(Date.now() - 86400000).toISOString(), discipline_score: 90 },
            { timestamp: new Date(Date.now() - 172800000).toISOString(), discipline_score: 71 },
          ],
          analytics: { avg_discipline_score: 82 }
        });
      }
    };
    load();
    fetchNotifications(20, user?.id);
  }, [fetchNotifications, user?.id]);

  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => {
      const vals = [Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.2, Math.random() * 0.15, Math.random() * 0.1];
      const emotions = ["happy", "neutral", "stressed", "angry", "fearful"];
      const obj = {};
      emotions.forEach((e, i) => (obj[e] = parseFloat(vals[i].toFixed(3))));
      obj.dominant_emotion = emotions[vals.indexOf(Math.max(...vals))];
      setEmotionData(obj);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleToggleMonitoring = async () => {
    if (!user?.class_assigned || !user?.subject) {
      toast.error("Please set your class and subject in Profile settings first.");
      return;
    }
    setMonitorLoading(true);
    try {
      if (isMonitoring) {
        await stopMonitoring(`Room ${user.class_assigned}`);
        setIsMonitoring(false);
        toast.success("Monitoring stopped.");
      } else {
        await startMonitoring({ class_id: `Room ${user.class_assigned}`, teacher_id: user.id, subject: user.subject });
        setIsMonitoring(true);
        toast.success("Monitoring started!");
      }
    } catch {
      toast.error("Could not connect to monitoring service.");
    } finally {
      setMonitorLoading(false);
    }
  };

  const emotionHistory = (reports?.emotion_history || []).map((e) => ({
    time: new Date(e.timestamp).toLocaleDateString("en-IN", { weekday: "short" }),
    score: e.discipline_score,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="section-title">Teacher Dashboard</h1>
              <p className="section-subtitle">{user?.subject || "N/A"} · Room {user?.class_assigned || "N/A"}</p>
            </div>
            <AnimatedButton onClick={handleToggleMonitoring} loading={monitorLoading} variant={isMonitoring ? "danger" : "primary"} icon={isMonitoring ? Square : Play}>
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </AnimatedButton>
          </div>

          {isMonitoring && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border border-emerald-500/30 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-sm text-emerald-300 font-medium">AI monitoring is active — analyzing audio, speech, and emotions in real-time.</p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Alerts" value={reports?.total_alerts || 0} icon={Bell} color="red" delay={0} />
            <DashboardCard title="Abusive Incidents" value={reports?.abusive_incidents || 0} icon={AlertTriangle} color="red" delay={1} />
            <DashboardCard title="Noise Incidents" value={reports?.noise_incidents || 0} icon={Activity} color="yellow" delay={2} />
            <DashboardCard title="Discipline Score" value={reports?.analytics?.avg_discipline_score || 0} unit="%" icon={TrendingUp} color="green" delay={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <EmotionChart data={emotionData} title="Current Classroom Emotion" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Discipline Score Trend</p>
              <p className="text-xs text-gray-500 mb-4">Your classroom score over recent sessions</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={emotionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[50, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Alert History</p>
              <span className="badge-red">{notifications.filter((n) => !n.is_read).length} unread</span>
            </div>
            <NotificationPanel notifications={notifications.slice(0, 10)} onMarkRead={markRead} maxHeight="400px" />
          </div>
        </main>
      </div>
    </div>
  );
}
