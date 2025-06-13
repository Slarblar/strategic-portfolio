import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const ProjectEvolution = () => {
  return (
    <section className="relative mb-16 sm:mb-24 md:mb-32">
      {/* Background with gradient and glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#591902] via-[#465902] to-[#FF6600] opacity-5 rounded-xl sm:rounded-2xl" />
      <div className="absolute inset-0 backdrop-blur-sm bg-[#191717]/10 rounded-xl sm:rounded-2xl" />
      
      {/* Content */}
      <div className="relative p-8 sm:p-12">
        <motion.h2 
          className="font-display font-black text-[2rem] xs:text-[2.25rem] sm:text-[2.5rem] leading-none mb-12 xs:mb-16 text-[#EAE2DF]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            ease: [0.215, 0.610, 0.355, 1.000]
          }}
        >
          <GlitchText text="PROJECT EVOLUTION & MARKET CONTEXT" />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Market Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ 
              y: -8,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="group relative"
          >
            {/* Card Background with gradient and glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#591902] via-[#465902] to-[#FF6600] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />
            <div className="absolute inset-0 backdrop-blur-sm bg-[#191717]/20 rounded-xl sm:rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
            
            {/* Content */}
            <div className="relative p-6 sm:p-8 border border-[#FF6600]/10 rounded-xl sm:rounded-2xl">
              <motion.h3 
                className="font-martian-mono text-lg sm:text-xl tracking-wider mb-6 text-[#FF6600]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <GlitchText text="MARKET IMPACT" />
              </motion.h3>
              <motion.p 
                className="font-martian-mono text-sm sm:text-base leading-relaxed text-[#EAE2DF]/80 group-hover:text-[#EAE2DF] transition-colors duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Quarter Machine's operations were significantly impacted by the 2022-2023 crypto market downturn, which affected the broader Web3 ecosystem and reduced community engagement across the industry. While the project faced challenges during this period, the core innovations in physical-digital integration and the partnerships established continue to influence industry approaches to NFT utility and community building.
              </motion.p>
            </div>
          </motion.div>

          {/* Future Implications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ 
              y: -8,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            className="group relative"
          >
            {/* Card Background with gradient and glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600] via-[#465902] to-[#591902] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />
            <div className="absolute inset-0 backdrop-blur-sm bg-[#191717]/20 rounded-xl sm:rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
            
            {/* Content */}
            <div className="relative p-6 sm:p-8 border border-[#FF6600]/10 rounded-xl sm:rounded-2xl">
              <motion.h3 
                className="font-martian-mono text-lg sm:text-xl tracking-wider mb-6 text-[#FF6600]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <GlitchText text="FUTURE IMPLICATIONS" />
              </motion.h3>
              <motion.p 
                className="font-martian-mono text-sm sm:text-base leading-relaxed text-[#EAE2DF]/80 group-hover:text-[#EAE2DF] transition-colors duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                The experience provided valuable insights into market timing, community sustainability during economic downturns, and the importance of diversified revenue models in emerging technology sectors. The hardware technology and distribution methodologies developed remain relevant for future Web3 applications as the market evolves.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectEvolution; 