/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-light": "#f5f7f8",
        "background-dark": "#101722",
        "content-light": "#1f2937",
        "content-dark": "#d1d5db",
        "subtle-light": "#6b7280",
        "subtle-dark": "#9ca3af",
      },
      fontFamily: {
        display: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
