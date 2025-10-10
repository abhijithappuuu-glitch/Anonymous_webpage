/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D1117',
        primary: '#161B22',
        secondary: '#21262D',
        accent: '#3081F7',
        'accent-hover': '#4C9AFF',
        text: '#C9D1D9',
        'text-secondary': '#8B949E',
        // Legacy / semantic aliases used in components
        'cyber-blue': '#00d9ff',
        'cyber-green': '#00ff41',
        'cyber-red': '#ff3355',
        'cyber-purple': '#bd00ff',
        'cyber-dark': '#050814',
        'cyber-darker': '#020510',
        // Hacker theme palette additions
        hacker: {
          bg: '#050b0a',
          panel: '#0d1513',
          grid: '#0f1f1c',
          green: '#00ff41',
          greenSoft: '#1aff65',
          aqua: '#00e5ff',
          purple: '#9d4bff',
          amber: '#ffb300',
          danger: '#ff0055'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
        cyber: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 15px 0 rgba(48, 129, 247, 0.5)',
        'glow-accent-hover': '0 0 25px 0 rgba(76, 154, 255, 0.7)',
        'glow-hacker-green': '0 0 12px 0 rgba(0,255,65,0.55), 0 0 32px -4px rgba(0,255,65,0.35)',
        'glow-hacker-aqua': '0 0 14px 0 rgba(0,229,255,0.55), 0 0 36px -6px rgba(0,229,255,0.35)',
      },
    },
  },
  plugins: [],
}
