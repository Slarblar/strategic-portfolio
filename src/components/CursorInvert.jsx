import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, animate } from 'framer-motion';

const CursorInvert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Create motion values for x and y
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Create spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports touch
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1280; // xl breakpoint in Tailwind
      setIsTouchDevice(hasTouch || isSmallScreen);
    };

    // Check on mount
    checkTouchDevice();

    // Check on window resize
    const handleResize = () => {
      checkTouchDevice();
    };

    window.addEventListener('resize', handleResize);

    const updateMousePosition = (e) => {
      // Check if the body is shifted due to scroll lock
      const bodyTop = document.body.style.top || '0';
      const scrollOffset = parseInt(bodyTop, 10);
      const correctedY = e.clientY - scrollOffset;

      mouseX.set(e.clientX);
      mouseY.set(correctedY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Check for Calendly modal and hide cursor trail when open
    const checkCalendlyModal = () => {
      // Try multiple selectors for Calendly
      const calendlyWrapper = document.querySelector('.calendly-popup-wrapper');
      const calendlyOverlay = document.querySelector('.calendly-overlay');
      const calendlyWidget = document.querySelector('[data-calendly]');
      const calendlyIframe = document.querySelector('iframe[src*="calendly"]');
      const allCalendlyElements = document.querySelectorAll('[class*="calendly"]');
      
      const isCalendlyPresent = calendlyWrapper || calendlyOverlay || calendlyWidget || calendlyIframe || allCalendlyElements.length > 0;
      
      if (isCalendlyPresent) {
        // Calendly modal is open - hide cursor trail completely
        setIsCalendlyOpen(true);
      } else {
        // Calendly modal is closed - show cursor trail normally
        setIsCalendlyOpen(false);
      }
    };

    // Set up mutation observer to detect when Calendly modal is added/removed
    const observer = new MutationObserver(() => {
      // Small delay to ensure DOM has updated
      setTimeout(checkCalendlyModal, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial check in case Calendly is already open
    checkCalendlyModal();

    const triggerPulseSequence = async () => {
    setIsPulsing(true);
    // Multiple pulses with different intensities
    await animate(scale, [
      1,    // Start
      1.6,  // First big pulse
      1.2,  // Settle
      1.4,  // Second medium pulse
      1.1,  // Settle
      1.2,  // Final small pulse
      1     // Return to normal
    ], {
      duration: 1.2,
      ease: "easeInOut",
      times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
      onComplete: () => setIsPulsing(false)
    });
  };

  const handleClick = () => {
    if (!isPulsing) {
      triggerPulseSequence();
    }
    };

    // Only add mouse event listeners on non-touch devices
    if (!isTouchDevice) {
      window.addEventListener('mousemove', updateMousePosition);
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [mouseX, mouseY, scale, isTouchDevice]);

  // Don't render anything when Calendly is open or on touch devices/small screens
  if (isCalendlyOpen || isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      className="cursor-invert hidden xl:block"
      style={{
        x: x,
        y: y,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        scale: scale,
        willChange: 'transform',
        pointerEvents: 'none',
        zIndex: 99999999,
        position: 'fixed',
        isolation: 'isolate',
        // Force proper stacking context
        transform: 'translate3d(0,0,0)'
      }}
    >
      <motion.div
        animate={isPulsing ? {
          boxShadow: [
            '0 0 0 0 rgba(255,255,255,0.4)',
            '0 0 0 20px rgba(255,255,255,0)',
            '0 0 0 0 rgba(255,255,255,0.4)',
            '0 0 0 15px rgba(255,255,255,0)',
            '0 0 0 0 rgba(255,255,255,0.4)',
            '0 0 0 10px rgba(255,255,255,0)',
          ]
        } : {}}
        transition={{ 
          duration: 1.2,
          ease: "easeOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }}
        style={{
          width: '24px',
          height: '24px',
          background: 'radial-gradient(circle, #fff 40%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)',
          borderRadius: '50%',
          filter: 'contrast(4) brightness(2) blur(2px)',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 2
        }}
      />
      {/* Sharp inner circle for stronger center effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '12px', // Increased from 3px to 12px (300% increase)
          height: '12px',
          background: '#fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'contrast(4) brightness(2)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      
      {/* Subtle outer glow for better visibility */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
    </motion.div>
  );
};

export default CursorInvert; 