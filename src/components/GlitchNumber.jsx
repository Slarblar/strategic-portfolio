import React, { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const GlitchNumber = ({ value, duration = 3, calmMode = false }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const hoverIntervalRef = React.useRef(null);

  // Characters to use for scrambling (including numbers and some symbols)
  const scrambleChars = '0123456789%MK+.$';

  // Parse the numeric value from the string (e.g., "300%" -> 300, "$1M+" -> 1000000)
  const parseValue = (val) => {
    // First strip out everything except numbers and decimal points to get the base number
    const baseNumber = parseFloat(val.replace(/[^0-9.]/g, ''));
    
    if (val.includes('BN')) {
      return baseNumber * 1000000000;
    }
    if (val.includes('M')) {
      return baseNumber * 1000000;
    }
    return baseNumber;
  };

  // Format the number back to the original format
  const formatValue = (num) => {
    const hasPrefix = value.startsWith('$');
    const prefix = hasPrefix ? '$' : '';
    
    if (value.includes('BN')) {
      // For billions, show progression through millions first
      if (num < 1000000000) {
        const millions = Math.floor(num / 1000000);
        return prefix + millions + 'M+';
      }
      return prefix + (num / 1000000000).toFixed(1) + 'BN+';
    }
    if (value.includes('M')) {
      // For millions, show progression through thousands first
      if (num < 1000000) {
        const thousands = Math.floor(num / 1000);
        if (thousands > 0) {
          return prefix + thousands + 'K+';
        }
        return prefix + Math.floor(num).toString();
      }
      return prefix + (num / 1000000).toFixed(0) + 'M+';
    }
    if (value.includes('%')) {
      return num.toFixed(1) + '%';
    }
    // For regular numbers, round to nearest integer and add any suffix
    const suffix = value.match(/[^0-9.]+$/)?.[0] || '';
    return prefix + Math.round(num).toString() + suffix;
  };

  // Function to generate a scrambled version of the value
  const generateScrambledValue = useCallback(() => {
    const originalValue = value.toString();
    return originalValue
      .split('')
      .map((char, index) => {
        // Keep special characters intact
        if (char === '%' || char === 'M' || char === 'K' || char === '+' || char === '.' || char === '$') {
          return char;
        }
        // 30% chance to scramble each character
        return Math.random() < 0.3 ? 
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)] : 
          char;
      })
      .join('');
  }, [value]);

  // Handle hover animations
  useEffect(() => {
    if (isHovering && !calmMode) {
      // Start scrambling animation
      hoverIntervalRef.current = setInterval(() => {
        setDisplayValue(generateScrambledValue());
      }, 50); // Update every 50ms
    } else {
      // Stop scrambling and reset to actual value
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
        setDisplayValue(value);
      }
    }

    return () => {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    };
  }, [isHovering, generateScrambledValue, value, calmMode]);

  useEffect(() => {
    if (!isInView) return;

    const targetValue = parseValue(value);
    const startTime = performance.now();
    const animationDuration = duration * 1000; // Convert to milliseconds
    let glitchTimeout;

    const updateNumber = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Calculate current value
      const currentValue = progress * targetValue;

      // Add occasional glitch effect only near the end of animation (disabled in calm mode)
      if (!calmMode && progress > 0.8 && Math.random() < 0.005 && !isGlitching) { // Even more reduced probability
        setIsGlitching(true);
        clearTimeout(glitchTimeout);
        glitchTimeout = setTimeout(() => {
          setIsGlitching(false);
        }, 50); // Even shorter duration
      }

      // Update display value
      if (!isHovering) {
        setDisplayValue(formatValue(currentValue));
      }

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    // Start animation
    requestAnimationFrame(updateNumber);

    return () => {
      clearTimeout(glitchTimeout);
    };
  }, [isInView, value, duration, isHovering]);

  return (
    <motion.div 
      ref={ref}
      className="relative inline-block cursor-pointer select-none"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span 
        className={`inline-block transition-all duration-200 
          ${isGlitching ? 'opacity-95' : ''} 
          ${isHovering && calmMode ? 'scale-105 text-ink/90' : ''} 
          ${isHovering && !calmMode ? 'text-ink/80' : ''}`}
      >
        {displayValue}
      </span>
      {(isGlitching || (isHovering && !calmMode)) && (
        <motion.span
          className="absolute top-0 left-0 text-ink mix-blend-difference"
          initial={{ x: 0, opacity: 0 }}
          animate={{ 
            x: [-0.5, 0.5, -0.5],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut"
          }}
        >
          {displayValue}
        </motion.span>
      )}
    </motion.div>
  );
};

export default GlitchNumber; 