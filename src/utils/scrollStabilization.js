// Scroll stabilization utility to prevent momentum scroll snap-back
class ScrollStabilizer {
  constructor() {
    this.isStabilizing = false;
    this.lastScrollTop = 0;
    this.stabilizeTimeout = null;
    this.momentumThreshold = 2; // Pixels of movement to consider "stopped"
    this.stabilizeDelay = 150; // ms to wait before stabilizing
    
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    // Only run on touch devices
    if (!this.isTouchDevice()) return;

    let isScrolling = false;
    let scrollEndTimeout;

    const handleTouchStart = () => {
      isScrolling = true;
      this.clearStabilization();
    };

    const handleScroll = () => {
      if (!isScrolling) return;

      clearTimeout(scrollEndTimeout);
      
      scrollEndTimeout = setTimeout(() => {
        this.stabilizeScroll();
        isScrolling = false;
      }, this.stabilizeDelay);
    };

    const handleTouchEnd = () => {
      // Small delay to allow momentum scrolling to settle
      setTimeout(() => {
        if (!isScrolling) {
          this.stabilizeScroll();
        }
      }, 50);
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Store cleanup function
    this.cleanup = () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchend', handleTouchEnd);
      this.clearStabilization();
    };
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  stabilizeScroll() {
    if (this.isStabilizing) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if scroll position has changed significantly
    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.momentumThreshold) {
      return; // Already stable
    }

    this.isStabilizing = true;
    this.lastScrollTop = currentScrollTop;

    // Use requestAnimationFrame for smooth stabilization
    requestAnimationFrame(() => {
      // Gentle nudge to prevent snap-back
      const stabilizedPosition = this.lastScrollTop;
      
      // Use smooth scrollTo to settle at current position
      window.scrollTo({
        top: stabilizedPosition,
        behavior: 'auto' // Use auto for immediate positioning
      });

      // Reset stabilization flag after a short delay
      this.stabilizeTimeout = setTimeout(() => {
        this.isStabilizing = false;
      }, 100);
    });
  }

  clearStabilization() {
    clearTimeout(this.stabilizeTimeout);
    this.isStabilizing = false;
  }

  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}

// Export singleton instance
export const scrollStabilizer = new ScrollStabilizer();

// Export class for manual instantiation if needed
export default ScrollStabilizer; 