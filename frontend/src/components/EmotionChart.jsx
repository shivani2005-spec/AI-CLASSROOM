import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, Cell, PieChart, Pie,
} from "recharts";
import { EMOTION_COLORS } from "../utils/constants";

const EMOTION_LABELS = {
  happy: "😊 Happy",
  neutral: "😐 Neutral",
  stressed: "😰 Stressed",
  angry: "😠 Angry",
  fearful: "😨 Fearful",
};

export default function EmotionChart({ data, title = "Classroom Emotion State" }) {
  const pieData = Object.entries(EMOTION_COLORS).map(([key, color]) => ({
    name: EMOTION_LABELS[key] || key,
    value: Math.round((data?.[key] || 0) * 100),
    color,
  }));

  const radarData = pieData.map(({ name, value }) => ({ emotion: name, value }));
  const dominant = data?.dominant_emotion || "neutral";
  const dominantColor = EMOTION_COLORS[dominant] || "#6b7280";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-gray-500">Real-time mood analysis</p>
        </div>
        <div
          className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
          style={{ color: dominantColor, borderColor: `${dominantColor}40`, backgroundColor: `${dominantColor}15` }}
        >
          {EMOTION_LABELS[dominant] || dominant}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
              {pieData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" }} formatter={(val) => [`${val}%`]} />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={160}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="emotion" tick={{ fill: "#6b7280", fontSize: 9 }} />
            <Radar dataKey="value" stroke="#3b63f8" fill="#3b63f8" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {pieData.map(({ name, color, value }) => (
          <div key={name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400">{name} <span className="text-gray-600">{value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
