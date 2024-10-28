/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#5A6ACF",
        notBlack: "#18345E",
        navBar: {
          inactive: "#273240",
          active: "#5A6ACF",
        },
        title: "#5A6ACF",
        button: "#18345E",
        placeHolder: "#B6BEC7",
      },
      backgroundColor: {
        // navBar: "#F1F2F7",
        // "#E4E7F5"
        active: "#E4E7F4",
        navBar: "#F1F2F7",
        inputBox: "#F6F6FB",
        button: {
          basic: "#A4B3FF",
          hover: "#E4RE7F5",
        }
      },
      colors: {

        primary: "#5A6ACF",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
        error: "#FF3B3B",
        softRed: "#FC8D8B",
        softGreen: "#82E898"
      },


    },
  },
  plugins: [],
}