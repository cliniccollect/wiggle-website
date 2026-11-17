/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sofia': ['Sofia Pro', 'sans-serif'],
      },
      colors: {
        'brand-purple': '#FF00FF',
        'brand-blue': '#017afe',
      },
    },
  },
  plugins: [],
};
