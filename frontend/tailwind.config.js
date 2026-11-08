/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F17',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        brand: {
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          cyan: '#06B6D4',
          violet: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}
