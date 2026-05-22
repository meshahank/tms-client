/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F08A24',
          primarySoft: '#FFE0B8',
          primaryTint: '#FFF3E7',
          dark: '#171717',
          muted: '#6B625A',
          border: 'rgba(23, 23, 23, 0.08)',
          danger: '#E95555',
          success: '#2E9C74',
          warm: '#F6D1A8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        display: ['"Syne"', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
        card: '1.15rem',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(17, 17, 17, 0.08)',
        glow: '0 0 0 1px rgba(240, 138, 36, 0.15), 0 18px 50px rgba(240, 138, 36, 0.15)',
        float: '0 16px 45px rgba(17, 17, 17, 0.12)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(23,23,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -10px, 0) scale(1.02)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        drift: 'drift 10s ease-in-out infinite',
        marquee: 'marquee 24s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
