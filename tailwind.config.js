/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%'
      },
      colors: {
        'primary': "#fcba03"
      }
    },
  },
  plugins: [],
}
