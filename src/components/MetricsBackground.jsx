import React from 'react';
import { motion } from 'framer-motion';

const MetricsBackground = () => {
  // Generate random heights for bars
  const bars = Array.from({ length: 8 }, () => ({
    height: Math.random() * 60 + 20, // Between 20% and 80%
    delay: Math.random() * 0.3,
    duration: 1.2 + Math.random() * 0.8, // Random duration between 1.2 and 2 seconds
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div className="relative w-full h-full">
        {/* Abstract bars */}
        <div className="absolute right-0 bottom-0 flex items-end h-full w-2/3 justify-end pr-4">
          {bars.map((bar, index) => (
            <motion.div
              key={index}
              className="w-[3.5px] mx-[4px] bg-ink opacity-35 mix-blend-color-burn"
              initial={{ height: 0 }}
              animate={{
                height: [`${bar.height}%`, `${bar.height * 0.4}%`, `${bar.height}%`],
              }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: bar.delay,
              }}
              viewport={{ once: true }}
            />
          ))}
        </div>

        {/* Floating dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={`dot-${index}`}
              className="absolute w-1 h-1 bg-ink rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
                transition: {
                  duration: 2,
                  delay: Math.random(),
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2
                }
              }}
              viewport={{ once: true }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsBackground; 