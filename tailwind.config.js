/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Bật JIT (Just-In-Time) mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //Colors used in the project
       colors:{
        primary:"#1DA1F2",
        secondary:"EF863E",
       },
    },
  },
  plugins: [],
}

 