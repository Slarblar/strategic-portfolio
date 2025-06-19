import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ArchiveCard from './ArchiveCard';

const ArchiveYear = ({ year, projects, isActive, yearConfig, onElementSelect }) => {
  const [expandedCardId, setExpandedCardId] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.610, 0.355, 1.000],
        staggerChildren: 0.1
      }
    }
  };

  const handleCardExpansion = useCallback((cardId) => {
    setExpandedCardId(prev => (prev === cardId ? null : cardId));
  }, []);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <motion.section
      id={`year-${year}`}
      className={`mb-16 sm:mb-20 md:mb-24 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Year Header */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-sand">
            {year}
          </h2>
          <div className="flex-1 h-px bg-stone/20 hidden sm:block" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-martian-mono text-stone text-sm order-2 sm:order-1">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
            
            {/* Year-specific badge if configured */}
            {yearConfig?.highlight && (
              <span className="px-2 py-1 bg-cream/20 text-cream font-martian-mono text-xs rounded uppercase tracking-wider order-1 sm:order-2 self-start sm:self-auto">
                {yearConfig.highlight}
              </span>
            )}
          </div>
        </motion.div>

        {/* Year description/context if configured */}
        {yearConfig?.description && (
          <motion.p 
            className="font-martian-mono text-cream/60 text-sm sm:text-base mb-4 sm:mb-6 max-w-3xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {yearConfig.description}
          </motion.p>
        )}
      </div>

      {/* Projects Grid - Stable grid with generous spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
        {projects.map((project, index) => {
          // Create a guaranteed unique and stable key for each card.
          // This prevents re-rendering issues if project.id is missing or not unique.
          const uniqueCardId = `${year}-${project.id || project.title}-${index}`;

          return (
            <ArchiveCard
              key={uniqueCardId}
              project={project}
              index={index}
              yearData={yearConfig}
              onElementSelect={onElementSelect}
              isExpanded={expandedCardId === uniqueCardId}
              onToggleExpanded={() => handleCardExpansion(uniqueCardId)}
            />
          );
        })}
      </div>

      {/* Year footer/stats if configured */}
      {yearConfig?.stats && (
        <motion.div 
          className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-stone/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(yearConfig.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-display text-xl sm:text-2xl lg:text-2xl text-cream">{value}</div>
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