// Scroll performance optimization utilities
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Throttle function for scroll events
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Optimized viewport settings for Framer Motion based on device
export const getOptimizedViewportSettings = () => {
  const mobile = isMobile();
  
  return {
    once: true, // Always use once for better performance
    margin: mobile ? "-20px" : "-100px", // Smaller margin on mobile
    amount: mobile ? 0.1 : 0.3, // Lower threshold on mobile
  };
};

// Optimized animation settings for mobile
export const getOptimizedAnimationSettings = () => {
  const mobile = isMobile();
  
  return {
    duration: mobile ? 0.2 : 0.5,
    ease: mobile ? "easeOut" : [0.215, 0.610, 0.355, 1.000],
    delay: mobile ? 0 : 0.1,
  };
};

// Passive scroll event listener options
export const passiveScrollOptions = {
  passive: true,
  capture: false
};

// Request animation frame throttling for scroll events
export const rafThrottle = (func) => {
  let rafId = null;
  return function (...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
};

// Optimized scroll handler that reduces repaints
export const createOptimizedScrollHandler = (callback, throttleMs = 16) => {
  const mobile = isMobile();
  const delay = mobile ? throttleMs * 2 : throttleMs; // Slower on mobile
  
  return mobile ? rafThrottle(callback) : throttle(callback, delay);
}; 