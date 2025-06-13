import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const AdditionalChallenges = () => {
  const challenges = [
    {
      title: "Market Saturation",
      description: "The NFT space was experiencing explosive growth with thousands of projects launching weekly, making differentiation extremely difficult."
    },
    {
      title: "Utility Gap",
      description: "Most NFT projects offered limited real-world utility beyond speculation, creating skepticism among potential collectors and creators."
    },
    {
      title: "Compressed Timeline",
      description: "We had only one month from concept to launch to capitalize on market momentum, requiring unprecedented speed in development and marketing."
    },
    {
      title: "Technical Innovation Requirements",
      description: "Creating a unique value proposition required developing both digital assets and physical distribution hardware simultaneously."
    },
    {
      title: "Community Building Challenge",
      description: "Establishing trust and engagement in a market filled with failed projects and skeptical participants."
    },
    {
      title: "Revenue Model Complexity",
      description: "Designing a sustainable tokenomics system that connected NFT ownership with animation content revenue sharing."
    }
  ];

  return (
    <section className="pt-12 sm:pt-16 md:pt-24 lg:pt-32 mb-12 sm:mb-16 md:mb-24 lg:mb-32">
      <motion.div 
        className="bg-olive rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.6,
          ease: [0.215, 0.610, 0.355, 1.000]
        }}
      >
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-display font-black text-[1.75rem] xs:text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-none">
            <GlitchText text="ADDITIONAL CHALLENGES" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.215, 0.610, 0.355, 1.000]
              }}
              whileHover={{ x: 10 }}
              className="group/item cursor-pointer"
            >
              <div className="font-martian-mono text-xs sm:text-sm leading-relaxed text-cream/90 flex items-start">
                <span className="mr-2 text-orange group-hover/item:text-sand transition-colors duration-300">•</span>
                <span className="group-hover/item:text-cream transition-colors duration-300">
                  <span className="font-bold tracking-wider block mb-1.5">{challenge.title}</span>
                  {challenge.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AdditionalChallenges; 