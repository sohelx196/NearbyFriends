/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./features/**/*.{html,js}",
    "./assets/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
           sans: ['Montserrat', 'sans-serif'],
        },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
