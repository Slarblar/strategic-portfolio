import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import GlitchText from './GlitchText';
import ModalVideoPlayer from './ModalVideoPlayer';
import { Z_INDEX } from './archives/constants/zIndexLayers';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Zoom functionality state
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  
  // Swipe functionality state
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const scrollHintTimeoutRef = useRef(null);

  // Create unified media array with both video and images
  const getMediaItems = useCallback(() => {
    const mediaItems = [];
    
    // Add video first if it exists
    if (project?.videoId && project?.videoType) {
      mediaItems.push({
        type: 'video',
        videoId: project.videoId,
        videoType: project.videoType,
        videoHash: project.videoHash || null,
        title: `${project.title} - Video`,
        index: 0
      });
    }
    
    // Add images
    if (project?.images && project?.images.length > 0) {
      project.images.forEach((image, index) => {
        mediaItems.push({
          type: 'image',
          src: image,
          title: `${project.title} - Image ${index + 1}`,
          index: mediaItems.length
        });
      });
    }
    
    return mediaItems;
  }, [project]);

  const mediaItems = getMediaItems();
  const currentMedia = mediaItems[currentMediaIndex];
  const hasMultipleMedia = mediaItems.length > 1;

  // Reset media index when project changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setScale(1);
    dragX.set(0);
    dragY.set(0);
  }, [project]);

  // Generate video URL based on type and settings
  const getVideoUrl = useCallback((videoId, videoType, videoHash = null) => {
    if (videoType === 'vimeo') {
      const params = new URLSearchParams({
        background: '0',
        autoplay: '0',
        loop: '0',
        muted: '1',
        controls: '0', // Hide Vimeo's native controls for better immersion
        title: '0',
        byline: '0',
        portrait: '0',
        badge: '0',
        autopause: '0',
        api: '1' // Enable API for programmatic control
      });
      
      // Add hash parameter if provided (required for some Vimeo videos)
      if (videoHash) {
        params.set('h', videoHash);
      }
      
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    } else if (videoType === 'gumlet') {
      const params = new URLSearchParams({
        autoplay: 'false',
        loop: 'false',
        muted: 'false',
        background: 'false',
        disable_player_controls: 'false'
      });
      return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
    }
    return '';
  }, []);

  // Zoom functionality methods - stable function reference
  const animateToPosition = useCallback((x, y) => {
    animate(dragX, x, {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.5
    });
    animate(dragY, y, {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.5
    });
  }, []);

  const showScrollHintNotification = useCallback(() => {
    setShowScrollHint(true);
    
    // Clear existing timeout
    if (scrollHintTimeoutRef.current) {
      clearTimeout(scrollHintTimeoutRef.current);
    }
    
    // Auto-hide after 2 seconds
    scrollHintTimeoutRef.current = setTimeout(() => {
      setShowScrollHint(false);
    }, 2000);
  }, []);

  // Add non-passive wheel event listener for image zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentMedia?.type !== 'image') return;

    const wheelHandler = (e) => {
      // Check if the mouse is over the actual image element
      if (!imageRef.current) return;
      
      const imageRect = imageRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within image bounds
      const isOverImage = mouseX >= imageRect.left && 
                         mouseX <= imageRect.right && 
                         mouseY >= imageRect.top && 
                         mouseY <= imageRect.bottom;
      
      if (isOverImage) {
        // Mouse is over image - zoom the image
        e.preventDefault();
        e.stopPropagation();
        
        // Show scroll hint notification
        showScrollHintNotification();
        
        const delta = -Math.sign(e.deltaY) * 0.25;
        const newScale = Math.max(Math.min(scale + delta, 2.5), minScale);
        
        if (newScale === minScale) {
          dragX.set(0);
          dragY.set(0);
        }
        setScale(newScale);
      }
    };

    // Add with non-passive option
    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [scale, minScale, showScrollHintNotification, currentMedia?.type]);

  // Add pinch-to-zoom functionality for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentMedia?.type !== 'image') return;

    let lastTouchDistance = 0;
    let initialScale = 1;

    const getTouchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistance = getTouchDistance(e.touches);
        initialScale = scale;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const scaleChange = currentDistance / lastTouchDistance;
        const newScale = Math.max(Math.min(initialScale * scaleChange, 2.5), minScale);
        
        if (newScale === minScale) {
          dragX.set(0);
          dragY.set(0);
        }
        setScale(newScale);
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastTouchDistance = 0;
        initialScale = scale;
      }
    };

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, minScale, currentMedia?.type]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Cleanup scroll hint timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollHintTimeoutRef.current) {
        clearTimeout(scrollHintTimeoutRef.current);
      }
    };
  }, []);

  const calculateMinScale = () => {
    if (!imageRef.current || !containerRef.current) return 1;
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const widthRatio = container.width / image.width;
    const heightRatio = container.height / image.height;
    return Math.min(widthRatio, heightRatio);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, minScale);
      if (newScale === minScale) {
        dragX.set(0);
        dragY.set(0);
      }
      return newScale;
    });
  };

  const calculateConstraints = () => {
    if (!imageRef.current || !containerRef.current) return { top: 0, bottom: 0, left: 0, right: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const xConstraint = Math.max(0, (scaledWidth - container.width) / 2);
    const yConstraint = Math.max(0, (scaledHeight - container.height) / 2);
    const buffer = scale === 2.5 ? 100 : 50;
    return {
      top: -yConstraint - buffer,
      bottom: yConstraint + buffer,
      left: -xConstraint - buffer,
      right: xConstraint + buffer
    };
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (!imageRef.current || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const xConstraint = Math.max(0, (scaledWidth - container.width) / 2);
    const yConstraint = Math.max(0, (scaledHeight - container.height) / 2);
    const currentX = dragX.get();
    const currentY = dragY.get();
    const targetX = Math.max(-xConstraint, Math.min(xConstraint, currentX));
    const targetY = Math.max(-yConstraint, Math.min(yConstraint, currentY));
    if (Math.abs(currentX - targetX) > 1 || Math.abs(currentY - targetY) > 1) {
      animateToPosition(targetX, targetY);
    }
  };

  const handleDrag = (event, info) => {
    if (!imageRef.current || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const xConstraint = Math.max(0, (scaledWidth - container.width) / 2);
    const yConstraint = Math.max(0, (scaledHeight - container.height) / 2);
    const resistance = 0.5;
    const applyResistance = (value, limit) => {
      const excess = Math.abs(value) - limit;
      if (excess <= 0) return value;
      const sign = Math.sign(value);
      return sign * (limit + excess * resistance);
    };
    const constrainedX = applyResistance(dragX.get(), xConstraint);
    const constrainedY = applyResistance(dragY.get(), yConstraint);
    dragX.set(constrainedX);
    dragY.set(constrainedY);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Media navigation functions
  const handleNextMedia = (e) => {
    e.stopPropagation();
    if (hasMultipleMedia) {
      setDirection(1);
      setCurrentMediaIndex((prev) => 
        prev === mediaItems.length - 1 ? 0 : prev + 1
      );
      // Reset image zoom when changing media
      setScale(1);
      dragX.set(0);
      dragY.set(0);
    }
  };

  const handlePrevMedia = (e) => {
    e.stopPropagation();
    if (hasMultipleMedia) {
      setDirection(-1);
      setCurrentMediaIndex((prev) => 
        prev === 0 ? mediaItems.length - 1 : prev - 1
      );
      // Reset image zoom when changing media
      setScale(1);
      dragX.set(0);
      dragY.set(0);
    }
  };

  // Swipe gesture handlers
  const handleSwipeStart = () => {
    setSwipeOffset(0);
    // Disable swipe if image is zoomed (let zoom/pan take priority)
    setIsSwipeEnabled(scale <= minScale);
  };

  const handleSwipe = (event, info) => {
    if (!isSwipeEnabled || !hasMultipleMedia) return;
    
    const offset = info.offset.x;
    setSwipeOffset(offset);
  };

  const handleSwipeEnd = (event, info) => {
    if (!isSwipeEnabled || !hasMultipleMedia) {
      setSwipeOffset(0);
      return;
    }

    const swipeThreshold = 100; // Minimum distance for a swipe
    const velocityThreshold = 500; // Minimum velocity for quick swipes
    
    const { offset, velocity } = info;
    const absOffset = Math.abs(offset.x);
    const absVelocity = Math.abs(velocity.x);

    // Determine if this is a valid swipe
    const isValidSwipe = absOffset > swipeThreshold || absVelocity > velocityThreshold;

    if (isValidSwipe) {
      if (offset.x > 0 && currentMediaIndex > 0) {
        // Swipe right - go to previous
        setDirection(-1);
        setCurrentMediaIndex(currentMediaIndex - 1);
        setScale(1);
        dragX.set(0);
        dragY.set(0);
      } else if (offset.x < 0 && currentMediaIndex < mediaItems.length - 1) {
        // Swipe left - go to next
        setDirection(1);
        setCurrentMediaIndex(currentMediaIndex + 1);
        setScale(1);
        dragX.set(0);
        dragY.set(0);
      }
    }

    // Reset swipe offset
    setSwipeOffset(0);
  };

  if (!isOpen) return null;
  if (!project) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center pt-24 pb-24 px-4 sm:pt-20 sm:pb-20 sm:px-6 lg:p-8"
        style={{ zIndex: Z_INDEX.MODALS }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-ink/90 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-6xl h-full max-h-[60vh] sm:max-h-[75vh] bg-sand rounded-2xl overflow-hidden mx-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-ink/10 hover:bg-ink/20 rounded-full text-ink hover:text-orange transition-all duration-200 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-full">
            <div className="p-4 sm:p-6 lg:p-8 pt-12 sm:pt-6 lg:pt-8">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-ink text-sand text-xs font-martian-mono tracking-wider rounded-full">
                    PROJECT
                  </span>
                  <span className="text-ink font-martian-mono text-sm">
                    {project.year}
                  </span>
                </div>
                <h1 className="font-display font-semibold uppercase text-2xl sm:text-3xl lg:text-4xl text-ink mb-4">
                  <GlitchText text={project.title} />
                </h1>
                <p className="font-martian-mono text-ink text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Enhanced Media Section with Navigation */}
              {mediaItems.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  {/* Media Navigation Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {/* Navigation Controls */}
                      {hasMultipleMedia && (
                        <>
                          <motion.button
                            onClick={handlePrevMedia}
                            className="p-2 sm:p-2 bg-ink/10 hover:bg-ink/20 rounded-lg text-ink hover:text-orange transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Previous media"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </motion.button>

                          {/* Media Counter */}
                          <div className="px-2 sm:px-3 py-1 bg-ink/10 rounded-full">
                            <span className="text-ink font-martian-mono text-xs sm:text-sm">
                              {currentMediaIndex + 1} / {mediaItems.length}
                            </span>
                          </div>

                          <motion.button
                            onClick={handleNextMedia}
                            className="p-2 sm:p-2 bg-ink/10 hover:bg-ink/20 rounded-lg text-ink hover:text-orange transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Next media"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </>
                      )}

                      {/* Media Type Indicator */}
                      <div className="px-2 sm:px-3 py-1 bg-ink/10 rounded-full">
                        <span className="text-ink font-martian-mono text-xs sm:text-sm capitalize">
                          {currentMedia?.type === 'video' ? (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8.5l-5-3v6l5-3z"/>
                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H4z" clipRule="evenodd"/>
                              </svg>
                              Video
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                              Image
                            </div>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Zoom Controls - Only show for images */}
                    {currentMedia?.type === 'image' && (
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={handleZoomOut}
                          disabled={scale <= minScale}
                          className="p-2 sm:p-2 bg-ink/10 hover:bg-ink/20 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg text-ink hover:text-orange transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Zoom out"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          onClick={handleZoomIn}
                          disabled={scale >= 2.5}
                          className="p-2 sm:p-2 bg-ink/10 hover:bg-ink/20 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg text-ink hover:text-orange transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Zoom in"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Media Display */}
                  <motion.div 
                    ref={containerRef}
                    className="relative aspect-video bg-ink/10 rounded-xl overflow-hidden select-none touch-pan-y"
                    drag={hasMultipleMedia ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    onDragStart={handleSwipeStart}
                    onDrag={handleSwipe}
                    onDragEnd={handleSwipeEnd}
                    style={{ x: swipeOffset * 0.1 }} // Subtle visual feedback during swipe
                  >
                    <AnimatePresence mode="wait" custom={direction}>
                      {currentMedia?.type === 'video' ? (
                        // Video Display with ModalVideoPlayer
                        <motion.div
                          key={`video-${currentMediaIndex}`}
                          className="w-full h-full"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                          }}
                        >
                          <ModalVideoPlayer 
                            videoData={{
                              url: getVideoUrl(currentMedia.videoId, currentMedia.videoType, currentMedia.videoHash),
                              title: currentMedia.title,
                              type: 'video'
                            }}
                            onPlayStateChange={(isPlaying) => {
                              // Handle play state change if needed
                              console.log('Video playing state:', isPlaying);
                            }}
                            allowClickToToggle={true}
                          />
                        </motion.div>
                      ) : (
                        // Image Display with Zoom
                        <motion.div
                          key={`image-${currentMediaIndex}`}
                          className="relative w-full h-full flex items-center justify-center"
                          style={{
                            x: dragX,
                            y: dragY,
                            cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default'),
                            scale: scale
                          }}
                          drag={scale > 1}
                          dragConstraints={calculateConstraints()}
                          dragElastic={0.1}
                          dragMomentum={false}
                          onDragStart={handleDragStart}
                          onDrag={handleDrag}
                          onDragEnd={handleDragEnd}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                          }}
                        >
                          <motion.img
                            ref={imageRef}
                            src={currentMedia.src}
                            alt={currentMedia.title}
                            className="max-w-full max-h-full object-contain rounded-lg pointer-events-none"
                            draggable={false}
                            onLoad={() => {
                              const newMinScale = calculateMinScale();
                              setMinScale(newMinScale);
                              if (scale < newMinScale) {
                                setScale(newMinScale);
                              }
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scroll Hint Notification - Only for images */}
                    {currentMedia?.type === 'image' && (
                      <AnimatePresence>
                        {showScrollHint && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ink/95 text-sand px-6 py-3 rounded-xl text-sm font-martian-mono tracking-wide shadow-xl backdrop-blur-md border border-sand/20 z-20"
                          >
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-sand/80">
                                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>Move cursor outside image to scroll modal</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>

                  {/* Progress Dots */}
                  {hasMultipleMedia && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <div className="flex gap-2">
                        {mediaItems.map((media, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentMediaIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              idx === currentMediaIndex ? 'bg-ink' : 'bg-ink/30'
                            }`}
                            aria-label={`Go to ${media.type} ${idx + 1}`}
                          />
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Roles */}
                {project.roles && project.roles.length > 0 && (
                  <div>
                    <h3 className="font-martian-mono font-bold text-lg tracking-wider text-ink mb-4 uppercase">
                      Roles
                    </h3>
                    <div className="space-y-2">
                      {project.roles.map((role, index) => (
                        <div key={index} className="font-martian-mono text-ink text-sm flex items-start">
                          <span className="mr-2 text-olive">•</span>
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h3 className="font-martian-mono font-bold text-lg tracking-wider text-ink mb-4 uppercase">
                      Technologies
                    </h3>
                    <div className="space-y-2">
                      {project.technologies.map((tech, index) => (
                        <div key={index} className="font-martian-mono text-ink text-sm flex items-start">
                          <span className="mr-2 text-olive">•</span>
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team */}
                {project.team && project.team.length > 0 && (
                  <div>
                    <h3 className="font-martian-mono font-bold text-lg tracking-wider text-ink mb-4 uppercase">
                      Team
                    </h3>
                    <div className="space-y-2">
                      {project.team.map((member, index) => (
                        <div key={index} className="font-martian-mono text-ink text-sm flex items-start">
                          <span className="mr-2 text-olive">•</span>
                          <span>{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {project.categories && project.categories.length > 0 && (
                  <div>
                    <h3 className="font-martian-mono font-bold text-lg tracking-wider text-ink mb-4 uppercase">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((category, index) => (
                        <span key={index} className="px-3 py-1 bg-ink/10 text-ink text-xs font-martian-mono tracking-wider rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="bg-ink/5 rounded-xl p-6">
                  <h3 className="font-martian-mono font-bold text-lg tracking-wider text-ink mb-6 uppercase">
                    Key Results
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="font-martian-mono text-ink text-sm leading-relaxed flex items-start"
                      >
                        <span className="mr-2 text-olive">•</span>
                        <span>{metric}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal; 