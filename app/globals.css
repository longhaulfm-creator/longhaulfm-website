import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt:  '#0e1014',
        road:     '#151820',
        lane:     '#1e2230',
        marking:  '#2a2f40',
        stripe:   '#363c52',
        amber: {
          DEFAULT: '#f5a623',
          hot:     '#ff8c00',
          dim:     '#b87200',
        },
        signal: {
          green:  '#39d98a',
          red:    '#ff4d4d',
          blue:   '#4da6ff',
          yellow: '#ffd166',
        },
        ink: {
          DEFAULT: '#e8eaf0',
          muted:   '#7a8094',
          dim:     '#4a5068',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        ui:      ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"Barlow"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink':      'blink 1s step-end infinite',
        'wave':       'wave 0.8s ease-in-out infinite alternate',
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
      },
      keyframes: {
        blink:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        wave:    { from: { transform: 'scaleY(0.2)' }, to: { transform: 'scaleY(1)' } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
}

export default config