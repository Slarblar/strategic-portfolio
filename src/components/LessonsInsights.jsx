import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const LessonsInsights = () => {
  const lessons = [
    {
      title: "Physical Experiences Enhance Digital Value",
      description: "Tangible interactions create stronger emotional connections to digital assets than purely virtual offerings."
    },
    {
      title: "Utility Drives Sustainability",
      description: "Projects built around genuine utility and value creation outlast those focused solely on speculation."
    },
    {
      title: "Speed and Quality Can Coexist",
      description: "Compressed timelines can accelerate innovation when supported by clear vision and efficient processes."
    },
    {
      title: "Community Trust Requires Transparency",
      description: "Successful Web3 projects must prioritize clear communication and demonstrable value delivery."
    },
    {
      title: "Strategic Partnerships Amplify Impact",
      description: "Collaborations with established players can provide credibility and reach that accelerates community growth."
    }
  ];

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
        delay: i * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
        opacity: {
          duration: 0.4,
          ease: "linear"
        }
      }
    }),
    hover: {
      y: -10,
      transition: {
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  // Colors for each card
  const cardColors = [
    'orange',
    'olive',
    'sky',
    'orange',
    'olive'
  ];

  return (
    <section className="w-full bg-orange rounded-2xl p-8 md:p-12 mb-32 relative overflow-hidden group">
      {/* Background accent */}
      <motion.div 
        className="absolute inset-0 bg-sky/5 opacity-0 group-hover:opacity-100 transition-all duration-700"
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
        className="font-display text-[40px] leading-none mb-16 text-ink relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlitchText text="LESSONS & INSIGHTS" />
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
            custom={index}
            className="bg-ink rounded-xl p-8 text-sand relative group/card cursor-pointer"
          >
            {/* Hover accent */}
            <div className={`absolute inset-0 rounded-xl bg-${cardColors[index]}/0 group-hover/card:bg-${cardColors[index]}/10 transition-all duration-500`} />
            
            {/* Glitch effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-sky/0 group-hover/card:bg-sky/5 transition-all duration-75 transform group-hover/card:translate-x-[1px] group-hover/card:translate-y-[1px]" />
            <div className="absolute inset-0 rounded-xl bg-orange/0 group-hover/card:bg-orange/5 transition-all duration-75 transform group-hover/card:translate-x-[-1px] group-hover/card:translate-y-[-1px]" />
            
            <div className="relative z-10">
              <motion.h3 
                className="font-martian-mono text-xl mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <GlitchText text={lesson.title} />
              </motion.h3>
              <motion.p 
                className="font-martian-mono text-sm leading-relaxed text-sand/90"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {lesson.description}
              </motion.p>

              {/* Interactive indicator */}
              <motion.div 
                className={`mt-6 h-[2px] w-0 bg-${cardColors[index]} group-hover/card:w-full transition-all duration-500`}
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                exit={{ width: 0 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LessonsInsights; 