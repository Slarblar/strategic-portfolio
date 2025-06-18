/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors from ProjectCard
        'sky': '#BACCFC',      // Light blue
        'olive': '#465902',    // Deep olive (A For Adley)
        'orange': '#FF6600',   // Vibrant orange
        'forest': '#4C5F2C',   // Forest green
        'rust': '#8C2703',     // Rust color
        'ink': '#1A1717',      // Black
        'stone': '#7F7C7A',    // Gray
        'sand': '#EAE2DF',     // Light sand / cream
        'custom-gray': '#726a6a',
        'proper-green': '#6e8c03',

        // Original names for reference if needed elsewhere
        'brand-sky': '#ACC2FF',
        'brand-orange': '#FF5C1A',
        'brand-rust': '#591902',
        'brand-ink': '#151717',
        'brand-stone': '#7D8A8A',
        'brand-sand': '#E4E2DE',
        'cream': '#EAE2DF',
      },
      fontFamily: {
        'display': ['degular-display', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],    // Display text
        'header': ['degular', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],      // Headers
        'subheader': ['Martian Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'], // Sub headers
        'body': ['Martian Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],         // Body text
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
      },
      fontSize: {
        'mega': ['clamp(3rem, 12vw, 12rem)', { lineHeight: '0.85' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'glitch': 'textGlitch 8s ease-in-out infinite',
        'flicker': 'textFlicker 4s ease-in-out infinite',
        'tv-static-layer1': 'tvStaticJitter 0.2s linear infinite',
        'tv-static-layer2': 'tvStaticJitter 0.25s linear infinite reverse',
        'flash-opacity': 'flashOpacity 0.3s ease-in-out',
        'gentle-static-layer1': 'gentleStaticJitter1 0.045s linear infinite',
        'gentle-static-layer2': 'gentleStaticJitter2 0.035s linear infinite',
      },
      keyframes: {
        textGlitch: {
          '0%': { transform: 'translate(0)', opacity: '0.7' },
          '20%': { transform: 'translate(-2px, 2px)', opacity: '0.6' },
          '40%': { transform: 'translate(-2px, -2px)', opacity: '0.7' },
          '60%': { transform: 'translate(2px, 2px)', opacity: '0.6' },
          '80%': { transform: 'translate(2px, -2px)', opacity: '0.7' },
          '100%': { transform: 'translate(0)', opacity: '0.7' },
        },
        textFlicker: {
          '0%': { opacity: '0.5', transform: 'translate(0)' },
          '50%': { opacity: '0.3', transform: 'translate(-0.5px, 0.5px)' },
          '100%': { opacity: '0.5', transform: 'translate(0)' },
        },
        tvStaticJitter: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '20%': { transform: 'translateX(-3.2px) translateY(0.8px)' },
          '40%': { transform: 'translateX(3.2px) translateY(-0.8px)' },
          '60%': { transform: 'translateX(-2.4px) translateY(-0.4px)' },
          '80%': { transform: 'translateX(2.4px) translateY(0.4px)' },
        },
        gentleStaticJitter1: {
          '0%': { transform: 'translateY(0)' },
          '15%': { transform: 'translateY(1.75px)' },
          '30%': { transform: 'translateY(1.25px)' },
          '45%': { transform: 'translateY(1.75px)' },
          '60%': { transform: 'translateY(1.25px)' },
          '75%': { transform: 'translateY(1.75px)' },
          '90%': { transform: 'translateY(1.25px)' },
          '100%': { transform: 'translateY(0)' },
        },
        gentleStaticJitter2: {
          '0%': { transform: 'translateY(0)' },
          '15%': { transform: 'translateY(-1.75px)' },
          '30%': { transform: 'translateY(-1.25px)' },
          '45%': { transform: 'translateY(-1.75px)' },
          '60%': { transform: 'translateY(-1.25px)' },
          '75%': { transform: 'translateY(-1.75px)' },
          '90%': { transform: 'translateY(-1.25px)' },
          '100%': { transform: 'translateY(0)' },
        },
        flashOpacity: {
          '0%, 100%': { opacity: '0' },
          '25%, 75%': { opacity: '0.6' },
        }
      },
    },
  },
  safelist: [
    'mix-blend-normal',
    'mix-blend-multiply',
    'mix-blend-screen',
    'mix-blend-overlay',
    'mix-blend-darken',
    'mix-blend-lighten',
    'mix-blend-color-dodge',
    'mix-blend-color-burn',
    'mix-blend-hard-light',
    'mix-blend-soft-light',
    'mix-blend-difference',
    'mix-blend-exclusion',
    'mix-blend-hue',
    'mix-blend-saturation',
    'mix-blend-color',
    'mix-blend-luminosity',
    'mix-blend-plus-lighter',
    // Force generation of critical color classes
    'bg-sand',
    'bg-ink',
    'group-hover:bg-sand',
    'group-hover:bg-ink',
    'text-sand',
    'text-ink',
    'text-stone',
    'group-hover:text-sand',
    'group-hover:text-ink',
    'group-hover:text-stone'
  ],
  plugins: [],
} 