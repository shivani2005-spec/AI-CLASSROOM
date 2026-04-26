/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      opacity: {
        '3': '0.03',
        '6': '0.06',
        '8': '0.08',
        '15': '0.15',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c2d4ff",
          300: "#93b4fe",
          400: "#608afc",
          500: "#3b63f8",
          600: "#2245ed",
          700: "#1a33d9",
          800: "#1c2db0",
          900: "#1d2c8b",
          950: "#141a5e",
        },
        surface: {
          DEFAULT: "#0f1117",
          50:  "#1a1d27",
          100: "#22263a",
          200: "#2d3250",
        },
        glass: "rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #1e2a4a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        "brand-gradient": "linear-gradient(135deg, #3b63f8, #7c3aed)",
        "danger-gradient": "linear-gradient(135deg, #ef4444, #dc2626)",
        "success-gradient": "linear-gradient(135deg, #10b981, #059669)",
        "warning-gradient": "linear-gradient(135deg, #f59e0b, #d97706)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.37)",
        glow:  "0 0 20px rgba(59,99,248,0.35)",
        "glow-red": "0 0 20px rgba(239,68,68,0.4)",
        "glow-green": "0 0 20px rgba(16,185,129,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "slide-in-right": "slideInRight 0.4s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-subtle": "bounceSubtle 1.5s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideInRight: { from: { opacity: 0, transform: "translateX(30px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59,99,248,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(59,99,248,0.7)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        blink: { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0 } },
      },
    },
  },
  plugins: [],
};
