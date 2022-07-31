/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        hitam: '#16161a',
        ungu: '#7f5af0',
        hijau: '#2cb67d',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
