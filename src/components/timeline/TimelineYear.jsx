import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SimpleProjectCard from './SimpleProjectCard';

const TimelineYear = ({ year, projects, isActive, onInView }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) onInView();
    }
  });

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

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <motion.section
      id={`year-${year}`}
      ref={ref}
      className={`mb-24 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Year Header */}
      <div className="mb-12">
        <motion.div 
          className="flex items-center gap-6 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <h2 className="font-display text-6xl md:text-7xl text-sand">
            {year}
          </h2>
          <div className="flex-1 h-px bg-stone/20" />
          <span className="font-martian-mono text-stone text-sm">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <SimpleProjectCard
            key={project.id}
            project={project}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default TimelineYear; 