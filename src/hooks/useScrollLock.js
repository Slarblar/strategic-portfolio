import { useCallback, useRef } from 'react';

const useScrollLock = () => {
  const scrollPositionRef = useRef(0);
  const isLockedRef = useRef(false);
  const originalStylesRef = useRef({});
  
  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return;
    
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    scrollPositionRef.current = scrollY;
    
    // Save original styles
    originalStylesRef.current = {
      htmlOverflow: document.documentElement.style.overflow,
      htmlScrollBehavior: document.documentElement.style.scrollBehavior,
      bodyPosition: document.body.style.position,
      bodyWidth: document.body.style.width,
      bodyTop: document.body.style.top,
    };
    
    // Apply lock styles
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    isLockedRef.current = true;
  }, []);
  
  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return;
    
    // Restore body styles first
    document.body.style.position = originalStylesRef.current.bodyPosition || '';
    document.body.style.width = originalStylesRef.current.bodyWidth || '';
    document.body.style.top = originalStylesRef.current.bodyTop || '';
    
    // Force instant scroll
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, scrollPositionRef.current);
    
    // Restore remaining html styles
    document.documentElement.style.overflow = originalStylesRef.current.htmlOverflow || '';
    document.documentElement.style.scrollBehavior = originalStylesRef.current.htmlScrollBehavior || '';
    
    // Clear refs
    scrollPositionRef.current = 0;
    originalStylesRef.current = {};
    isLockedRef.current = false;
  }, []);
  
  return { lockScroll, unlockScroll };
};

export default useScrollLock; 