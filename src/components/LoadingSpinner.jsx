import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingSpinner - A smaller loading component for inline/embedded loading states
 * Designed to replace the old animate-spin loading indicators with a better UX
 */
const LoadingSpinner = ({ 
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  color = 'cream', // 'cream', 'ink', 'orange', 'olive', 'sky'
  text = null,
  className = "",
  style = {},
  showDots = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    cream: 'border-cream/30 border-t-cream',
    ink: 'border-ink/30 border-t-ink',
    orange: 'border-orange/30 border-t-orange',
    olive: 'border-olive/30 border-t-olive',
    sky: 'border-sky/30 border-t-sky'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const textColors = {
    cream: 'text-cream/60',
    ink: 'text-ink/60',
    orange: 'text-orange/60',
    olive: 'text-olive/60',
    sky: 'text-sky/60'
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={style}>
      {/* Spinner */}
      <motion.div
        className={`border-2 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Text */}
      {text && (
        <span className={`font-martian-mono ${textSizes[size]} ${textColors[color]}`}>
          {text}
        </span>
      )}
      
      {/* Animated dots */}
      {showDots && !text && (
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-1 h-1 rounded-full ${colorClasses[color].split(' ')[1].replace('border-t-', 'bg-')}`}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 