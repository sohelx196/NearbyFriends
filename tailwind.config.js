/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./features/**/*.{html,js}",
    "./assets/**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
