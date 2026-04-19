/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        red: { main: '#E81C24' },
        neutral: {
          dark: '#3A3533',
          mid: '#6B6868',
          light: '#C9C5B9',
        },
        cream: { light: '#F9F8F5' },
      },
      fontFamily: {
        heading: ['"Roboto Slab"', ...defaultTheme.fontFamily.serif],
        body: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        pill: '100px',
      },
      boxShadow: {
        pill: '0 0 2px rgba(58, 53, 51, 0.2), 0 2px 12px rgba(58, 53, 51, 0.1)',
      },
    },
  },
  plugins: [],
};
