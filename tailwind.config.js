/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        raleway:['Raleway', 'sans-serif']
      },
      colors:{
        'primary':'#43766C',
        'secondary':'#76453B',
        'light':'#FBF9F1',
        'being':'#B19470',
        'dark': '#386058'
      },
      spacing:{
        '550' : '34.375rem'
      }
    },
  },
  plugins: [],
}

