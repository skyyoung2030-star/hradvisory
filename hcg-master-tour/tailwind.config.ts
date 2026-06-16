import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Surface tokens for the dark theme ──
        // Used by .card / page background classes in globals.css. Components
        // typically reach for these via component classes rather than directly.
        ink: {
          0:   "#08090D",  // deepest background
          50:  "#0A0B11",  // page bg
          100: "#13141B",  // card base
          200: "#1C1D27",  // card hover / strong surface
          300: "#262833",  // strong border
          400: "#3F4150",  // dividers
          500: "#71717A",  // faint text
          600: "#A1A1AA",  // muted text
          700: "#D4D4D8",  // body text
          800: "#E4E4E7",
          900: "#FAFAFA",  // headings
        },
        // Existing palette kept for compatibility with components that still
        // reach for `primary-*` etc. Slowly being migrated to `ink-*`.
        primary: {
          50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1",
          400: "#64748B", 500: "#475569", 600: "#334155", 700: "#1E293B",
          800: "#0F172A", 900: "#0F172A",
        },
        accent: {
          50:  "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
        },
        success: { 500: "#10B981" },
        warning: { 500: "#F59E0B" },
        danger:  { 500: "#EF4444" },
        bg: {
          DEFAULT: "#0A0B11",
          soft:    "#13141B",
          muted:   "#1C1D27",
        },
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: { container: "1200px", tour: "1040px" },
      borderRadius: { xl: "12px", "2xl": "16px" },
      boxShadow: {
        // 3D depth combos
        "depth-1": "0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)",
        "depth-2": "0 2px 4px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.5)",
        "depth-3": "0 4px 8px rgba(0,0,0,0.5), 0 24px 56px rgba(0,0,0,0.6)",
        // accent glow for featured surfaces
        "glow-accent": "0 0 0 1px rgba(14,165,233,0.4), 0 0 40px -8px rgba(14,165,233,0.5), 0 24px 48px -16px rgba(0,0,0,0.6)",
        "glow-accent-lg": "0 0 0 1px rgba(14,165,233,0.5), 0 0 60px -8px rgba(14,165,233,0.55), 0 32px 64px -16px rgba(0,0,0,0.7)",
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.55" } },
        shimmer: { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "0.9" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
