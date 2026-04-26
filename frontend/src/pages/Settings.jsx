import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Bell, Shield } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";
import toast from "react-hot-toast";

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/8 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-brand-500" : "bg-white/15"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const [prefs, setPrefs] = useState({ emailAlerts: true, soundAlerts: true, showConfidence: true, compactView: false, autoMonitor: false });

  const toggle = (key) => (val) => { setPrefs((p) => ({ ...p, [key]: val })); toast.success("Setting updated!"); };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 max-w-2xl space-y-5">
          <div>
            <h1 className="section-title">Settings</h1>
            <p className="section-subtitle">Customize your ClassroomAI experience</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Sun size={16} className="text-brand-400" /> Appearance</p>
            <ToggleRow label="Dark Mode" description="Use the dark color theme (recommended)" enabled={isDark} onChange={toggleTheme} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Bell size={16} className="text-brand-400" /> Notifications</p>
            <ToggleRow label="Email Alerts" description="Receive discipline alerts via email" enabled={prefs.emailAlerts} onChange={toggle("emailAlerts")} />
            <ToggleRow label="Sound Alerts" description="Play a sound when a new alert arrives" enabled={prefs.soundAlerts} onChange={toggle("soundAlerts")} />
            <ToggleRow label="Show Confidence Score" description="Display AI confidence % in alert cards" enabled={prefs.showConfidence} onChange={toggle("showConfidence")} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield size={16} className="text-brand-400" /> Monitoring</p>
            <ToggleRow label="Auto-Start Monitoring" description="Begin monitoring automatically at class time" enabled={prefs.autoMonitor} onChange={toggle("autoMonitor")} />
            <ToggleRow label="Compact View" description="Show smaller cards to fit more data on screen" enabled={prefs.compactView} onChange={toggle("compactView")} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
