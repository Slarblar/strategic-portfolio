import React from 'react';
import { motion } from 'framer-motion';

const TimelineFilters = ({ filters, onChange, isMobile }) => {
  const handleSizeChange = (size) => {
    onChange({ ...filters, size });
  };

  return (
    <div className={`${isMobile ? 'w-full' : ''}`}>
      <div className="flex gap-2">
        {['all', 'large', 'small'].map((size) => (
          <motion.button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`px-3 py-1 rounded font-martian-mono text-xs uppercase tracking-wider transition-colors ${
              filters.size === size
                ? 'bg-cream text-ink'
                : 'text-stone hover:text-cream'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {size}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TimelineFilters; 