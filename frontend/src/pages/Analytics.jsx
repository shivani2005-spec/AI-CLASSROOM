import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import EmotionChart from "../components/EmotionChart";
import { useNotifications } from "../hooks/useNotifications";
import { getAnalytics } from "../api/analyticsApi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const TOOLTIP_STYLE = { background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" };
const DEMO_EMOTION = { happy: 0.28, neutral: 0.38, stressed: 0.18, angry: 0.10, fearful: 0.06, dominant_emotion: "neutral" };

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    getAnalytics().then(({ data }) => setAnalytics(data)).catch(() => {
      setAnalytics({
        total_alerts: 63, abusive_incidents: 14, noise_incidents: 31, avg_discipline_score: 78.2,
        weekly_data: [
          { day: "Mon", alerts: 10, discipline: 82 },
          { day: "Tue", alerts: 7, discipline: 88 },
          { day: "Wed", alerts: 14, discipline: 71 },
          { day: "Thu", alerts: 9, discipline: 85 },
          { day: "Fri", alerts: 13, discipline: 74 },
          { day: "Sat", alerts: 10, discipline: 80 },
        ],
        emotion_trend: [
          { name: "😊 Happy", value: 28 },
          { name: "😐 Neutral", value: 38 },
          { name: "😰 Stressed", value: 18 },
          { name: "😠 Angry", value: 10 },
          { name: "😨 Fearful", value: 6 },
        ],
        class_rankings: [
          { class_id: "Room 204", discipline_score: 92, total_alerts: 3 },
          { class_id: "Room 101", discipline_score: 85, total_alerts: 7 },
          { class_id: "Room 102", discipline_score: 78, total_alerts: 12 },
          { class_id: "Room 201", discipline_score: 71, total_alerts: 18 },
          { class_id: "Room 202", discipline_score: 65, total_alerts: 23 },
          { class_id: "Room 301", discipline_score: 88, total_alerts: 5 },
        ],
      });
    });
  }, []);

  const PIE_COLORS = ["#10b981", "#6b7280", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <h1 className="section-title">Analytics & Insights</h1>
            <p className="section-subtitle">School-wide discipline data and performance metrics</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Alerts" value={analytics?.total_alerts || 0} icon={AlertTriangle} color="red" delay={0} />
            <DashboardCard title="Abusive Incidents" value={analytics?.abusive_incidents || 0} icon={AlertTriangle} color="red" delay={1} />
            <DashboardCard title="Noise Incidents" value={analytics?.noise_incidents || 0} icon={Activity} color="yellow" delay={2} />
            <DashboardCard title="Avg Discipline" value={analytics?.avg_discipline_score || 0} unit="%" icon={TrendingUp} color="green" delay={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Weekly Discipline Trend</p>
              <p className="text-xs text-gray-500 mb-4">Average score by day</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics?.weekly_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[50, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="discipline" stroke="#3b63f8" strokeWidth={2.5} dot={{ fill: "#3b63f8", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Weekly Alert Count</p>
              <p className="text-xs text-gray-500 mb-4">Violations flagged per day</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.weekly_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="alerts" fill="#ef4444" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <EmotionChart data={DEMO_EMOTION} title="School-wide Emotion Distribution" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Emotion Breakdown</p>
              <p className="text-xs text-gray-500 mb-4">Overall classroom mood percentages</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={analytics?.emotion_trend || []} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={0}>
                    {(analytics?.emotion_trend || []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {(analytics?.emotion_trend || []).map((e, i) => (
                  <span key={e.name} className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {e.name} ({e.value}%)
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Class Rankings Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4">Class Discipline Rankings</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-white/8">
                    <th className="text-left pb-3 pr-4">Rank</th>
                    <th className="text-left pb-3 pr-4">Classroom</th>
                    <th className="text-left pb-3 pr-4">Discipline Score</th>
                    <th className="text-left pb-3">Total Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(analytics?.class_rankings || []).map((cls, i) => (
                    <tr key={cls.class_id} className="hover:bg-white/3 transition-colors">
                      <td className="py-3 pr-4 text-gray-400">#{i + 1}</td>
                      <td className="py-3 pr-4 font-medium text-white">{cls.class_id}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/8 rounded-full max-w-24">
                            <div className="h-full rounded-full bg-brand-500" style={{ width: `${cls.discipline_score}%` }} />
                          </div>
                          <span className={cls.discipline_score >= 80 ? "text-emerald-400" : cls.discipline_score >= 60 ? "text-yellow-400" : "text-red-400"}>
                            {cls.discipline_score}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={cls.total_alerts > 15 ? "badge-red" : cls.total_alerts > 8 ? "badge-yellow" : "badge-green"}>
                          {cls.total_alerts} alerts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
