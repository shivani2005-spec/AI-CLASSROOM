import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mic, Brain, Shield, Bell, BarChart3, Users, ArrowRight, Play,
  ChevronRight, Zap, Eye, Activity,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: Mic, title: "Live Audio Analysis", desc: "Real-time decibel monitoring detects noise, silence, and disturbances with 94%+ accuracy.", color: "blue" },
  { icon: Brain, title: "NLP Abuse Detection", desc: "Bilingual English + Hindi toxic language detection with confidence scoring.", color: "red" },
  { icon: Eye, title: "Emotion Recognition", desc: "Voice-based emotion analysis detects anger, stress, happiness across the entire classroom.", color: "yellow" },
  { icon: Bell, title: "Instant Alerts", desc: "Real-time WebSocket notifications pushed directly to the principal dashboard.", color: "green" },
  { icon: BarChart3, title: "Deep Analytics", desc: "Weekly discipline trends, class rankings, and teacher performance indices.", color: "blue" },
  { icon: Shield, title: "Role-Based Access", desc: "Student, Teacher, Principal, and Admin roles with JWT-secured APIs.", color: "green" },
];

const STATS = [
  { value: "94%", label: "Detection Accuracy" },
  { value: "<1s", label: "Alert Latency" },
  { value: "100", label: "Discipline Score" },
  { value: "24/7", label: "Real-time Monitoring" },
];

const colorMap = {
  blue: { bg: "bg-brand-500/15", icon: "text-brand-400", border: "border-brand-500/25" },
  red: { bg: "bg-red-500/15", icon: "text-red-400", border: "border-red-500/25" },
  yellow: { bg: "bg-yellow-500/15", icon: "text-yellow-400", border: "border-yellow-500/25" },
  green: { bg: "bg-emerald-500/15", icon: "text-emerald-400", border: "border-emerald-500/25" },
};

export default function Landing() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");

      // Stats count-up on scroll
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 0.7,
            scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
          }
        );
      }

      // Feature cards stagger
      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6,
          scrollTrigger: { trigger: ".features-grid", start: "top 75%" },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-surface bg-mesh">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl bg-surface/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-glow">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Classroom<span className="text-gradient">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-20 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-sm font-medium mb-8"
        >
          <Zap size={14} className="animate-pulse" />
          AI-Powered Classroom Intelligence
        </motion.div>

        <h1 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-tight tracking-tight mb-6">
          Smart Classroom
          <br />
          <span className="text-gradient">Monitoring System</span>
        </h1>

        <p ref={subtitleRef} className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Track discipline, emotions, noise level and classroom behavior in real-time
          using advanced AI, NLP, and audio analysis.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3.5 group">
            Start Demo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/signin" className="btn-secondary text-base px-8 py-3.5 group">
            <Play size={16} />
            Watch Live Preview
          </Link>
        </div>

        {/* Live indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live monitoring active in 6 classrooms
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass-card p-6 text-center">
              <div className="text-4xl font-display font-black text-gradient mb-1">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-white mb-3">
            Everything You Need to <span className="text-gradient">Monitor Smarter</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete AI suite that works silently in the background, alerting you only when action is needed.
          </p>
        </div>
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => {
            const c = colorMap[color];
            return (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                className={`feature-card glass-card p-6 border ${c.border} transition-all duration-300 hover:shadow-glow`}
              >
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={c.icon} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="glass-card p-10 text-center border border-brand-500/25 bg-brand-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-white mb-3">
              Ready to Transform Your School?
            </h2>
            <p className="text-brand-200 mb-7">
              Join thousands of educators using ClassroomAI to create safer, more productive environments.
            </p>
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
              Get Started Free <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center text-sm text-gray-600">
        <p>© 2024 ClassroomAI. Built with ❤️ for smarter education.</p>
      </footer>
    </div>
  );
}
