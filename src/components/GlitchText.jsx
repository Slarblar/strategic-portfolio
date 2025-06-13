import React, { useState, useEffect, useCallback, useRef } from 'react';

const GlitchText = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  
  // Characters to use for glitch effect - keeping it minimal and readable
  const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  const scrambleText = useCallback(() => {
    if (!isVisible) return;

    const textArray = text.split('');
    // Only scramble 1 character at a time for subtlety
    const randomIndex = Math.floor(Math.random() * textArray.length);
    
    if (textArray[randomIndex] !== ' ') { // Don't scramble spaces
      textArray[randomIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    
    setDisplayText(textArray.join(''));
  }, [text, isVisible]);

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
    
    if (isVisible) {
      // Slightly longer initial delay
      timeoutId = setTimeout(() => {
        // Run the scramble effect every 95ms for a more deliberate glitch
        intervalId = setInterval(() => {
          scrambleText();
          // 50% chance to reset text to normal each interval for better readability
          if (Math.random() < 0.5) {
            setDisplayText(text);
          }
        }, 95);

        // Stop the effect after 1.5s
        setTimeout(() => {
          if (intervalId) {
            clearInterval(intervalId);
            setDisplayText(text);
          }
        }, 1500);
      }, 120);
    } else {
      setDisplayText(text);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, scrambleText, text]);

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