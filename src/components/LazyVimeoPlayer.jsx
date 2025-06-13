import React, { useState, useRef, useCallback, useEffect } from 'react';

const LazyVimeoPlayer = ({ 
  videoId = "1090277957", 
  hash = "b49a61abb7",
  className = "w-full h-full object-cover pointer-events-none",
  aspectRatio = "16/9",
  background = true,
  autoPlayOnLoad = true,
  preload = false
}) => {
  const [isLoaded, setIsLoaded] = useState(preload);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const observerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    setIsInView(entry.isIntersecting);
    
    if (entry.isIntersecting) {
      if (!isLoaded && autoPlayOnLoad) {
        setIsLoaded(true);
        setIsPlaying(true);
      } else if (isLoaded) {
        // Resume playback if already loaded
        setIsPlaying(true);
        try {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ method: 'play' }), 
            '*'
          );
        } catch (e) {
          console.warn('Failed to send play message to Vimeo iframe:', e);
        }
      }
    } else if (isLoaded) {
      // Pause when out of view
      setIsPlaying(false);
      try {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: 'pause' }), 
          '*'
        );
      } catch (e) {
        console.warn('Failed to send pause message to Vimeo iframe:', e);
      }
    }
  }, [isLoaded, autoPlayOnLoad]);

  const containerRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (node) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: [0, 0.1, 0.5],
        rootMargin: '50px'
      });
      observerRef.current.observe(node);
    }
  }, [handleIntersection]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const videoSrc = `https://player.vimeo.com/video/${videoId}?h=${hash}${background ? '&background=1' : ''}&autoplay=${isPlaying ? '1' : '0'}&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0&muted=1`;

  return (
    <div 
      ref={containerRef}
      className={`bg-ink rounded-lg sm:rounded-xl overflow-hidden`}
      style={{ aspectRatio }}
    >
      {isLoaded ? (
        <iframe 
          ref={iframeRef}
          src={videoSrc}
          className={className}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ pointerEvents: 'none' }}
        />
      ) : (
        <div className="w-full h-full bg-ink/50 animate-pulse flex items-center justify-center">
          <div className="text-ink/30 text-sm">Loading video...</div>
        </div>
      )}
    </div>
  );
};

export default LazyVimeoPlayer; 