/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",   // teal — calm/medical
        urgent: "#dc2626",
        warning: "#d97706",
        safe: "#16a34a",
      },
    },
  },
  plugins: [],
}
