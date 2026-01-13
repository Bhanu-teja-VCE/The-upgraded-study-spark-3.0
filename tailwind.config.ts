import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#0A0A0F", // Dark Navy
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#0F0F14",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#00D9FF", // Cyan/Electric Blue
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Purple accent
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#00D9FF",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#FF453A",
          foreground: "#FFFFFF",
        },
        warning: "#FFB800", // Gold
        border: "rgba(0, 217, 255, 0.2)",
        input: "rgba(0, 0, 0, 0.3)",
        ring: "#00D9FF",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #00D9FF, 0 0 10px #00D9FF" },
          "50%": { boxShadow: "0 0 20px #00D9FF, 0 0 30px #00D9FF" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
