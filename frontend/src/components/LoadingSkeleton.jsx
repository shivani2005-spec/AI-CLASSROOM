/**
 * Loading skeleton — shown during initial auth check or data fetches.
 */
export default function LoadingSkeleton({ lines = 5 }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-brand-gradient animate-pulse-glow flex items-center justify-center shadow-glow">
          <span className="text-2xl">🎓</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 animate-pulse">Loading ClassroomAI…</p>
      </div>
    </div>
  );
}

/** Inline skeleton bar for use inside cards */
export function SkeletonBar({ className = "" }) {
  return (
    <div className={`h-4 rounded-lg bg-white/5 animate-pulse ${className}`} />
  );
}

/** Skeleton card placeholder */
export function SkeletonCard() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <SkeletonBar className="w-1/3 h-3" />
      <SkeletonBar className="w-2/3 h-6" />
      <SkeletonBar className="w-1/2 h-3" />
    </div>
  );
}
