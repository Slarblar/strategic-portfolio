/**
 * Simple Image Loader - No complex auto-detection
 * This utility directly checks for image files sequentially.
 */

class SimpleImageLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get images for a project by trying known patterns (_1, _2, etc.).
   * Uses robust detection to avoid false positives from development servers.
   */
  async getProjectImages(year, projectSlug) {
    const cacheKey = `images-${year}-${projectSlug}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const basePath = `/timeline/${year}/${projectSlug}`;
    const images = [];
    const maxImagesToCheck = 10;
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 1; // Stop after first missing image

    console.log(`🔍 SimpleImageLoader: Checking images for ${projectSlug} in ${year}...`);

    for (let i = 1; i <= maxImagesToCheck && consecutiveFailures < maxConsecutiveFailures; i++) {
      const imagePath = `${basePath}/${projectSlug}_${i}.webp`;
      
      try {
        // Use GET with range to check file header
        const response = await fetch(imagePath, { 
          method: 'GET',
          headers: { 'Range': 'bytes=0-1023' },
          cache: 'no-store'
        });
        
        if (response.ok && (response.status === 200 || response.status === 206)) {
          const contentType = response.headers.get('content-type');
          
          // Check for exact image content types
          const isValidImageType = contentType && (
            contentType === 'image/webp' || 
            contentType === 'image/jpeg' || 
            contentType === 'image/png' ||
            contentType === 'image/gif'
          );
          
          const notTextFallback = !contentType?.includes('text/') && !contentType?.includes('application/');
          
          if (isValidImageType && notTextFallback) {
            // For partial content, verify it's actually an image
            if (response.status === 206) {
              const buffer = await response.arrayBuffer();
              const bytes = new Uint8Array(buffer);
              
              // Check for image signatures
              const hasImageSignature = 
                (bytes.length >= 12 && 
                 bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) || // WEBP
                (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xD8) || // JPEG
                (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47); // PNG
              
              if (hasImageSignature) {
                console.log(`✓ SimpleImageLoader: Found valid image ${i}: ${imagePath}`);
                images.push(imagePath);
                consecutiveFailures = 0;
              } else {
                console.log(`✗ SimpleImageLoader: Invalid signature for image ${i}: ${imagePath}`);
                consecutiveFailures++;
              }
            } else {
              // Status 200 - assume valid
              console.log(`✓ SimpleImageLoader: Found valid image ${i}: ${imagePath}`);
              images.push(imagePath);
              consecutiveFailures = 0;
            }
          } else {
            console.log(`✗ SimpleImageLoader: Invalid content type for image ${i} (${contentType}): ${imagePath}`);
            consecutiveFailures++;
          }
        } else {
          console.log(`✗ SimpleImageLoader: Request failed for image ${i} (status: ${response.status}): ${imagePath}`);
          consecutiveFailures++;
        }
      } catch (error) {
        console.log(`✗ SimpleImageLoader: Network error for image ${i}: ${imagePath}`, error.message);
        consecutiveFailures++;
      }
    }
    
    console.log(`🎯 SimpleImageLoader: Found ${images.length} images for ${projectSlug}`);
    
    const result = {
      cover: images[0] || null,
      gallery: images.slice(1),
      allImages: images,
      count: images.length
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 Simple image cache cleared');
  }
}

// Create singleton
const simpleImageLoader = new SimpleImageLoader();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.simpleImageLoader = simpleImageLoader;
}

export default simpleImageLoader; 