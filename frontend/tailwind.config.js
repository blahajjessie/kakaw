/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          100: '#674EA7',
        },
        orange: {
          100: '#FF801A',
          200: '#FF7200',
          300: '#AEAEAE',
        },
        gray: {
          100: '#D9D9D9',
          200: '#4B5563',
        },
      },
      boxShadow: {
        'heavy': '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
