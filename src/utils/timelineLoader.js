/**
 * Enhanced Timeline Data Loader
 * 
 * Provides intelligent data loading with caching, error handling, 
 * and performance optimizations for the strategic portfolio timeline.
 */

class TimelineLoader {
  constructor() {
    this.cache = new Map();
    this.requestQueue = new Map();
    this.config = {
      baseUrl: '/timeline',
      cacheExpiry: 5 * 60 * 1000, // 5 minutes
      requestTimeout: 10000, // 10 seconds
      maxRetries: 3,
      batchSize: 5,
      retryDelay: 1000, // Initial retry delay (ms)
    };
    this.stats = {
      requests: 0,
      cacheHits: 0,
      errors: 0,
      lastHealthCheck: null,
    };
  }

  /**
   * Health check to verify timeline system status
   */
  async healthCheck() {
    const startTime = performance.now();
    try {
      // Try to load the main index to verify system health
      const response = await this._fetchWithTimeout(`${this.config.baseUrl}/projects.json`, {
        method: 'HEAD', // Just check if file exists
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      this.stats.lastHealthCheck = new Date().toISOString();
      
      if (response.ok) {
        return {
          status: 'healthy',
          responseTime: Math.round(responseTime),
          timestamp: this.stats.lastHealthCheck,
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.stats.errors++;
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Load the main timeline index
   */
  async loadIndex() {
    const cacheKey = 'timeline-index';
    
    // Check cache first
    const cached = this._getFromCache(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return cached;
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return await this.requestQueue.get(cacheKey);
    }

    const request = this._loadIndexData();
    this.requestQueue.set(cacheKey, request);

    try {
      const data = await request;
      this._setCache(cacheKey, data);
      this.requestQueue.delete(cacheKey);
      return data;
    } catch (error) {
      this.requestQueue.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Load all projects across all years
   */
  async loadAllProjects() {
    const index = await this.loadIndex();
    const allProjects = [];
    
    // Extract all project slugs from all years
    const projectRequests = [];
    for (const yearEntry of index.years) {
      for (const projectSlug of yearEntry.projects) {
        projectRequests.push({
          year: yearEntry.year,
          slug: projectSlug,
        });
      }
    }

    // Load projects in batches for better performance
    const batches = this._chunkArray(projectRequests, this.config.batchSize);
    
    for (const batch of batches) {
      const batchPromises = batch.map(({ year, slug }) => 
        this.loadProject(year, slug).catch(error => {
          console.warn(`Failed to load project ${slug} from ${year}:`, error);
          return null; // Continue with other projects
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      allProjects.push(...batchResults.filter(Boolean));
    }

    return allProjects;
  }

  /**
   * Load a specific project
   */
  async loadProject(year, projectSlug) {
    const cacheKey = `project-${year}-${projectSlug}`;
    
    // Check cache first
    const cached = this._getFromCache(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return cached;
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return await this.requestQueue.get(cacheKey);
    }

    const request = this._loadProjectData(year, projectSlug);
    this.requestQueue.set(cacheKey, request);

    try {
      const project = await request;
      
      // Auto-detect images if not specified
      if (!project.cover || !project.gallery) {
        project.images = await this.autoDetectImages(year, projectSlug);
        if (!project.cover && project.images.length > 0) {
          project.cover = project.images[0];
        }
        if (!project.gallery && project.images.length > 1) {
          project.gallery = project.images.slice(1);
        }
      }
      
      this._setCache(cacheKey, project);
      this.requestQueue.delete(cacheKey);
      return project;
    } catch (error) {
      this.requestQueue.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Load projects for a specific year
   */
  async loadYearProjects(year) {
    const index = await this.loadIndex();
    const yearEntry = index.years.find(y => y.year === year);
    
    if (!yearEntry) {
      console.warn(`Year ${year} not found in index`);
      return [];
    }

    const projects = [];
    for (const projectSlug of yearEntry.projects) {
      try {
        const project = await this.loadProject(year, projectSlug);
        projects.push(project);
      } catch (error) {
        console.warn(`Failed to load project ${projectSlug} from ${year}:`, error);
      }
    }

    return projects;
  }

  /**
   * Get year configuration/metadata
   */
  async getYearConfig(year) {
    const cacheKey = `year-meta-${year}`;
    
    // Check cache first
    const cached = this._getFromCache(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return cached;
    }

    try {
      const response = await this._fetchWithTimeout(`${this.config.baseUrl}/${year}/meta.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this._setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn(`Failed to load meta for year ${year}:`, error);
      return this.getDefaultYearMeta(year);
    }
  }

  /**
   * Get default year metadata fallback
   */
  getDefaultYearMeta(year) {
    return {
      year: year,
      title: `Year ${year}`,
      description: `Projects and work from ${year}`,
      theme: 'Default',
      stats: {
        projects: 0,
      },
    };
  }

  /**
   * Auto-detect images for a project using naming convention (public method)
   */
  async autoDetectImages(year, projectSlug) {
    const images = [];
    let imageIndex = 1;
    let consecutiveFailures = 0;
    const maxImages = 10; // Reasonable limit to prevent infinite requests
    const maxConsecutiveFailures = 1; // Stop after 1 failure to be more conservative
    
    console.log(`🖼️ TimelineLoader: Auto-detecting images for ${projectSlug} in ${year}...`);
    
    while (imageIndex <= maxImages && consecutiveFailures < maxConsecutiveFailures) {
      const imagePath = `${this.config.baseUrl}/${year}/${projectSlug}/${projectSlug}_${imageIndex}.webp`;
      
      try {
        // Use GET request with range to check just the first few bytes
        const response = await this._fetchWithTimeout(imagePath, { 
          method: 'GET',
          headers: {
            'Range': 'bytes=0-1023' // Just first 1KB
          }
        });
        
        console.log(`🔍 TimelineLoader: Checking image ${imageIndex}: status=${response.status}, content-type=${response.headers.get('content-type')}, content-length=${response.headers.get('content-length')}`);
        
        if (response.ok && (response.status === 200 || response.status === 206)) {
          const contentType = response.headers.get('content-type');
          
          // Check for exact webp content type first
          const isWebP = contentType === 'image/webp';
          
          // If not webp, check if it's any image type but be more strict
          const isValidImageType = isWebP || (
            contentType && (
              contentType === 'image/jpeg' || 
              contentType === 'image/png' ||
              contentType === 'image/gif'
            )
          );
          
          // Additional check: ensure it's not HTML/text fallback
          const notTextFallback = !contentType?.includes('text/') && !contentType?.includes('application/');
          
          if (isValidImageType && notTextFallback) {
            // For range requests, we need to verify the content looks like image data
            if (response.status === 206) {
              const buffer = await response.arrayBuffer();
              const bytes = new Uint8Array(buffer);
              
              // Check for WebP signature (RIFF...WEBP) or other image signatures
              const hasImageSignature = 
                (bytes.length >= 12 && 
                 bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // RIFF
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) || // WEBP
                (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xD8) || // JPEG
                (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47); // PNG
              
              if (hasImageSignature) {
                console.log(`✅ TimelineLoader: Found valid image with signature: ${imagePath}`);
                images.push(imagePath);
                consecutiveFailures = 0;
              } else {
                console.log(`❌ TimelineLoader: No valid image signature found: ${imagePath}`);
                consecutiveFailures++;
              }
            } else {
              // Status 200 - assume it's valid if content-type is correct
              console.log(`✅ TimelineLoader: Found valid image: ${imagePath}`);
              images.push(imagePath);
              consecutiveFailures = 0;
            }
          } else {
            console.log(`❌ TimelineLoader: Invalid content type (${contentType}): ${imagePath}`);
            consecutiveFailures++;
          }
        } else {
          console.log(`❌ TimelineLoader: Request failed (status: ${response.status}): ${imagePath}`);
          consecutiveFailures++;
        }
      } catch (error) {
        console.log(`❌ TimelineLoader: Network error: ${imagePath}`, error.message);
        consecutiveFailures++;
      }
      
      imageIndex++;
    }
    
    console.log(`🎯 TimelineLoader: Auto-detection complete for ${projectSlug}: found ${images.length} images`);
    return images;
  }

  /**
   * Load main index data with retry logic
   */
  async _loadIndexData() {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        this.stats.requests++;
        const response = await this._fetchWithTimeout(`${this.config.baseUrl}/projects.json`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Basic validation
        if (!data.timeline || !data.years || !Array.isArray(data.years)) {
          throw new Error('Invalid index data structure');
        }
        
        return data;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed to load index:`, error.message);
        
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          await this._sleep(delay);
        }
      }
    }
    
    this.stats.errors++;
    throw new Error(`Failed to load timeline index after ${this.config.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Load individual project data
   */
  async _loadProjectData(year, projectSlug) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        this.stats.requests++;
        const response = await this._fetchWithTimeout(`${this.config.baseUrl}/${year}/${projectSlug}/project.json`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const project = await response.json();
        
        // Basic validation
        if (!project.id || !project.title || !project.year) {
          throw new Error('Invalid project data: missing required fields');
        }
        
        return project;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed to load project ${projectSlug}:`, error.message);
        
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          await this._sleep(delay);
        }
      }
    }
    
    this.stats.errors++;
    throw new Error(`Failed to load project ${projectSlug} after ${this.config.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Fetch with timeout support
   */
  async _fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.requestTimeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.config.requestTimeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Cache management methods
   */
  _getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheExpiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired entry
    }
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache (optionally with pattern matching)
   */
  clearCache(pattern) {
    if (!pattern) {
      this.cache.clear();
      console.log('Timeline cache cleared');
      return;
    }
    
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
    console.log(`Timeline cache cleared for pattern: ${pattern}`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      hitRate: this.stats.requests > 0 ? (this.stats.cacheHits / this.stats.requests * 100).toFixed(1) + '%' : '0%',
      activeRequests: this.requestQueue.size,
    };
  }

  /**
   * Utility methods
   */
  _chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create and export singleton instance
const timelineLoader = new TimelineLoader();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.timelineLoader = timelineLoader;
}

export default timelineLoader; 