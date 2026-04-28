import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Shield, BookOpen, MapPin } from "lucide-react";
import { signup } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import toast from "react-hot-toast";

const ROLES = ["student", "teacher", "hod", "admin"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "teacher", subject: "", class_assigned: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error("Please fill all required fields"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await signup(form);
      login(data.user, { access_token: data.access_token, refresh_token: data.refresh_token });
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      const dashboards = { teacher: "/teacher-dashboard", hod: "/hod-dashboard", admin: "/admin", student: "/dashboard" };
      navigate(dashboards[data.user.role] || "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30 bg-mesh-light dark:from-surface dark:via-surface dark:to-brand-900/10 dark:bg-mesh flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">ClassroomAI</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join ClassroomAI and start monitoring today</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <input name="name" value={form.name} onChange={handleChange} className="input-field pl-10" placeholder="Rajesh Sharma" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@school.edu" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field capitalize">
                  {ROLES.map((r) => <option key={r} value={r} className="bg-surface">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              {(form.role === "teacher") && (
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Class Room</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input name="class_assigned" value={form.class_assigned} onChange={handleChange} className="input-field pl-10" placeholder="e.g. 204" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <AnimatedButton type="submit" loading={loading} className="w-full justify-center mt-2">
              Create Account
            </AnimatedButton>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signin" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
