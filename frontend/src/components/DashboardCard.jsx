import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * DashboardCard — animated metric card with GSAP count-up.
 */
export default function DashboardCard({
  title,
  value,
  unit = "",
  icon: Icon,
  trend,         // "up" | "down" | "neutral"
  trendValue,
  color = "blue",  // "blue" | "green" | "red" | "yellow"
  delay = 0,
  onClick,
}) {
  const valueRef = useRef(null);

  const colorConfig = {
    blue:   { icon: "text-brand-400", glow: "shadow-glow",     bg: "bg-brand-500/15",   border: "border-brand-500/25" },
    green:  { icon: "text-emerald-400", glow: "shadow-glow-green", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
    red:    { icon: "text-red-400",    glow: "shadow-glow-red", bg: "bg-red-500/15",     border: "border-red-500/25" },
    yellow: { icon: "text-yellow-400", glow: "",                bg: "bg-yellow-500/15",  border: "border-yellow-500/25" },
  }[color];

  // GSAP count-up animation
  useEffect(() => {
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue) || !valueRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericValue,
      duration: 1.6,
      delay: delay * 0.1,
      ease: "power2.out",
      onUpdate() {
        if (valueRef.current) {
          const formatted = Number.isInteger(numericValue)
            ? Math.round(obj.val)
            : obj.val.toFixed(1);
          valueRef.current.textContent = `${formatted}${unit}`;
        }
      },
    });
  }, [value, unit, delay]);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`glass-card p-5 cursor-${onClick ? "pointer" : "default"} border ${colorConfig.border} hover:${colorConfig.glow} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorConfig.bg}`}>
          {Icon && <Icon size={20} className={colorConfig.icon} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon size={13} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div ref={valueRef} className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
        {value}{unit}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );
}
