import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import GlitchText from './GlitchText';

const VisualArchives = ({ media }) => {
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

  // Reset state when media changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    dragX.set(0);
    dragY.set(0);
  }, [selectedMedia]);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
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

  // Add pinch-to-zoom functionality for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !selectedMedia) return;

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
          animateToPosition(0, 0);
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
  }, [scale, minScale, selectedMedia, animateToPosition]);

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
    <section className="w-full bg-[#acc3f2] rounded-2xl p-8 md:p-12 mb-32">
      <h2 className="font-display text-[40px] leading-none mb-16 text-ink">
        <GlitchText text="VISUAL WORKS" />
      </h2>

      {/* Media Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 pb-16 relative">
        {media.map((item, index) => (
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
              className="font-martian-mono text-xl tracking-wider mb-6 text-ink"
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
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={item.images ? 
                    // Look for thumbnail in image array
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
                <p className="font-martian-mono text-[14px] text-sand leading-relaxed">{item.description}</p>
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
              className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[1000px] rounded-xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  className="w-full rounded-xl"
                  controls
                  autoPlay
                />
              ) : (
                <>
                  {/* Mobile Controls - Top Bar */}
                  <div className="md:hidden flex items-center justify-between mb-4 px-2">
                    <div className="font-martian-mono text-sm text-sand/60 bg-ink/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {Math.round(scale * 100)}%
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all"
                        onClick={handleZoomOut}
                        whileTap={{ scale: 0.95 }}
                        disabled={scale <= minScale}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all"
                        onClick={handleZoomIn}
                        whileTap={{ scale: 0.95 }}
                        disabled={scale >= 2.5}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                      <motion.button
                        className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2 rounded-full backdrop-blur-sm transition-all"
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
                          className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all"
                          onClick={handlePrevImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </motion.button>

                        {/* Image Counter */}
                        <div className="bg-ink/80 text-sand/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm font-martian-mono text-sm min-w-[70px] sm:min-w-[80px] text-center">
                          {currentImageIndex + 1} / {selectedMedia.images.length}
                        </div>

                        {/* Next Button */}
                        <motion.button
                          className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-2.5 sm:p-3 rounded-full backdrop-blur-sm transition-all"
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
                  <div 
                    ref={containerRef}
                    className="relative w-full overflow-hidden rounded-xl bg-ink/20"
                    style={{ 
                      maxHeight: 'calc(var(--vh, 1vh) * 60)',
                      minHeight: '250px',
                      height: 'auto'
                    }}
                    onWheel={handleWheel}
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
                  </div>

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
                    <p className="font-martian-mono text-xs sm:text-sm text-sand/80 leading-relaxed max-h-[60px] sm:max-h-[90px] overflow-y-auto pr-2">
                      {selectedMedia.description}
                    </p>
                  </motion.div>

                  {/* Desktop controls - Hidden on mobile */}
                  <div className="hidden md:flex absolute -right-16 top-1/2 transform -translate-y-1/2 flex-col gap-4">
                    <motion.button
                      className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all"
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
                      className="bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all"
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
                    className="absolute -right-16 -top-2 bg-ink/80 hover:bg-ink/90 text-sand/60 hover:text-orange p-3 rounded-full backdrop-blur-sm transition-all hidden md:block"
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

export default VisualArchives; 