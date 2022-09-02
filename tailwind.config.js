const colors = require("tailwindcss/colors")
const plugin = require("tailwindcss/plugin")

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: colors.sky,
      secondary: colors.sky,
      neutral: colors.stone,
      gray: colors.gray,
      white: colors.white,
      danger: colors.red,
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("not-last", "&:not(:last-child)")
    }),
  ],
}
