/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {},
  },
  content: ["./**/*.tsx"],
  plugins: []
})