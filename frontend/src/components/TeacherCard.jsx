import { motion } from "framer-motion";
import { BookOpen, MapPin, AlertTriangle, TrendingUp } from "lucide-react";
import { scoreToColor, scoreToBg, getInitials } from "../utils/helpers";

export default function TeacherCard({ teacher, rank, onClick }) {
  const score = teacher.discipline_score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="glass-card p-4 cursor-pointer hover:border-brand-500/30 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        {rank && (
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
            #{rank}
          </div>
        )}
        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-sm font-bold text-white shadow-glow shrink-0">
          {getInitials(teacher.teacher_name || teacher.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{teacher.teacher_name || teacher.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <BookOpen size={11} className="text-gray-500" />
            <span className="text-xs text-gray-400 truncate">{teacher.subject || "N/A"}</span>
            {teacher.class_assigned && (
              <>
                <MapPin size={11} className="text-gray-500" />
                <span className="text-xs text-gray-400">Room {teacher.class_assigned}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-xl font-display font-bold ${scoreToColor(score)}`}>{score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="flex items-center gap-1"><TrendingUp size={10} /> Discipline Score</span>
          {teacher.total_alerts !== undefined && (
            <span className="flex items-center gap-1 text-yellow-500">
              <AlertTriangle size={10} />{teacher.total_alerts} alerts
            </span>
          )}
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${scoreToBg(score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
