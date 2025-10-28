/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          primary: { 
            light: '#2dd4bf', 
            DEFAULT: '#14b8a6', 
            dark: '#0d9488', 
          },
          
          background: {
            light: '#f8fafc', 
            dark: '#0f172a',   
          },
          card: {
            light: '#ffffff', 
            dark: '#1e293b',   
          },
          text: {
            light: '#0f172a', 
            dark: '#f1f5f9',   
          },
          muted: {
            light: '#64748b', 
            dark: '#94a3b8',   
          },
          border: {
             light: '#e2e8f0', 
             dark: '#334155', 
          }
        }
    },
  },
  plugins: [],
}