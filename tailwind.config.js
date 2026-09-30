/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury': {
          'dark': '#0a0a0a',
          'darker': '#050505',
          'gold': '#d4af37',
          'gold-light': '#f4d03f',
          'gold-dim': '#b8962e',
          'silver': '#c0c0c0',
          'bronze': '#cd7f32',
          'cream': '#fdf6e3',
        }
      },
      fontFamily: {
        'display': ['"Faculty Glyphic"', 'Playfair Display', 'serif'],
        'body': ['"Faculty Glyphic"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(ellipse at center, #d4af37 0%, #b8962e 100%)',
        'gold-conic': 'conic-gradient(from 0deg, #d4af37, #f4d03f, #cd7f32, #d4af37)',
      },
      boxShadow: {
        'gold-sm': '0 2px 12px rgba(212,175,55,0.25)',
        'gold-md': '0 4px 24px rgba(212,175,55,0.35)',
        'gold-lg': '0 8px 48px rgba(212,175,55,0.45)',
        'gold-xl': '0 12px 64px rgba(212,175,55,0.55)',
        'inner-gold': 'inset 0 0 32px rgba(212,175,55,0.1)',
      },
      animation: {
        // existing
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-left': 'slideLeft 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right': 'slideRight 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.8s ease-out both',
        // new
        'shimmer': 'shimmer 2.5s linear infinite',
        'shimmer-slow': 'shimmer 4s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'orbit': 'orbit 12s linear infinite',
        'orbit-reverse': 'orbit 9s linear infinite reverse',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
        'border-spin': 'borderSpin 4s linear infinite',
        'gradient-x': 'gradientX 4s ease infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'reveal': 'reveal 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'reveal-delayed': 'reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both',
        'draw-line': 'drawLine 1.5s ease-out both',
        'count-up': 'countUp 0.6s ease-out both',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'bounce-x': 'bounceX 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '100%': { boxShadow: '0 0 50px rgba(212,175,55,0.7), 0 0 80px rgba(212,175,55,0.3)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.2)' },
          '50%': { boxShadow: '0 0 60px rgba(212,175,55,0.6), 0 0 100px rgba(212,175,55,0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(60px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-60px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        reveal: {
          '0%': { transform: 'translateY(30px)', opacity: '0', filter: 'blur(4px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },
        drawLine: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
        countUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        bounceX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
