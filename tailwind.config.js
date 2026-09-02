/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['BubbledotICG-FinePos', 'Geist Pixel Circle', 'monospace'],
        mono: ['Geist Pixel Circle', 'Courier New', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#000000',
          surface: '#0A0A0A',
          surface2: '#111111',
          elevated: '#181818',
          card: '#1A1A1A',
          hover: '#222222',
          pill: '#28282A',
          pillHover: '#323234',
          border: 'rgba(255,255,255,0.12)',
          borderStrong: 'rgba(255,255,255,0.20)',
          borderWhite: 'rgba(255,255,255,0.35)',
          muted: '#8E8E8E',
          subtle: '#C8C8C8',
          disabled: '#5F5F5F',
        },
        status: {
          success: '#B8F5D0',
          warning: '#FFE7A3',
          error: '#FFB3B3',
          info: '#C9D7FF',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'card-hover': '0 10px 25px -5px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 25px -5px rgba(255, 255, 255, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
