import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SplitLayoutModal from '../SplitLayoutModal';
import ArchiveCardVideo from './ArchiveCardVideo';
import GlitchText from '../GlitchText';
import { Z_INDEX } from './constants/zIndexLayers';
import { useProjectImages } from '../../hooks/useProjectImages';
import useScrollLock from '../../hooks/useScrollLock';

// Simplified Color Scheme System using Tailwind colors
const COLOR_SCHEMES = {
  olive: {
    name: 'Olive Green',
    background: '#465902', // olive
    text: '#FFFFFF', // pure white for maximum contrast
    textRgb: '255, 255, 255',
    button: {
      bg: 'rgba(255, 255, 255, 0.15)', // subtle white
      hover: '#FF5C1A', // orange
      hoverText: '#151717' // ink
    }
  },
  orange: {
    name: 'Orange',
    background: '#FF5C1A', // orange  
    text: '#000000', // pure black for maximum contrast
    textRgb: '0, 0, 0',
    button: {
      bg: 'rgba(0, 0, 0, 0.15)', // subtle black
      hover: '#465902', // olive
      hoverText: '#FFFFFF' // white
    }
  },
  rust: {
    name: 'Dark Rust',
    background: '#591902', // dark-rust
    text: '#FFFFFF', // pure white for maximum contrast
    textRgb: '255, 255, 255',
    button: {
      bg: 'rgba(255, 255, 255, 0.15)', // subtle white
      hover: '#ACC2FF', // sky
      hoverText: '#151717' // ink
    }
  },
  sky: {
    name: 'Sky Blue',
    background: '#ACC2FF', // sky
    text: '#000000', // pure black for maximum contrast
    textRgb: '0, 0, 0',
    button: {
      bg: 'rgba(0, 0, 0, 0.15)', // subtle black
      hover: '#591902', // dark-rust
      hoverText: '#FFFFFF' // white
    }
  },
  stone: {
    name: 'Stone Gray',
    background: '#7D8A8A', // stone
    text: '#FFFFFF', // pure white for maximum contrast
    textRgb: '255, 255, 255',
    button: {
      bg: 'rgba(255, 255, 255, 0.15)', // subtle white
      hover: '#FF5C1A', // orange
      hoverText: '#151717' // ink
    }
  }
};

// Simplified color scheme assignment
const getColorScheme = (project) => {
  // Priority 1: Explicit colorScheme prop if provided
  if (project.colorScheme && COLOR_SCHEMES[project.colorScheme]) {
    return COLOR_SCHEMES[project.colorScheme];
  }

  // Simple assignment based on project type and category
  const isCaseStudy = project?.type === 'CASE_STUDY';
  const isExperiment = project?.type === 'EXPERIMENT';
  const primaryCategory = project.categories?.[0]?.toLowerCase();

  // Case Studies
  if (isCaseStudy) {
    switch (primaryCategory) {
      case 'animation':
      case 'design':
        return COLOR_SCHEMES.olive; // Green for creative work
      case 'development':
      case 'web3':
      case 'hardware':
        return COLOR_SCHEMES.orange; // Orange for technical work
      case 'strategy':
      case 'leadership':
      case 'operations':
        return COLOR_SCHEMES.rust; // Rust for strategic work
      default:
        return COLOR_SCHEMES.sky; // Sky for other case studies
    }
  }

  // Experiments
  if (isExperiment) {
    return COLOR_SCHEMES.stone; // Stone for experimental work
  }

  // Regular projects
  const isLarge = project.size === 'large';
  const isActive = project.size === 'active';
  
  if (isActive) {
    // Sao House gets olive color scheme
    if (project.title === 'Sao House') {
      return COLOR_SCHEMES.olive;
    }
    // Other active projects get orange gradient scheme
    return {
      background: 'linear-gradient(135deg, #FF6600, #FF8533)',
      text: '#EAE2DF',
      textRgb: '234, 226, 223',
      button: {
        bg: 'rgba(234, 226, 223, 0.15)',
        hover: '#1A1717',
        hoverText: '#EAE2DF'
      }
    };
  } else if (isLarge) {
    switch (primaryCategory) {
      case 'development':
      case 'tech':
        return COLOR_SCHEMES.orange;
      case 'design':
      case 'branding':
        return COLOR_SCHEMES.olive;
      default:
        return COLOR_SCHEMES.rust;
    }
  } else {
    switch (primaryCategory) {
      case 'design':
      case 'branding':
        return COLOR_SCHEMES.stone;
      default:
        return COLOR_SCHEMES.sky;
    }
  }
};

