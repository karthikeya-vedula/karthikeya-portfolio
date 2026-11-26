/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#070b19",
          900: "#0f172a",
        },
        accent: {
          primary: "#3b82f6",
          secondary: "#06b6d4",
        },
      },
    },
  },
  plugins: [],
};