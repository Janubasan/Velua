/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        velua: {
          bg: "#0a0a0f",
          card: "#15151f",
          border: "#23233a",
          green: "#00ff88",
          red: "#ff3b5c",
          yellow: "#ffcc00",
          purple: "#8b5cf6"
        }
      }
    },
  },
  plugins: [],
}
