import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Z_INDEX } from './constants/zIndexLayers';

const SelectedHighlight = ({ 
  selectedElement, 
  isVisible = false,
  highlightColor = 'bg-cream/10',
  borderColor = 'border-cream/20'
}) => {
  if (!selectedElement || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`absolute pointer-events-none ${highlightColor} ${borderColor} border-2 rounded-lg`}
          style={{
            zIndex: Z_INDEX.SELECTED_HIGHLIGHT,
            left: selectedElement.x,
            top: selectedElement.y,
            width: selectedElement.width,
            height: selectedElement.height,
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.95,
            boxShadow: '0 0 0 0 rgba(238, 226, 222, 0.4)'
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: [
              '0 0 0 0 rgba(238, 226, 222, 0.4)',
              '0 0 0 8px rgba(238, 226, 222, 0.1)',
              '0 0 0 0 rgba(238, 226, 222, 0.4)'
            ]
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            transition: { duration: 0.2 }
          }}
          transition={{
            duration: 0.3,
            ease: [0.215, 0.610, 0.355, 1.000],
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default SelectedHighlight; 