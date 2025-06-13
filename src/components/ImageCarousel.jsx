import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

const ImageCarousel = ({ images, id, onLoad }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Handle image transition
  const transitionToNextImage = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  // Timer management
  useEffect(() => {
    if (!images?.length) return;

    if (isVisible) {
      timerRef.current = setInterval(transitionToNextImage, 10000);
      return () => clearInterval(timerRef.current);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [images, isVisible]);

  // Track loaded images
  const handleImageLoad = (index) => {
    setImagesLoaded(prev => {
      const newState = { ...prev, [index]: true };
      // If this is the first image loading, call onLoad
      if (index === 0 && !prev[0] && onLoad) {
        onLoad();
      }
      return newState;
    });
  };

  if (!images?.length) {
    return (
      <div className="relative aspect-[16/9] bg-ink/10 rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-sand/60 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      className="relative aspect-[16/9] bg-ink/10 rounded-xl overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <OptimizedImage
            src={images[activeIndex]}
            alt={`Slide ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onLoadingComplete={() => handleImageLoad(activeIndex)}
            priority={activeIndex === 0} // Load first image with priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Loading indicator */}
          <AnimatePresence>
            {!imagesLoaded[activeIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-ink/20"
              >
                <div className="w-6 h-6 border-2 border-sand border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-none transition-colors duration-300 ${
              idx === activeIndex ? 'bg-sky' : 'bg-ink/20'
            }`}
          />
        ))}
      </div>

      {/* Preload next image */}
      <div className="hidden">
        <OptimizedImage
          src={images[(activeIndex + 1) % images.length]}
          alt="Preload next"
          onLoadingComplete={() => handleImageLoad((activeIndex + 1) % images.length)}
        />
      </div>
    </div>
  );
};

export default ImageCarousel; 