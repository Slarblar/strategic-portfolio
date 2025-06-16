import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import GlitchText from './GlitchText';
import { projectsData } from '../data/projectsData';

const VisualWorks = ({ media, visualArchives, id }) => {
  // Determine data source - prioritize passed props, then try to get from projectsData by id
  const getMediaData = () => {
    if (media) return media;
    if (visualArchives) return visualArchives;
    if (id && projectsData[id]?.visualArchives) return projectsData[id].visualArchives;
    return [];
  };

  const mediaData = getMediaData();
  
  // Early return if no data
  if (!mediaData || mediaData.length === 0) {
    return (
      <section className="w-full bg-sky rounded-2xl p-8 md:p-12 mb-32">
        <h2 className="font-display text-[40px] leading-none mb-16 text-ink">
          <GlitchText text="VISUAL WORKS" />
        </h2>
        <div className="text-center py-16">
          <p className="font-martian-mono text-lg text-ink/60">
            Visual archives coming soon...
          </p>
        </div>
      </section>
    );
  }

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [minScale, setMinScale] = useState(1);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [direction, setDirection] = useState(0);
  
  // Swipe functionality state
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const thumbnailVideoRefs = useRef({});
  const modalVideoRef = useRef(null);

  const [activeThumbnailVideoId, setActiveThumbnailVideoId] = useState(null);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  const [isModalVideoMuted, setIsModalVideoMuted] = useState(true);

  const sendPlayerCommand = (iframeRef, command, value) => {
    if (iframeRef?.contentWindow) {
      const message = value !== undefined ? { method: command, value: value } : { method: command };
      iframeRef.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  // Helper function to determine video type and format URL
  const getVideoUrl = (item, isModal = false) => {
    const url = item.url;
    
    // Check if it's a Gumlet URL
    if (url.includes('play.gumlet.io')) {
      // Extract video ID from Gumlet URL
      const gumletId = url.split('/embed/')[1]?.split('?')[0];
      if (isModal) {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=false&background=false&disable_player_controls=false`;
      } else {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=true&background=true&disable_player_controls=true`;
      }
    }
    
    // Default Vimeo handling
    if (isModal) {
      return `${url}&autoplay=0&muted=0`;
    } else {
      return `${url}&background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`;
    }
  };

  useEffect(() => {
    if (selectedMedia?.type === 'video') {
      setIsModalVideoPlaying(false);
      setIsModalVideoMuted(true);
      if (modalVideoRef.current) {
        sendPlayerCommand(modalVideoRef.current, 'pause');
        sendPlayerCommand(modalVideoRef.current, 'setVolume', 0);
      }
    }
    if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
      sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      setActiveThumbnailVideoId(null);
    }
  }, [selectedMedia]);

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleModalVideoTogglePlay = () => {
    if (!modalVideoRef.current) return;
    if (isModalVideoPlaying) {
      sendPlayerCommand(modalVideoRef.current, 'pause');
    } else {
      sendPlayerCommand(modalVideoRef.current, 'play');
      if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
        sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
        setActiveThumbnailVideoId(null);
      }
    }
    setIsModalVideoPlaying(!isModalVideoPlaying);
  };

  const handleModalVideoToggleMute = () => {
    if (!modalVideoRef.current) return;
    sendPlayerCommand(modalVideoRef.current, 'setMuted', !isModalVideoMuted);
    setIsModalVideoMuted(!isModalVideoMuted);
  };

  const handleThumbnailVideoTogglePlay = (itemId) => {
    const targetRef = thumbnailVideoRefs.current[itemId];
    if (!targetRef) return;

    if (activeThumbnailVideoId === itemId) {
      sendPlayerCommand(targetRef, 'pause');
      setActiveThumbnailVideoId(null);
    } else {
      if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
        sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      }
      sendPlayerCommand(targetRef, 'play');
      setActiveThumbnailVideoId(itemId);

      if (isModalVideoPlaying && modalVideoRef.current) {
        sendPlayerCommand(modalVideoRef.current, 'pause');
        setIsModalVideoPlaying(false);
      }
    }
  };

  const handleMediaClick = (mediaItem) => {
    if (isModalVideoPlaying && modalVideoRef.current) {
        sendPlayerCommand(modalVideoRef.current, 'pause');
    }
    setSelectedMedia(mediaItem);
    setCurrentImageIndex(0);
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
    setScale(1); // Start at 100% - no initial zoom
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (selectedMedia?.images?.length > 1) {
      setDirection(1);
      setCurrentImageIndex((prev) => 
        prev === selectedMedia.images.length - 1 ? 0 : prev + 1
      );
      resetZoomAndPosition();
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (selectedMedia?.images?.length > 1) {
      setDirection(-1);
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedMedia.images.length - 1 : prev - 1
      );
      resetZoomAndPosition();
    }
  };

  const resetZoomAndPosition = () => {
    setScale(1); // Reset to 100% - no zoom
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
  };

  // Swipe gesture handlers
  const handleSwipeStart = () => {
    setSwipeOffset(0);
    // Disable swipe if image is zoomed (let zoom/pan take priority)
    setIsSwipeEnabled(scale <= minScale);
  };

  const handleSwipe = (event, info) => {
    if (!isSwipeEnabled || !selectedMedia?.images || selectedMedia.images.length <= 1) return;
    
    const offset = info.offset.x;
    setSwipeOffset(offset);
  };

  const handleSwipeEnd = (event, info) => {
    if (!isSwipeEnabled || !selectedMedia?.images || selectedMedia.images.length <= 1) {
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
      if (offset.x > 0 && currentImageIndex > 0) {
        // Swipe right - go to previous
        setDirection(-1);
        setCurrentImageIndex(currentImageIndex - 1);
        resetZoomAndPosition();
      } else if (offset.x < 0 && currentImageIndex < selectedMedia.images.length - 1) {
        // Swipe left - go to next
        setDirection(1);
        setCurrentImageIndex(currentImageIndex + 1);
        resetZoomAndPosition();
      }
    }

    // Reset swipe offset
    setSwipeOffset(0);
  };

  const calculateMinScale = () => {
    if (!imageRef.current || !containerRef.current) return 1;
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const widthRatio = container.width / image.width;
    const heightRatio = container.height / image.height;
    return Math.min(widthRatio, heightRatio, 1); // Never go below fit scale or 100%
  };

  const closeModal = () => {
    if (isModalVideoPlaying && modalVideoRef.current) {
      sendPlayerCommand(modalVideoRef.current, 'pause');
    }
    setIsModalVideoPlaying(false);

    if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
      sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
    }
    setActiveThumbnailVideoId(null);

    setSelectedMedia(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
    
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };

  const calculateCenterPosition = () => {
    if (!imageRef.current || !containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    const newWidth = image.width * scale;
    const newHeight = image.height * scale;
    const xOffset = (newWidth - container.width) / 2;
    const yOffset = (newHeight - container.height) / 2;
    return {
      x: xOffset > 0 ? dragX.get() : 0,
      y: yOffset > 0 ? dragY.get() : 0
    };
  };

  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.25, 2.5);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, minScale);
      if (newScale === minScale) {
        animateToPosition(0, 0);
      }
      return newScale;
    });
  };

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.25; // Normalize wheel delta
    const newScale = Math.max(Math.min(scale + delta, 2.5), minScale);
    
    // If we're zooming to minimum scale, center the image
    if (newScale === minScale) {
      animateToPosition(0, 0);
    }
    
    setScale(newScale);
  };

  // Smooth animation to position
  const animateToPosition = (x, y) => {
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
  };

  // Add optimized pinch-to-zoom functionality for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !selectedMedia || selectedMedia.type === 'video') return;

    let lastTouchDistance = 0;
    let lastScale = 1;
    let isGesture = false;

    const getTouchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistance = getTouchDistance(e.touches);
        lastScale = scale;
        isGesture = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isGesture) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        
        if (lastTouchDistance > 0) {
          // Calculate scale change with smoothing and smaller increments
          const scaleChange = currentDistance / lastTouchDistance;
          const smoothedScaleChange = 1 + (scaleChange - 1) * 0.5; // Reduce sensitivity by 50%
          
          // Apply incremental scaling from current scale, not initial
          const newScale = Math.max(Math.min(lastScale * smoothedScaleChange, 2.5), minScale);
          
          // Reset position when at minimum scale
          if (newScale === minScale) {
            animateToPosition(0, 0);
          }
          
          setScale(newScale);
          
          // Update last values for next iteration
          lastTouchDistance = currentDistance;
          lastScale = newScale;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastTouchDistance = 0;
        lastScale = scale;
        isGesture = false;
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
  }, [scale, minScale, selectedMedia, animateToPosition]);

  const calculateConstraints = () => {
    if (!imageRef.current || !containerRef.current) return { top: 0, bottom: 0, left: 0, right: 0 };

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    
    // Calculate constraints based on scaled dimensions
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    
    // Calculate the maximum allowed movement in each direction
    const xConstraint = Math.max(0, (scaledWidth - container.width) / 2);
    const yConstraint = Math.max(0, (scaledHeight - container.height) / 2);

    // Add buffer for smoother edge behavior
    const buffer = scale === 2.5 ? 100 : 50; // Adjusted buffer for max zoom

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

    const currentX = dragX.get();
    const currentY = dragY.get();

    // Add resistance when approaching boundaries
    const applyResistance = (value, limit) => {
      const overflow = Math.abs(value) - limit;
      if (overflow <= 0) return value;
      const resistance = 0.5; // Adjust this value to change resistance strength
      return Math.sign(value) * (limit + overflow * resistance);
    };

    // Apply resistance near boundaries
    if (Math.abs(currentX) > xConstraint) {
      dragX.set(applyResistance(currentX, xConstraint));
    }
    if (Math.abs(currentY) > yConstraint) {
      dragY.set(applyResistance(currentY, yConstraint));
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const slideTransition = {
    type: "tween",
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1]
  };

  return (
    <>
      <section className="w-full bg-sky rounded-2xl p-8 md:p-12 mb-32">
      <h2 className="font-display text-[40px] leading-none mb-16 text-ink">
        <GlitchText text="VISUAL WORKS" />
      </h2>

      {/* Media Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 pb-16 relative">
        {mediaData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8,
              delay: index * 0.2,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className="group"
          >
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: (index * 0.2) + 0.3
              }}
              className="font-martian-mono text-xl tracking-wider mb-6 text-ink"
            >
              <GlitchText text={item.title} />
            </motion.h3>

            <motion.div 
              className="relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl bg-ink/10"
              onClick={() => handleMediaClick(item)}
              whileHover={{ scale: 1.02 }}
              transition={{
                scale: {
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }
              }}
            >
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <iframe
                    ref={el => thumbnailVideoRefs.current[item.id] = el}
                    src={getVideoUrl(item, false)}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    allowFullScreen
                  />
                  <div className="absolute bottom-6 right-6 z-20">
                    <button
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleThumbnailVideoTogglePlay(item.id); 
                      }}
                      className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-white hover:text-orange transition-colors duration-200"
                    >
                      {activeThumbnailVideoId === item.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={item.images ? 
                    item.images.find(img => img.toLowerCase().includes('thumbnail')) || item.images[0]
                    : item.url}
                  alt={item.description || `Design work ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-ink/90 backdrop-blur-sm p-6"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <p className="font-martian-mono text-[14px] text-sand leading-relaxed">{item.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 bg-ink bg-opacity-95 flex items-center justify-center z-[999999] p-2 sm:p-4 md:p-8 pt-20 sm:pt-24 pb-20 sm:pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-[90vw] h-[75vh] max-w-5xl max-h-[75vh] bg-sky rounded-lg sm:rounded-xl overflow-hidden shadow-2xl flex flex-col"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
                            {/* Header with controls */}
              <div className="flex flex-col gap-3 p-3 sm:p-4 border-b border-ink/10">
                {/* Top Row: Title and Close Button */}
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg sm:text-xl text-ink truncate max-w-[70%]">
                    {selectedMedia.title}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 sm:p-2 bg-ink/5 hover:bg-ink/10 rounded-lg text-ink hover:text-orange transition-all duration-200 touch-manipulation"
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Row: Navigation and Zoom Controls */}
                <div className="flex items-center justify-between">
                  {/* Navigation Controls */}
                  <div className="flex items-center gap-2">
                    {selectedMedia.images && selectedMedia.images.length > 1 && (
                      <>
                        <motion.button
                          onClick={handlePrevImage}
                          className="bg-ink/5 hover:bg-ink/10 text-ink hover:text-orange p-2 rounded-lg transition-colors duration-200 touch-manipulation"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Previous image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </motion.button>

                        <div className="px-2 sm:px-3 py-1 bg-ink/5 rounded-full">
                          <span className="text-ink font-martian-mono text-xs sm:text-sm">
                            {currentImageIndex + 1} / {selectedMedia.images.length}
                          </span>
                        </div>

                        <motion.button
                          onClick={handleNextImage}
                          className="bg-ink/5 hover:bg-ink/10 text-ink hover:text-orange p-2 rounded-lg transition-colors duration-200 touch-manipulation"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Next image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Zoom Controls */}
                  {selectedMedia.type !== 'video' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        disabled={scale <= minScale}
                        className="p-2 bg-ink/5 hover:bg-ink/10 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg text-ink hover:text-orange transition-colors duration-200 touch-manipulation"
                        aria-label="Zoom out"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleZoomIn}
                        disabled={scale >= 2.5}
                        className="p-2 bg-ink/5 hover:bg-ink/10 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg text-ink hover:text-orange transition-colors duration-200 touch-manipulation"
                        aria-label="Zoom in"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Container */}
              <motion.div 
                ref={containerRef}
                className="flex-1 flex items-center justify-center overflow-hidden min-h-0 relative bg-ink/5 p-2 sm:p-4 touch-pan-y"
                onWheel={selectedMedia.type !== 'video' ? handleWheel : undefined}
                drag={selectedMedia?.images && selectedMedia.images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                dragMomentum={false}
                onDragStart={handleSwipeStart}
                onDrag={handleSwipe}
                onDragEnd={handleSwipeEnd}
                style={{ x: swipeOffset * 0.1 }} // Subtle visual feedback during swipe
              >
                {selectedMedia.type === 'video' ? (
                  <div className="relative w-full h-full max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] aspect-video">
                    <iframe
                      ref={modalVideoRef}
                      src={getVideoUrl(selectedMedia, true)}
                      className="w-full h-full rounded-lg sm:rounded-xl shadow-lg"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      allowFullScreen
                    />
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex gap-2 sm:gap-4">
                      <button
                        onClick={handleModalVideoTogglePlay}
                        className="p-2 sm:p-3 bg-ink bg-opacity-70 hover:bg-opacity-90 rounded-full text-sand hover:text-orange transition-colors duration-200 backdrop-blur-sm touch-manipulation"
                        aria-label={isModalVideoPlaying ? "Pause video" : "Play video"}
                      >
                        {isModalVideoPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={handleModalVideoToggleMute}
                        className="p-2 sm:p-3 bg-ink bg-opacity-70 hover:bg-opacity-90 rounded-full text-sand hover:text-orange transition-colors duration-200 backdrop-blur-sm touch-manipulation"
                        aria-label={isModalVideoMuted ? "Unmute video" : "Mute video"}
                      >
                        {isModalVideoMuted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Image Display */}
                    <motion.div
                      className="relative w-full h-full flex items-center justify-center select-none"
                      style={{
                        x: dragX,
                        y: dragY,
                        scale: scale,
                        cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default')
                      }}
                      drag={scale > 1}
                      dragConstraints={calculateConstraints()}
                      dragElastic={0.05}
                      dragMomentum={true}
                      whileDrag={{ scale: scale * 0.98 }}
                      onDragStart={handleDragStart}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                      transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 300,
                        mass: 0.8
                      }}
                    >
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.img
                          key={currentImageIndex}
                          ref={imageRef}
                          src={selectedMedia.images ? selectedMedia.images[currentImageIndex] : selectedMedia.url}
                          alt={selectedMedia.description || 'Design work'}
                          className="max-w-full max-h-[50vh] w-auto h-auto object-contain select-none bg-transparent rounded-xl"
                          draggable={false}
                          style={{ 
                            cursor: isDragging ? 'grabbing' : 'grab',
                            touchAction: 'none'
                          }}
                          custom={direction}
                          variants={{
                            enter: (direction) => ({
                              x: direction > 0 ? '100%' : '-100%',
                            }),
                            center: {
                              x: 0,
                            },
                            exit: (direction) => ({
                              x: direction < 0 ? '100%' : '-100%',
                            })
                          }}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={slideTransition}
                          onLoad={() => {
                            const newMinScale = calculateMinScale();
                            setMinScale(newMinScale);
                          }}
                        />
                      </AnimatePresence>
                    </motion.div>


                  </>
                )}
              </motion.div>

              {/* Footer with description */}
              <div className="p-3 sm:p-4 border-t border-ink/10">
                <p className="font-martian-mono text-xs sm:text-sm text-ink/80 leading-relaxed">
                  {selectedMedia.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>
    </>
  );
};

export default VisualWorks; 