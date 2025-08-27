/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: '#E6E6FA',
        mint: '#F5FFFA',
        blush: '#FFDDEE',
        powder: '#B0E0E6',
        peach: '#FFE5B4',
      },
    },
  },
  plugins: [],
}