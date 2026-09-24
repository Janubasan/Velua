import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070c",
          900: "#0b0b13",
          800: "#12121d",
          700: "#1a1a29",
          600: "#242438",
          500: "#33334d",
          400: "#7e869c",
          300: "#b0b7c9",
          200: "#d3d7e2",
          100: "#e9ebf2",
        },
        gold: {
          400: "#ffd166",
          500: "#f5b942",
          600: "#e0a12c",
        },
        neon: {
          400: "#4ade80",
          500: "#22c55e",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(245,185,66,.45)",
        card: "0 20px 60px -30px rgba(0,0,0,.8)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
