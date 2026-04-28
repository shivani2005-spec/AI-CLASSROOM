import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Bell, TrendingUp, Users, Search, Filter, Activity } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import TeacherCard from "../components/TeacherCard";
import NotificationPanel from "../components/NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";
import { useWebSocket } from "../hooks/useWebSocket";
import { getHodAlerts, getTeacherPerformance, getLiveAllClasses } from "../api/classroomApi";
import { getHodAnalytics } from "../api/analyticsApi";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TOOLTIP_STYLE = { background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" };

export default function HodDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const { notifications, unreadCount, fetchNotifications, markRead, addNotification } = useNotifications();

  const onWsMessage = useCallback((msg) => {
    if (msg.type === "NEW_ALERT") {
      addNotification(msg.payload);
      toast.error(`🚨 ${msg.payload.class_id}: ${msg.payload.issue_type}`, {
        duration: 6000,
        icon: "🔴",
      });
    }
  }, [addNotification]);

  useWebSocket(onWsMessage, true);

  useEffect(() => {
    const load = async () => {
      try {
        const [perfRes, liveRes, analyticsRes] = await Promise.allSettled([
          getTeacherPerformance(),
          getLiveAllClasses(),
          getHodAnalytics(),
        ]);
        if (perfRes.status === "fulfilled") setTeachers(perfRes.value.data.teachers || []);
        if (liveRes.status === "fulfilled") setLiveClasses(liveRes.value.data || []);
        if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
      } catch {}
      // demo fallback
      setTeachers((prev) => prev.length ? prev : [
        { teacher_id: "1", teacher_name: "Rajesh Sharma", subject: "Mathematics", class_assigned: "204", discipline_score: 92, total_alerts: 3, ranking: 1 },
        { teacher_id: "2", teacher_name: "Priya Singh", subject: "Physics", class_assigned: "101", discipline_score: 85, total_alerts: 7, ranking: 2 },
        { teacher_id: "3", teacher_name: "Anita Patel", subject: "Chemistry", class_assigned: "102", discipline_score: 78, total_alerts: 12, ranking: 3 },
        { teacher_id: "4", teacher_name: "Vijay Kumar", subject: "Biology", class_assigned: "201", discipline_score: 71, total_alerts: 18, ranking: 4 },
        { teacher_id: "5", teacher_name: "Sunita Verma", subject: "English", class_assigned: "202", discipline_score: 65, total_alerts: 23, ranking: 5 },
      ]);
      setAnalytics((prev) => prev || {
        total_alerts: 63, abusive_incidents: 14, noise_incidents: 31, avg_discipline_score: 78.2,
        weekly_data: [
          { day: "Mon", alerts: 10 }, { day: "Tue", alerts: 7 }, { day: "Wed", alerts: 14 },
          { day: "Thu", alerts: 9 }, { day: "Fri", alerts: 13 }, { day: "Sat", alerts: 10 },
        ],
        class_rankings: [
          { class_id: "Room 204", discipline_score: 92 }, { class_id: "Room 101", discipline_score: 85 },
          { class_id: "Room 102", discipline_score: 78 }, { class_id: "Room 201", discipline_score: 71 },
        ],
      });
    };
    load();
    fetchNotifications(50);
  }, [fetchNotifications]);

  const subjects = ["All", ...new Set(teachers.map((t) => t.subject).filter(Boolean))];
  const filteredTeachers = teachers.filter((t) => {
    const matchSearch = !search || (t.teacher_name || "").toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "All" || t.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="section-title">Command Center</h1>
              <p className="section-subtitle">Real-time school-wide discipline monitoring</p>
            </div>
            {unreadCount > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-semibold text-red-300">{unreadCount} Active Alerts</span>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Alerts Today" value={analytics?.total_alerts || 0} icon={Bell} color="red" delay={0} />
            <DashboardCard title="Abusive Incidents" value={analytics?.abusive_incidents || 0} icon={AlertTriangle} color="red" delay={1} />
            <DashboardCard title="Noise Incidents" value={analytics?.noise_incidents || 0} icon={Activity} color="yellow" delay={2} />
            <DashboardCard title="Avg Discipline Score" value={analytics?.avg_discipline_score || 0} unit="%" icon={TrendingUp} color="green" delay={3} />
          </div>

          {/* Live Classes + Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Alert feed */}
            <div className="xl:col-span-2 glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Live Alert Feed</p>
                <span className="badge-red animate-pulse">{unreadCount} new</span>
              </div>
              <NotificationPanel notifications={notifications.slice(0, 8)} onMarkRead={markRead} maxHeight="380px" />
            </div>

            {/* Weekly bar chart */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
              <p className="text-sm font-semibold text-white mb-1">Weekly Alerts</p>
              <p className="text-xs text-gray-500 mb-4">Violations per day this week</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.weekly_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="alerts" fill="#ef4444" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Class rankings */}
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 font-medium mb-2">Top Classrooms</p>
                {(analytics?.class_rankings || []).slice(0, 4).map((cls) => (
                  <div key={cls.class_id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-20 shrink-0">{cls.class_id}</span>
                    <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-brand-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${cls.discipline_score}%` }} transition={{ duration: 1 }} />
                    </div>
                    <span className="text-xs text-brand-300 shrink-0">{cls.discipline_score}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Teacher Rankings */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div>
                <p className="text-sm font-semibold text-white">Teacher Performance Rankings</p>
                <p className="text-xs text-gray-500">Sorted by discipline score</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-8 py-2 text-sm w-48" placeholder="Search teacher..." />
                </div>
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="input-field py-2 text-sm w-40">
                  {subjects.map((s) => <option key={s} value={s} className="bg-surface">{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredTeachers.map((t) => (
                <TeacherCard key={t.teacher_id} teacher={t} rank={t.ranking} />
              ))}
              {filteredTeachers.length === 0 && (
                <p className="text-sm text-gray-500 col-span-3 text-center py-8">No teachers match your search.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
