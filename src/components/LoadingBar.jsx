import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingBar - A sleek loading bar component that fits the site's aesthetic
 * Features progress indication, smooth animations, and mobile optimization
 */
const LoadingBar = ({ 
  isLoading = false, 
  progress = null, // 0-100 for determinate progress, null for indeterminate
  title = "Loading", 
  subtitle = "",
  className = "",
  showPercentage = false,
  glitchEffect = false // Enable glitch effect for special loading states
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle visibility with slight delay to prevent flash
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Smooth progress updates
  useEffect(() => {
    if (progress !== null) {
      // Smooth transition to new progress value
      const startProgress = displayProgress;
      const targetProgress = progress;
      const duration = 300; // 300ms transition
      const startTime = Date.now();
      
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
        const currentProgress = startProgress + (targetProgress - startProgress) * easedProgress;
        
        setDisplayProgress(currentProgress);
        
        if (progressRatio < 1) {
          requestAnimationFrame(animateProgress);
        }
      };
      
      requestAnimationFrame(animateProgress);
    } else if (isLoading) {
      // Indeterminate progress simulation
      let start = 0;
      const interval = setInterval(() => {
        start += Math.random() * 12 + 3; // Random increment between 3-15
        if (start > 85) start = 85; // Cap at 85% for indeterminate
        setDisplayProgress(start);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [progress, isLoading]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={`fixed top-0 left-0 w-full h-full z-[99999] flex items-center justify-center bg-ink/95 backdrop-blur-sm ${className}`}
          style={{ 
            height: '100vh', 
            height: '100dvh',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
                      <div className="relative w-full max-w-md mx-4">
              {/* Glass morphism container */}
              <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl p-8 overflow-hidden">
                
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cream/[0.005] via-stone/[0.005] to-cream/[0.005] opacity-30" />
                
                {/* Content */}
                <div className="relative z-10 text-center flex flex-col items-center justify-center">
                
                {/* Title */}
                <motion.h3 
                  className="font-display text-xl md:text-2xl font-bold text-cream mb-2"
                  animate={glitchEffect ? {
                    textShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "2px 0 0px rgba(255, 51, 51, 0.3), -2px 0 0px rgba(51, 51, 255, 0.3)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {title}
                </motion.h3>
                
                {/* Subtitle */}
                {subtitle && (
                  <p className="font-martian-mono text-sm text-cream/60 mb-8">
                    {subtitle}
                  </p>
                )}
                
                {/* Progress Bar Container */}
                <div className="relative mb-4">
                  {/* Background track */}
                  <div className="w-full h-2 bg-stone/10 rounded-full overflow-hidden">
                    {/* Progress fill */}
                    <motion.div
                      className="h-full rounded-full origin-left"
                      style={{
                        background: progress !== null 
                          ? "linear-gradient(90deg, rgba(234, 226, 223, 0.4) 0%, rgba(234, 226, 223, 0.6) 50%, rgba(234, 226, 223, 0.4) 100%)"
                          : "linear-gradient(90deg, rgba(234, 226, 223, 0.3) 0%, rgba(234, 226, 223, 0.5) 100%)"
                      }}
                      initial={{ scaleX: 0 }}
                                              animate={{ 
                          scaleX: displayProgress / 100,
                          background: progress === null ? [
                            "linear-gradient(90deg, rgba(234, 226, 223, 0.3) 0%, rgba(234, 226, 223, 0.5) 100%)",
                            "linear-gradient(90deg, rgba(234, 226, 223, 0.4) 0%, rgba(234, 226, 223, 0.6) 100%)",
                            "linear-gradient(90deg, rgba(234, 226, 223, 0.5) 0%, rgba(234, 226, 223, 0.4) 100%)",
                            "linear-gradient(90deg, rgba(234, 226, 223, 0.3) 0%, rgba(234, 226, 223, 0.5) 100%)"
                          ] : undefined
                        }}
                      transition={{ 
                        scaleX: { 
                          duration: 0.4, 
                          ease: [0.25, 0.1, 0.25, 1]
                        },
                        background: progress === null ? {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : {}
                      }}
                    />
                    
                    {/* Animated shimmer effect for indeterminate progress */}
                    {progress === null && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/10 to-transparent"
                        animate={{
                          x: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Progress percentage */}
                  {(showPercentage && progress !== null) && (
                    <motion.div 
                      className="absolute -top-8 left-0 font-martian-mono text-xs text-cream/60"
                      style={{ left: `${Math.min(displayProgress, 95)}%` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {Math.round(displayProgress)}%
                    </motion.div>
                  )}
                </div>
                
                {/* Loading dots indicator */}
                <div className="flex justify-center items-center gap-1 w-full">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-1.5 h-1.5 bg-cream/25 rounded-full"
                                              animate={{
                          opacity: [0.2, 0.6, 0.2],
                          scale: [1, 1.1, 1]
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
                
                {/* Debug info (development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="font-martian-mono text-xs text-cream/40">
                      Progress: {Math.round(displayProgress)}%
                      {progress !== null ? ' (Determinate)' : ' (Indeterminate)'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingBar; 