/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0b0f',
          2: '#111318',
          3: '#181b22',
          4: '#1e2229',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          2: 'rgba(255,255,255,0.12)',
        },
        purple: {
          DEFAULT: '#7c6ff7',
          2: '#a99ff5',
          dim: 'rgba(124,111,247,0.1)',
        },
        green: {
          DEFAULT: '#22d3a0',
          dim: 'rgba(34,211,160,0.1)',
        },
        red: {
          DEFAULT: '#f56565',
          dim: 'rgba(245,101,101,0.1)',
        },
        blue: {
          DEFAULT: '#60a5fa',
          dim: 'rgba(96,165,250,0.1)',
        },
        amber: '#fbbf24',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'blink': 'blink 1.2s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.4s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
