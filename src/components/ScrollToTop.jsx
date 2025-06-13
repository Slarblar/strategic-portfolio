import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Handle route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  // Handle page reloads
  useEffect(() => {
    // Disable browser's scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top on page load/reload
    window.addEventListener('load', () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener('load', () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      });
    };
  }, []);

  return null;
};

export default ScrollToTop; 