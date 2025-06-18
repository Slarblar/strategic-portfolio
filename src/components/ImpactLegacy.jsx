import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const CardTitle = React.memo(({ title }) => (
  <motion.h3
    className="font-martian-mono text-xl"
  >
    <GlitchText text={title} />
  </motion.h3>
));

const ImpactCard = ({ title, items }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    backgroundColor: isHovered ? '#1A1717' : '#d04f1a', // Ink on hover, New Rust by default
    color: isHovered ? '#EAE2DF' : '#1A1717', // Sand on hover, Ink by default
  };

  return (
    <div 
      className="group relative rounded-xl p-8 transition-all duration-500 ease-in-out"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-6">
        <CardTitle title={title} />
        <motion.div
          className="transform transition-all duration-500 ease-in-out opacity-50 group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transform transition-transform duration-500 ease-in-out group-hover:translate-y-1 group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>
      
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
        <div className="overflow-hidden">
          <ul className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out delay-100 space-y-4 transform translate-y-2 group-hover:translate-y-0">
            {items.map((item, index) => (
              <li
                key={index}
                className="font-martian-mono text-sm leading-relaxed flex items-start"
              >
                <span className="mr-2 opacity-60">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ImpactLegacy = ({ impact }) => {
  return (
    <section className="w-full rounded-2xl p-8 mb-32 text-ink" style={{ backgroundColor: '#FF6600' }}>
      <motion.h2 
        className="font-display font-black text-[40px] leading-none mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlitchText text="IMPACT AND LEGACY" />
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ImpactCard
          title="SHORT-TERM IMPACT"
          items={impact.shortTerm}
        />
        <ImpactCard
          title="LONG-TERM IMPACT"
          items={impact.longTerm}
        />
      </div>

      <motion.div
        className="bg-ink rounded-xl p-8 text-sand"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-martian-mono text-xl mb-6">
          <GlitchText text="LEGACY" />
        </h3>
        <motion.p
          className="font-martian-mono text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {impact.legacy}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ImpactLegacy; 