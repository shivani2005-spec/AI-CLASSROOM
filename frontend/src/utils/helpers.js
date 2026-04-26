/** Format a UTC ISO timestamp to a human-readable local time string. */
export const formatTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** Return badge color class based on dB level. */
export const dbToColor = (db) => {
  if (db > 72) return "text-red-400";
  if (db < 28) return "text-yellow-400";
  return "text-emerald-400";
};

/** Clamp a number between min and max. */
export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

/** Convert 0-100 discipline score to a tailwind color class. */
export const scoreToColor = (score) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

export const scoreToBg = (score) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

/** Get initials from a full name. */
export const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
