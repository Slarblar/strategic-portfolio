// Motion optimization utilities for mobile performance

// Detect if device is mobile
export const isMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized animation variants for different devices
export const getOptimizedVariants = (baseVariants, options = {}) => {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    // Remove all animations for users who prefer reduced motion
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }
  
  if (isMobile) {
    // Simplified mobile variants
    return {
      ...baseVariants,
      // Reduce scale effects
      ...(baseVariants.initial?.scale && {
        initial: { ...baseVariants.initial, scale: 1 }
      }),
      ...(baseVariants.animate?.scale && {
        animate: { ...baseVariants.animate, scale: Math.min(baseVariants.animate.scale, 1.02) }
      }),
      // Reduce transform distances
      ...(baseVariants.initial?.y && {
        initial: { ...baseVariants.initial, y: Math.min(Math.abs(baseVariants.initial.y), 20) * Math.sign(baseVariants.initial.y) }
      }),
      ...(baseVariants.animate?.y && {
        animate: { ...baseVariants.animate, y: Math.min(Math.abs(baseVariants.animate.y || 0), 20) * Math.sign(baseVariants.animate.y || 0) }
      })
    };
  }
  
  return baseVariants;
};

// Optimized transition settings
export const getOptimizedTransition = (baseTransition = {}, options = {}) => {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion) {
    return { duration: 0.001 }; // Instant for reduced motion
  }
  
  if (isMobile) {
    return {
      ...baseTransition,
      duration: (baseTransition.duration || 0.5) * 0.7, // 30% faster on mobile
      ease: "easeOut", // Simpler easing
      // Remove complex spring physics on mobile
      type: baseTransition.type === "spring" ? "tween" : baseTransition.type
    };
  }
  
  return baseTransition;
};

// Optimized hover animations
export const getOptimizedHover = (baseHover = {}, options = {}) => {
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  if (reducedMotion || isMobile) {
    // Disable hover effects on mobile and reduced motion
    return {};
  }
  
  return baseHover;
};

// Optimized viewport settings for InView animations
export const getOptimizedViewport = (baseViewport = {}) => {
  const isMobile = isMobileDevice();
  
  return {
    once: true, // Always animate only once for performance
    margin: isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px", // Trigger earlier on mobile
    amount: isMobile ? 0.2 : 0.3, // Lower threshold on mobile
    ...baseViewport
  };
};

// Debounced resize handler
export const createResizeHandler = (callback, delay = 150) => {
  let timeoutId;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Performance-aware intersection observer
export const createOptimizedObserver = (callback, options = {}) => {
  const isMobile = isMobileDevice();
  
  return new IntersectionObserver(callback, {
    threshold: isMobile ? [0.1, 0.5] : [0.1, 0.3, 0.7],
    rootMargin: isMobile ? "50px" : "100px",
    ...options
  });
}; 