/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Base palette for light/dark mode
        lightbg: '#ffffff', // white
        lightbg2: '#f5f6fa', // soft light gray
        darkbg: '#181818', // very dark gray
        darkbg2: '#23272f', // slightly lighter dark
        textlight: '#181818', // dark gray/black for text
        textdark: '#f9fafb', // white/near-white for text
        // Orange gradient for buttons
        orange: {
          400: '#ff9800', // deep orange
          500: '#ffb300', // lighter orange
          600: '#ffd54f', // yellowish
        },
      },
      backgroundImage: {
        // Button gradients
        'btn-light': 'linear-gradient(90deg, #ff9800 0%, #ffd54f 100%)',
        'btn-dark': 'linear-gradient(90deg, #ff9800 0%, #ffb300 100%)',
      },
    },
  },
  plugins: [],
};
