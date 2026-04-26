import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { signin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import toast from "react-hot-toast";

const ROLE_DASHBOARDS = {
  teacher: "/teacher-dashboard",
  principal: "/principal-dashboard",
  admin: "/admin",
  student: "/dashboard",
};

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const { data } = await signin(form);
      login(data.user, { access_token: data.access_token, refresh_token: data.refresh_token });
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(ROLE_DASHBOARDS[data.user.role] || "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface bg-mesh flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">ClassroomAI</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@school.edu" autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                  className="input-field pl-10 pr-10" placeholder="••••••••" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatedButton type="submit" loading={loading} className="w-full justify-center">
              Sign In
            </AnimatedButton>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl bg-brand-500/8 border border-brand-500/20">
            <p className="text-xs font-semibold text-brand-300 mb-1.5">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Principal: <span className="text-gray-400">principal@school.com / demo1234</span></p>
              <p>Teacher: <span className="text-gray-400">teacher@school.com / demo1234</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
