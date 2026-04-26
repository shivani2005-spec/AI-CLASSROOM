import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Monitor, BarChart3, Bell, User, Settings,
  GraduationCap, Shield, Users, Mic, LogOut, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const NAV_ITEMS = {
  student: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ],
  teacher: [
    { to: "/teacher-dashboard", icon: GraduationCap, label: "My Dashboard" },
    { to: "/classroom-live", icon: Mic, label: "Live Monitor" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Bell, label: "Alerts" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ],
  principal: [
    { to: "/principal-dashboard", icon: Shield, label: "Command Center" },
    { to: "/classroom-live", icon: Monitor, label: "Live Classrooms" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Bell, label: "Alerts" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ],
  admin: [
    { to: "/admin", icon: Users, label: "Admin Panel" },
    { to: "/principal-dashboard", icon: Shield, label: "Principal View" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/notifications", icon: Bell, label: "Alerts" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ],
};

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: -280, opacity: 0, transition: { duration: 0.2 } },
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS[user?.role] || NAV_ITEMS.student;

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose?.();
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow text-sm font-bold text-white">
            {getInitials(user?.name)}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 lg:hidden">
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8">
        {user?.subject && (
          <div className="px-4 py-2 mb-2 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <p className="text-xs text-gray-500">Teaching</p>
            <p className="text-sm font-semibold text-brand-300">{user.subject}</p>
            {user.class_assigned && (
              <p className="text-xs text-gray-500">Room {user.class_assigned}</p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-link text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/8 bg-surface/60 backdrop-blur-xl shrink-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 h-full w-64 z-50 border-r border-white/8 bg-surface backdrop-blur-xl lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
