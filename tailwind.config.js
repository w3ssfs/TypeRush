/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        card: '#1E293B',
        border: '#334155',
        accent: {
          blue: '#3B82F6',
          green: '#22C55E',
          yellow: '#EAB308',
          red: '#EF4444',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.35)',
        glow: '0 0 24px rgba(59,130,246,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        caret: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        pop: 'pop 0.35s ease-out',
        caret: 'caret 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
