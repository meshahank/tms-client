/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Shorthand aliases used across pages */
        tea: {
          DEFAULT: '#184D47',
          dark:    '#123a35',
          light:   '#EBF4F3',
        },
        surface: {
          DEFAULT: '#F7F3EE',
          subtle:  '#F0EBE3',
          border:  'rgba(24,77,71,0.10)',
          muted:   '#7A9490',
          dark:    '#1A2421',
        },
        brand: {
          // Core palette
          green:       '#184D47',
          greenLight:  '#1E6259',
          greenTint:   '#EBF4F3',
          greenMid:    '#D0E9E7',
          amber:       '#E9B44C',
          amberLight:  '#F5D48A',
          amberTint:   '#FEF7E8',
          brown:       '#8B5E3C',
          brownTint:   '#F5EDE5',
          beige:       '#F7F3EE',
          // Neutrals
          ink:         '#0F1C1B',
          dark:        '#1A2421',
          mid:         '#3D5450',
          muted:       '#7A9490',
          subtle:      '#B8CECA',
          border:      'rgba(24, 77, 71, 0.10)',
          borderLight: 'rgba(24, 77, 71, 0.06)',
          // States
          danger:      '#DC4A3D',
          dangerTint:  '#FDF1F0',
          success:     '#1E7B5C',
          successTint: '#EBF6F1',
        },
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Layered elevation system
        xs:    '0 1px 2px rgba(15, 28, 27, 0.04)',
        sm:    '0 2px 8px rgba(15, 28, 27, 0.06)',
        md:    '0 4px 16px rgba(15, 28, 27, 0.08)',
        lg:    '0 8px 32px rgba(15, 28, 27, 0.10)',
        xl:    '0 16px 48px rgba(15, 28, 27, 0.12)',
        '2xl': '0 24px 64px rgba(15, 28, 27, 0.16)',
        // Glow effects
        glow:       '0 0 0 3px rgba(24, 77, 71, 0.15)',
        glowAmber:  '0 0 0 3px rgba(233, 180, 76, 0.25)',
        // Card hover
        card:       '0 4px 24px rgba(15, 28, 27, 0.08)',
        'card-hover':'0 8px 40px rgba(15, 28, 27, 0.13)',
        // Inset for inputs
        inner:      'inset 0 1px 3px rgba(15, 28, 27, 0.06)',
      },
      backgroundImage: {
        // Subtle noise/grain texture
        grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        // Green radial glows
        'hero-glow': 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(24,77,71,0.12) 0%, transparent 70%)',
        // Gradient fills
        'green-grad':  'linear-gradient(135deg, #184D47 0%, #1E6259 100%)',
        'amber-grad':  'linear-gradient(135deg, #E9B44C 0%, #F5D48A 100%)',
        'card-surface':'linear-gradient(145deg, #FFFFFF 0%, #F9FAFA 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-right':'slideRight 0.4s ease forwards',
        'scale-in':   'scaleIn 0.3s ease forwards',
        shimmer:      'shimmer 1.8s linear infinite',
        marquee:      'marquee 28s linear infinite',
        float:        'float 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
