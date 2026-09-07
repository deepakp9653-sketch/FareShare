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
          base: '#12160F', // Deep charcoal-green background
          raised: '#1B2119', // Card / surface background
          overlay: '#1B2119', // Hover / elevated background
          hairline: '#2A322A', // Barely visible hairline border
        },
        ink: {
          primary: '#F4F2E6', // Warm off-white
          secondary: '#8B9A8C', // Muted sage-gray
          muted: '#8B9A8C', // Muted sage-gray
        },
        brand: {
          emerald: '#5FA97D',
          emeraldDim: '#3E7D5A',
          coral: '#5FA97D',
          coralDim: '#3E7D5A',
          mint: '#5FA97D',
          mintDark: '#3E7D5A',
        },
        ledger: {
          surplus: '#4E9A6E', // Muted sage-green credit
          surplusBg: 'rgba(78, 154, 110, 0.12)',
          deficit: '#B5484C', // Muted brick-red debit
          deficitBg: 'rgba(181, 72, 76, 0.12)',
          neutral: '#8B9A8C',
        },
        accent: {
          start: '#3E7D5A',
          end: '#5FA97D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        numeric: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        paper: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        mint: '0 4px 14px 0 rgba(95, 169, 125, 0.2)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
