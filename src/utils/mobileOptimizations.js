// Mobile optimization utilities to prevent crashes on Archives page

/**
 * Detect if the current device is mobile
 */
export const isMobileDevice = () => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  return width < 768 || isMobileUA;
};

/**
 * Throttle function calls to prevent overwhelming mobile devices
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Debounce function calls for resize events
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Optimized intersection observer settings for mobile
 */
export const getMobileOptimizedIntersectionConfig = (isMobile) => ({
  triggerOnce: true,
  threshold: isMobile ? 0.05 : 0.1,
  rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px'
});

/**
 * Get reduced animation settings for mobile
 */
export const getMobileOptimizedAnimationConfig = (isMobile) => ({
  duration: isMobile ? 0.2 : 0.6,
  ease: isMobile ? "easeOut" : [0.215, 0.610, 0.355, 1.000],
  delay: isMobile ? 0.05 : 0.1
});

/**
 * Cleanup function to remove event listeners and prevent memory leaks
 */
export const cleanupMobileOptimizations = () => {
  // Clear any pending animation frames
  if (window.mobileRafId) {
    cancelAnimationFrame(window.mobileRafId);
    window.mobileRafId = null;
  }
  
  // Clear any pending timeouts
  if (window.mobileTimeouts) {
    window.mobileTimeouts.forEach(clearTimeout);
    window.mobileTimeouts = [];
  }
};

/**
 * Force garbage collection if available (development only)
 */
export const forceGarbageCollection = () => {
  if (process.env.NODE_ENV === 'development' && window.gc) {
    try {
      window.gc();
      console.log('[Mobile Optimization] Forced garbage collection');
    } catch (e) {
      // Silently fail if gc is not available
    }
  }
};

/**
 * Monitor memory usage and warn if getting high
 */
export const monitorMemoryUsage = (componentName = 'Unknown') => {
  if (performance.memory && isMobileDevice()) {
    const memoryInfo = performance.memory;
    const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024);
    
    console.log(`[${componentName}] Memory: ${usedMB}MB / ${totalMB}MB`);
    
    // Warn if memory usage is getting high on mobile
    if (usedMB > 100) {
      console.warn(`[${componentName}] High memory usage on mobile: ${usedMB}MB`);
      return true; // Indicates high memory usage
    }
  }
  return false;
};

/**
 * Batch DOM updates to prevent layout thrashing
 */
export const batchDOMUpdates = (updates) => {
  if (window.mobileRafId) {
    cancelAnimationFrame(window.mobileRafId);
  }
  
  window.mobileRafId = requestAnimationFrame(() => {
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        console.warn('[Mobile Optimization] DOM update failed:', error);
      }
    });
    window.mobileRafId = null;
  });
}; 