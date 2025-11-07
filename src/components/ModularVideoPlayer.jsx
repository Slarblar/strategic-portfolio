import React, { useState, useRef, useEffect, useCallback } from 'react';
import { videoConfigs } from '../data/videoConfigs';
import { getGumletInteractiveUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

/**
 * ModularVideoPlayer - A "Lego Piece" Video Component
 * 
 * This component provides a centralized, reusable video player that automatically
 * configures itself based on project and section data. Perfect for case studies!
 * 
 * USAGE EXAMPLES:
 * 
 * Basic usage (uses 'default' section):
 * <ModularVideoPlayer projectId="quarter-machine" />
 * 
 * Specific section:
 * <ModularVideoPlayer projectId="quarter-machine" section="hero-desktop" />
 * 
 * With custom styling:
 * <ModularVideoPlayer 
 *   projectId="quarter-machine" 
 *   section="platform-innovation"
 *   className="w-full h-full rounded-lg"
 * />
 * 
 * ADDING NEW PROJECTS:
 * 1. Add your project config in src/data/videoConfigs.js
 * 2. Use this component with your new projectId
 * 
 * ADDING NEW SECTIONS:
 * 1. Add the section to your project config in videoConfigs.js
 * 2. Use this component with the new section name
 * 
 * Benefits:
 * - Centralized configuration
 * - Consistent behavior across all case studies
 * - Easy to maintain and update
 * - Type-safe and predictable
 * - Automatic fallbacks
 */

const ModularVideoPlayer = ({ 
  projectId, 
  section = 'default', 
  className = "",
  enableHover = true,
  autoplay = false, // Changed default to false for better performance
  loop = true,
  muted = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const progressTimer = useRef(null);

  // Get video configuration
  const videoConfig = videoConfigs[projectId]?.[section] || videoConfigs[projectId]?.['default'];
  
  if (!videoConfig) {
    console.warn(`No video configuration found for project: ${projectId}, section: ${section}`);
    return <div className={`bg-ink ${className}`} />;
  }

  const { videoId, thumbnailSrc, videoDuration = 10 } = videoConfig;

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Only enable hover effects when in view
  const handleMouseEnter = useCallback(() => {
    if (!enableHover || !isInView) return;
    setIsHovered(true);
    if (!hasPlayed) {
      setIsLoading(true);
      setHasPlayed(true);
      // Delay to allow iframe to load
      setTimeout(() => {
        setIsPlaying(true);
        setIsLoading(false);
        startProgressTimer();
      }, 500);
    } else {
      setIsPlaying(true);
      startProgressTimer();
    }
  }, [enableHover, isInView, hasPlayed]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
    }
    // Don't immediately stop video, let it complete or timeout
    setTimeout(() => {
      if (!isHovered) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }, 500);
  }, [isHovered]);

  const startProgressTimer = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
    }
    
    setCurrentTime(0);
    progressTimer.current = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = prevTime + 0.1;
        if (newTime >= videoDuration) {
          clearInterval(progressTimer.current);
          if (!loop) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
          return 0; // Reset for loop
        }
        return newTime;
      });
    }, 100);
  }, [videoDuration, loop]);

  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, []);

  // Only load video when it's been hovered and is in view
  const shouldLoadVideo = hasPlayed && isInView;
  
  // Generate URL once - don't change based on isPlaying state
  // Changing URL causes iframe reload which breaks playback
  const videoUrl = React.useMemo(() => {
    return getGumletInteractiveUrl(videoId, true, {
      loop,
      muted
    });
  }, [videoId, loop, muted]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 z-10 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        style={{backgroundImage: `url('${thumbnailSrc}')`}}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Video Player - Only render when needed */}
      {shouldLoadVideo && (
        <iframe 
          ref={iframeRef}
          loading="lazy" 
          title={`${projectId} ${section} video player`}
          src={videoUrl}
          style={{
            border: 'none', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            height: '100%', 
            width: '100%',
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          allow={GUMLET_IFRAME_ATTRS.allow}
          allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
          className="w-full h-full"
        />
      )}
      
      {/* Progress indicator (optional) */}
      {isPlaying && videoDuration > 0 && (
        <div className="absolute bottom-2 left-2 right-2 z-30">
          <div className="w-full bg-black/30 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-100" 
              style={{ width: `${Math.min((currentTime / videoDuration) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularVideoPlayer; 