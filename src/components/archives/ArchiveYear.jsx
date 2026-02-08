import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ArchiveCard from './ArchiveCard';

const ArchiveYear = ({ year, projects, isActive, yearConfig, onElementSelect }) => {
  // CRITICAL: Check for projects BEFORE calling any hooks to prevent hooks errors
  if (!projects || projects.length === 0) {
    return null;
  }

  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile detection for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(width < 768 || isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Optimize intersection observer for mobile - higher threshold and less frequent triggers
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: isMobile ? 0.05 : 0.1, // Lower threshold on mobile
    rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px' // Smaller margin on mobile
  });

  const containerVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6, // Faster animations on mobile
        ease: isMobile ? "easeOut" : [0.215, 0.610, 0.355, 1.000],
        staggerChildren: isMobile ? 0.05 : 0.1 // Reduced stagger on mobile
      }
    }
  };

  const handleCardExpansion = useCallback((cardId) => {
    setExpandedCardId(prev => (prev === cardId ? null : cardId));
  }, []);

  return (
    <motion.section
      id={`year-${year}`}
      ref={ref}
      className={`mb-16 sm:mb-20 md:mb-24 transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-60'
      } ${isMobile ? 'mobile-year-optimized' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Year Header - simplified on mobile */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <motion.div 
          className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6"
          initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: isMobile ? 0.3 : 0.6,
            ease: isMobile ? "easeOut" : [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <h2 className={`font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl text-sand ${
            isMobile ? 'leading-none' : ''
          }`}>
            {year}
          </h2>
          <div className="flex-1 h-px bg-stone/20" />
          <span className="font-martian-mono text-stone text-xs sm:text-sm">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </motion.div>

        {/* Year description/context if configured - simplified on mobile */}
        {yearConfig?.description && (
          <motion.p 
            className="font-martian-mono text-cream/60 text-sm sm:text-base mb-4 sm:mb-6 max-w-3xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: isMobile ? 0.1 : 0.3, 
              duration: isMobile ? 0.3 : 0.6 
            }}
          >
            {yearConfig.description}
          </motion.p>
        )}
      </div>

      {/* Projects Grid - Optimized spacing for mobile */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 2xl:gap-12 items-start ${
        isMobile ? 'mobile-grid-optimized' : ''
      }`}>
        {projects.map((project, index) => {
          // Create a guaranteed unique and stable key for each card.
          // This prevents re-rendering issues if project.id is missing or not unique.
          const uniqueCardId = `${year}-${project.id || project.title}-${index}`;

          return (
            <ArchiveCard
              key={uniqueCardId}
              project={project}
              index={index}
              inView={inView}
              yearData={yearConfig}
              onElementSelect={onElementSelect}
              isExpanded={expandedCardId === uniqueCardId}
              onToggleExpanded={() => handleCardExpansion(uniqueCardId)}
              isMobile={isMobile} // Pass mobile state to cards
            />
          );
        })}
      </div>

      {/* Year footer/stats if configured - simplified on mobile */}
      {yearConfig?.stats && (
        <motion.div 
          className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-stone/20"
          initial={{ opacity: 0, y: isMobile ? 5 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: isMobile ? 0.4 : 0.8, 
            duration: isMobile ? 0.3 : 0.6 
          }}
        >
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 ${
            isMobile ? 'text-center' : ''
          }`}>
            {Object.entries(yearConfig.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-display text-lg sm:text-xl lg:text-2xl text-cream">{value}</div>
                <div className="font-martian-mono text-stone text-xs uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

ArchiveYear.displayName = 'ArchiveYear';

export default React.memo(ArchiveYear, (prevProps, nextProps) => {
  return (
    prevProps.year === nextProps.year &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.projects === nextProps.projects &&
    prevProps.yearConfig === nextProps.yearConfig &&
    prevProps.onElementSelect === nextProps.onElementSelect
  );
}); 