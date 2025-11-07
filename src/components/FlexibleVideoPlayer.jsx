import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getGumletInteractiveUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

const FlexibleVideoPlayer = ({
  videoType = 'vimeo', // 'vimeo' or 'gumlet'
  videoId,
  vimeoHash, // For Vimeo videos that need a hash
  aspectRatio = 'aspect-[2/3]', // Default aspect ratio
  className = '',
  scale = 1.25,
  autoplay = false, // Changed default to false for performance
  loop = false, // Changed to false for proper hover behavior
  muted = true,
  background = true,
  disableControls = true,
  animationDelay = 0.2,
  videoDuration = 10, // Duration in seconds for auto-reset
  thumbnailSrc = null, // Optional custom thumbnail
  ...motionProps
}) => {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Reset to thumbnail function
  const resetToThumbnail = useCallback(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handle hover interactions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!hasPlayed && shouldLoad) {
      setIsPlaying(true);
      setHasPlayed(true);
      
      // Reset after video duration + buffer
      timeoutRef.current = setTimeout(resetToThumbnail, (videoDuration + 2) * 1000);
    }
  }, [hasPlayed, shouldLoad, videoDuration, resetToThumbnail]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Don't immediately reset, let video finish naturally
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !shouldLoad) {
          // Delay loading slightly to improve performance
          setTimeout(() => setShouldLoad(true), 500);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  // Handle autoplay when video loads and autoplay is enabled
  useEffect(() => {
    if (shouldLoad && autoplay && !isPlaying && !hasPlayed) {
      setIsPlaying(true);
      setHasPlayed(true);
      
      // If loop is disabled, reset after video duration
      if (!loop && videoDuration > 0) {
        timeoutRef.current = setTimeout(resetToThumbnail, (videoDuration + 2) * 1000);
      }
    }
  }, [shouldLoad, autoplay, isPlaying, hasPlayed, loop, videoDuration, resetToThumbnail]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Generate stable video URL - don't change based on isPlaying
  const videoUrl = React.useMemo(() => {
    if (videoType === 'gumlet') {
      return getGumletInteractiveUrl(videoId, true, {
        loop,
        muted,
        background
      });
    } else if (videoType === 'vimeo') {
      const hashParam = vimeoHash ? `h=${vimeoHash}&` : '';
      const loopParam = loop ? '1' : '0';
      const params = `${hashParam}background=${background ? '1' : '0'}&autoplay=1&loop=${loopParam}&byline=0&title=0${muted ? '&muted=1' : ''}`;
      return `https://player.vimeo.com/video/${videoId}?${params}`;
    }
    return '';
  }, [videoType, videoId, vimeoHash, loop, muted, background]);
  
  const iframeAttrs = videoType === 'gumlet' ? GUMLET_IFRAME_ATTRS : {};

  // Generate thumbnail URL if custom one not provided
  const getThumbnailUrl = () => {
    if (thumbnailSrc) return thumbnailSrc;
    if (videoType === 'gumlet') {
      return `https://play.gumlet.io/embed/${videoId}/thumbnail.jpg`;
    }
    return null;
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`${aspectRatio} bg-ink rounded-xl overflow-hidden relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6,
        delay: animationDelay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...motionProps}
    >
      <motion.div
        className="w-full h-full"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 80,
          damping: 20
        }}
      >
        {/* Thumbnail - shows when not playing */}
        {getThumbnailUrl() && (
          <div
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 z-10 ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              backgroundImage: `url('${getThumbnailUrl()}')`,
              transform: `scale(${scale})`,
              transformOrigin: 'center center'
            }}
          />
        )}

        {/* Video iframe - only render when in view and should load */}
        {shouldLoad && (
          <iframe
            key={`video-${videoId}`}
            src={videoUrl}
            className="w-full h-full object-cover pointer-events-none"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
              opacity: isPlaying ? 1 : 0,
              transition: 'opacity 0.5s ease',
              border: 'none'
            }}
            loading="lazy"
            allow={iframeAttrs.allow || "autoplay; fullscreen; picture-in-picture; encrypted-media"}
            allowFullScreen
            title={`${videoType} video player`}
          />
        )}
        
        {/* Loading placeholder when not loaded */}
        {!shouldLoad && (
          <div className="w-full h-full bg-ink/20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sand/30 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FlexibleVideoPlayer; 