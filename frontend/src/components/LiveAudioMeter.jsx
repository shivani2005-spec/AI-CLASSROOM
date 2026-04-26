import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { clamp, dbToColor } from "../utils/helpers";

/**
 * LiveAudioMeter — animated real-time decibel bar visualizer.
 * Accepts a `dbLevel` prop (0-100) and renders animated bar segments.
 */
export default function LiveAudioMeter({ dbLevel = 0, isActive = false }) {
  const BAR_COUNT = 24;
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => i);
  const normalizedLevel = clamp(dbLevel, 0, 100);

  const getLevelColor = (barIndex) => {
    const threshold = (barIndex / BAR_COUNT) * 100;
    if (!isActive || normalizedLevel < threshold) return "bg-white/8";
    if (threshold < 45) return "bg-emerald-500";
    if (threshold < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const label = dbLevel > 72 ? "LOUD" : dbLevel < 28 ? "QUIET" : "NORMAL";
  const labelColor = dbLevel > 72 ? "text-red-400" : dbLevel < 28 ? "text-yellow-400" : "text-emerald-400";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isActive ? "bg-brand-500/20" : "bg-white/5"}`}>
            {isActive ? (
              <Mic size={18} className="text-brand-400 animate-pulse" />
            ) : (
              <MicOff size={18} className="text-gray-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Live Audio Level</p>
            <p className="text-xs text-gray-500">{isActive ? "Monitoring active" : "Not monitoring"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-display font-bold ${dbToColor(dbLevel)}`}>
            {isActive ? `${dbLevel.toFixed(0)} dB` : "— dB"}
          </div>
          <div className={`text-xs font-semibold ${labelColor}`}>{isActive ? label : "IDLE"}</div>
        </div>
      </div>

      {/* Bar visualizer */}
      <div className="flex items-end gap-0.5 h-14">
        {bars.map((i) => {
          const heightPct = 20 + (i / BAR_COUNT) * 80;
          return (
            <motion.div
              key={i}
              className={`flex-1 rounded-sm transition-colors duration-100 ${getLevelColor(i)}`}
              style={{ height: `${heightPct}%` }}
              animate={
                isActive && normalizedLevel > (i / BAR_COUNT) * 100
                  ? { scaleY: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse", delay: i * 0.02 }}
            />
          );
        })}
      </div>

      {/* Threshold markers */}
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <span>0 dB</span>
        <span className="text-yellow-600/70">28 dB ← quiet</span>
        <span className="text-red-600/70">72 dB → loud</span>
        <span>100 dB</span>
      </div>
    </div>
  );
}
