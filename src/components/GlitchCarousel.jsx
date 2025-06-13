import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const lessons = [
  {
    title: 'Authentic Scaling',
    description: 'Growth requires systems, but those systems must preserve the authentic elements that created initial connection.'
  },
  {
    title: 'Platform Synergy',
    description: 'Each platform should leverage unique strengths while reinforcing a cohesive brand story.'
  },
  {
    title: 'Design for Two Audiences',
    description: "Children's content must simultaneously engage children while earning parent trust."
  },
  {
    title: 'Revenue and Creativity',
    description: 'Business goals and creative excellence can be complementary when properly aligned.'
  },
  {
    title: 'Adapt',
    description: 'Building flexible production frameworks allows for evolution without constant restructuring.'
  }
];

const LessonsInsightsSection = () => (
  <section className="w-full bg-[#eae2df] py-24 px-0 rounded-2xl">
    <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row gap-0 md:gap-12 px-4 md:px-12">
      {/* Left Sticky Column */}
      <div className="md:w-1/3 flex-shrink-0 mb-12 md:mb-0 md:sticky md:top-32 h-fit">
        <h2 className="font-display text-[2.5rem] md:text-[3.5rem] xl:text-[5rem] font-black text-ink leading-tight">
          <GlitchText text="Lessons &" />
          <br />
          <GlitchText text="Insights" />
        </h2>
      </div>
      {/* Right Scrollable Column */}
      <div className="md:w-2/3 flex flex-col gap-10">
        {lessons.map((lesson, idx) => (
          <motion.div
            key={lesson.title}
            className="bg-white/80 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-start w-full max-w-[500px] md:max-w-none"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: idx * 0.13, ease: 'easeOut' }}
          >
            <div className="font-bold text-xl md:text-2xl mb-2 text-ink w-full text-left">
              <GlitchText text={lesson.title} />
            </div>
            <div className="font-martian-mono text-base md:text-lg text-ink text-left">
              {lesson.description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LessonsInsightsSection; 