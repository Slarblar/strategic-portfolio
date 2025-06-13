import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { getCacheControl } from './src/middleware/cacheControl.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: true,
            fileName: false
          }]
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'styled-components',
            'framer-motion'
          ],
          'vimeo': ['@vimeo/player'],
          'animations': [
            './src/components/GlitchText.jsx',
            './src/components/GlitchNumber.jsx',
            './src/components/GlitchRipple.jsx',
            './src/components/GlitchCarousel.jsx'
          ],
          'video-players': [
            './src/components/LazyVimeoPlayer.jsx',
            './src/components/SimpleHoverVimeoPlayer.jsx',
            './src/components/HoverVimeoPlayer.jsx',
            './src/components/VideoBackground.jsx'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    reportCompressedSize: true
  },
  preview: {
    compress: true,
    headers: {
      // Add cache control headers for preview mode
      'Cache-Control': (path) => getCacheControl(path),
      'Vary': 'Accept-Encoding'
    }
  },
  server: {
    compress: true,
    headers: {
      // Development should use no-store to prevent caching during development
      'Cache-Control': 'no-store',
      'Vary': 'Accept-Encoding'
    }
  }
})
