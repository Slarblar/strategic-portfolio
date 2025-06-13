import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThumbnailByVideoId } from '../../data/videoConfigs';

/**
 * ArchiveCardVideo - Video player optimized for archive cards
 * Handles both Vimeo and Gumlet videos with thumbnail previews
 * Supports hover-to-play and click interactions
 */
const ArchiveCardVideo = ({ 
  videoId, 
  videoType = 'gumlet', 
  thumbnail,
  className = "",
  autoPlayOnHover = true,
  showPlayButton = true,
  onVideoStateChange
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  if (!videoId) return null;

  // Generate thumbnail URL if not provided
  const getThumbnailUrl = useCallback(() => {
    if (thumbnail) return thumbnail;
    
    if (videoType === 'gumlet') {
      return getThumbnailByVideoId(videoId);
    } else {
      // Vimeo thumbnail service
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  }, [thumbnail, videoId, videoType]);

  // Generate video URL based on type and state
  const getVideoUrl = useCallback((forcePlay = false) => {
    const shouldAutoplay = forcePlay || (autoPlayOnHover && isHovered && isPlaying);
    
    if (videoType === 'gumlet') {
      const params = new URLSearchParams({
        autoplay: shouldAutoplay.toString(),
        loop: 'true',
        muted: 'true',
        background: 'true',
        disable_player_controls: 'true',
        preload: 'metadata'
      });
      return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
    } else {
      // Vimeo
      const params = new URLSearchParams({
        background: '1',
        autoplay: shouldAutoplay ? '1' : '0',
        loop: '1',
        muted: '1',
        controls: '0',
        title: '0',
        byline: '0',
        portrait: '0'
      });
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }
  }, [videoId, videoType, autoPlayOnHover, isHovered, isPlaying]);

  // Send commands to video player
  const sendVideoCommand = useCallback((command, value) => {
    if (iframeRef.current?.contentWindow) {
      const message = value !== undefined ? { method: command, value } : { method: command };
      try {
        iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
      } catch (error) {
        console.warn('Failed to send video command:', error);
      }
    }
  }, []);

  // Handle hover interactions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (autoPlayOnHover) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Small delay to prevent accidental triggers
      hoverTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
        setIsPlaying(true);
        onVideoStateChange?.('playing');
      }, 200);
    }
  }, [autoPlayOnHover, onVideoStateChange]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (autoPlayOnHover && isPlaying) {
      setIsPlaying(false);
      setIsLoading(false);
      sendVideoCommand('pause');
      onVideoStateChange?.('paused');
    }
  }, [autoPlayOnHover, isPlaying, sendVideoCommand, onVideoStateChange]);

  // Handle manual play/pause
  const handlePlayToggle = useCallback((e) => {
    e.stopPropagation();
    
    if (isPlaying) {
      setIsPlaying(false);
      sendVideoCommand('pause');
      onVideoStateChange?.('paused');
    } else {
      setIsLoading(true);
      setIsPlaying(true);
      sendVideoCommand('play');
      onVideoStateChange?.('playing');
    }
  }, [isPlaying, sendVideoCommand, onVideoStateChange]);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setIsPlaying(false);
    onVideoStateChange?.('error');
  }, [onVideoStateChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-video overflow-hidden bg-ink rounded-xl ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Layer */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isPlaying && videoLoaded ? 0 : 1
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        <img
          src={getThumbnailUrl()}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          onLoad={() => setThumbnailLoaded(true)}
          onError={(e) => {
            e.target.src = '/images/thumbnails/default-thumb.webp';
          }}
        />
        
        {/* Thumbnail overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Play button overlay */}
        {showPlayButton && thumbnailLoaded && !isPlaying && (
          <motion.button
            onClick={handlePlayToggle}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-ink ml-1"
              >
                <path 
                  d="M8 5v14l11-7z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* Video Layer */}
      <AnimatePresence>
        {isPlaying && (
          <motion.iframe
            ref={iframeRef}
            key={`video-${videoId}`}
            src={getVideoUrl(true)}
            title={`${videoType} video player`}
            className="absolute inset-0 w-full h-full z-20"
            style={{
              border: 'none',
              backgroundColor: '#1a1a1a'
            }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: videoLoaded ? 1 : 0,
              scale: videoLoaded ? 1 : 0.95
            }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.3 }
            }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-30"
          >
            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin bg-black/30 backdrop-blur-sm" />
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
            className="absolute inset-0 bg-ink/80 flex items-center justify-center backdrop-blur-sm z-30"
          >
            <div className="text-center">
              <div className="text-cream/90 text-sm mb-2">Video unavailable</div>
              <button
                onClick={handlePlayToggle}
                className="text-cream/60 text-xs hover:text-cream transition-colors"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video type indicator */}
      <div className="absolute top-4 left-4 z-30">
        <span className="px-2 py-1 bg-black/50 text-white/80 text-xs font-martian-mono uppercase tracking-wider rounded backdrop-blur-sm">
          {videoType}
        </span>
      </div>

      {/* Hover state indicator */}
      {autoPlayOnHover && isHovered && !isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 ring-2 ring-cream/50 rounded-xl pointer-events-none z-40"
        />
      )}
    </div>
  );
};

export default ArchiveCardVideo; 