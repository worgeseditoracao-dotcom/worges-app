/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        worges: {
          DEFAULT: "#7a1f2b",
          dark: "#5a1620",
          light: "#a8394a",
          cream: "#f7f1e8",
        },
      },
    },
  },
  plugins: [],
};
