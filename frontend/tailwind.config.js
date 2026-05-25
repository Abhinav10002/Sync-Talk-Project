/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark-mode toggle support
  theme: {
    extend: {
      colors: {
        chatBg: "#111827",
        panelBg: "#1f2937",
        accentColor: "#6366f1"
      }
    },
  },
  plugins: [],
}