import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, X, Clock, Zap } from "lucide-react";
import { formatTime } from "../utils/helpers";
import { ISSUE_COLORS } from "../utils/constants";

const ISSUE_BADGE = {
  "Abusive Language": "badge-red",
  "Excessive Noise": "badge-yellow",
  "Too Quiet": "badge-yellow",
  "Angry Teacher": "badge-red",
  "Disturbance": "badge-yellow",
  "Loud Talking": "badge-yellow",
};

export default function NotificationPanel({ notifications, onMarkRead, maxHeight = "500px" }) {
  if (!notifications.length) {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle size={36} className="text-emerald-500" />
        <p className="text-white font-semibold">All Clear</p>
        <p className="text-sm text-gray-500">No alerts at the moment. Everything looks peaceful!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" style={{ maxHeight, overflowY: "auto" }}>
      <AnimatePresence initial={false}>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className={`glass-card p-4 border ${n.is_read ? "border-white/8 opacity-60" : "border-red-500/30"} ${!n.is_read ? "alert-card-critical" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-1.5 rounded-lg ${n.is_read ? "bg-gray-500/20" : "bg-red-500/20"}`}>
                <AlertTriangle size={14} className={n.is_read ? "text-gray-500" : "text-red-400"} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={ISSUE_BADGE[n.issue_type] || "badge-blue"}>{n.issue_type}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Zap size={10} />
                    <span>{Math.round(n.confidence * 100)}% confidence</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-white">{n.class_id}</p>
                <p className="text-xs text-gray-400">
                  {n.teacher_name} · {n.subject}
                </p>
                {n.abusive_word && (
                  <p className="text-xs text-red-400 mt-1">
                    Detected: <span className="font-mono bg-red-500/10 px-1 rounded">{n.abusive_word}</span>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 italic">{n.suggested_action}</p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={10} />
                  <span>{formatTime(n.timestamp)}</span>
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => onMarkRead?.(n.id)}
                    className="p-1 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    title="Mark as read"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
