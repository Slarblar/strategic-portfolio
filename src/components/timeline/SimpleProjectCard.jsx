import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectImages } from '../../hooks/useProjectImages';

const SimpleProjectCard = ({ project, index, inView }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Extract project slug - handle different formats
  const projectSlug = project.slug || project.id?.replace(`-${project.year}`, '') || project.id;
  
  // Use simple image loading
  const { images, loading, error } = useProjectImages(project.year, projectSlug);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000],
        delay: index * 0.1
      }
    }
  };

  const handleImageChange = (direction) => {
    if (!images.allImages || images.allImages.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImageIndex((prev) => 
        prev === images.allImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setActiveImageIndex((prev) => 
        prev === 0 ? images.allImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="group bg-olive/90 rounded-2xl overflow-hidden hover:bg-olive transition-all duration-500"
    >
      {/* Image Section */}
      {loading ? (
        <div className="aspect-video bg-ink/20 flex items-center justify-center">
          <div className="text-cream/60 text-sm">Loading images...</div>
        </div>
      ) : error ? (
        <div className="aspect-video bg-ink/20 flex items-center justify-center">
          <div className="text-red-400 text-sm">Error loading images</div>
        </div>
      ) : images.allImages.length > 0 ? (
        <div className="relative aspect-video overflow-hidden">
          {/* Current Image */}
          <img
            src={images.allImages[activeImageIndex]}
            alt={`${project.title} preview ${activeImageIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Navigation Buttons - Only show if more than 1 image */}
          {images.allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => handleImageChange('prev')}
                className="p-2 bg-ink/80 rounded-full hover:bg-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={() => handleImageChange('next')}
                className="p-2 bg-ink/80 rounded-full hover:bg-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

          {/* Pagination Dots - SIMPLE: Only show exactly as many as we have images */}
          {images.allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-1">
              {images.allImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    idx === activeImageIndex ? 'bg-cream' : 'bg-cream/30'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Debug Info */}
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {images.count} images | slug: {projectSlug}
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-ink/20 flex items-center justify-center">
          <div className="text-cream/60 text-sm">No images found for: {projectSlug}</div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-8">
        <div className="mb-6">
          <h3 className="font-header text-2xl font-medium text-cream mb-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded text-xs font-martian-mono uppercase tracking-wider bg-stone/20 text-stone">
              {project.size}
            </span>
            <div className="font-martian-mono text-cream/60 text-xs uppercase tracking-wider">
              {project.categories?.slice(0, 2).join(' • ')}
            </div>
          </div>
          <p className="font-martian-mono text-cream/80 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SimpleProjectCard; 