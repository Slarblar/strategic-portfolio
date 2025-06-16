import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import ProjectCardVideo from './ProjectCardVideo';
import GlitchText from './GlitchText';
import GlitchRipple from './GlitchRipple';
import ProjectModal from './ProjectModal';
import BulletList from './BulletList';

const AnimatedText = ({ text, delay = 0, className, isRole = false }) => {
  // Split text by bullet points, preserving the bullet points
  const processText = (text) => {
    return text.split('•').filter(Boolean).map(item => item.trim());
  };

  const bulletPoints = processText(text);
  
  return (
    <div className="flex flex-col space-y-3">
      {bulletPoints.map((point, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.25,
            delay: delay + (index * 0.1),
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <div className={`${className} flex`}>
            <span className="w-[24px] flex-shrink-0">•</span>
            <span className="flex-1">{point}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
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
  
  // Initialize loaded state after a brief delay to show smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Media loaded handler with optimization
  const handleMediaLoad = useCallback(() => {
    setIsMediaLoaded(true);
  }, []);
  
  // Design system colors - matching your exact palette
  const bgColors = {
    sand: 'bg-[#EAE2DF]',      // BEAEDE from your design system
    olive: 'bg-[#465902]',      // 465902 from your design system  
    orange: 'bg-[#FF6600]',     // FF6600 from your design system
    forest: 'bg-[#4C5F2C]',     // 4C5F2C from your design system
    rust: 'bg-[#8C2703]',       // 8C2703 from your design system
    sky: 'bg-[#BACCFC]',        // BACCFC from your design system
    ink: 'bg-[#1A1717]',        // 1A1717 from your design system
    stone: 'bg-[#7F7C7A]',      // 7F7C7A from your design system
    'custom-gray': 'bg-[#726a6a]', // Custom gray for Quarter Machine
    'proper-green': 'bg-[#6e8c03]', // Proper Hemp Co. custom green
  };

  // Skeleton/loading background colors (lighter versions for smooth transition)
  const skeletonBgColors = {
    sand: 'bg-[#F5F0ED]',      // Lighter version of sand
    olive: 'bg-[#5A6D0A]',     // Lighter version of olive
    orange: 'bg-[#FF8533]',    // Lighter version of orange
    forest: 'bg-[#5C7235]',    // Lighter version of forest
    rust: 'bg-[#A03008]',      // Lighter version of rust
    sky: 'bg-[#C8D4FD]',       // Lighter version of sky
    ink: 'bg-[#2A2424]',       // Lighter version of ink
    stone: 'bg-[#8E8B89]',     // Lighter version of stone
    'custom-gray': 'bg-[#7F7775]', // Lighter version of custom gray
    'proper-green': 'bg-[#7fa60a]', // Lighter version for loading
  };

  // High-contrast hover colors from design system
  const hoverBgColors = {
    sand: 'hover:bg-[#1A1717]',    // Sand -> Ink (light to dark)
    olive: 'hover:bg-[#FF6600]',   // Olive -> Orange (dark green to bright orange)
    orange: 'hover:bg-[#465902]',  // Orange -> Olive (bright to dark green)
    forest: 'hover:bg-[#BACCFC]',  // Forest -> Sky (dark to light blue)
    rust: 'hover:bg-[#EAE2DF]',    // Rust -> Sand (dark to light)
    sky: 'hover:bg-[#726a6a]',     // Sky -> Stone (light blue to gray)
    ink: 'hover:bg-[#EAE2DF]',     // Ink -> Sand (dark to light)
    stone: 'hover:bg-[#BACCFC]',   // Stone -> Sky (gray to light blue)
    'custom-gray': 'hover:bg-[#ACC2FF]', // Custom gray -> Sky
    'proper-green': 'hover:bg-[#726a6a]', // Proper green -> custom gray on hover
  };

  // Text colors based on your design system
  const textColors = {
    sand: 'text-[#1A1717]',     // Dark text on light background
    olive: 'text-[#EAE2DF]',    // Light text on dark olive background
    orange: 'text-[#1A1717]',   // Dark text on orange
    forest: 'text-[#EAE2DF]',   // Light text on dark background
    rust: 'text-[#EAE2DF]',     // Light text on dark background
    sky: 'text-[#1A1717]',      // Dark text on light background
    ink: 'text-[#EAE2DF]',      // Light text on dark background
    stone: 'text-[#EAE2DF]',    // Light text on medium background
    'custom-gray': 'text-[#EAE2DF]', // Light text on custom gray background
    'proper-green': 'text-[#EAE2DF]', // Cream/white text on Proper green
  };

  // Hover text colors (inverted for high contrast)
  const hoverTextColors = {
    sand: 'group-hover:text-[#EAE2DF]',  // Sand -> Light text on dark hover
    olive: 'group-hover:text-[#1A1717]', // Olive -> Dark text on orange hover
    orange: 'group-hover:text-[#EAE2DF]', // Orange -> Light text on dark hover
    forest: 'group-hover:text-[#1A1717]', // Forest -> Dark text on light hover
    rust: 'group-hover:text-[#1A1717]',  // Rust -> Dark text on light hover
    sky: 'group-hover:text-[#EAE2DF]',   // Sky -> Light text on forest hover
    ink: 'group-hover:text-[#1A1717]',   // Ink -> Dark text on light hover
    stone: 'group-hover:text-[#1A1717]',  // Stone -> Dark text on light hover
    'custom-gray': 'group-hover:text-[#1A1717]', // Custom gray -> Ink text on sky hover
    'proper-green': 'group-hover:text-[#EAE2DF]', // Sand text on custom gray hover
  };

  // High-contrast button colors based on background
  const buttonColors = {
    sand: 'bg-ink group-hover:bg-orange',           // Dark → Orange hover on light bg
    olive: 'bg-[#EAE2DF] group-hover:bg-[#191717]', // Sand → Ink hover on olive bg
    orange: 'bg-ink group-hover:bg-sand',          // Dark → Light hover on orange bg
    forest: 'bg-orange group-hover:bg-sand',       // Orange → Light hover on dark bg
    rust: 'bg-sand group-hover:bg-ink',           // Sand → Black hover
    sky: 'bg-ink group-hover:bg-orange',           // Dark → Orange hover on light bg
    ink: 'bg-orange group-hover:bg-sand',          // Orange → Light hover on dark bg
    stone: 'bg-orange group-hover:bg-sand',         // Orange → Light hover on dark bg
    'custom-gray': 'bg-sand group-hover:bg-ink',    // Sand → Ink hover on custom gray bg
    'proper-green': 'bg-sand group-hover:bg-ink'    // Sand → Ink hover on proper green bg
  };

  // View Project text colors (separate from button)
  const viewProjectTextColors = {
    sand: 'text-ink group-hover:text-orange',      // Dark → Orange on hover (light bg)
    olive: 'text-[#EAE2DF] group-hover:text-[#191717]', // Sand → Ink on hover
    orange: 'text-ink group-hover:text-sand',      // Dark → Light on hover (orange bg)
    forest: 'text-sand group-hover:text-orange',   // Light → Orange on hover (dark bg)
    rust: 'text-sand group-hover:text-ink',       // Sand → Black on hover
    sky: 'text-ink group-hover:text-orange',       // Dark → Orange hover on light bg
    ink: 'text-sand group-hover:text-orange',      // Light → Orange on hover (dark bg)
    stone: 'text-sand group-hover:text-orange',     // Light → Orange on hover (dark bg)
    'custom-gray': 'text-sand group-hover:text-ink',  // Sand → Ink on hover
    'proper-green': 'text-sand group-hover:text-ink'  // Sand → Ink on hover
  };

  // Button icon colors matching text for consistency
  const buttonIconColors = {
    sand: 'text-sand group-hover:text-ink',        // Light → Dark on hover (dark/orange bg)
    olive: 'text-[#191717] group-hover:text-[#EAE2DF]', // Ink → Sand on hover
    orange: 'text-sand group-hover:text-ink',      // Light → Dark on hover (dark/light bg)
    forest: 'text-ink group-hover:text-ink',       // Dark → Dark on hover (orange/light bg)
    rust: 'text-[#AA5A3C] group-hover:text-sand',      // Rust → Sand on hover
    sky: 'text-sand group-hover:text-ink',         // Light → Dark on hover (dark/orange bg)
    ink: 'text-ink group-hover:text-ink',          // Dark → Dark on hover (orange/light bg)
    stone: 'text-ink group-hover:text-ink',         // Dark → Dark on hover (orange/light bg)
    'custom-gray': 'text-[#726a6a] group-hover:text-[#BACCFC]',  // Custom gray → Sky on hover
    'proper-green': 'text-[#6e8c03] group-hover:text-sand'  // Proper green → Sand on hover
  };

  // Determine if this is a case study or project
  const isCaseStudy = project?.type === 'CASE_STUDY';
  const buttonText = isCaseStudy ? 'View Project' : 'View Project'; // Keep consistent with design system

  const handleButtonClick = (e) => {
    if (!isCaseStudy) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  // Process description text to get bullet points
  const getDescriptionPoints = (text) => {
    return text.split('•').filter(Boolean).map(item => item.trim());
  };

  const descriptionPoints = getDescriptionPoints(description);

  const getBgColor = (projectSlug, isHovered) => {
    if (projectSlug === 'quarter-machine') {
      return isHovered ? bgColors.sky : bgColors['custom-gray'];
    }
    if (projectSlug === 'spacestation-animation') {
      return isHovered ? bgColors.olive : bgColors.sand;
    }
    return bgColors[bgColor] || bgColors.sand;
  };

  const getColors = (projectSlug, isHovered) => {
    switch (projectSlug) {
      case 'spacestation-animation':
        return {
          textColor: isHovered ? 'text-sand/90' : 'text-ink/90',
          bulletColor: isHovered ? 'text-sand/60' : 'text-ink/60'
        };
      case 'proper-hemp-co':
        if (isHovered) {
          return {
            textColor: 'text-sand',
            bulletColor: 'text-sand'
          };
        }
        return {
          textColor: 'text-sand',
          bulletColor: 'text-sand'
        };
      case 'a-for-adley':
        return {
          textColor: isHovered ? 'text-ink/90' : 'text-sand/90',
          bulletColor: isHovered ? 'text-ink/60' : 'text-sand/60'
        };
      case 'quarter-machine':
        return {
          textColor: isHovered ? 'text-ink/90' : 'text-sand/90',
          bulletColor: isHovered ? 'text-ink/60' : 'text-sand/60'
        };
      default:
        return {
          textColor: isHovered ? 'text-sand/90' : 'text-ink/90',
          bulletColor: isHovered ? 'text-sand/60' : 'text-ink/60'
        };
    }
  };

  const colors = getColors(projectSlug, isCardHovered);

  const getButtonStyles = (projectSlug, isHovered) => {
    if (projectSlug === 'quarter-machine') {
      return {
        text: 'text-sand group-hover:text-ink',
        iconBg: 'bg-sand group-hover:bg-ink',
        iconColor: 'text-[#726a6a] group-hover:text-[#BACCFC]'
      };
    }
    if (projectSlug === 'proper-hemp-co') {
      return {
        text: 'text-sand',
        iconBg: 'bg-ink group-hover:bg-[#6e8c03]',
        iconColor: 'text-sand'
      };
    }
    if (projectSlug === 'spacestation-animation') {
      return {
        text: 'text-ink group-hover:text-sand',
        iconBg: 'bg-ink group-hover:bg-sand',
        iconColor: 'text-sand group-hover:text-ink'
      };
    }
    if (projectSlug === 'a-for-adley') {
      return {
        text: 'text-sand group-hover:text-ink',
        iconBg: 'bg-ink group-hover:bg-sand',
        iconColor: 'text-sand group-hover:text-ink'
      };
    }
    // Default button styles for other projects - using the original color scheme
    return {
      text: viewProjectTextColors[bgColor],
      iconBg: buttonColors[bgColor],
      iconColor: buttonIconColors[bgColor]
    };
  };

    const buttonStyles = getButtonStyles(projectSlug, isCardHovered);

  // Get current background color with smooth loading transition
  const getCurrentBgColor = () => {
    if (!isContentLoaded) {
      return skeletonBgColors[bgColor] || skeletonBgColors.sand;
    }
    
    if (projectSlug === 'quarter-machine') {
      return isCardHovered ? bgColors.sky : bgColors['custom-gray'];
    }
    return bgColors[bgColor];
  };

  // Animation variants for smooth content loading
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

  // Enhanced card variants with loading states
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
        onMouseEnter={useCallback(() => setIsCardHovered(true), [])}
        onMouseLeave={useCallback(() => setIsCardHovered(false), [])}
        className={`group ${getCurrentBgColor()} ${hoverBgColors[bgColor]} rounded-2xl overflow-hidden relative cursor-pointer`}
        style={{
          transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          willChange: 'transform, background-color, opacity',
        }}
      >
        {/* Subtle loading shimmer effect */}
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

        {/* Content Container with smooth transitions */}
        <motion.div
          variants={contentVariants}
          animate={isContentLoaded ? "loaded" : "loading"}
          className="p-6 lg:p-8 relative z-20"
        >
          {/* Main Content Layout - Following design system structure */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Image/Video with enhanced loading */}
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
                {/* Minimal media loading background */}
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

            {/* Right Column - Content with staggered animations */}
            <div className="lg:w-1/2 flex flex-col">
              {/* Title with loading state */}
              <motion.h2 
                className={`font-display font-black text-2xl lg:text-3xl ${textColors[bgColor]} ${hoverTextColors[bgColor]} mb-4`}
                style={{
                  transition: 'color 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                }}
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

              {/* Description with smooth loading */}
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
                      textColor={colors.textColor}
                      bulletColor={colors.bulletColor}
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

              {/* Roles Section with loading state */}
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
                      <h4 className={`font-martian-mono font-semibold text-lg uppercase tracking-wider ${bgColor === 'sand' ? 'text-ink group-hover:text-sand' : bgColor === 'olive' ? 'text-[#EAE2DF] group-hover:text-[#191717]' : `${textColors[bgColor]} ${hoverTextColors[bgColor]}`} opacity-80 group-hover:opacity-100 mb-2`}
                          style={{ transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)' }}>
                        ROLES
                      </h4>
                      <p className={`font-martian-mono text-base ${bgColor === 'sand' ? 'text-ink group-hover:text-sand' : bgColor === 'olive' ? 'text-[#EAE2DF] group-hover:text-[#191717]' : `${textColors[bgColor]} ${hoverTextColors[bgColor]}`} opacity-80 group-hover:opacity-100`}
                         style={{ transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)' }}>
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

              {/* View Project Button with enhanced transitions */}
              <motion.div 
                className="flex justify-end"
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
                        className="group flex items-center gap-3 cursor-pointer"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <span className={`font-martian-mono font-semibold text-sm uppercase tracking-wider ${buttonStyles.text} transition-all duration-500`}>
                          {buttonText}
                        </span>
                        <div className={`w-10 h-10 rounded-lg ${buttonStyles.iconBg} flex items-center justify-center transition-all duration-500`}>
                          <svg 
                            width="24" 
                            height="24"
                            className={`${buttonStyles.iconColor} group-hover:translate-x-0.5 transition-all duration-500`}
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
                    <motion.div 
                      className="group flex items-center gap-3 cursor-pointer"
                      onClick={handleButtonClick}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <span className={`font-martian-mono font-semibold text-sm uppercase tracking-wider ${buttonStyles.text} transition-all duration-500`}>
                        {buttonText}
                      </span>
                      <div className={`w-10 h-10 rounded-lg ${buttonStyles.iconBg} flex items-center justify-center transition-all duration-500`}>
                        <svg 
                          width="24" 
                          height="24"
                          className={`${buttonStyles.iconColor} group-hover:translate-x-0.5 transition-all duration-500`}
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