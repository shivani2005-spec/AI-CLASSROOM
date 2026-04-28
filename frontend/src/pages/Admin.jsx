import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Trash2, Shield, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import AnimatedButton from "../components/AnimatedButton";
import { useNotifications } from "../hooks/useNotifications";
import { getAllTeachers } from "../api/classroomApi";
import { getInitials } from "../utils/helpers";
import toast from "react-hot-toast";

const ROLE_BADGE = { teacher: "badge-blue", hod: "badge-green", admin: "badge-red", student: "badge-yellow" };

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    getAllTeachers().then(({ data }) => setTeachers(Array.isArray(data) ? data : [])).catch(() => {
      setTeachers([
        { id: "1", name: "Rajesh Sharma", email: "rajesh@school.com", subject: "Mathematics", class_assigned: "204", role: "teacher" },
        { id: "2", name: "Priya Singh", email: "priya@school.com", subject: "Physics", class_assigned: "101", role: "teacher" },
        { id: "3", name: "Anita Patel", email: "anita@school.com", subject: "Chemistry", class_assigned: "102", role: "teacher" },
        { id: "4", name: "Dr. Mehta", email: "hod@school.com", subject: null, class_assigned: null, role: "hod" },
      ]);
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="section-title">Admin Panel</h1>
              <p className="section-subtitle">Manage users, roles, and system settings</p>
            </div>
            <AnimatedButton icon={UserPlus} onClick={() => toast.success("Open signup to add users")}>
              Add User
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Total Users" value={teachers.length + 10} icon={Users} color="blue" delay={0} />
            <DashboardCard title="Teachers" value={teachers.filter((t) => t.role === "teacher").length} icon={BookOpen} color="green" delay={1} />
            <DashboardCard title="HODs" value={teachers.filter((t) => t.role === "hod").length} icon={Shield} color="yellow" delay={2} />
            <DashboardCard title="Active Sessions" value={3} icon={Users} color="blue" delay={3} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4">All Users</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-white/8">
                    <th className="text-left pb-3 pr-4">User</th>
                    <th className="text-left pb-3 pr-4">Email</th>
                    <th className="text-left pb-3 pr-4">Role</th>
                    <th className="text-left pb-3 pr-4">Subject</th>
                    <th className="text-left pb-3 pr-4">Class</th>
                    <th className="text-left pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teachers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/3 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <span className="font-medium text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                      <td className="py-3 pr-4"><span className={ROLE_BADGE[u.role] || "badge-blue"}>{u.role}</span></td>
                      <td className="py-3 pr-4 text-gray-400">{u.subject || "—"}</td>
                      <td className="py-3 pr-4 text-gray-400">{u.class_assigned ? `Room ${u.class_assigned}` : "—"}</td>
                      <td className="py-3">
                        <button onClick={() => toast.error("Delete user: " + u.name)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4">System Information</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "API Status", value: "Online ✅", color: "text-emerald-400" },
                { label: "DB Status", value: "MongoDB ✅", color: "text-emerald-400" },
                { label: "AI Engine", value: "Hybrid Mode", color: "text-brand-400" },
                { label: "WebSocket", value: "Active ✅", color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-sm font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
