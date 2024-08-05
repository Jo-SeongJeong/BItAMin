/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bagel: ['"Bagel Fat One"', 'cursive'],
        nanum: ['"Nanum Gothic"', 'sans-serif'],
        ownglyph: ['"Ownglyph ryuttung"', 'cursive'],
      },
    },
  },
  plugins: [],
}
