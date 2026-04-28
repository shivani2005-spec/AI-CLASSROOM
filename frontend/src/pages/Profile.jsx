import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, BookOpen, MapPin, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AnimatedButton from "../components/AnimatedButton";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/authApi";
import { getInitials } from "../utils/helpers";
import { useNotifications } from "../hooks/useNotifications";
import toast from "react-hot-toast";

const SUBJECTS = ["TOC", "CN", "DVA", "CC"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", subject: user?.subject || "", class_assigned: user?.class_assigned || "" });
  const [loading, setLoading] = useState(false);
  const { unreadCount } = useNotifications();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar unreadCount={unreadCount} onMenuToggle={() => setSidebarOpen((p) => !p)} menuOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-5 max-w-2xl">
          <h1 className="section-title mb-1">My Profile</h1>
          <p className="section-subtitle mb-6">Manage your account details</p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-5">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/8">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-2xl font-bold text-white shadow-glow">
                {getInitials(user?.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <span className="badge-blue mt-1 capitalize">{user?.role}</span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="name" value={form.name} onChange={handleChange} className="input-field pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={user?.email} disabled className="input-field pl-10 opacity-50 cursor-not-allowed" />
                </div>
              </div>

              {user?.role === "teacher" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <div className="relative">
                      <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <select name="subject" value={form.subject} onChange={handleChange} className="input-field pl-10">
                        <option value="">Select Subject</option>
                        {SUBJECTS.map((s) => <option key={s} value={s} className="bg-surface">{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Class Room Number</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input name="class_assigned" value={form.class_assigned} onChange={handleChange} className="input-field pl-10" placeholder="e.g. 204" />
                    </div>
                  </div>
                </>
              )}

              <AnimatedButton type="submit" loading={loading} icon={Save}>Save Changes</AnimatedButton>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
