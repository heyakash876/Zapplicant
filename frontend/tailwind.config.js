/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          light: "#60a5fa",
          DEFAULT: "#2563eb",
          dark: "#1e40af",
        },
        accent: {
          light: "#f472b6",
          DEFAULT: "#db2777",
          dark: "#9d174d",
        },
        bg: {
          light: "#18181b", // changed to dark by default
          DEFAULT: "#18181b",
          dark: "#09090b",
        },
        card: {
          light: "#232336", // changed to dark by default
          dark: "#18181b",
        },
      },
    },
  },
  plugins: [],
}
