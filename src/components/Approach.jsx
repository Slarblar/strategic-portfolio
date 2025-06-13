import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import LazyApproachVideo from './LazyApproachVideo';
import { projectsData } from '../data/projectsData';

const Approach = ({ projectId, approachData, bgColor = 'bg-olive', textColor = 'text-sand' }) => {
  // Get approach data from props, projectsData, or fallback
  const getApproachData = () => {
    if (approachData) return approachData;
    if (projectId && projectsData[projectId]?.approach) return projectsData[projectId].approach;
    return null;
  };

  const approach = getApproachData();
  
  // Early return if no approach data
  if (!approach) {
    return (
      <section className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
        <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
          <GlitchText text="MY APPROACH" />
        </h2>
        <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-cream/90">
          Approach details coming soon...
        </p>
      </section>
    );
  }

  // Convert approach object to array for rendering
  const approachSections = Object.values(approach);

  return (
    <section className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
      <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none mb-12 xs:mb-14 sm:mb-14 lg:mb-16">
        <GlitchText text="MY APPROACH" />
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6 xs:gap-6 sm:gap-6 lg:gap-8">
          {approachSections.map((section, index) => (
            <motion.div
              key={section.title || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                y: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileHover={{ 
                y: -12,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              className={`${bgColor} rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col min-h-full transform-gpu`}
            >
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                <h3 className={`font-martian-mono text-base sm:text-lg tracking-wider ${textColor}`}>
                  {section.title}
                </h3>
                <p className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${textColor}/90`}>
                  {section.description}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {section.points?.map((point, pointIndex) => (
                    <li key={pointIndex} className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${textColor}/90 flex items-start`}>
                      <span className={`mr-2 ${textColor}/60`}>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {section.videoId && (
                <div className="aspect-[16/9] bg-ink rounded-lg sm:rounded-xl overflow-hidden mt-6 sm:mt-8">
                  <LazyApproachVideo 
                    videoId={section.videoId}
                    section={section.title?.toLowerCase().replace(/\s+/g, '-')}
                    thumbnailUrl={section.thumbnailUrl}
                    className="w-full h-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
    </section>
  );
};

export default Approach; 