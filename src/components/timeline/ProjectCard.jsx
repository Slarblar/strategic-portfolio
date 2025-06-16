import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectModal from '../ProjectModal';
import { Z_INDEX } from '../archives/constants/zIndexLayers';
import { useInView } from 'react-intersection-observer';
import { useProjectImages } from '../../hooks/useProjectImages';

const ProjectCard = ({ project, index, inView, onElementSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef(null);

  // Use the simplified image loading hook
  const projectSlug = project.slug || project.id?.replace(`-${project.year}`, '') || project.id;
  const { images: projectImages, loading: imagesLoading } = useProjectImages(project.year, projectSlug);

  // Determine if this is a case study or project
  const isCaseStudy = project?.type === 'CASE_STUDY';
  const isExperiment = project?.type === 'EXPERIMENT';

  // Design system color mapping (same as ArchiveCard)
  const getCardTheme = () => {
    // Primary mapping by type
    if (isCaseStudy) {
      // For case studies, use primary category to determine color
      const primaryCategory = project.categories?.[0]?.toLowerCase();
      
      switch (primaryCategory) {
        case 'animation':
          return {
            bg: 'bg-[#EAE2DF]', // BISCUIT/SAND - light neutral
            hover: 'hover:bg-[#D5CDC8]',
            text: 'text-[#1A1717]', // INK - dark text
            badge: 'bg-[#1A1717] text-[#EAE2DF]', // INK badge with SAND text
            button: 'bg-[#1A1717] hover:bg-[#FF6600] text-[#EAE2DF] hover:text-[#1A1717]'
          };
        case 'design':
          return {
            bg: 'bg-[#465902]', // MOSS - dark green
            hover: 'hover:bg-[#5A6B02]',
            text: 'text-[#EAE2DF]', // SAND - light text
            badge: 'bg-[#EAE2DF] text-[#465902]', // SAND badge with MOSS text
            button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#465902] hover:text-[#1A1717]'
          };
        case 'development':
          return {
            bg: 'bg-[#FF6600]', // ORANGE
            hover: 'hover:bg-[#E55A00]',
            text: 'text-[#1A1717]', // INK - dark text
            badge: 'bg-[#1A1717] text-[#FF6600]', // INK badge with ORANGE text
            button: 'bg-[#1A1717] hover:bg-[#465902] text-[#FF6600] hover:text-[#EAE2DF]'
          };
        case 'strategy':
          return {
            bg: 'bg-[#8B4513]', // AUBURN - dark brown
            hover: 'hover:bg-[#A0501A]',
            text: 'text-[#EAE2DF]', // SAND - light text
            badge: 'bg-[#EAE2DF] text-[#8B4513]', // SAND badge with AUBURN text
            button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#8B4513] hover:text-[#1A1717]'
          };
        default:
          return {
            bg: 'bg-[#1A1717]', // RAISIN/INK - dark
            hover: 'hover:bg-[#252020]',
            text: 'text-[#EAE2DF]', // SAND - light text
            badge: 'bg-[#EAE2DF] text-[#1A1717]',
            button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#1A1717] hover:text-[#1A1717]'
          };
      }
    } else if (isExperiment) {
      return {
        bg: 'bg-[#808080]', // CHARCOAL/ELEPHANT - medium gray
        hover: 'hover:bg-[#707070]',
        text: 'text-[#EAE2DF]', // SAND - light text
        badge: 'bg-[#EAE2DF] text-[#808080]',
        button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#808080] hover:text-[#1A1717]'
      };
    } else {
      // Regular projects - vary by size
      if (project.size === 'large') {
        return {
          bg: 'bg-[#465902]', // MOSS
          hover: 'hover:bg-[#5A6B02]',
          text: 'text-[#EAE2DF]',
          badge: 'bg-[#EAE2DF] text-[#465902]',
          button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#465902] hover:text-[#1A1717]'
        };
      } else if (project.size === 'active') {
        // Sao House gets olive color scheme
        if (project.title === 'Sao House') {
          return {
            bg: 'bg-[#465902]', // MOSS/OLIVE
            hover: 'hover:bg-[#5A6B02]',
            text: 'text-[#EAE2DF]', // Light text for contrast
            badge: 'bg-[#EAE2DF] text-[#465902]',
            button: 'bg-[#EAE2DF] hover:bg-[#FF6600] text-[#465902] hover:text-[#1A1717]'
          };
        }
        // Other active projects get orange gradient
        return {
          bg: 'bg-gradient-to-br from-[#FF6600] to-[#FF8533]', // ORANGE gradient for active projects
          hover: 'hover:from-[#FF5500] hover:to-[#FF7722]',
          text: 'text-[#EAE2DF]',
          badge: 'bg-[#EAE2DF] text-[#FF6600]',
          button: 'bg-[#EAE2DF] hover:bg-[#1A1717] text-[#FF6600] hover:text-[#EAE2DF]'
        };
      } else {
        return {
          bg: 'bg-[#EAE2DF]', // BISCUIT/SAND
          hover: 'hover:bg-[#D5CDC8]',
          text: 'text-[#1A1717]',
          badge: 'bg-[#1A1717] text-[#EAE2DF]',
          button: 'bg-[#1A1717] hover:bg-[#FF6600] text-[#EAE2DF] hover:text-[#1A1717]'
        };
      }
    }
  };

  const theme = getCardTheme();

  // Floating animation variants
  const floatingVariants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      y: -4,
      scale: 1.01,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
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
    if (!project.images || project.images.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setActiveImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const handleViewClick = () => {
    if (!isCaseStudy) {
      setIsModalOpen(true);
    }
    // For case studies, the Link component will handle navigation
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        variants={floatingVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`group ${theme.bg} ${theme.hover} rounded-2xl overflow-hidden transition-colors duration-300`}
        style={{ zIndex: Z_INDEX.CARDS }}
        onClick={() => onElementSelect && onElementSelect(cardRef.current, true)}
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="h-full"
        >
          {/* Image Section */}
          {project.images && project.images.length > 0 && (
            <div className="relative aspect-video overflow-hidden">
              <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ 
                  x: `-${activeImageIndex * 100}%`,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                  }
                }}
              >
                <div className="absolute inset-0 flex">
                  {project.images.map((image, idx) => (
                    <motion.div
                      key={idx}
                      className="relative w-full flex-shrink-0 h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={image}
                        alt={`${project.title} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Gallery Navigation */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <motion.button
                    onClick={() => handleImageChange('prev')}
                    className="p-2 bg-ink/80 rounded-full hover:bg-ink transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() => handleImageChange('next')}
                    className="p-2 bg-ink/80 rounded-full hover:bg-ink transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.button>
                </div>
              )}

              {/* Image Indicator */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-1">
                  {project.images.map((_, idx) => (
                    <motion.div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        idx === activeImageIndex ? 'bg-cream' : 'bg-cream/30'
                      }`}
                      initial={false}
                      animate={{
                        scale: idx === activeImageIndex ? 1.2 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-header text-2xl font-medium ${theme.text}`}>
                  {project.title}
                </h3>
                {/* Type Badge */}
                {project.type && (
                  <span className={`px-2 py-1 text-xs font-martian-mono tracking-wider rounded uppercase ${theme.badge}`}>
                    {isCaseStudy ? 'Case Study' : isExperiment ? 'Experiment' : 'Project'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-martian-mono uppercase tracking-wider ${
                  project.size === 'large' 
                    ? `${theme.text.includes('1A1717') ? 'bg-[#1A1717]/20 text-[#1A1717]' : 'bg-[#EAE2DF]/20 text-[#EAE2DF]'}` 
                    : project.size === 'active'
                    ? project.title !== 'Sao House' 
                      ? 'bg-[#EAE2DF]/20 text-[#EAE2DF] animate-pulse'
                      : 'bg-[#EAE2DF]/20 text-[#EAE2DF]'
                    : `${theme.text.includes('1A1717') ? 'bg-[#808080]/20 text-[#808080]' : 'bg-[#808080]/20 text-[#808080]'}`
                }`}>
                  {project.size === 'active' ? 'Active' : project.size}
                </span>
                <div className={`font-martian-mono ${theme.text.replace('text-', 'text-').replace(']', '/60]')} text-xs uppercase tracking-wider`}>
                  {project.categories?.slice(0, 2).join(' • ')}
                </div>
              </div>
              <p className={`font-martian-mono ${theme.text.replace('text-', 'text-').replace(']', '/80]')} text-sm leading-relaxed`}>
                {project.description}
              </p>
            </div>

            {/* Key Metrics (First 2) */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="mb-6">
                <ul className={`font-martian-mono ${theme.text.replace('text-', 'text-').replace(']', '/70]')} text-sm space-y-2`}>
                  {project.metrics.slice(0, 2).map((metric, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`${theme.text.replace('text-', 'text-').replace(']', '/40]')} mt-1`}>•</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                  <div className={`border-t border-${theme.text.includes('1A1717') ? '[#1A1717]' : '[#EAE2DF]'}/10 pt-6 mb-6`}>
                    {/* Additional Metrics */}
                    {project.metrics && project.metrics.length > 2 && (
                      <div className="mb-6">
                        <ul className={`font-martian-mono ${theme.text.replace('text-', 'text-').replace(']', '/70]')} text-sm space-y-2`}>
                          {project.metrics.slice(2).map((metric, idx) => (
                            <li key={idx + 2} className="flex items-start gap-2">
                              <span className={`${theme.text.replace('text-', 'text-').replace(']', '/40]')} mt-1`}>•</span>
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {project.technologies && (
                      <div className="mb-6">
                        <h4 className={`font-martian-mono ${theme.text.replace('text-', 'text-').replace(']', '/60]')} uppercase text-xs tracking-wider mb-3`}>
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span 
                              key={`tech-${idx}-${tech}`}
                              className={`px-2 py-1 bg-ink/30 rounded ${theme.text.replace('text-', 'text-').replace(']', '/80]')} text-xs font-martian-mono`}
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
            <div className="flex items-center justify-between gap-3">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`${theme.text.replace('text-', 'text-').replace(']', '/60]')} font-martian-mono text-sm hover:${theme.text} transition-colors flex items-center gap-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                <motion.svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <path d="M19 9l-7 7-7-7"/>
                </motion.svg>
              </motion.button>

              {/* View Button - using theme colors */}
              {isCaseStudy ? (
                <Link 
                  to={project.caseStudyUrl}
                  className={`${theme.button} px-3 sm:px-4 py-2 rounded font-martian-mono text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0`}
                >
                  <span>View</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ) : (
                <motion.button
                  onClick={handleViewClick}
                  className={`${theme.button} px-3 sm:px-4 py-2 rounded font-martian-mono text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0`}
                  whileHover={{ scale: 1.02 }}
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
      </motion.div>

      {/* Project Modal for non-case studies */}
      {!isCaseStudy && (
        <ProjectModal 
          project={project}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectCard; 