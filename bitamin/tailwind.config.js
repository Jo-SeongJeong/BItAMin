/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bagel: ['"Bagel Fat One"', 'cursive'],
        nanum: ['Nanum Gothic', 'sans-serif'],
        nanumBold: ['Nanum Gothic Bold', 'sans-serif'],
        ownglyph: ['Ownglyph ryuttung', 'cursive'],
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         coral: '#ff713c',
//       },
//       spacing: {},
//       fontFamily: {
//         'bagel-fat-one': "'Bagel Fat One'",
//       },
//     },
//     fontSize: {
//       inherit: 'inherit',
//     },
//   },
//   corePlugins: {
//     preflight: false,
//   },
// }
