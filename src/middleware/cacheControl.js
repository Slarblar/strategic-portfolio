const CACHE_CONTROL_SETTINGS = {
  // Assets that rarely change can be cached for longer
  assets: {
    maxAge: 31536000, // 1 year
    pattern: /\.(jpg|jpeg|png|gif|webp|ico|svg|woff2|woff|ttf|eot)$/
  },
  // JavaScript and CSS files should be cached but revalidated
  static: {
    maxAge: 86400, // 24 hours
    pattern: /\.(js|css|json)$/
  },
  // HTML and API responses shouldn't be cached by default
  dynamic: {
    maxAge: 0,
    pattern: /\.(html|htm)$/
  }
};

export function getCacheControl(path) {
  // Determine cache settings based on file extension
  if (CACHE_CONTROL_SETTINGS.assets.pattern.test(path)) {
    return `public, max-age=${CACHE_CONTROL_SETTINGS.assets.maxAge}, immutable`;
  }
  
  if (CACHE_CONTROL_SETTINGS.static.pattern.test(path)) {
    return `public, max-age=${CACHE_CONTROL_SETTINGS.static.maxAge}, must-revalidate`;
  }
  
  if (CACHE_CONTROL_SETTINGS.dynamic.pattern.test(path)) {
    return 'no-cache, must-revalidate';
  }
  
  // Default: no caching
  return 'no-store';
}

export function cacheControlMiddleware(req, res, next) {
  // Skip caching for development environment
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Cache-Control', 'no-store');
    return next();
  }

  const cacheControl = getCacheControl(req.path);
  res.setHeader('Cache-Control', cacheControl);
  
  // Add Vary header for proper caching with compression
  res.setHeader('Vary', 'Accept-Encoding');
  
  next();
} 