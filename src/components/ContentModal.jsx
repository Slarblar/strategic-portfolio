import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import useScrollLock from '../hooks/useScrollLock';
import OptimizedImage from './OptimizedImage';
import ModalVideoPlayer from './ModalVideoPlayer';

const ContentModal = ({ isOpen, onClose, project, currentImageIndex = 0, onImageChange, totalImages = 1 }) => {
  const { lockScroll, unlockScroll } = useScrollLock();
  
  // Local state for image index if not controlled externally
  const [localImageIndex, setLocalImageIndex] = useState(0);
  const activeImageIndex = onImageChange ? currentImageIndex : localImageIndex;
  
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset zoom when image changes or modal opens
  const resetZoom = useCallback(() => {
    setScale(1);
    dragX.set(0);
    dragY.set(0);
    setImageLoaded(false);
  }, [dragX, dragY]);

  useEffect(() => {
    resetZoom();
  }, [activeImageIndex, resetZoom]);

  useEffect(() => {
    if (isOpen && project) {
      lockScroll();
      setLocalImageIndex(0);
      resetZoom();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen, project, lockScroll, unlockScroll, resetZoom]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleImageChange = (newIndex) => {
    let loopedIndex = newIndex;
    if (newIndex >= totalImages) {
      loopedIndex = 0;
    } else if (newIndex < 0) {
      loopedIndex = totalImages - 1;
    }
    
    if (onImageChange) {
      onImageChange(loopedIndex);
    } else {
      setLocalImageIndex(loopedIndex);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && totalImages > 1) {
      handleImageChange(activeImageIndex - 1);
    } else if (e.key === 'ArrowRight' && totalImages > 1) {
      handleImageChange(activeImageIndex + 1);
    }
  }, [activeImageIndex, totalImages, onClose]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.4, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev / 1.4, 1);
      if (newScale <= 1.1) {
        dragX.set(0);
        dragY.set(0);
        return 1;
      }
      return newScale;
    });
  }, [dragX, dragY]);

  const handleZoomReset = useCallback(() => {
    setScale(1);
    dragX.set(0);
    dragY.set(0);
  }, [dragX, dragY]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY;
    if (delta > 0) {
      handleZoomOut();
    } else {
      handleZoomIn();
    }
  }, [handleZoomIn, handleZoomOut]);

  // Keyboard event listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !project) return null;

  const currentImage = project.images?.[activeImageIndex] || project.images?.[0];
  const hasMultipleImages = totalImages > 1;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative w-[95vw] h-[90vh] max-w-[1400px] bg-ink rounded-2xl shadow-2xl border border-sand/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-ink/95 backdrop-blur-sm border-b border-sand/20 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-sand truncate pr-4">
                {project.title}
              </h2>
              
              <div className="flex items-center gap-4">
                {/* Image Counter */}
                {hasMultipleImages && !project?.videoUrl && (
                  <span className="hidden lg:inline-block font-martian-mono text-sm text-sand/70">
                    {activeImageIndex + 1} / {totalImages}
                  </span>
                )}
                
                {/* Zoom Controls */}
                {!project?.videoUrl && (
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={handleZoomOut}
                      disabled={scale <= 1}
                      className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                      −
                    </button>
                    <span className="font-martian-mono text-xs text-sand/70 min-w-[3rem] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={scale >= 4}
                      className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    >
                      +
                    </button>
                    {scale > 1 && (
                      <button
                        onClick={handleZoomReset}
                        className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                          <path d="M3 21v-5h5"/>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {hasMultipleImages && !project?.videoUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleImageChange(activeImageIndex - 1)}
                      className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => handleImageChange(activeImageIndex + 1)}
                      className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200"
                    >
                      ›
                    </button>
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 bg-sand/10 hover:bg-sand/20 text-sand rounded-lg transition-all duration-200 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row h-full pt-20">
            {/* LEFT: Media Area */}
            <div 
              ref={containerRef}
              className="w-full lg:w-[65%] h-[45vh] lg:h-full bg-ink/5 border-r border-sand/20 relative overflow-hidden"
              onWheel={handleWheel}
              style={{ cursor: scale > 1 ? 'grab' : 'default' }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-6">
                {project?.videoUrl ? (
                  <div className="w-full h-full">
                    <ModalVideoPlayer
                      videoData={{
                        url: project.videoUrl,
                        title: project.title,
                        description: project.description
                      }}
                      allowClickToToggle={true}
                    />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {currentImage && (
                      <motion.div
                        key={`${project.title}-${activeImageIndex}`}
                        ref={imageRef}
                        className="max-w-full max-h-full select-none"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                        style={{ x: dragX, y: dragY }}
                        drag={scale > 1}
                        dragElastic={0.05}
                        dragMomentum={false}
                        whileDrag={{ cursor: 'grabbing' }}
                      >
                        <OptimizedImage
                          src={currentImage}
                          alt={project.title}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-lg select-none pointer-events-none"
                          onLoadingComplete={() => setImageLoaded(true)}
                          draggable={false}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
              
              {/* Mobile Navigation Dots */}
              {hasMultipleImages && !project?.videoUrl && (
                <div className="lg:hidden absolute inset-x-4 bottom-4 flex justify-center gap-2">
                  {Array.from({ length: totalImages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeImageIndex ? 'bg-sand scale-125' : 'bg-sand/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Scrollable Text Content */}
            <div className="w-full lg:w-[35%] h-[55vh] lg:h-full bg-ink overflow-y-auto split-modal-scroll-area">
              <div className="p-6 lg:p-8 space-y-6 split-modal-text-content">
                {/* Project Year */}
                {project.year && (
                  <div className="font-martian-mono text-sm text-sand/60 tracking-wider">
                    {project.year}
                  </div>
                )}

                {/* Description */}
                {project.description && (
                  <div>
                    <p className="font-martian-mono text-xs text-sand/50 tracking-wider uppercase mb-3">
                      Description
                    </p>
                    <div className="prose prose-sand max-w-none">
                      <p className="font-neue-haas text-[16px] leading-7 text-sand">
                        {project.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Details (only show if different from description) */}
                {project.details && project.details !== project.description && (
                  <div>
                    <p className="font-martian-mono text-xs text-sand/50 tracking-wider uppercase mb-3">
                      Details
                    </p>
                    <div className="prose prose-sand max-w-none">
                      <p className="font-neue-haas text-[16px] leading-7 text-sand">
                        {project.details}
                      </p>
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <p className="font-martian-mono text-xs text-sand/50 tracking-wider uppercase mb-3">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-sand/10 text-sand text-sm rounded-full font-martian-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role */}
                {project.role && (
                  <div>
                    <p className="font-martian-mono text-xs text-sand/50 tracking-wider uppercase mb-3">
                      Role
                    </p>
                    <p className="font-neue-haas text-[16px] leading-7 text-sand">
                      {project.role}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ContentModal; 