// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Add this line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // Optional: Define custom colors for easier theme management
        colors: {
          primary: { // Example using teal
            light: '#2dd4bf', // teal-400
            DEFAULT: '#14b8a6', // teal-500
            dark: '#0d9488', // teal-600
          },
          // Define background and text colors for light/dark modes
          background: {
            light: '#f8fafc', // slate-50 (Light Gray)
            dark: '#0f172a',   // slate-900 (Very Dark Blue-Gray) <--- CHANGE HERE
          },
          card: {
            light: '#ffffff', // white
            dark: '#1e293b',   // slate-800 (Darker Blue-Gray) <--- CHANGE HERE
          },
          text: {
            light: '#0f172a', // slate-900 (Very Dark Blue-Gray) <--- CHANGE HERE
            dark: '#f1f5f9',   // slate-100 (Lighter Gray) <--- CHANGE HERE
          },
          muted: {
            light: '#64748b', // slate-500
            dark: '#94a3b8',   // slate-400
          },
          border: {
             light: '#e2e8f0', // slate-200
             dark: '#334155', // slate-700 <--- CHANGE HERE
          }
        }
    },
  },
  plugins: [],
}