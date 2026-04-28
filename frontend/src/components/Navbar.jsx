import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Menu, X, Sun, Moon, LogOut, User, ChevronDown, Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../utils/helpers";

const ROLE_LABELS = {
  teacher: { label: "Teacher", color: "badge-blue" },
  hod: { label: "HOD", color: "badge-green" },
  admin: { label: "Admin", color: "badge-red" },
  student: { label: "Student", color: "badge-yellow" },
};

export default function Navbar({ unreadCount = 0, onMenuToggle, menuOpen }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleInfo = ROLE_LABELS[user?.role] || ROLE_LABELS.student;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 backdrop-blur-xl bg-surface/80">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left — logo + hamburger */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-glow group-hover:shadow-lg transition-all">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white hidden sm:block">
              Classroom<span className="text-gradient">AI</span>
            </span>
          </Link>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* Notifications bell */}
          {user && (
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </Link>
          )}

          {/* Profile dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/8 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shadow-glow">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-white truncate max-w-[100px]">{user.name}</span>
                  <span className={`text-[10px] ${roleInfo.color}`}>{roleInfo.label}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 glass-card py-1 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all"
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-all"
                    >
                      <Shield size={14} />
                      Settings
                    </Link>
                    <hr className="border-white/8 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/signin" className="btn-primary text-sm py-2 px-4">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
