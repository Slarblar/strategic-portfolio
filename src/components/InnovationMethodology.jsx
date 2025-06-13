import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const InnovationMethodology = () => {
  // Animation variants for cards
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.2,
        ease: [0.21, 0.47, 0.32, 0.98],
        opacity: {
          duration: 0.4,
          ease: "linear"
        }
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }),
    hover: {
      x: 10,
      transition: {
        duration: 0.2,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  return (
    <section className="w-full bg-olive rounded-2xl p-8 md:p-12 mb-32 relative overflow-hidden group">
      {/* Background accent */}
      <motion.div 
        className="absolute inset-0 bg-orange/5 opacity-0 group-hover:opacity-100 transition-all duration-700"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.h2 
        className="font-display text-[40px] leading-none mb-16 text-sand relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlitchText text="INNOVATION & METHODOLOGY" />
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hardware Development Philosophy */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          className="bg-ink rounded-xl p-8 text-sand relative group/card"
        >
          {/* Hover accent */}
          <div className="absolute inset-0 rounded-xl bg-orange/0 group-hover/card:bg-orange/10 transition-all duration-500" />
          <div className="relative z-10">
            <h3 className="font-martian-mono text-xl mb-6">
              <GlitchText text="HARDWARE DEVELOPMENT PHILOSOPHY" />
            </h3>
            <p className="font-martian-mono text-sm leading-relaxed mb-6 text-sand/90">
              My approach to physical-digital integration focused on accessibility and experience:
            </p>
            <ul className="space-y-3">
              {[
                "Designed interfaces that didn't require existing cryptocurrency knowledge",
                "Created tactile, memorable interactions that enhanced digital ownership value",
                "Implemented fail-safes and user support systems for technology newcomers",
                "Developed modular hardware systems that could adapt to different event requirements"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  custom={index}
                  className="font-martian-mono text-sm leading-relaxed text-sand/90 flex items-start cursor-pointer group/item"
                >
                  <span className="mr-2 text-orange group-hover/item:text-sky transition-colors duration-300">•</span>
                  <span className="group-hover/item:text-sand transition-colors duration-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Community-Centric Design */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, margin: "-100px" }}
          custom={1}
          className="bg-ink rounded-xl p-8 text-sand relative group/card"
        >
          {/* Hover accent */}
          <div className="absolute inset-0 rounded-xl bg-sky/0 group-hover/card:bg-sky/10 transition-all duration-500" />
          <div className="relative z-10">
            <h3 className="font-martian-mono text-xl mb-6">
              <GlitchText text="COMMUNITY-CENTRIC DESIGN" />
            </h3>
            <p className="font-martian-mono text-sm leading-relaxed mb-6 text-sand/90">
              I prioritized genuine community value over speculative appeal:
            </p>
            <ul className="space-y-3">
              {[
                "Established transparent revenue-sharing mechanisms with clear documentation",
                "Created community governance opportunities for collection direction",
                "Implemented social media integration that rewarded authentic engagement",
                "Developed collector benefits that increased in value with community participation"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  custom={index}
                  className="font-martian-mono text-sm leading-relaxed text-sand/90 flex items-start cursor-pointer group/item"
                >
                  <span className="mr-2 text-sky group-hover/item:text-orange transition-colors duration-300">•</span>
                  <span className="group-hover/item:text-sand transition-colors duration-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Partnership Strategy */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, margin: "-100px" }}
          custom={2}
          className="bg-ink rounded-xl p-8 text-sand lg:col-span-2 relative group/card"
        >
          {/* Hover accent */}
          <div className="absolute inset-0 rounded-xl bg-olive/0 group-hover/card:bg-olive/10 transition-all duration-500" />
          <div className="relative z-10">
            <h3 className="font-martian-mono text-xl mb-6">
              <GlitchText text="PARTNERSHIP STRATEGY" />
            </h3>
            <p className="font-martian-mono text-sm leading-relaxed mb-6 text-sand/90">
              My collaboration approach emphasized mutual value creation:
            </p>
            <ul className="space-y-3">
              {[
                "Identified partners whose audiences aligned with Quarter Machine's community",
                "Developed win-win arrangements that provided value to all stakeholders",
                "Maintained Quarter Machine's unique identity while leveraging partner strengths",
                "Created sustainable relationships that extended beyond individual projects"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  custom={index}
                  className="font-martian-mono text-sm leading-relaxed text-sand/90 flex items-start cursor-pointer group/item"
                >
                  <span className="mr-2 text-olive group-hover/item:text-orange transition-colors duration-300">•</span>
                  <span className="group-hover/item:text-sand transition-colors duration-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovationMethodology; 