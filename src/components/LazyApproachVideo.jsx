import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LazyApproachVideo = ({ 
  videoId,
  section,
  thumbnailUrl = null, // Optional custom thumbnail for A for Adley
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // Key to force video reload
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isHovered) {
      setShouldShowVideo(true);
      // Clear any existing timeout when mouse enters
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      // When mouse leaves, give enough time for video to complete
      timeoutRef.current = setTimeout(() => {
        setShouldShowVideo(false);
        setIsVideoLoaded(false);
        setVideoKey(prev => prev + 1);
      }, 12000); // 12 second timeout after mouse leave to ensure full video plays
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Use custom thumbnail if provided, otherwise use local thumbnail path
  const thumbnailPath = thumbnailUrl || `/images/ssa/myapproach-thumbnails/${section}/thumb-1.webp`;

  return (
    <motion.div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9' }}>
        {/* Thumbnail Image */}
        <AnimatePresence>
          {!shouldShowVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <img
                src={thumbnailPath}
                alt={`${section || 'Video'} thumbnail`}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Container */}
        <AnimatePresence mode="wait">
          {shouldShowVideo && (
            <motion.div
              key={videoKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVideoLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <iframe 
                key={videoKey}
                ref={iframeRef}
                loading="lazy"
                title="Gumlet video player"
                src={`https://play.gumlet.io/embed/${videoId}?preload=true&autoplay=true&loop=false&background=true&disable_player_controls=true&initial_play_button=false&muted=true&playsinline=true`}
                style={{ 
                  border: 'none',
                  width: '100%',
                  height: '100%',
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                onLoad={() => setIsVideoLoaded(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading indicator */}
      <AnimatePresence>
        {shouldShowVideo && !isVideoLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 border-2 border-sand border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LazyApproachVideo; 