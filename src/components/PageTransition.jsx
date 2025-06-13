import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0, 
          y: 20 
        }}
        animate={{ 
          opacity: 1, 
          y: 0 
        }}
        exit={{ 
          opacity: 0, 
          y: -10 
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{ 
          // Safe positioning that won't interfere with modals
          position: 'relative',
          zIndex: 1,
          isolation: 'auto'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 