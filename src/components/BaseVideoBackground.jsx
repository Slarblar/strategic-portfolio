import React, { useState, useEffect, useRef } from 'react';

const BaseVideoBackground = ({ 
  videoId, 
  scale = 1,
  additionalStyles = {} 
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Check if it's a Gumlet video ID (no question mark)
  const isGumlet = !videoId.includes('?');
  
  // Construct the video URL based on the type
  let videoUrl = isGumlet
    ? `https://play.gumlet.io/embed/${videoId}?preload=true&autoplay=${isInView ? 'true' : 'false'}&loop=true&background=true&disable_player_controls=true`
    : `https://player.vimeo.com/video/${videoId}&background=1&autoplay=${isInView ? '1' : '0'}&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0&controls=0&muted=1`;

  useEffect(() => {
    // Initialize Intersection Observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isNowInView = entry.isIntersecting;
        setIsInView(isNowInView);
        
        // Only set loaded to true once when it first comes into view
        if (isNowInView && !isLoaded) {
          setIsLoaded(true);
        }
      },
      {
        rootMargin: '50% 0px', // Start loading when within 50% of viewport
        threshold: 0.1
      }
    );

    // Start observing
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="video-background absolute inset-0 w-full h-[200vh] overflow-hidden">
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          width: '250vh',
          height: '150vh',
          minWidth: '100%',
          minHeight: '100%',
          ...additionalStyles,
          transform: additionalStyles.transform ? additionalStyles.transform : `translate(-50%, -50%) scale(${scale * 1.4})`,
        }}
      >
        {/* Only render iframe when it should be loaded */}
        {isLoaded && (
          <iframe
            src={videoUrl}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              objectFit: 'cover',
              border: 'none'
            }}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      
      {/* Gradient overlay with minimal opacity */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(14, 17, 17, 0.1) 0%, rgba(14, 17, 17, 0.01) 35%, rgba(14, 17, 17, 0.01) 65%, rgba(14, 17, 17, 0.1) 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Chromatic Aberration Overlay */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none chromatic-aberration-overlay opacity-5"
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.008] mix-blend-overlay"
        style={{
          backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxM8mAAAACHRSTlMzMzMzMzMzM85JBgUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAwSURBVDjLY2AY2uF/AgO6gP+3/2sZsAv6f/z/HgMOEyDgH1HA/3/YRQyNFhroEABs2bqBosV/LwAAAABJRU5ErkJggg==)',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default BaseVideoBackground; 