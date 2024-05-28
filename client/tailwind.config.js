/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui:{
    themes:['light'],
  },
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        'brown': '#834333'
      },
      animation: {
        fade: "fade 0.5s",
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: "0%",
          },

          "100%": {
            opacity: "100%",
          },
        },
      },
      fontFamily:{
        'lexend': ["'Lexend'",'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
}

// require("daisyui")

