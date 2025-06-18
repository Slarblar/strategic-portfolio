import { useCallback, useRef } from 'react';

const useScrollLock = () => {
  const scrollPositionRef = useRef(0);
  const isLockedRef = useRef(false);
  
  const lockScroll = useCallback(() => {
    if (isLockedRef.current) return;
    
    // Store current scroll position
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    scrollPositionRef.current = scrollY;
    
    // Add modal-open class - let CSS handle the rest
    document.documentElement.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    
    isLockedRef.current = true;
  }, []);
  
  const unlockScroll = useCallback(() => {
    if (!isLockedRef.current) return;
    
    // Remove modal-open class
    document.documentElement.classList.remove('modal-open');
    document.body.style.top = '';
    
    // Restore scroll position
    const scrollY = scrollPositionRef.current;
    window.scrollTo(0, scrollY);
    
    isLockedRef.current = false;
  }, []);
  
  return { lockScroll, unlockScroll };
};

export default useScrollLock; 