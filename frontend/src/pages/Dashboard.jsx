import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { BarChart3, Bell, TrendingUp, AlertTriangle, BookOpen, Activity } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { getAnalytics } from "../api/analyticsApi";
import { SkeletonCard } from "../components/LoadingSkeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const CHART_STYLE = { background: "transparent", border: "none" };
const TOOLTIP_STYLE = { background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" };

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notifications, unreadCount, fetchNotifications } = useNotifications();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAnalytics();
        setAnalytics(data);
      } catch {
        // Use demo data if backend not available
        setAnalytics({
          total_alerts: 47, abusive_incidents: 12, noise_incidents: 23,
          avg_discipline_score: 78.5,
          weekly_data: [
            { day: "Mon", alerts: 8, discipline: 82 },
            { day: "Tue", alerts: 5, discipline: 88 },
            { day: "Wed", alerts: 12, discipline: 71 },
            { day: "Thu", alerts: 7, discipline: 85 },
            { day: "Fri", alerts: 10, discipline: 74 },
            { day: "Sat", alerts: 5, discipline: 90 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    load();
    fetchNotifications(10);
  }, [fetchNotifications]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Header */}
          <div>
            <h1 className="section-title">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="section-subtitle">Here's an overview of classroom discipline today.</p>
          </div>

          {/* Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Alerts" value={analytics?.total_alerts || 0} icon={Bell} color="red" trend="up" trendValue="+12% today" delay={0} />
              <DashboardCard title="Abusive Incidents" value={analytics?.abusive_incidents || 0} icon={AlertTriangle} color="red" trend="down" trendValue="-5% this week" delay={1} />
              <DashboardCard title="Noise Incidents" value={analytics?.noise_incidents || 0} icon={Activity} color="yellow" trend="neutral" trendValue="Stable" delay={2} />
              <DashboardCard title="Avg Discipline Score" value={analytics?.avg_discipline_score || 0} unit="%" icon={TrendingUp} color="green" trend="up" trendValue="+3.2 pts" delay={3} />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Weekly Discipline Score</p>
              <p className="text-xs text-gray-500 mb-4">Average score trend over the past week</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics?.weekly_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[50, 100]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="discipline" stroke="#3b63f8" strokeWidth={2.5} dot={{ fill: "#3b63f8", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Daily Alert Count</p>
              <p className="text-xs text-gray-500 mb-4">Number of violations flagged per day</p>
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
          </div>

          {/* Recent Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Recent Alerts</p>
              <a href="/notifications" className="text-xs text-brand-400 hover:text-brand-300">View all →</a>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No recent alerts. Classrooms are peaceful! 🎉</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-all">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${n.is_read ? "bg-gray-600" : "bg-red-500 animate-pulse"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{n.issue_type} — {n.class_id}</p>
                      <p className="text-xs text-gray-500">{n.teacher_name} · {n.subject}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{Math.round(n.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
