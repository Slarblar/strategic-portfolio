import { createServer } from 'vite'
import compression from 'compression'
import express from 'express'
import { cacheControlMiddleware } from './src/middleware/cacheControl.js'

async function createDevServer() {
  const app = express()
  
  // Enable compression
  app.use(compression({
    // Enable compression for all responses
    filter: () => true,
    // Only compress responses larger than 1KB
    threshold: 1024,
    // Use Brotli when available, fallback to gzip
    brotli: {
      enabled: true,
      zlib: {}
    }
  }))

  // Apply cache control headers
  app.use(cacheControlMiddleware)

  try {
    const vite = await createServer({
      server: { 
        middlewareMode: true,
        headers: {
          // Ensure proper caching behavior
          'Vary': 'Accept-Encoding'
        }
      },
      appType: 'spa',
      // Enable compression in Vite
      build: {
        compress: true,
        brotli: true
      }
    })

    // Use Vite's connect instance
    app.use(vite.middlewares)

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err)
      res.status(500).send('Internal Server Error')
    })

    // Start the server
    const port = process.env.PORT || 5174
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
      console.log('Compression and caching enabled')
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

createDevServer().catch(err => {
  console.error('Server startup error:', err)
  process.exit(1)
}) 