import React from 'react';
import { motion } from 'framer-motion';

const BulletPoint = ({ 
  text, 
  textColor = 'text-sand/90',
  bulletColor = 'text-sand/60',
  isAnimated = false,
  delay = 0,
  className = ''
}) => {
  const content = (
    <div className={`font-martian-mono text-xs sm:text-sm leading-relaxed ${textColor} flex items-start ${className}`}>
      <span className={`mr-2 flex-shrink-0 ${bulletColor}`}>•</span>
      <span className="flex-1">{text}</span>
    </div>
  );

  if (isAnimated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          delay: delay,
          ease: [0.215, 0.610, 0.355, 1.000]
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default BulletPoint; 