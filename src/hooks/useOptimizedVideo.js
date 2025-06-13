import { useEffect, useState, useCallback, useRef } from 'react';

export const useOptimizedVideo = ({
  videoId,
  enableMobileVideo = false,
  enableIntersectionObserver = true,
  observerOptions = { threshold: 0.1, rootMargin: '50px 0px' }
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [quality, setQuality] = useState('360p');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({ effectiveType: '4g' });
  
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Network-aware quality adjustment
  const getOptimalQuality = useCallback((width, connection, isMobileDevice) => {
    // Consider network conditions if available
    const effectiveType = connection?.effectiveType || '4g';
    
    if (isMobileDevice) {
      // Conservative approach for mobile
      if (effectiveType === 'slow-2g' || effectiveType === '2g') return '240p';
      if (effectiveType === '3g') return '360p';
      return width >= 768 ? '540p' : '360p';
    }
    
    // Desktop/tablet quality based on screen size and network
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return '360p';
    } else if (effectiveType === '3g') {
      return width >= 1920 ? '720p' : '540p';
    } else {
      // 4g or better
      if (width >= 2560) return '1440p';
      if (width >= 1920) return '1080p';
      if (width >= 1280) return '720p';
      if (width >= 768) return '540p';
      return '360p';
    }
  }, []);

  // Device detection and quality optimization
  const updateDeviceAndQuality = useCallback(() => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Enhanced device detection
    const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const tabletCheck = width >= 768 && width <= 1024;
    
    setIsMobile(mobileCheck || width < 768);
    setIsTablet(tabletCheck);
    
    // Get network information if available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    setNetworkInfo(connection || { effectiveType: '4g' });
    
    // Set quality based on device, network, and screen size
    if (videoId) {
      const optimalQuality = getOptimalQuality(width, connection, mobileCheck);
      setQuality(optimalQuality);
    }
  }, [videoId, getOptimalQuality]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initial setup and resize listener
  useEffect(() => {
    updateDeviceAndQuality();
    
    window.addEventListener('resize', updateDeviceAndQuality);
    
    // Listen for network changes
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateDeviceAndQuality);
    }
    
    return () => {
      window.removeEventListener('resize', updateDeviceAndQuality);
      if (connection) {
        connection.removeEventListener('change', updateDeviceAndQuality);
      }
    };
  }, [updateDeviceAndQuality]);

  // Intersection Observer setup
  useEffect(() => {
    if (!enableIntersectionObserver) {
      setIsIntersecting(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      observerOptions
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableIntersectionObserver, observerOptions]);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
    setHasVideoError(false);
  }, []);

  // Handle video error
  const handleVideoError = useCallback(() => {
    setHasVideoError(true);
    setIsVideoLoaded(false);
  }, []);

  // Determine if video should be shown
  const shouldShowVideo = !reducedMotion && 
                         (enableMobileVideo || !isMobile) && 
                         !hasVideoError && 
                         (enableIntersectionObserver ? isIntersecting : true);

  // Generate optimized video URL
  const getVideoUrl = useCallback((customSrc, additionalParams = {}) => {
    if (customSrc) return customSrc;
    if (!videoId) return '';

    const params = new URLSearchParams({
      preload: shouldShowVideo ? 'true' : 'metadata',
      autoplay: shouldShowVideo && !isMobile ? 'true' : 'false',
      loop: 'true',
      background: 'true',
      disable_player_controls: 'true',
      quality: quality,
      poster_time: '1',
      muted: 'true',
      playsinline: 'true',
      ...additionalParams
    });

    return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
  }, [videoId, shouldShowVideo, isMobile, quality]);

  return {
    // State
    isIntersecting,
    quality,
    isMobile,
    isTablet,
    hasVideoError,
    isVideoLoaded,
    reducedMotion,
    shouldShowVideo,
    networkInfo,
    
    // Refs
    containerRef,
    
    // Handlers
    handleVideoLoad,
    handleVideoError,
    getVideoUrl,
    
    // Utils
    updateDeviceAndQuality
  };
}; 