const ArchiveCard = ({ 
  project, 
  index, 
  inView, 
  yearData, 
  onElementSelect,
  colorScheme, // Optional prop to override automatic scheme selection
  isExpanded,  // Controlled expanded state from parent
  onToggleExpanded, // Handler to toggle expanded state
  isMobile // Pass mobile state from parent
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const cardRef = useRef(null);
  const { lockScroll, unlockScroll } = useScrollLock();
  
  // Use the new simplified image loading hook
  const projectSlug = project.slug || project.id?.replace(`-${project.year}`, '') || project.id;
  const { images: projectImages, loading: imagesLoading } = useProjectImages(project.year, projectSlug);

  // Determine if this is a case study or project
  const isCaseStudy = project?.type === 'CASE_STUDY';
  const isExperiment = project?.type === 'EXPERIMENT';
  
  // Check if project has video content
  const hasVideo = project?.videoId && project?.videoType;
  const hasImages = project?.images && project?.images.length > 0;

  // Get the color scheme for this card
  const projectWithScheme = { ...project, colorScheme };
  const scheme = getColorScheme(projectWithScheme);

  // CSS Custom Properties for theme
  const cardStyle = {
    '--card-bg': scheme.background,
    '--card-text': scheme.text,
    '--card-text-rgb': scheme.textRgb,
    '--button-bg': scheme.button.bg,
    '--button-hover': scheme.button.hover,
    '--button-text': scheme.text,
    '--button-hover-text': scheme.button.hoverText
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: isMobile ? 5 : 20 // Reduced movement on mobile
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5, // Faster on mobile
        ease: isMobile ? "easeOut" : [0.22, 1, 0.36, 1],
        delay: index * (isMobile ? 0.02 : 0.05) // Reduced delay on mobile
      }
    }
  };

  const handleImageChange = (direction) => {
    if (!projectImages.allImages || projectImages.allImages.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImageIndex((prev) => (prev + 1) % projectImages.allImages.length);
    } else {
      setActiveImageIndex((prev) => (prev - 1 + projectImages.allImages.length) % projectImages.allImages.length);
    }
  };

  const handleViewClick = () => {
    if (!isCaseStudy) {
      // Only open modal if we have images
      if (projectImages.allImages?.length > 0 || project.images?.length > 0) {
        setIsModalOpen(true);
      }
    }
    // For case studies, the Link component will handle navigation
  };

  useEffect(() => {
    if (isModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    // Cleanup on unmount
    return () => unlockScroll();
  }, [isModalOpen, lockScroll, unlockScroll]);

  // Get type label
  const getTypeLabel = () => {
    if (isCaseStudy) return 'Case Study';
    if (isExperiment) return 'Experiment';
    return 'Project';
  };

  // Handle video state changes
  const handleVideoStateChange = (state) => {
    setVideoPlaying(state === 'playing');
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`group archive-card rounded-2xl overflow-hidden transition-all duration-300 ${
          isMobile ? 'mobile-card-optimized' : ''
        }`}
        style={{ 
          ...cardStyle,
          backgroundColor: 'var(--card-bg)',
          color: 'var(--card-text)',
          zIndex: Z_INDEX.CARDS,
          // Much lighter shadows on mobile, heavier on desktop
          boxShadow: isMobile 
            ? "0 2px 8px rgba(0, 0, 0, 0.04)" 
            : "0 8px 25px rgba(0, 0, 0, 0.08)",
          perspective: isMobile ? "none" : "1000px", // Disable 3D perspective on mobile
          border: "1px solid transparent" // Thinner border on mobile
        }}
        onTap={(e) => {
          // If the click is on a button or a link, do nothing.
          if (e.target.closest('button, a')) {
            return;
          }
          // Otherwise, it's a click on the card itself.
          onElementSelect && onElementSelect(cardRef.current, true);
        }}
      >
        <motion.div 
          className="h-full"
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Media Section - Video or Images */}
          {(hasVideo || hasImages) && (
            <div className="relative aspect-video overflow-hidden">
              {imagesLoading ? (
                <div className="w-full h-full flex items-center justify-center" 
                     style={{ backgroundColor: 'var(--card-accent)' }}>
                  <div className="w-6 h-6 border-2 border-current opacity-20 border-t-current rounded-full animate-spin"></div>
                </div>
              ) : projectImages.count > 0 ? (
                <>
                  <div className="relative w-full h-full touch-pan-y overflow-hidden">
                    <motion.div
                      className="flex h-full"
                      animate={{ x: `-${activeImageIndex * (100 / projectImages.count)}%` }}
                      drag={projectImages.count > 1 ? "x" : false}
                      dragConstraints={false}
                      dragElastic={0.2}
                      dragMomentum={false}
                      onDragEnd={(e, { offset, velocity }) => {
                        if (projectImages.count <= 1) return;
                        
                        const swipe = offset.x;
                        const threshold = 30; // Reduced threshold for easier swiping
                        
                        if (Math.abs(swipe) > threshold || Math.abs(velocity.x) > 300) {
                          if (swipe > 0) {
                            handleImageChange('prev');
                          } else if (swipe < 0) {
                            handleImageChange('next');
                          }
                        }
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        bounce: 0 
                      }}
                      style={{
                        cursor: projectImages.count > 1 ? 'grab' : 'default',
                        width: `${projectImages.count * 100}%`
                      }}
                      whileDrag={{
                        cursor: 'grabbing'
                      }}
                    >
                      {projectImages.allImages.map((image, idx) => (
                        <motion.img
                          key={idx}
                          src={image}
                          alt={`${project.title} preview ${idx + 1}`}
                          className="h-full object-cover flex-shrink-0 select-none pointer-events-none"
                          style={{ 
                            width: `${100 / projectImages.count}%`
                          }}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          draggable={false}
                        />
                      ))}
                    </motion.div>
                  </div>



                  {/* Media Content Indicator */}
                  <div className="absolute top-2 left-2 flex gap-2 z-10">
                    {hasVideo && (
                      <div className="px-2 py-1 rounded-full text-xs bg-black/50 text-white border border-white/20 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8.5l-5-3v6l5-3z"/>
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H4z" clipRule="evenodd"/>
                        </svg>
                        +Video
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm"
                     style={{ backgroundColor: 'var(--card-accent)', color: 'var(--card-text)' }}>
                  No images
                </div>
              )}
            </div>
          )}

          {/* Gallery Controls Below Image - Portfolio Focus */}
          {projectImages.count > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-b"
                 style={{ borderColor: 'var(--card-text)', opacity: 0.2 }}>
              {/* Image Pagination Dots */}
              <div className="flex gap-1.5">
                {projectImages.allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setActiveImageIndex(idx); 
                    }}
                    className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-125"
                    style={{
                      backgroundColor: 'var(--card-text)',
                      opacity: idx === activeImageIndex ? 1 : 0.5
                    }}
                  />
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-2">
                <motion.button
                  onTap={(e) => { e.stopPropagation(); handleImageChange('prev'); }}
                  className="p-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card-text)',
                    opacity: 0.8,
                    color: 'var(--card-bg)'
                  }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </motion.button>
                <motion.button
                  onTap={(e) => { e.stopPropagation(); handleImageChange('next'); }}
                  className="p-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card-text)',
                    opacity: 0.8,
                    color: 'var(--card-bg)'
                  }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </motion.button>
              </div>

              {/* Image Counter */}
              <div className="font-martian-mono text-xs opacity-80" 
                   style={{ color: 'var(--card-text)' }}>
                {activeImageIndex + 1} / {projectImages.count}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-4 sm:p-6 lg:p-8 card-content">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-header text-base sm:text-lg md:text-xl lg:text-2xl font-semibold uppercase flex-1 min-w-0"
                    style={{ color: 'var(--card-text)' }}>
                  <GlitchText text={project.title} />
                </h3>
                {/* Type Badge */}
                {project.type && (
                  <span className="px-2 py-1 text-xs font-martian-mono tracking-wider rounded uppercase flex-shrink-0 bg-white/10 border border-white/20"
                        style={{ color: 'var(--card-text)' }}>
                    {getTypeLabel()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-martian-mono uppercase tracking-wider ${
                  project.size === 'active' && project.title !== 'Sao House' ? 'animate-pulse' : ''
                }`}
                      style={{ 
                        backgroundColor: 'var(--button-bg)', 
                        color: 'var(--button-text)' 
                      }}>
                  {project.size === 'active' ? 'Active' : project.size}
                </span>
                <div className="font-martian-mono text-xs uppercase tracking-wider break-normal hyphens-none"
                     style={{ color: 'var(--card-text)' }}>
                  {project.categories?.slice(0, 2).join(' • ')}
                </div>
              </div>
              <p className="font-martian-mono text-xs sm:text-sm leading-relaxed mb-4 break-normal hyphens-none"
                 style={{ color: 'var(--card-text)' }}>
                {project.description}
              </p>
              
              {/* Key Metrics - First 2 only */}
              {project.metrics && project.metrics.length > 0 && (
                <div>
                  <ul className="font-martian-mono text-xs sm:text-sm space-y-2"
                      style={{ color: 'var(--card-text)' }}>
                    {project.metrics.slice(0, 2).map((metric, idx) => (
                      <li key={`metric-${project.id}-${idx}`} className="flex items-start gap-2">
                        <span className="mt-1 opacity-90 flex-shrink-0" style={{ color: 'var(--olive)' }}>•</span>
                        <span className="leading-relaxed break-normal hyphens-none">{metric}</span>
                      </li>
                    ))}
                  </ul>
                  {/* More indicator */}
                  {project.metrics.length > 2 && (
                    <div className="mt-3 font-martian-mono text-xs opacity-60" 
                         style={{ color: 'var(--card-text)' }}>
                      +{project.metrics.length - 2} more achievement{project.metrics.length > 3 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1,
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      },
                      opacity: {
                        duration: 0.3,
                        ease: [0.215, 0.610, 0.355, 1.000]
                      }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      },
                      opacity: {
                        duration: 0.2
                      }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <div className="border-t pt-6 mb-6 opacity-70"
                       style={{ borderColor: 'var(--card-text)' }}>
                    {/* Additional Metrics */}
                    {project.metrics && project.metrics.length > 2 && (
                      <div className="mb-6">
                        <h4 className="font-martian-mono uppercase text-xs tracking-wider mb-3"
                            style={{ color: 'var(--card-text)' }}>
                          Additional Achievements
                        </h4>
                        <ul className="font-martian-mono text-sm space-y-2"
                            style={{ color: 'var(--card-text)' }}>
                          {project.metrics.slice(2).map((metric, idx) => (
                            <li key={`metric-expanded-${project.id}-${idx + 2}`} className="flex items-start gap-2">
                              <span className="mt-1 opacity-90 flex-shrink-0" style={{ color: 'var(--olive)' }}>•</span>
                              <span className="leading-relaxed break-normal hyphens-none">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {project.technologies && (
                      <div className="mb-6">
                        <h4 className="font-martian-mono uppercase text-xs tracking-wider mb-3"
                            style={{ color: 'var(--card-text)' }}>
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span 
                              key={`tech-${project.id}-${idx}-${tech}`}
                              className="px-2 py-1 rounded text-xs font-martian-mono"
                              style={{ 
                                backgroundColor: 'var(--button-bg)', 
                                color: 'var(--button-text)' 
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}


                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Show More/Less button - only show if there's additional content */}
              {(project.metrics?.length > 2 || project.technologies?.length > 0) && (
                <motion.button
                  onTap={(e) => {
                    e.stopPropagation();
                    onToggleExpanded();
                  }}
                  className="font-martian-mono text-xs sm:text-sm transition-all duration-300 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 min-w-0 flex-1 p-2 touch-manipulation"
                  style={{ color: 'var(--card-text)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="truncate">{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <motion.svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="flex-shrink-0"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <path d="M19 9l-7 7-7-7"/>
                  </motion.svg>
                </motion.button>
              )}

              {/* View Button */}
              {isCaseStudy ? (
                <Link 
                  to={project.caseStudyUrl}
                  className="view-button px-4 py-3 rounded font-martian-mono text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 min-w-0 flex-shrink-0 text-center touch-manipulation hover:opacity-90"
                  style={{ 
                    backgroundColor: 'var(--button-bg)', 
                    color: 'var(--card-text)'
                  }}
                >
                  <span>View</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <motion.button
                  onTap={(e) => {
                    e.stopPropagation();
                    handleViewClick();
                  }}
                  className="view-button px-4 py-3 rounded font-martian-mono text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 min-w-0 flex-shrink-0 touch-manipulation hover:opacity-90"
                  style={{ 
                    backgroundColor: 'var(--button-bg)', 
                    color: 'var(--card-text)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Modal for non-case studies */}
      {!isCaseStudy && (
        <SplitLayoutModal 
          project={{
            ...project,
            images: projectImages.allImages || project.images || []
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentImageIndex={activeImageIndex}
          onImageChange={setActiveImageIndex}
          totalImages={projectImages.allImages?.length || project.images?.length || 0}
          enableScrollLock={false}
        />
      )}
    </>
  );
};

export default ArchiveCard; 