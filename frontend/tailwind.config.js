/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8E387C", //suce mon aubergine
        primaryHover: "#7e316e",
        secondary: "#FFFFFF", // walter white
        secondaryHover: "#e6e6e6",
        validation: "#10A979", //green lantern
        validationHover: "#0e966a",
        pending: "#1083A9", //blue lock
        pendingHover: "#0e7597",
        error: "#FF595C", //axelle red
        errorHover: "#e64f52",
        cancel: "#959494", //sasha grey
        cancelHover: "#868585",
        textLight: "#FFFFFF",
        textDark: "#0D1B32", //midnightblue
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
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
