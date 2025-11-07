import React, { useEffect, useState, useRef, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { getGumletBackgroundUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

const UniversalVideoBackground = ({ 
  videoId,
  customSrc,
  onLoad,
  className = "",
  enableMobileVideo = true,
  fallbackImage = null,
  overlayOpacity = 0.4, // Semi-dark overlay for text readability
  enableIntersectionObserver = true,
  ...props
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [quality, setQuality] = useState('360p');
  const [deviceType, setDeviceType] = useState('desktop');
  const [scale, setScale] = useState(1);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Device detection and optimization
  const updateDeviceAndOptimization = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Enhanced device detection
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = width >= 768 && width <= 1024;
    const isLargeTablet = width >= 1024 && width <= 1366;
    
    let newDeviceType = 'desktop';
    let newQuality = '1080p';
    let newScale = 1;

    if (isMobileDevice || width < 768) {
      // Mobile optimization
      newDeviceType = 'mobile';
      newQuality = width >= 414 ? '540p' : '360p';
      // Scale to fit height, zoom in more on mobile for better framing
      newScale = Math.max(1.4, (height / (width * 0.5625)) * 1.2);
    } else if (isTablet) {
      // Tablet optimization
      newDeviceType = 'tablet';
      newQuality = '720p';
      // Scale to fit height with moderate zoom
      newScale = Math.max(1.3, (height / (width * 0.5625)) * 1.1);
    } else if (isLargeTablet) {
      // Large tablet optimization
      newDeviceType = 'large-tablet';
      newQuality = '1080p';
      // Scale to fit height with minimal zoom
      newScale = Math.max(1.2, (height / (width * 0.5625)) * 1.05);
    } else {
      // Desktop optimization
      newDeviceType = 'desktop';
      if (width >= 2560) {
        newQuality = '1440p';
      } else if (width >= 1920) {
        newQuality = '1080p';
      } else {
        newQuality = '720p';
      }
      // Scale to fit height
      newScale = Math.max(1.1, (height / (width * 0.5625)));
    }

    // Network-aware quality adjustment
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        newQuality = '240p';
      } else if (effectiveType === '3g' && (newQuality === '1080p' || newQuality === '1440p')) {
        newQuality = '720p';
      }
    }

    setDeviceType(newDeviceType);
    setQuality(newQuality);
    setScale(newScale);
  }, []);

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
    updateDeviceAndOptimization();
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(updateDeviceAndOptimization, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [updateDeviceAndOptimization]);

  // Intersection Observer setup
  useEffect(() => {
    if (!enableIntersectionObserver) {
      setIsIntersecting(true);
      return;
    }

    // Check if element is already in view on mount (for hero sections)
    const checkInitialIntersection = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          setIsIntersecting(true);
        }
      }
    };

    // Initial check
    checkInitialIntersection();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableIntersectionObserver]);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
    setHasVideoError(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Handle video error
  const handleVideoError = useCallback(() => {
    setHasVideoError(true);
    setIsVideoLoaded(false);
  }, []);

  // Determine if video should be shown
  const shouldShowVideo = !reducedMotion && 
                         (enableMobileVideo || deviceType !== 'mobile') && 
                         !hasVideoError && 
                         (enableIntersectionObserver ? isIntersecting : true);

  // Generate optimized video URL - STABLE, don't change based on state
  // Changing the URL causes iframe to reload which breaks playback
  const videoUrl = React.useMemo(() => {
    // If customSrc is provided, use it as-is (it's already configured)
    if (customSrc) {
      return customSrc;
    }
    if (!videoId) return '';

    // Use helper function for consistent URL generation
    // Always set autoplay=true and let video play, don't toggle based on intersection
    return getGumletBackgroundUrl(videoId, {
      autoplay: true,
      posterTime: 1
    });
  }, [customSrc, videoId]);

  return (
    <div 
      ref={containerRef}
              className={`absolute inset-0 w-full full-height overflow-hidden ${className}`} 
      style={{ isolation: 'isolate' }}
      {...props}
    >
      {/* Fallback Image for mobile or when video fails */}
      {(hasVideoError || (!enableMobileVideo && deviceType === 'mobile') || reducedMotion) && fallbackImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      
      {/* Video Container */}
      {shouldShowVideo && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div 
            className="relative w-full h-full"
            style={{
              // Height-based scaling optimization
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <iframe 
              key={`video-${videoId || 'custom'}`}
              loading={enableIntersectionObserver ? "lazy" : "eager"}
              title="Universal video background player"
              src={videoUrl}
              style={{
                border: 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '56.25vw', // 16:9 aspect ratio
                minWidth: '177.78vh', // 16:9 aspect ratio
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
              allow={GUMLET_IFRAME_ATTRS.allow}
              allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              aria-hidden="true"
            />
          </div>
        </div>
      )}
      
      {/* Semi-dark overlay for text readability */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: `linear-gradient(180deg, 
            rgba(14, 17, 17, ${overlayOpacity * 1.2}) 0%, 
            rgba(14, 17, 17, ${overlayOpacity * 0.8}) 25%, 
            rgba(14, 17, 17, ${overlayOpacity * 0.8}) 75%, 
            rgba(14, 17, 17, ${overlayOpacity * 1.2}) 100%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Loading indicator */}
      {shouldShowVideo && !isVideoLoaded && !hasVideoError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <LoadingSpinner size="lg" color="cream" />
        </div>
      )}


    </div>
  );
};

export default UniversalVideoBackground; 