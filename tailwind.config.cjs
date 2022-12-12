/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 0px 10px 0px rgba(0,0,0,0.2)",
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-60%)" },
          "100%": { transform: "translateX(-140%)" },
        },
        firework: {
          "0%": {
            transform: "translate(-50%, 60vh)",
            width: "0.5vmin",
            opacity: 1,
          },
          "50%": {
            width: "0.5vmin",
            opacity: 1,
          },
          "100%": {
            width: "45vmin",
            opacity: 0,
          },
        },
      },
      animation: {
        "wave-moving1": "wave 10s linear infinite",
        "wave-moving2": "wave 18s linear reverse infinite",
        "wave-moving3": "wave 20s linear infinite",
        "wave-moving3": "wave 20s linear reverse infinite",
        "wave-press": "wave 3s linear infinite",
        "firework ": "firework 2s infinite",
      },
    },
  },
  plugins: [],
};
