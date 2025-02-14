/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0D1B32",
        primaryHover: "#f3af4a",
        secondary: "#03031B",
        dark: "#03031B",
        light: "#FFFFF0",
      },
      keyframes: {
        vibrate: {
          "0%, 100%": { transform: "translateX(0) rotateZ(0)" },
          "25%": { transform: "translateX(-1px) rotateZ(10deg)" },
          "50%": { transform: "translateX(1px) rotateZ(-10deg)" },
          "75%": { transform: "translateX(-1px) rotateZ(0)" },
        },
      },
      animation: {
        vibrate: "vibrate 400ms linear forwards",
      },
    },
  },
  plugins: [],
};
