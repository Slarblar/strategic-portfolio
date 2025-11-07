import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getGumletBackgroundUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

const LazyVideoPlayer = ({ 
  videoId,
  className = "w-full h-full object-cover pointer-events-none",
  aspectRatio = "16/9",
  background = true,
  autoPlayOnLoad = true,
  preload = false,
  onError,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(preload);
  const [isInView, setIsInView] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const observerRef = useRef(null);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  const getVideoUrl = () => {
    return getGumletBackgroundUrl(videoId);
  };

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    const wasInView = isInView;
    const newIsInView = entry.isIntersecting;
    
    console.log('[LazyVideoPlayer] Intersection:', { 
      wasInView, 
      newIsInView, 
      isLoaded
    });
    
    setIsInView(newIsInView);
    
    if (newIsInView && !isLoaded && autoPlayOnLoad) {
      console.log('[LazyVideoPlayer] Loading video');
      setIsLoaded(true);
    }
  }, [isLoaded, isInView, autoPlayOnLoad]);

  useEffect(() => {
    if (playerRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: 0.1
      });
      observerRef.current.observe(playerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  useEffect(() => {
    console.log('[LazyVideoPlayer] State update:', {
      isLoaded,
      isInView,
      videoId,
      url: getVideoUrl()
    });
  }, [isLoaded, isInView, videoId]);

  const handleIframeLoad = () => {
    console.log('[LazyVideoPlayer] Iframe loaded');
    setLoadError(null);
    if (onLoad) {
      onLoad();
    }
  };

  const handleIframeError = (error) => {
    console.error('[LazyVideoPlayer] Iframe error:', error);
    setLoadError(error);
    if (onError) {
      onError(error);
    }
  };

  if (!isLoaded) {
    return (
      <div 
        ref={playerRef}
        className={className}
        style={{ aspectRatio }}
      />
    );
  }

  if (loadError) {
    return (
      <div 
        ref={playerRef}
        className={className}
        style={{ aspectRatio }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
          <p className="text-sm text-sand/60">Error loading video</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className={className}
      style={{ aspectRatio }}
    >
      <iframe
        ref={iframeRef}
        src={getVideoUrl()}
        className="w-full h-full object-cover"
        style={{
          border: 'none',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0'
        }}
        allow={GUMLET_IFRAME_ATTRS.allow}
        allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
      <style jsx>{`
        iframe {
          pointer-events: none !important;
        }
        /* Hide any UI elements that might be injected by the player */
        iframe :global(.gumlet-player-ui),
        iframe :global(.gumlet-controls),
        iframe :global(.gumlet-volume-control),
        iframe :global(.gumlet-sound-control),
        iframe :global(.gumlet-player-controls),
        iframe :global(.gumlet-player-ui *),
        iframe :global([class*="control"]),
        iframe :global([class*="volume"]),
        iframe :global([class*="sound"]),
        iframe :global([class*="ui"]) {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
};

export default LazyVideoPlayer; 