import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TimelineSearch = ({ value, onChange, isMobile }) => {
  return (
    <div className={`${isMobile ? 'w-full' : 'w-64'}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-stone/10 text-cream placeholder-stone/60 px-4 py-2 rounded-lg font-martian-mono text-sm focus:outline-none focus:ring-1 focus:ring-cream/30 transition-all"
        />
        
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone/60">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-stone/60 hover:text-cream transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Count */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 font-martian-mono text-stone text-sm"
          >
            Press Enter to search
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineSearch; 