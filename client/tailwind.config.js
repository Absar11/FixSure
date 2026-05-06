/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a', // Dark Navy Blue from logo
          orange: '#f97316', // Vibrant Orange from logo
          light: '#f8fafc', // Light background
        }
      }
    },
  },
  plugins: [],
}
