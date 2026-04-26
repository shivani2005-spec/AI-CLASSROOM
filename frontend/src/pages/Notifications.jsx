import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";
import { useWebSocket } from "../hooks/useWebSocket";
import { Bell, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { notifications, unreadCount, fetchNotifications, markRead, addNotification } = useNotifications();

  useWebSocket((msg) => {
    if (msg.type === "NEW_ALERT") {
      addNotification(msg.payload);
      toast.error(`🚨 ${msg.payload.issue_type}`, { duration: 4000 });
    }
  }, true);

  useEffect(() => { fetchNotifications(100); }, [fetchNotifications]);

  const FILTERS = ["All", "Abusive Language", "Excessive Noise", "Too Quiet", "Angry Teacher", "Disturbance"];
  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.issue_type === filter);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="section-title">Notifications</h1>
              <p className="section-subtitle">{notifications.length} total · {unreadCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field py-2 text-sm w-44">
                {FILTERS.map((f) => <option key={f} value={f} className="bg-surface">{f}</option>)}
              </select>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="glass-card p-4 border border-red-500/30 flex items-center gap-3">
              <Bell size={16} className="text-red-400 animate-pulse" />
              <p className="text-sm text-red-300 font-medium">{unreadCount} unread alert{unreadCount > 1 ? "s" : ""} require your attention.</p>
            </div>
          )}

          <NotificationPanel notifications={filtered} onMarkRead={markRead} maxHeight="none" />
        </main>
      </div>
    </div>
  );
}
