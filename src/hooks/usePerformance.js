import { useState, useEffect } from 'react';

export const usePerformance = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Detect device type for performance optimization
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isMobile) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    reducedMotion,
    deviceType,
    shouldReduceAnimations: reducedMotion || deviceType === 'mobile',
    shouldPreloadVideos: deviceType === 'desktop',
    shouldUseHighQuality: deviceType === 'desktop'
  };
};

// Optimized animation variants
export const optimizedAnimations = {
  slideInUp: (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.4, // Reduced from 0.6
      delay,
      ease: 'easeOut' // Simplified easing
    }
  }),
  
  fadeIn: (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.3, // Reduced from 0.5
      delay,
      ease: 'easeOut'
    }
  }),

  scale: {
    initial: { scale: 1.05 },
    animate: { scale: 1 },
    transition: { 
      duration: 0.4, // Reduced
      ease: 'easeOut'
    }
  },

  // Lighter hover effects
  lightHover: {
    whileHover: { 
      y: -4, // Reduced from -12
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  }
}; 