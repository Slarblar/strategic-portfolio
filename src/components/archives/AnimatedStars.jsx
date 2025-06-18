import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Z_INDEX } from './constants/zIndexLayers';

const AnimatedStars = React.memo(() => {
  const [stars, setStars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to glow intensity - all at top level
  const scrollGlow = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ["0 0 0px rgba(234, 226, 223, 0)", "0 0 8px rgba(234, 226, 223, 0.6)", "0 0 0px rgba(234, 226, 223, 0)"]
  );
  const glowBrightness = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ["brightness(1)", "brightness(1.4)", "brightness(1)"]
  );

  // Generate random stars on mount - memoized for performance
  const starData = useMemo(() => {
    const starCount = 25; // Increased for visual richness
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100, // Percentage position
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // 1-3px
        delay: Math.random() * 3, // Stagger animation delays
        duration: Math.random() * 2 + 2, // 2-4 second pulses
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 base opacity
        orbitRadius: Math.random() * 20 + 5, // Reduced orbit radius for performance
        orbitDuration: Math.random() * 20 + 15, // Slower orbit for smoother animation
        orbitDirection: Math.random() > 0.5 ? 1 : -1, // Clockwise or counter-clockwise
      });
    }

    return newStars;
  }, []);

  useEffect(() => {
    setStars(starData);
    // Delay showing stars to prevent flash
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [starData]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z_INDEX.BACKGROUND + 1, opacity: isLoaded ? 1 : 0 }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-cream"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: scrollGlow,
            filter: glowBrightness,
          }}
          animate={{
            // Pulsing effect
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.3, 1],
            // Orbital movement - circular motion
            x: [
              0,
              star.orbitRadius * Math.cos(0) * star.orbitDirection,
              star.orbitRadius * Math.cos(Math.PI) * star.orbitDirection,
              star.orbitRadius * Math.cos(2 * Math.PI) * star.orbitDirection,
              0
            ],
            y: [
              0,
              star.orbitRadius * Math.sin(0),
              star.orbitRadius * Math.sin(Math.PI),
              star.orbitRadius * Math.sin(2 * Math.PI),
              0
            ],
          }}
          transition={{
            opacity: {
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            },
            scale: {
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            },
            x: {
              duration: star.orbitDuration,
              repeat: Infinity,
              ease: "linear",
              delay: star.delay,
            },
            y: {
              duration: star.orbitDuration,
              repeat: Infinity,
              ease: "linear",
              delay: star.delay,
            },
          }}
        />
      ))}
    </div>
  );
});

AnimatedStars.displayName = 'AnimatedStars';

export default AnimatedStars; 