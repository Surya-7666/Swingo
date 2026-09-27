/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./dangle.html",
    "./hitbox.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        swingo: {
          bg: '#0a0d14',
          card: '#111726',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#6366f1',
          accentHover: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.25)'
        }
      }
    }
  },
  plugins: []
};