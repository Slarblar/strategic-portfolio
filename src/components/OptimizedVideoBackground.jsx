import React, { useCallback } from 'react';
import { useOptimizedVideo } from '../hooks/useOptimizedVideo';

const OptimizedVideoBackground = ({ 
  videoId,
  customSrc,
  onLoad,
  className = "",
  overlayOpacity = 0.5,
  enableMobileVideo = false, // Option to disable video on mobile for performance
  fallbackImage = null, // Fallback image for mobile or when video fails
  aspectRatio = "16/9", // Configurable aspect ratio
  scale = 1.4, // Configurable scale for video
  overlayGradient = 'linear-gradient(180deg, rgba(14, 17, 17, 0.50) 0%, rgba(14, 17, 17, 0.35) 35%, rgba(14, 17, 17, 0.35) 65%, rgba(14, 17, 17, 0.50) 100%)',
  enableIntersectionObserver = true,
  enableNoiseTexture = false,
  enableChromaticAberration = false,
  ...props
}) => {
  // Use the optimized video hook
  const {
    containerRef,
    isMobile,
    hasVideoError,
    isVideoLoaded,
    reducedMotion,
    shouldShowVideo,
    handleVideoLoad: hookHandleVideoLoad,
    handleVideoError: hookHandleVideoError,
    getVideoUrl: hookGetVideoUrl
  } = useOptimizedVideo({
    videoId,
    enableMobileVideo,
    enableIntersectionObserver
  });

  // Handle video load with onLoad callback
  const handleVideoLoad = useCallback(() => {
    hookHandleVideoLoad();
    if (onLoad) onLoad();
  }, [hookHandleVideoLoad, onLoad]);

  // Get video URL with custom src support
  const getVideoUrl = useCallback(() => {
    if (customSrc) return customSrc;
    return hookGetVideoUrl();
  }, [customSrc, hookGetVideoUrl]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-screen overflow-hidden ${className}`} 
      style={{ isolation: 'isolate' }}
      {...props}
    >
      {/* Fallback Image for mobile or when video fails */}
      {(hasVideoError || (!enableMobileVideo && isMobile) || reducedMotion) && fallbackImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      
      {/* Video Container */}
      {shouldShowVideo && (
        <div 
          className="absolute inset-0 w-full h-[250vh] -top-[5%]" 
          style={{ zIndex: 1 }}
        >
          <div style={{ position: 'relative', aspectRatio }}>
            <iframe 
              loading={enableIntersectionObserver ? "lazy" : "eager"}
              title="Optimized video background player"
              src={getVideoUrl()}
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                transform: `translateZ(0) scale(${scale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
                fetchPriority: enableIntersectionObserver ? 'low' : 'high'
              }}
                             allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
               onLoad={handleVideoLoad}
               onError={hookHandleVideoError}
               aria-hidden="true"
            />
          </div>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: 2,
          background: overlayGradient,
          opacity: overlayOpacity,
          mixBlendMode: 'normal',
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />

      {/* Chromatic Aberration Overlay (optional) */}
      {enableChromaticAberration && (
        <div 
          className="absolute inset-0 z-[3] pointer-events-none opacity-5"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(255,0,0,0.01) 25%, rgba(0,255,0,0.01) 50%, rgba(0,0,255,0.01) 75%, transparent 100%)',
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {/* Noise Texture (optional) */}
      {enableNoiseTexture && (
        <div 
          className="absolute inset-0 z-[4] pointer-events-none opacity-[0.008] mix-blend-overlay"
          style={{
            backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxM8mAAAACHRSTlMzMzMzMzMzM85JBgUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAwSURBVDjLY2AY2uF/AgO6gP+3/2sZsAv6f/z/HgMOEyDgH1HA/3/YRQyNFhroEABs2bqBosV/LwAAAABJRU5ErkJggg==)',
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* Loading indicator */}
      {shouldShowVideo && !isVideoLoaded && !hasVideoError && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedVideoBackground; 