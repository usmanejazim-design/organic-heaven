/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#070f09',
          900: '#0a1a0e',
          800: '#0d1f12',
          700: '#123018',
          600: '#173d1f',
          500: '#1e4d28',
        },
        ink: '#0a0a0a',
        gold: {
          50: '#fbf6e3',
          100: '#f7ecc6',
          200: '#f0c869',
          300: '#e3c15a',
          400: '#d4af37',
          500: '#b8932b',
          600: '#8f7220',
        },
        champagne: '#f0c869',
        cream: '#f5f5f0',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.45)' },
          '50%': { boxShadow: '0 0 24px 6px rgba(212,175,55,0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'leaf-drift': {
          '0%': { transform: 'translate(0,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translate(40px,120vh) rotate(180deg)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-7px)' },
          '40%, 80%': { transform: 'translateX(7px)' },
        },
        'toast-in': {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out forwards',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'leaf-drift': 'leaf-drift linear infinite',
        shake: 'shake 0.4s ease-in-out',
        'toast-in': 'toast-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
