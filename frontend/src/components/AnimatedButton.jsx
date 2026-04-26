import { motion } from "framer-motion";

/**
 * AnimatedButton — reusable button with Framer Motion press animation.
 * Variants: primary | secondary | danger | ghost
 */
export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  type = "button",
  className = "",
  icon: Icon,
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    ghost: "text-gray-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/8 transition-all",
  }[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${variantClass} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
