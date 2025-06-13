import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Example component demonstrating standardized loading transitions
 * This pattern can be applied to any component that needs async loading states
 */
const LoadingTransitionExample = ({ 
  title, 
  content, 
  bgColor = 'sand',
  asyncData = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Example color system (can be extracted to a shared utility)
  const colorMap = {
    sand: {
      bg: 'bg-[#EAE2DF]',
      skeleton: 'bg-[#F5F0ED]',
      text: 'text-[#1A1717]',
      hover: 'hover:bg-[#1A1717]',
      hoverText: 'group-hover:text-[#EAE2DF]'
    },
    olive: {
      bg: 'bg-[#465902]',
      skeleton: 'bg-[#5A6D0A]',
      text: 'text-[#EAE2DF]',
      hover: 'hover:bg-[#FF6600]',
      hoverText: 'group-hover:text-[#1A1717]'
    },
    orange: {
      bg: 'bg-[#FF6600]',
      skeleton: 'bg-[#FF8533]',
      text: 'text-[#1A1717]',
      hover: 'hover:bg-[#465902]',
      hoverText: 'group-hover:text-[#EAE2DF]'
    }
  };

  const colors = colorMap[bgColor] || colorMap.sand;

  // Standardized animation variants
  const cardVariants = {
    loading: {
      opacity: 0.8,
      scale: 0.98,
      filter: "blur(2px)",
      transition: { duration: 0.4, ease: [0.215, 0.610, 0.355, 1.000] }
    },
    loaded: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }
    },
    hover: {
      y: -4,
      scale: 1.01,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  };

  const contentVariants = {
    loading: {
      opacity: 0.6,
      y: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    loaded: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  };

  return (
    <motion.div
      className={`group ${isLoaded ? colors.bg : colors.skeleton} ${colors.hover} rounded-2xl p-6 cursor-pointer smooth-transition`}
      variants={cardVariants}
      initial="loading"
      animate={isLoaded ? "loaded" : "loading"}
      whileHover="hover"
      style={{
        transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        willChange: 'transform, background-color, opacity',
      }}
    >
      {/* Shimmer loading effect */}
      {!isLoaded && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"
        />
      )}

      {/* Content with staggered loading */}
      <motion.div
        variants={contentVariants}
        animate={isLoaded ? "loaded" : "loading"}
        className="relative z-20"
      >
        {/* Title */}
        <motion.h3
          className={`font-display font-black text-xl ${colors.text} ${colors.hoverText} mb-4`}
          style={{ transition: 'color 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0.7, y: isLoaded ? 0 : 5 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {isLoaded ? title : (
            <div className="w-3/4 h-6 loading-skeleton" />
          )}
        </motion.h3>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0.6, y: isLoaded ? 0 : 5 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isLoaded ? (
            <p className={`${colors.text} ${colors.hoverText} opacity-80 group-hover:opacity-100`}
               style={{ transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)' }}>
              {content}
            </p>
          ) : (
            <div className="space-y-2">
              <div className="w-full h-4 loading-skeleton" />
              <div className="w-5/6 h-4 loading-skeleton" />
              <div className="w-4/5 h-4 loading-skeleton" />
            </div>
          )}
        </motion.div>

        {/* Action button */}
        <motion.div
          className="mt-6 flex justify-end"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0.4, y: isLoaded ? 0 : 5 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {isLoaded ? (
            <motion.button
              className={`px-4 py-2 rounded-lg ${colors.text} ${colors.hoverText} font-medium`}
              style={{ transition: 'all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          ) : (
            <div className="w-24 h-8 loading-skeleton" />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Usage examples:
 * 
 * // Basic usage
 * <LoadingTransitionExample 
 *   title="Project Title"
 *   content="Project description content"
 *   bgColor="sand"
 * />
 * 
 * // With async data
 * <LoadingTransitionExample 
 *   title={asyncData?.title}
 *   content={asyncData?.description}
 *   bgColor="olive"
 *   asyncData={asyncData}
 * />
 * 
 * // Different color variants
 * <LoadingTransitionExample bgColor="orange" title="Orange Card" content="Content" />
 * <LoadingTransitionExample bgColor="olive" title="Olive Card" content="Content" />
 * <LoadingTransitionExample bgColor="sand" title="Sand Card" content="Content" />
 */

export default LoadingTransitionExample; 