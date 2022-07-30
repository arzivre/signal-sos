/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hitam: '#16161a',
        ungu: '#7f5af0',
        hijau: '#2cb67d',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
