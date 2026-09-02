/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#FAF5FF',
          raised: '#FFFFFF',
          overlay: '#F3E8FF',
          hairline: '#E9D5FF',
        },
        ink: {
          primary: '#2E1065',
          secondary: '#581C87',
          muted: '#7E22CE',
        },
        brand: {
          coral: '#F97316',
          coralDim: '#EA580C',
          indigo: '#6366F1',
          gold: '#F59E0B',
        },
        ledger: {
          surplus: '#10B981',
          surplusBg: '#ECFDF5',
          deficit: '#EF4444',
          deficitBg: '#FEF2F2',
          neutral: '#7E22CE',
        },
        variance: {
          over: '#F59E0B',
          under: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        numeric: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        paper: '0 4px 20px -2px rgba(46, 16, 101, 0.08), 0 2px 6px -1px rgba(46, 16, 101, 0.05)',
        coral: '0 8px 25px -4px rgba(249, 115, 22, 0.35)',
        indigo: '0 8px 25px -4px rgba(99, 102, 241, 0.35)',
      },
    },
  },
  plugins: [],
};
