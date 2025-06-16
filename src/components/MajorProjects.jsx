import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import GlitchText from './GlitchText';
import ModalVideoPlayer from './ModalVideoPlayer';

const MajorProjects = ({ 
  media = [],
  title = "MAJOR WORKS",
  backgroundColor = "bg-[#6e8c03]",
  textColor = "text-sand"
}) => {
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

  const [activeThumbnailVideoId, setActiveThumbnailVideoId] = useState(null);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);

  // Normalize data to ensure consistent field names
  const normalizedData = media.map((item, index) => ({
    id: item.id || `item-${index}`,
    type: item.type || 'image',
    url: item.url || item.src || item.videoSrc || '',
    title: item.title || `Item ${index + 1}`,
    description: item.description || '',
    images: item.images || (item.type !== 'video' ? [item.url || item.src] : undefined)
  }));

  const sendPlayerCommand = (iframeRef, command, value) => {
    if (iframeRef?.contentWindow) {
      const message = value !== undefined ? { method: command, value: value } : { method: command };
      console.log('Sending command:', command, 'with value:', value);
      iframeRef.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  const getVideoUrl = (item, isModal = false) => {
    const url = item.url;
    
    // Check if it's a Gumlet URL
    if (url.includes('play.gumlet.io')) {
      // Extract video ID from Gumlet URL
      const gumletId = url.split('/embed/')[1]?.split('?')[0];
      if (isModal) {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=false&background=false&disable_player_controls=false&muted=true`;
      } else {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=true&background=true&disable_player_controls=true&muted=true`;
      }
    }
    
    // Fallback for any remaining Vimeo URLs
    if (isModal) {
      return `${url}&autoplay=0&controls=0&title=0&byline=0&portrait=0&muted=1&api=1`;
    } else {
      return `${url}&background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`;
    }
  };

  useEffect(() => {
    if (selectedMedia?.type === 'video') {
      setIsModalVideoPlaying(false);
    }
    // When a modal opens/changes, pause any active thumbnail video.
    if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
      sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      setActiveThumbnailVideoId(null);
    }
  }, [selectedMedia]);

  const handleThumbnailVideoTogglePlay = (itemId) => {
    const targetRef = thumbnailVideoRefs.current[itemId];
    if (!targetRef) return;

    if (activeThumbnailVideoId === itemId) { // If it's already active, pause it
      sendPlayerCommand(targetRef, 'pause');
      setActiveThumbnailVideoId(null);
    } else { // Otherwise, play it and pause others
      // Pause the previously active thumbnail video, if any
      if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
        sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      }
      sendPlayerCommand(targetRef, 'play');
      setActiveThumbnailVideoId(itemId);

      // Reset modal video playing state
      if (isModalVideoPlaying) {
        setIsModalVideoPlaying(false);
      }
    }
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setCurrentImageIndex(0);
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
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
    setScale(1);
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

  // Calculate minimum scale to fit image
  const calculateMinScale = () => {
    if (!imageRef.current || !containerRef.current) return 1;

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();

    const widthRatio = container.width / image.width;
    const heightRatio = container.height / image.height;

    return Math.min(widthRatio, heightRatio);
  };

  const closeModal = () => {
    setIsModalVideoPlaying(false); // Reset modal play state

    if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
      sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
    }
    setActiveThumbnailVideoId(null); // Reset thumbnail play state

    setSelectedMedia(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
  };

  // Calculate the center position based on current image and container dimensions
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
      const newScale = Math.min(prev + 0.25, 2.5); // Max zoom 250%
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, minScale);
      // If we're zooming to minimum scale, center the image
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

  // Enhanced drag constraints calculation
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

  // Enhanced drag end handler
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

    // Calculate target positions with smooth bounce back
    const targetX = Math.max(-xConstraint, Math.min(xConstraint, currentX));
    const targetY = Math.max(-yConstraint, Math.min(yConstraint, currentY));

    // Animate to target position if out of bounds
    if (targetX !== currentX || targetY !== currentY) {
      animateToPosition(targetX, targetY);
    }

    // Reset to center if at minimum scale
    if (scale === minScale) {
      animateToPosition(0, 0);
    }
  };

  // Handle drag update for live boundary checking
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

  // Update position when scale changes
  useEffect(() => {
    const newPosition = calculateCenterPosition();
    setPosition(newPosition);
  }, [scale]);

  // Calculate and set minimum scale when image loads
  useEffect(() => {
    if (selectedMedia && imageRef.current) {
      const newMinScale = calculateMinScale();
      setMinScale(1);
      setScale(1);
      dragX.set(0);
      dragY.set(0);
    }
  }, [selectedMedia]);

  // Manage body scroll lock and nav visibility
  useEffect(() => {
    if (selectedMedia) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Hide navigation elements
      const navElements = document.querySelectorAll('nav');
      navElements.forEach(nav => {
        nav.style.display = 'none';
      });
      
      return () => {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
        
        // Show navigation elements again
        const navElements = document.querySelectorAll('nav');
        navElements.forEach(nav => {
          nav.style.display = '';
        });
      };
    }
  }, [selectedMedia]);

  // Animation variants for image transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
    })
  };

  // Smoother spring transition
  const slideTransition = {
    type: "tween",
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1]
  };

      return (
      <section className={`w-full ${backgroundColor} rounded-2xl p-8 md:p-12 mb-32`}>
        <h2 className={`font-display text-[40px] leading-none mb-16 ${textColor}`}>
          <GlitchText text={title} />
        </h2>

      {/* Media Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 pb-16 relative">
        {normalizedData.map((item, index) => (
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
            {/* Title */}
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: (index * 0.2) + 0.3
              }}
                              className={`font-martian-mono text-xl tracking-wider mb-6 ${textColor}`}
            >
              <GlitchText text={item.title} />
            </motion.h3>

            {/* Media Container - Thumbnail always 16:9 */}
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
                    src={getVideoUrl(item, false)} // background video for thumbnail
                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" // autoplay still needed in allow for postMessage to work
                    allowFullScreen
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailVideoTogglePlay(item.id);
                    }}
                  />
                  <div className="absolute bottom-6 right-6 z-20">
                    {/* This button now controls the THUMBNAIL video */}
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); // Prevent card click if button is for in-place play
                        handleThumbnailVideoTogglePlay(item.id); 
                      }}
                      className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-sand hover:text-orange transition-colors duration-200"
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
                  {/* Optional: Mute/Unmute for thumbnail if needed, but currently hardcoded to muted=1 */}
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
              
              {/* Description Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-ink/90 backdrop-blur-sm p-6"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <p className="font-martian-mono text-[14px] text-ink leading-relaxed">{item.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Modal for enlarged view */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-ink/95 backdrop-blur-md px-2 py-4 sm:px-4 sm:py-8 md:px-8 md:py-12"
            onClick={closeModal}
          >
            <motion.div 
              className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[1200px] rounded-xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <div className="flex flex-col lg:flex-row gap-6 bg-ink/80 backdrop-blur-sm rounded-xl p-6 pt-12 relative">
                  {/* Mobile X Button - Positioned in top-right corner within container bounds */}
                  <motion.button
                    onClick={closeModal}
                    className="absolute top-2 right-2 z-[999] md:hidden bg-ink/90 backdrop-blur-md rounded-full p-2 text-sand/60 hover:text-orange hover:bg-ink transition-all duration-300 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close modal"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>

                  {/* Video Container - Using clean new component */}
                  <div className="flex-shrink-0 lg:w-2/3">
                    <ModalVideoPlayer 
                      videoData={selectedMedia}
                      onPlayStateChange={(isPlaying) => setIsModalVideoPlaying(isPlaying)}
                      allowClickToToggle={true}
                    />
                  </div>

                  {/* Text Container - Scrollable */}
                  <div className="flex-1 lg:w-1/3">
                    <div className="h-full flex flex-col">
                      <h3 className="font-martian-mono text-lg md:text-xl text-sand mb-4 font-semibold">
                        {selectedMedia.title}
                      </h3>
                      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar max-h-[40vh] lg:max-h-[50vh]">
                        <div className="space-y-4">
                          {selectedMedia.description.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="font-martian-mono text-xs sm:text-sm text-sand/90 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile Controls - Top Bar */}
                  <div className="md:hidden flex items-center justify-between mb-4 px-2">
                    <div className="font-martian-mono text-sm text-sand/60 bg-ink/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {Math.round(scale * 100)}%
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                        onClick={handleZoomOut}
                        whileTap={{ scale: 0.95 }}
                        disabled={scale <= minScale}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                        onClick={handleZoomIn}
                        whileTap={{ scale: 0.95 }}
                        disabled={scale >= 2.5}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                        onClick={closeModal}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Image Navigation Container - Optimized for all devices */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {selectedMedia.images?.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <motion.button
                          className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-200"
                          onClick={handlePrevImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </motion.button>

                        {/* Image Counter & Swipe Hint */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-ink/80 text-sand/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm font-martian-mono text-sm min-w-[70px] sm:min-w-[80px] text-center">
                            {currentImageIndex + 1} / {selectedMedia.images.length}
                          </div>
                          
                          {/* Swipe Hint - Mobile Only */}
                          <div className="md:hidden bg-ink/80 text-sand/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            <span className="font-martian-mono text-[0.65rem] flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                              </svg>
                              swipe
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Next Button */}
                        <motion.button
                          className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-200"
                          onClick={handleNextImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Image container - Optimized for touch and mouse interactions */}
                  <motion.div 
                    ref={containerRef}
                    className="relative w-full overflow-hidden rounded-xl bg-ink/20 touch-pan-y"
                    style={{ 
                      maxHeight: 'calc(var(--vh, 1vh) * 60)',
                      minHeight: '250px',
                      height: 'auto',
                      x: swipeOffset * 0.1
                    }}
                    onWheel={handleWheel}
                    drag={selectedMedia?.images && selectedMedia.images.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    onDragStart={handleSwipeStart}
                    onDrag={handleSwipe}
                    onDragEnd={handleSwipeEnd}
                  >
                    <AnimatePresence 
                      initial={false} 
                      custom={direction} 
                      mode="wait"
                    >
                      <motion.div
                        key={currentImageIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={slideTransition}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <motion.img
                          ref={imageRef}
                          src={selectedMedia.images[currentImageIndex]}
                          alt={selectedMedia.description || 'Enlarged view'}
                          className="max-w-full max-h-[60vh] w-auto h-auto object-contain select-none bg-transparent rounded-xl"
                          style={{ 
                            cursor: isDragging ? 'grabbing' : 'grab',
                            x: dragX,
                            y: dragY,
                            scale: scale,
                            touchAction: 'none'
                          }}
                          initial={{ scale: 1 }}
                          drag
                          dragConstraints={calculateConstraints()}
                          dragElastic={0.1}
                          dragTransition={{
                            bounceStiffness: 300,
                            bounceDamping: 50,
                            power: 0.3
                          }}
                          onDragStart={handleDragStart}
                          onDrag={handleDrag}
                          onDragEnd={handleDragEnd}
                          transition={{ 
                            scale: {
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              mass: 0.5
                            }
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Touch instructions - Only show on touch devices */}
                    <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none md:hidden">
                      <div className="inline-block bg-ink/80 backdrop-blur-sm rounded-full px-4 py-2">
                        <p className="font-martian-mono text-xs text-sand/60">
                          Pinch to zoom • Double tap to reset
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description box - Responsive padding and text size */}
                  <motion.div 
                    className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[1000px] bg-ink/80 backdrop-blur-sm rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 mt-4 sm:mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-martian-mono text-base sm:text-lg md:text-xl text-sand mb-2 sm:mb-3">
                      {selectedMedia.title}
                    </h3>
                    <div className="max-h-[120px] sm:max-h-[150px] overflow-y-auto pr-4 custom-scrollbar">
                      <p className="font-martian-mono text-xs sm:text-sm text-sand/80 leading-relaxed">
                        {selectedMedia.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Desktop controls - Hidden on mobile */}
                  <div className="hidden md:flex absolute -right-16 top-1/2 transform -translate-y-1/2 flex-col gap-4">
                    <motion.button
                      className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all duration-200"
                      onClick={handleZoomIn}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={scale >= 2.5}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.button>
                    <motion.button
                      className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all duration-200"
                      onClick={handleZoomOut}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={scale <= minScale}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Desktop close button - Hidden on mobile */}
                  <motion.button
                    className="absolute -right-16 -top-2 bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all duration-200 hidden md:block"
                    onClick={closeModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MajorProjects; 