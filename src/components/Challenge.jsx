import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import { projectsData } from '../data/projectsData';

const Challenge = ({ id, bgColor = 'bg-[#eae2df]', challengeData }) => {
  // Get challenge data from props, projectsData, or fallback
  const getChallengeData = () => {
    if (challengeData) return challengeData;
    if (id && projectsData[id]?.challenge) return projectsData[id].challenge;
    return null;
  };

  const challenge = getChallengeData();
  
  // Early return if no challenge data
  if (!challenge) {
    return (
      <div className={`${bgColor} w-full rounded-xl sm:rounded-2xl py-4 xs:py-5 sm:py-6 md:py-8`}>
        <h2 className="font-display font-black text-[2rem] sm:text-[2.25rem] md:text-[2.5rem] leading-none mb-6 sm:mb-8 text-cream">
          <GlitchText text="THE CHALLENGE" />
        </h2>
        <p className="font-martian-mono text-xs sm:text-sm leading-relaxed text-cream/90">
          Challenge details coming soon...
        </p>
      </div>
    );
  }

  const isSpacestation = id === 'spacestation-animation';
  const textColor = isSpacestation ? 'text-ink' : 'text-cream';
  const textColorWithOpacity = isSpacestation ? 'text-ink/90' : 'text-cream/90';

  // Helper function to parse limitations into title and description
  const parseLimitation = (limitation) => {
    if (limitation.includes(':')) {
      const [title, ...descriptionParts] = limitation.split(':');
      return {
        title: title.trim(),
        description: descriptionParts.join(':').trim()
      };
    }
    // For backwards compatibility with existing data
    return {
      title: limitation,
      description: ''
    };
  };

  return (
    <div className={`${bgColor} w-full rounded-xl sm:rounded-2xl py-4 xs:py-5 sm:py-6 md:py-8`}>
      <div className="relative">
        {/* Challenge Title with Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <h2 className={`font-display font-black text-[2rem] sm:text-[2.25rem] md:text-[2.5rem] leading-none mb-10 sm:mb-14 ${textColor}`}>
            <GlitchText text="THE CHALLENGE" />
          </h2>
        </motion.div>
        
        {/* Challenge Description */}
        {challenge.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6,
              delay: 0.1,
              ease: [0.215, 0.610, 0.355, 1.000]
            }}
            className="mb-4 sm:mb-6"
          >
            <p className={`font-martian-mono text-xs sm:text-sm md:text-base leading-relaxed ${textColorWithOpacity}`}>
              {challenge.description}
            </p>
          </motion.div>
        )}

        {/* Challenge Details */}
        <motion.div className="space-y-3 sm:space-y-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6,
            delay: 0.2,
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          {challenge.limitations?.map((limitation, index) => {
            const { title, description } = parseLimitation(limitation);
            return (
              <motion.div 
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.3 + (index * 0.1)
                }}
              >
                <h3 className={`font-martian-mono font-bold text-sm sm:text-base md:text-lg tracking-wider ${textColor}`}>
                  {title.toUpperCase()}
                </h3>
                {description && (
                  <p className={`font-martian-mono text-xs sm:text-sm md:text-base leading-relaxed ${textColorWithOpacity}`}>
                    {description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Challenge; 