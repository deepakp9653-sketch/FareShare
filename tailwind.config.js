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
          base: '#09090b', // Midday/Dub rich dark background
          raised: '#121215', // Card background
          overlay: '#18181b', // Hover/dropdown/item background
          hairline: '#27272a', // Subtle 1px border
        },
        ink: {
          primary: '#f4f4f5', // Crisp high-contrast white/zinc
          secondary: '#a1a1aa', // Clean readable secondary
          muted: '#71717a', // Subtle metadata text
        },
        brand: {
          emerald: '#10b981',
          emeraldDim: '#059669',
          coral: '#10b981', // Re-mapped to emerald to eliminate pinkish tone
          coralDim: '#059669',
          indigo: '#6366f1',
          gold: '#f59e0b',
        },
        ledger: {
          surplus: '#10b981', // Emerald surplus
          surplusBg: 'rgba(16, 185, 129, 0.12)',
          deficit: '#f43f5e', // Rose deficit indicator for balance only
          deficitBg: 'rgba(244, 63, 94, 0.12)',
          neutral: '#a1a1aa',
        },
        variance: {
          over: '#f59e0b',
          under: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        numeric: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        paper: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        coral: '0 4px 14px 0 rgba(16, 185, 129, 0.2)', // Sleek emerald glow instead of pink
        emerald: '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
        indigo: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
