import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlitchRipple = ({ children, className = '' }) => {
  const [ripples, setRipples] = useState([]);
  const elementRef = useRef(null);
  
  const createRipple = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const element = elementRef.current;
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now().toString();
    
    setRipples(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div 
      ref={elementRef}
      className={`relative cursor-pointer ${className}`}
      onClick={createRipple}
      style={{ overflow: 'hidden' }}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{
              x: ripple.x,
              y: ripple.y,
              scale: 0,
              opacity: 1
            }}
            animate={{
              scale: 4,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
              boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.3), 0 0 20px 10px rgba(0, 255, 0, 0.3), 0 0 20px 10px rgba(0, 0, 255, 0.3)'
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Static glitch overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, rgba(255,0,0,0.1) 0%, rgba(0,255,0,0.1) 50%, rgba(0,0,255,0.1) 100%)',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default GlitchRipple; 