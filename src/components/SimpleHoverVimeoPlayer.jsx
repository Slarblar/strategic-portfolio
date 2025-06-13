import React, { useState, useRef, useCallback, useEffect } from 'react';

const SimpleHoverVideoPlayer = ({
  videoId, // Gumlet video ID (e.g., "683fd3152ea48d13d43e2b7c")
  thumbnailSrc, // Local thumbnail image path (e.g., "/images/video-thumbnail.jpg")
  className,
  style,
  scale = 1,
  additionalStyles = {},
  aspectRatio = '1/1', // Default to square, can be customized
  videoDuration = 10, // Video duration in seconds for auto-reset
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timeoutRef = useRef(null);

  console.log('SimpleHoverVideoPlayer render:', { videoId, isPlaying, hasPlayed });

  if (!videoId || !thumbnailSrc) {
    return <div>Missing video ID or thumbnail</div>;
  }

  // Video URLs - static for preload, playing for hover
  const staticVideoUrl = `https://play.gumlet.io/embed/${videoId}?autoplay=false&loop=false&muted=true&ui=false&background=true`;
  const playingVideoUrl = `https://play.gumlet.io/embed/${videoId}?autoplay=true&loop=false&muted=true&ui=false&background=true`;

  const resetToThumbnail = useCallback(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!hasPlayed && videoLoaded) {
      setIsPlaying(true);
      setHasPlayed(true);
      
      // Reset after video duration
      timeoutRef.current = setTimeout(resetToThumbnail, (videoDuration + 2) * 1000);
    }
  }, [hasPlayed, videoLoaded, videoDuration, resetToThumbnail]);

  // Preload video after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000); // Give time for thumbnail to render first
    
    return () => clearTimeout(timer);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const containerStyle = {
    ...style,
    aspectRatio: aspectRatio,
    overflow: 'hidden',
    position: 'relative',
  };

  const baseElementStyle = {
    border: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '100%',
    width: '100%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition: 'opacity 400ms ease-out',
    ...additionalStyles,
  };

  return (
    <div
      className={`${className || ''}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
    >
      {/* Thumbnail - fades out on hover */}
      <div
        style={{
          ...baseElementStyle,
          backgroundImage: `url(${thumbnailSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isPlaying ? 0 : 1,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      
      {/* Video iframe - preloaded, fades in on hover */}
      {videoLoaded && (
        <iframe
          key={isPlaying ? 'playing' : 'static'}
          src={isPlaying ? playingVideoUrl : staticVideoUrl}
          title="Video player"
          style={{
            ...baseElementStyle,
            opacity: isPlaying ? 1 : 0,
            zIndex: 1,
          }}
          allow="autoplay; fullscreen"
        />
      )}
    </div>
  );
};

export default SimpleHoverVideoPlayer; 