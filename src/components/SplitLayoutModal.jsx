import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import useScrollLock from '../hooks/useScrollLock';
import OptimizedImage from './OptimizedImage';
import ModalVideoPlayer from './ModalVideoPlayer';

// Utility function to format text with proper line breaks
const formatTextWithLineBreaks = (text) => {
  if (!text) return null;
  
  // First, split on periods followed by capital letters (sentence boundaries)
  // Then split on common label patterns
  const formatted = text
    // Add line breaks after sentences that end with periods and are followed by capital letters
    .replace(/(\.)(\s+)([A-Z][a-zA-Z\s]+:)/g, '$1\n\n$3')
    // Add line breaks before common project labels
    .replace(/\b(Client|Project Value|Event|Project|Experience Design|Audience|Project Overview|Complex Logistics|Coordination|Management):/gi, '\n\n$1:')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
  
  // Split into paragraphs and process each
  const paragraphs = formatted.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();
    const isLabel = /^(Client|Project Value|Event|Project|Experience Design|Audience|Project Overview|Complex Logistics|Coordination|Management):/i.test(trimmed);
    
    return (
      <div key={index} className={index > 0 ? "mt-4" : ""}>
        {isLabel ? (
          <div className="font-semibold text-current opacity-90">
            {trimmed}
          </div>
        ) : (
          <div className="leading-relaxed">
            {trimmed}
          </div>
        )}
      </div>
    );
  });
};

