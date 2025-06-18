import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import ProjectCardVideo from './ProjectCardVideo';
import SplitLayoutModal from './SplitLayoutModal';
import BulletList from './BulletList';
import { getColorScheme } from '../data/colorSchemes';

// Utility to convert Tailwind color classes to hex values
const getHexFromTailwindClass = (className) => {
  const colorMap = {
    'sand': '#EAE2DF',
    'ink': '#1A1717', 
    'olive': '#465902',
    'orange': '#FF6600',
    'forest': '#4C5F2C',
    'rust': '#8C2703',
    'stone': '#7F7C7A',
    'sky': '#BACCFC',
    'custom-gray': '#726a6a',
    'proper-green': '#6e8c03'
  };
  
  if (className.includes('bg-[') && className.includes(']')) {
    // Extract hex from bg-[#123456] format
    return className.match(/bg-\[([^\]]+)\]/)?.[1];
  }
  
  // Extract color name from bg-colorname or group-hover:bg-colorname
  const colorName = className.replace(/^(group-hover:)?bg-/, '');
  return colorMap[colorName] || '#EAE2DF';
};

const ProjectCard = ({ 
  title, 
  description, 
  roles = [],
  bgColor = 'sand', 
  projectSlug,
  project,
  videoId,
  images = [
    '/placeholder.jpg', 
    '/placeholder.jpg', 
    '/placeholder.jpg'
  ] 
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  // Get the color scheme for the card
  const scheme = getColorScheme(projectSlug, bgColor);
  
  // Debug logging for spacestation-animation
  if (projectSlug === 'spacestation-animation') {
    console.log('Spacestation Animation Card Debug:', {
      projectSlug,
      bgColor,
      scheme,
      cardClasses: scheme.card
    });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMediaLoad = useCallback(() => {
    setIsMediaLoaded(true);
  }, []);

  const isCaseStudy = project?.type === 'CASE_STUDY';
  const buttonText = 'View Project';

  const handleButtonClick = (e) => {
    // Prevent default behaviors and ensure modal opens properly
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isCaseStudy) {
      // Ensure we have valid project data before opening modal
      if (project && (project.images || images)) {
        setIsModalOpen(true);
      }
    }
    return false;
  };

  // Enhanced touch handler for mobile devices
  const handleButtonTouch = (e) => {
    // Prevent default behaviors and ensure modal opens properly
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isCaseStudy) {
      // Ensure we have valid project data before opening modal
      if (project && (project.images || images)) {
        setIsModalOpen(true);
      }
    }
    return false;
  };

  const descriptionPoints = description.split('•').filter(Boolean).map(item => item.trim());

  const contentVariants = {
    loading: {
      opacity: 0.7,
      scale: 0.98,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    loaded: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  };

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.96,
      filter: "blur(4px)"
    },
    loading: {
      opacity: 0.8,
      y: 10,
      scale: 0.98,
      filter: "blur(2px)",
      transition: { 
        duration: 0.4,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    },
    loaded: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000],
        delay: 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate={!isContentLoaded ? "loading" : "loaded"}
        whileHover="hover"
        variants={cardVariants}
        style={{
          '--card-bg': scheme.card.includes('bg-') ? 
            getHexFromTailwindClass(scheme.card) : undefined,
          '--card-hover-bg': scheme.cardHover?.includes('group-hover:bg-') ? 
            getHexFromTailwindClass(scheme.cardHover) : undefined,
        }}
        className={`group rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-700 ease-in-out hover:shadow-2xl`}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        {!isContentLoaded && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
          />
        )}

        <motion.div
          variants={contentVariants}
          animate={isContentLoaded ? "loaded" : "loading"}
          className="p-6 lg:p-8 relative z-20"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-1/2">
              <motion.div 
                className="aspect-video relative overflow-hidden rounded-xl"
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ 
                  opacity: isMediaLoaded ? 1 : 0.9, 
                  scale: isMediaLoaded ? 1 : 0.99 
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {!isMediaLoaded && (
                  <div className="absolute inset-0 bg-ink/10 rounded-xl" />
                )}
                
                {videoId ? (
                  <ProjectCardVideo 
                    videoId={videoId} 
                    videoType={project.videoType || 'vimeo'}
                    hoverToPlay={project.hoverToPlay || false}
                    isCardHovered={isCardHovered}
                    onLoad={handleMediaLoad}
                    thumbnail={project.thumbnail}
                  />
                ) : (
                  <ImageCarousel 
                    images={images} 
                    onLoad={handleMediaLoad}
                  />
                )}
              </motion.div>
            </div>

            <div className="lg:w-1/2 flex flex-col">
              <motion.h2 
                className={`font-display font-black text-2xl lg:text-3xl ${scheme.title} mb-4 project-text-transition`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isContentLoaded ? 1 : 0.7, 
                  y: isContentLoaded ? 0 : 5 
                }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {isContentLoaded ? title : (
                  <div className="w-3/4 h-8 bg-current opacity-20 rounded animate-pulse" />
                )}
              </motion.h2>

              <motion.div 
                className="flex-grow mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isContentLoaded ? 1 : 0.6, 
                  y: isContentLoaded ? 0 : 5 
                }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {isContentLoaded ? (
                  <div className="flex flex-col space-y-6">
                    <BulletList
                      items={descriptionPoints}
                      textColor={scheme.descriptionText}
                      bulletColor={scheme.descriptionBullet}
                      isAnimated={false}
                      className="mt-4"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-current opacity-20 rounded-full mt-2" />
                        <div className={`w-${i === 1 ? 'full' : i === 2 ? '5/6' : '4/5'} h-4 bg-current opacity-20 rounded animate-pulse`} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {roles && roles.length > 0 && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isContentLoaded ? 1 : 0.5, 
                    y: isContentLoaded ? 0 : 5 
                  }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  {isContentLoaded ? (
                    <>
                      <h4 className={`font-martian-mono font-semibold text-lg uppercase tracking-wider ${scheme.rolesHeading} mb-2 project-text-transition`}>
                        ROLES
                      </h4>
                      <p className={`font-martian-mono text-base ${scheme.rolesList} project-text-transition`}>
                        {Array.isArray(roles) ? roles.join(' / ') : roles}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-4 bg-current opacity-20 rounded animate-pulse mb-2" />
                      <div className="w-32 h-4 bg-current opacity-20 rounded animate-pulse" />
                    </>
                  )}
                </motion.div>
              )}

              <motion.div 
                className="flex justify-end mt-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isContentLoaded ? 1 : 0.4, 
                  y: isContentLoaded ? 0 : 5 
                }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {isContentLoaded ? (
                  isCaseStudy ? (
                    <Link to={`/archives/${projectSlug}`}>
                      <motion.div 
                        className="group/button flex items-center gap-3 cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span className={`font-martian-mono font-semibold text-sm uppercase tracking-wider ${scheme.button.text} transition-all duration-500`}>
                          {buttonText}
                        </span>
                        <div className={`w-10 h-10 rounded-lg ${scheme.button.iconBg} flex items-center justify-center transition-all duration-500`}>
                          <svg 
                            width="24" 
                            height="24"
                            className={`${scheme.button.iconColor} group-hover/button:translate-x-0.5 transition-all duration-500`}
                            viewBox="0 0 72 72"
                            fill="none"
                          >
                            <g>
                              <path 
                                className="stroke-current" 
                                strokeWidth="5"
                                strokeLinecap="round" 
                                strokeMiterlimit="10"
                                d="M40.72,22.5h13.17c1.56,0,2.82,1.26,2.82,2.82v14.56c0,1.56-1.26,2.82-2.82,2.82H12.38"
                              />
                              <polyline 
                                className="stroke-current" 
                                strokeWidth="5"
                                strokeLinecap="round" 
                                strokeMiterlimit="10"
                                points="22.05 33.02 12.38 42.7 22.09 52.41"
                              />
                            </g>
                          </svg>
                        </div>
                      </motion.div>
                    </Link>
                  ) : (
                    <button 
                      type="button"
                      className="group/button flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 m-0"
                      onClick={() => {
                        if (!isCaseStudy && project && (project.images || images)) {
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      <span className={`font-martian-mono font-semibold text-sm uppercase tracking-wider ${scheme.button.text} transition-all duration-500`}>
                        {buttonText}
                      </span>
                      <div className={`w-10 h-10 rounded-lg ${scheme.button.iconBg} flex items-center justify-center transition-all duration-500`}>
                        <svg 
                          width="24" 
                          height="24"
                          className={`${scheme.button.iconColor} group-hover/button:translate-x-0.5 transition-all duration-500`}
                          viewBox="0 0 72 72"
                          fill="none"
                        >
                          <g>
                            <path 
                              className="stroke-current" 
                              strokeWidth="5"
                              strokeLinecap="round" 
                              strokeMiterlimit="10"
                              d="M40.72,22.5h13.17c1.56,0,2.82,1.26,2.82,2.82v14.56c0,1.56-1.26,2.82-2.82,2.82H12.38"
                            />
                            <polyline 
                              className="stroke-current" 
                              strokeWidth="5"
                              strokeLinecap="round" 
                              strokeMiterlimit="10"
                              points="22.05 33.02 12.38 42.7 22.09 52.41"
                            />
                          </g>
                        </svg>
                      </div>
                    </button>
                  )
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-4 bg-current opacity-20 rounded animate-pulse" />
                    <div className="w-10 h-10 bg-current opacity-20 rounded-lg animate-pulse" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {!isCaseStudy && (
        <SplitLayoutModal 
          project={{
            ...project,
            title: project?.title || title,
            images: project?.images || images,
            description: project?.description || description
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;