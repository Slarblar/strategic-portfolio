import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { videoConfigs, getThumbnailByVideoId } from '../data/videoConfigs';

const ProjectCardVideo = ({ videoId, videoType = 'vimeo', className = "", hoverToPlay = false, isCardHovered = false, onLoad, thumbnail }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  
  if (!videoId) return null;

  // Generate thumbnail URL for first frame
  const getThumbnailUrl = () => {
    if (thumbnail) return thumbnail;
    if (videoType === 'gumlet') {
      return getThumbnailByVideoId(videoId);
    } else {
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  };

  // Generate video URL - simplified without aggressive cache-busting
  const getVideoUrl = useCallback(() => {
    if (videoType === 'gumlet') {
      const baseUrl = `https://play.gumlet.io/embed/${videoId}`;
      const params = new URLSearchParams({
        autoplay: 'true',
        loop: 'false',
        background: 'true',
        disable_player_controls: 'true',
        muted: 'true',
        preload: 'metadata'
      });

      return `${baseUrl}?${params.toString()}`;
    } else {
      const params = new URLSearchParams({
        background: '1',
        autoplay: '1',
        loop: '0',
        muted: '1',
        controls: '0',
        title: '0',
        byline: '0',
        portrait: '0'
      });
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }
  }, [videoId, videoType]);

  // Handle hover state changes with optimized timing and reduced re-renders
  useEffect(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    if (isCardHovered) {
      setHasError(false);
      setShowVideo(true);
      
      // Delay loading state to prevent flashing for quick hovers
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 100);
    } else {
      // Clear loading state immediately on unhover
      setIsLoading(false);
      setPlayerReady(false);
      
      // Smooth exit with minimal delay
      timeoutRef.current = setTimeout(() => {
        setShowVideo(false);
        setHasError(false);
      }, 200); // Reduced from 300ms
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isCardHovered]);

  // Handle iframe load with debouncing
  const handleIframeLoad = useCallback(() => {
    // Clear loading timeout since video is ready
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    setIsLoading(false);
    setHasError(false);
    setPlayerReady(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleIframeError = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <div 
      className={`relative aspect-[16/9] bg-ink rounded-xl overflow-hidden ${className}`}
      style={{ 
        backgroundColor: '#1a1a1a',
        // Hardware acceleration for smoother transitions
        willChange: isCardHovered ? 'opacity, transform' : 'auto',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Optimized crossfade transition */}
      
      {/* Thumbnail - always present, fades out when video loads */}
      <motion.img
        src={getThumbnailUrl()}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{
          transform: 'scale(1.18)',
          transformOrigin: 'center center',
          backgroundColor: '#1a1a1a'
        }}
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: showVideo && playerReady ? 0 : 1,
          transition: { 
            duration: 0.3, // Reduced from 0.4s
            ease: "easeOut", // Simplified easing
            delay: showVideo && playerReady ? 0.05 : 0 // Reduced delay
          }
        }}
        onLoad={() => {
          if (onLoad) onLoad();
        }}
        onError={(e) => {
          e.target.style.backgroundColor = '#1a1a1a';
          e.target.alt = 'Video preview';
        }}
      />
      
      {/* Video iframe - optimized loading */}
      <AnimatePresence mode="wait">
        {showVideo && (
          <motion.iframe
            ref={iframeRef}
            key={`video-${videoId}`}
            src={getVideoUrl()}
            loading="eager"
            title={videoType === 'gumlet' ? "Gumlet video player" : "Vimeo video player"}
            className="absolute inset-0 w-full h-full z-20"
            style={{
              border: 'none',
              transform: 'scale(1.18)',
              transformOrigin: 'center center',
              objectFit: 'cover',
              objectPosition: 'center center',
              backgroundColor: '#1a1a1a'
            }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: hasError ? 0.3 : (playerReady ? 1 : 0),
              transition: {
                duration: 0.3, // Reduced from 0.5s
                ease: "easeOut", // Simplified easing
                delay: playerReady ? 0 : 0.1 // Reduced delay
              }
            }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.2, // Reduced from 0.3s
                ease: "easeOut"
              }
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Minimal loading indicator - only show when truly needed */}
      <AnimatePresence>
        {isLoading && showVideo && !playerReady && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} // Reduced delay and show duration
            className="absolute top-4 right-4 z-30"
          >
            <div className="w-5 h-5 border-2 border-sand/50 border-t-transparent rounded-full animate-spin bg-ink/30 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/80 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-sand/90 text-sm">Video unavailable</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover indicator */}
      {hoverToPlay && !showVideo && !isLoading && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
      )}
    </div>
  );
};

export default ProjectCardVideo; 