const SplitLayoutModal = ({ isOpen, onClose, project, currentImageIndex: propImageIndex = 0, onImageChange, totalImages = 1 }) => {
  const { lockScroll, unlockScroll } = useScrollLock();
  
  // Create combined media array for mixed media support
  const combinedMedia = React.useMemo(() => {
    if (!project) return [];
    
    const media = [];
    
    // Add images to media array
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((image, index) => {
        media.push({
          type: 'image',
          url: image,
          index: index,
          id: `image-${index}`
        });
      });
    }
    
    // Add video to media array (if exists)
    if (project.videoUrl) {
      media.push({
        type: 'video',
        url: project.videoUrl,
        index: media.length,
        id: 'main-video'
      });
    }
    
    return media;
  }, [project]);
  
  // Update total items count to include all media
  const totalMediaItems = combinedMedia.length;
  const actualTotalImages = project?.images?.length || 0;
  
  // Local state for media index if not controlled externally
  const [localMediaIndex, setLocalMediaIndex] = useState(0);
  const currentMediaIndex = onImageChange ? propImageIndex : localMediaIndex;
  
  // Current media item
  const currentMedia = combinedMedia[currentMediaIndex];
  const isCurrentVideo = currentMedia?.type === 'video';
  const isCurrentImage = currentMedia?.type === 'image';
  
  // Zoom and pan state (only for images)
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showZoomLevel, setShowZoomLevel] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Touch gesture state
  const touchStartRef = useRef({ 
    touches: [], 
    initialDistance: 0, 
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    startTime: 0,
    swipeStartX: 0,
    swipeStartY: 0
  });

  // Reset zoom and position when media changes or modal opens
  const resetZoomAndPosition = useCallback(() => {
    setScale(1);
    dragX.set(0);
    dragY.set(0);
    setImageLoaded(false);
  }, [dragX, dragY]);

  useEffect(() => {
    resetZoomAndPosition();
  }, [currentMediaIndex, resetZoomAndPosition]);

  useEffect(() => {
    if (isOpen && project) {
      lockScroll();
      setLocalMediaIndex(0);
      resetZoomAndPosition();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen, project, lockScroll, unlockScroll, resetZoomAndPosition]);

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not on any child elements
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleMediaChange = (newIndex) => {
    // Handle looping: if going past last item, go to first; if going before first, go to last
    let loopedIndex = newIndex;
    if (newIndex >= totalMediaItems) {
      loopedIndex = 0; // Loop to first item
    } else if (newIndex < 0) {
      loopedIndex = totalMediaItems - 1; // Loop to last item
    }
    
    if (onImageChange) {
      onImageChange(loopedIndex);
    } else {
      setLocalMediaIndex(loopedIndex);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && totalMediaItems > 1) {
      handleMediaChange(currentMediaIndex - 1);
    } else if (e.key === 'ArrowRight' && totalMediaItems > 1) {
      handleMediaChange(currentMediaIndex + 1);
    }
  }, [currentMediaIndex, totalMediaItems, onClose]);

  // Enhanced zoom functions with better state management (only for images)
  const handleZoomIn = useCallback(() => {
    if (isCurrentImage) {
      setScale(prev => {
        const newScale = Math.min(prev * 1.4, 4);
        return newScale;
      });
    }
  }, [isCurrentImage]);

  const handleZoomOut = useCallback(() => {
    if (isCurrentImage) {
      setScale(prev => {
        const newScale = Math.max(prev / 1.4, 1);
        if (newScale <= 1.1) {
          // Reset position when zooming out to near 1x
          dragX.set(0);
          dragY.set(0);
          return 1;
        }
        return newScale;
      });
    }
  }, [isCurrentImage, dragX, dragY]);

  const handleZoomReset = useCallback(() => {
    if (isCurrentImage) {
      setScale(1);
      dragX.set(0);
      dragY.set(0);
    }
  }, [isCurrentImage, dragX, dragY]);

  // Improved mouse wheel zoom with throttling (only for images)
  const handleWheel = useCallback((e) => {
    if (isCurrentImage) {
      e.preventDefault();
      const delta = e.deltaY;
      if (delta > 0) {
        handleZoomOut();
      } else {
        handleZoomIn();
      }
    }
  }, [isCurrentImage, handleZoomIn, handleZoomOut]);

  // Touch gesture utilities
  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const showZoomLevelBriefly = useCallback((zoomLevel) => {
    setShowZoomLevel(true);
    setTimeout(() => setShowZoomLevel(false), 1000);
  }, []);

  // Touch event handlers for pinch-to-zoom and gestures
  const handleTouchStart = useCallback((e) => {
    const touches = Array.from(e.touches);
    touchStartRef.current.touches = touches;
    touchStartRef.current.initialScale = scale;
    touchStartRef.current.initialX = dragX.get();
    touchStartRef.current.initialY = dragY.get();
    touchStartRef.current.startTime = Date.now();

    if (touches.length === 2) {
      // Pinch-to-zoom start
      touchStartRef.current.initialDistance = getDistance(touches[0], touches[1]);
    } else if (touches.length === 1) {
      // Single touch for double-tap detection and swipe start
      const touch = touches[0];
      touchStartRef.current.swipeStartX = touch.clientX;
      touchStartRef.current.swipeStartY = touch.clientY;
      
      const now = Date.now();
      const timeDiff = now - lastTapTime;
      
      if (timeDiff < 300) {
        // Double tap detected - reset zoom
        handleZoomReset();
        showZoomLevelBriefly(100);
        
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
      setLastTapTime(now);
    }
  }, [scale, dragX, dragY, lastTapTime, handleZoomReset, showZoomLevelBriefly]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const touches = Array.from(e.touches);

    if (touches.length === 2 && touchStartRef.current.touches.length === 2) {
      // Pinch-to-zoom
      const currentDistance = getDistance(touches[0], touches[1]);
      const distanceRatio = currentDistance / touchStartRef.current.initialDistance;
      const newScale = Math.min(Math.max(touchStartRef.current.initialScale * distanceRatio, 1), 4);
      
      setScale(newScale);
      showZoomLevelBriefly(Math.round(newScale * 100));
    }
  }, [showZoomLevelBriefly]);

  const handleTouchEnd = useCallback((e) => {
    const remainingTouches = Array.from(e.touches);
    const changedTouches = Array.from(e.changedTouches);
    
    if (remainingTouches.length === 0) {
      // All touches ended - check for swipe gesture
      if (touchStartRef.current.touches.length === 1 && changedTouches.length === 1 && totalMediaItems > 1) {
        const touch = changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.swipeStartX;
        const deltaY = touch.clientY - touchStartRef.current.swipeStartY;
        const touchDuration = Date.now() - touchStartRef.current.startTime;
        
        // Check for horizontal swipe (when not zoomed in)
        if (scale <= 1.1 && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && touchDuration < 500) {
          if (deltaX > 0) {
            // Swipe right - previous image
            handleMediaChange(currentMediaIndex - 1);
          } else {
            // Swipe left - next image
            handleMediaChange(currentMediaIndex + 1);
          }
          
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(30);
          }
        }
      }
      
      touchStartRef.current.touches = [];
    } else if (remainingTouches.length === 2 && touchStartRef.current.touches.length > 2) {
      // Reset for two-finger gestures
      touchStartRef.current.touches = remainingTouches;
      touchStartRef.current.initialDistance = getDistance(remainingTouches[0], remainingTouches[1]);
      touchStartRef.current.initialScale = scale;
    }

    // Two-finger reset gesture (when lifting two fingers while zoomed)
    if (touchStartRef.current.touches.length === 2 && remainingTouches.length === 0 && scale > 1) {
      const touchDuration = Date.now() - touchStartRef.current.startTime;
      if (touchDuration > 500) { // Long press with two fingers
        handleZoomReset();
        showZoomLevelBriefly(100);
        
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }
      }
    }
  }, [scale, handleZoomReset, showZoomLevelBriefly, totalMediaItems, currentMediaIndex, handleMediaChange]);

  // More reliable constraint calculation
  const calculateConstraints = useCallback(() => {
    if (!imageRef.current || !containerRef.current || scale <= 1 || !imageLoaded) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    try {
      const container = containerRef.current.getBoundingClientRect();
      
      // Get the actual image element dimensions
      const imageElement = imageRef.current.querySelector('img');
      if (!imageElement) return { top: 0, bottom: 0, left: 0, right: 0 };
      
      // Get natural image dimensions and current display size
      const imageRect = imageElement.getBoundingClientRect();
      const displayWidth = imageRect.width;
      const displayHeight = imageRect.height;
      
      // Calculate scaled dimensions
      const scaledWidth = displayWidth * scale;
      const scaledHeight = displayHeight * scale;
      
      // Calculate how much the scaled image extends beyond the container
      const xOverflow = Math.max(0, scaledWidth - container.width);
      const yOverflow = Math.max(0, scaledHeight - container.height);
      
      // The constraint is half the overflow (since the image is centered)
      const xConstraint = xOverflow / 2;
      const yConstraint = yOverflow / 2;

      // Debug: Uncomment to see constraint calculations
      // console.log('Constraint calculation:', {
      //   scale,
      //   containerSize: { width: container.width, height: container.height },
      //   displaySize: { width: displayWidth, height: displayHeight },
      //   scaledSize: { width: scaledWidth, height: scaledHeight },
      //   overflow: { x: xOverflow, y: yOverflow },
      //   constraints: { x: xConstraint, y: yConstraint }
      // });

      return {
        top: -yConstraint,
        bottom: yConstraint,
        left: -xConstraint,
        right: xConstraint
      };
    } catch (error) {
      console.warn('Error calculating constraints:', error);
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  }, [scale, imageLoaded]);

  // Handle drag with better state management
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Prevent default browser drag behavior
  const handleImageInteraction = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Force constraint recalculation when scale changes
  const [constraints, setConstraints] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  
  useEffect(() => {
    if (imageLoaded && scale > 1) {
      const newConstraints = calculateConstraints();
      setConstraints(newConstraints);
    } else {
      setConstraints({ top: 0, bottom: 0, left: 0, right: 0 });
    }
  }, [scale, imageLoaded, calculateConstraints]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !project) {
    return null;
  }

  const currentImage = isCurrentImage ? currentMedia?.url : null;
  const hasMultipleItems = totalMediaItems > 1;
  const isVideo = isCurrentVideo;
  
  // Conditional colors based on content type
  const modalColors = isVideo ? {
    // Video: ink background with sand text (current style)
    background: 'bg-ink',
    border: 'border-sand/20',
    text: 'text-sand',
    textSecondary: 'text-sand/70',
    textMuted: 'text-sand/50',
    button: 'bg-sand/10 hover:bg-sand/20 text-sand',
    buttonDisabled: 'disabled:opacity-30',
    header: 'bg-ink/95',
    leftPanel: 'bg-ink/5 border-sand/20',
    rightPanel: 'bg-ink',
    dots: 'bg-sand',
    dotsInactive: 'bg-sand/30'
  } : {
    // Images: sand background with ink text
    background: 'bg-sand',
    border: 'border-ink/20',
    text: 'text-ink',
    textSecondary: 'text-ink/70',
    textMuted: 'text-ink/50',
    button: 'bg-ink/10 hover:bg-ink/20 text-ink',
    buttonDisabled: 'disabled:opacity-30',
    header: 'bg-sand/95',
    leftPanel: 'bg-sand/5 border-ink/20',
    rightPanel: 'bg-sand',
    dots: 'bg-ink',
    dotsInactive: 'bg-ink/30'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={`relative w-[95vw] h-[75vh] max-w-[1400px] ${modalColors.background} rounded-2xl shadow-2xl border ${modalColors.border} overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className={`absolute top-0 left-0 right-0 z-20 ${modalColors.header} backdrop-blur-sm border-b ${modalColors.border} p-6`}>
              <div className="flex items-center justify-between">
                {/* Project Title */}
                <h2 className={`font-display text-2xl md:text-3xl font-bold ${modalColors.text} truncate pr-4`}>
                  {project.title}
                </h2>
                
                {/* Navigation & Controls */}
                <div className="flex items-center gap-4">
                  {/* Media Counter - Desktop Only */}
                  {hasMultipleItems && (
                    <span className={`hidden lg:inline-block font-martian-mono text-sm ${modalColors.textSecondary}`}>
                      {currentMediaIndex + 1} / {totalMediaItems}
                      {isCurrentVideo && " (Video)"}
                      {isCurrentImage && " (Image)"}
                    </span>
                  )}
                  
                  {/* Zoom Controls - Desktop Only - Only for images */}
                  {isCurrentImage && (
                    <div className="hidden lg:flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        disabled={scale <= 1}
                        className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200 ${modalColors.buttonDisabled} disabled:cursor-not-allowed text-sm`}
                        title="Zoom out (or use mouse wheel)"
                      >
                        −
                      </button>
                      <span className={`font-martian-mono text-xs ${modalColors.textSecondary} min-w-[3rem] text-center`}>
                        {Math.round(scale * 100)}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        disabled={scale >= 4}
                        className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200 ${modalColors.buttonDisabled} disabled:cursor-not-allowed text-sm`}
                        title="Zoom in (or use mouse wheel)"
                      >
                        +
                      </button>
                      {scale > 1 && (
                        <button
                          onClick={handleZoomReset}
                          className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200`}
                          title="Reset zoom"
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Navigation Arrows - Show for all multi-media */}
                  {hasMultipleItems && (
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleMediaChange(currentMediaIndex - 1)}
                        className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.15 }}
                      >
                        ‹
                      </motion.button>
                      <motion.button
                        onClick={() => handleMediaChange(currentMediaIndex + 1)}
                        className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.15 }}
                      >
                        ›
                      </motion.button>
                    </div>
                  )}
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className={`p-2 ${modalColors.button} rounded-lg transition-all duration-200 text-xl font-bold`}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row h-full pt-20">
              {/* LEFT: Image Area (60-70% width on desktop) */}
              <div 
                ref={containerRef}
                className={`w-full lg:w-[65%] h-[35vh] lg:h-full ${modalColors.leftPanel} border-r relative overflow-hidden`}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDragStart={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                style={{ 
                  cursor: scale > 1 ? 'grab' : 'default',
                  touchAction: 'none' // Prevent default touch behaviors
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {/* Current Media Display - Video or Image */}
                  {isCurrentVideo ? (
                    <div className="w-full h-full">
                      <ModalVideoPlayer
                        videoData={{
                          url: currentMedia.url,
                          title: project.title,
                          description: project.description
                        }}
                        allowClickToToggle={true}
                      />
                    </div>
                  ) : (
                    /* Image Gallery for image content */
                    <AnimatePresence mode="wait" custom={currentMediaIndex}>
                      {currentImage && (
                        <motion.div
                          key={`${project.title}-${currentMediaIndex}`}
                          ref={imageRef}
                          className="max-w-full max-h-full select-none"
                          custom={currentMediaIndex}
                          initial={{ 
                            opacity: 0,
                            x: hasMultipleItems ? 20 : 0,
                            scale: 0.98
                          }}
                          animate={{ 
                            opacity: 1,
                            x: 0,
                            scale: scale
                          }}
                          exit={{ 
                            opacity: 0,
                            x: hasMultipleItems ? -20 : 0,
                            scale: 0.98
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.21, 0.47, 0.32, 0.98],
                            scale: {
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }
                          }}
                          style={{ 
                            x: dragX,
                            y: dragY
                          }}
                          drag={scale > 1}
                          dragConstraints={constraints}
                          dragElastic={0.05}
                          dragMomentum={false}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          whileDrag={{ cursor: 'grabbing' }}
                          onPointerDown={(e) => e.preventDefault()}
                        >
                          <OptimizedImage
                            src={currentImage}
                            alt={project.title}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg select-none pointer-events-none"
                            onLoadingComplete={() => setImageLoaded(true)}
                            draggable={false}
                            onDragStart={handleImageInteraction}
                            onContextMenu={handleImageInteraction}
                            onMouseDown={handleImageInteraction}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
                
                {/* Zoom Level Indicator - Mobile - Only for images */}
                {showZoomLevel && isCurrentImage && (
                  <div className={`lg:hidden absolute top-4 right-4 ${isVideo ? 'bg-sand/80 text-ink' : 'bg-ink/80 text-sand'} px-3 py-2 rounded-lg shadow-lg`}>
                    <span className="font-martian-mono text-sm">
                      {Math.round(scale * 100)}%
                    </span>
                  </div>
                )}
                
                {/* Media Navigation Overlay (Mobile) - Show for all multi-media */}
                {hasMultipleItems && (
                  <motion.div 
                    className="lg:hidden absolute inset-x-4 bottom-4 flex justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {Array.from({ length: totalMediaItems }).map((_, index) => {
                      const mediaItem = combinedMedia[index];
                      const isVideoItem = mediaItem?.type === 'video';
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleMediaChange(index)}
                          className="relative w-3 h-3 shadow-sm"
                          whileTap={{ scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          title={isVideoItem ? "Video" : "Image"}
                        >
                          <motion.div
                            className={`w-full h-full ${isVideoItem ? 'rounded-sm' : 'rounded-full'} ${modalColors.dotsInactive}`}
                            animate={{
                              scale: index === currentMediaIndex ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                          />
                          <motion.div
                            className={`absolute inset-0 ${isVideoItem ? 'rounded-sm' : 'rounded-full'} ${modalColors.dots}`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: index === currentMediaIndex ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                          />
                          {/* Video play icon indicator */}
                          {isVideoItem && (
                            <motion.div
                              className={`absolute inset-0 flex items-center justify-center ${modalColors.text}`}
                              animate={{
                                opacity: index === currentMediaIndex ? 1 : 0.6,
                              }}
                            >
                              <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* RIGHT: Scrollable Text Content Area (30-40% width on desktop) */}
              <div className={`w-full lg:w-[35%] h-[40vh] lg:h-full ${modalColors.rightPanel} overflow-y-auto`}>
                <div className="p-6 lg:p-8 space-y-6">
                  {/* Project Year */}
                  {project.year && (
                    <div className={`font-martian-mono text-sm ${modalColors.textSecondary} tracking-wider`}>
                      {project.year}
                    </div>
                  )}

                  {/* Project Description */}
                  {project.description && (
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${modalColors.text} mb-3`}>
                        Description
                      </h3>
                      <div className={`font-martian-mono text-sm leading-relaxed ${modalColors.textSecondary}`}>
                        {formatTextWithLineBreaks(project.description)}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  {project.details && project.details !== project.description && (
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${modalColors.text} mb-3`}>
                        Details
                      </h3>
                      <div className={`font-martian-mono text-sm leading-relaxed ${modalColors.textSecondary}`}>
                        {formatTextWithLineBreaks(project.details)}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${modalColors.text} mb-3`}>
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 ${modalColors.button} font-martian-mono text-xs rounded-full`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Project Info */}
                  {project.client && (
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${modalColors.text} mb-3`}>
                        Client
                      </h3>
                      <p className={`font-martian-mono text-sm ${modalColors.textSecondary}`}>
                        {project.client}
                      </p>
                    </div>
                  )}

                  {project.role && (
                    <div>
                      <h3 className={`font-display text-lg font-semibold ${modalColors.text} mb-3`}>
                        Role
                      </h3>
                      <p className={`font-martian-mono text-sm ${modalColors.textSecondary}`}>
                        {project.role}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SplitLayoutModal; 