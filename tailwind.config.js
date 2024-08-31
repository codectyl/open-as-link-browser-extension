/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./**/*.tsx"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["autumn", "night"],
    darkTheme: "night",
    theme: "autumn"
  }
}
