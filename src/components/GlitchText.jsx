import React, { useState, useEffect, useCallback, useRef } from 'react';

const GlitchText = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const elementRef = useRef(null);
  
  // Characters to use for glitch effect - keeping it minimal and readable
  const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);
  
  const scrambleText = useCallback(() => {
    if (!isVisible || prefersReducedMotion) return;

    const textArray = text.split('');
    // Only scramble 1 character at a time for subtlety
    const randomIndex = Math.floor(Math.random() * textArray.length);
    
    if (textArray[randomIndex] !== ' ') { // Don't scramble spaces
      textArray[randomIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    
    setDisplayText(textArray.join(''));
  }, [text, isVisible, prefersReducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Trigger when element is 50% visible
        rootMargin: '0px'
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let intervalId;
    let timeoutId;
    
    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }
    
    if (isVisible) {
      // Mobile optimization: less frequent and shorter animation
      const initialDelay = isMobile ? 200 : 120;
      const intervalDuration = isMobile ? 150 : 95; // Slower on mobile
      const effectDuration = isMobile ? 800 : 1500; // Shorter on mobile
      const resetChance = isMobile ? 0.7 : 0.5; // More frequent resets on mobile
      
      timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          scrambleText();
          // Reset text to normal more frequently on mobile for better readability
          if (Math.random() < resetChance) {
            setDisplayText(text);
          }
        }, intervalDuration);

        // Stop the effect - shorter duration on mobile
        setTimeout(() => {
          if (intervalId) {
            clearInterval(intervalId);
            setDisplayText(text);
          }
        }, effectDuration);
      }, initialDelay);
    } else {
      setDisplayText(text);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, scrambleText, text, isMobile, prefersReducedMotion]);

  return (
    <span
      ref={elementRef}
      className={`inline-block ${className}`}
    >
      {displayText}
    </span>
  );
};

export default GlitchText; 