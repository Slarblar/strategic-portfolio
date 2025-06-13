import React from 'react';
import { motion, useTransform } from 'framer-motion';

const TimelineScrubber = ({ years, activeYear, progress, onYearClick }) => {
  const progressHeight = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div className="relative flex flex-col items-center">
      {/* Progress Bar */}
      <div className="absolute inset-0 w-1 bg-stone/30 rounded-full overflow-hidden">
        <motion.div 
          className="w-full bg-cream origin-top rounded-full"
          style={{ height: progressHeight }}
        />
      </div>

      {/* Year Markers */}
      <div className="relative flex flex-col gap-8">
        {years.map((year) => (
          <motion.button
            key={year}
            onClick={() => onYearClick(year)}
            className={`relative pl-6 font-martian-mono text-sm transition-colors ${
              activeYear === year ? 'text-cream' : 'text-stone hover:text-cream/80'
            }`}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Marker Dot */}
            <div 
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors ${
                activeYear === year ? 'bg-cream' : 'bg-stone'
              }`}
            />
            {year}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TimelineScrubber; 