import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Chrome iOS viewport height fix - INSTANT execution
(function() {
  let lastViewportHeight = 0;
  
  function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    
    // Only update if there's a significant change to prevent micro-adjustments
    const threshold = 1; // 1px threshold
    if (Math.abs(window.innerHeight - lastViewportHeight) > threshold) {
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      lastViewportHeight = window.innerHeight;
    }
  }
  
  // Set immediately - before any React rendering
  setViewportHeight();
  
  // Debounced resize handler for performance
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setViewportHeight, 50); // Faster response
  }
  
  // Listen to multiple events for comprehensive coverage
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', () => {
    // Orientation change needs immediate and delayed updates
    setTimeout(setViewportHeight, 100);
    setTimeout(setViewportHeight, 500);
  }, { passive: true });
  
  // Handle visual viewport changes (for Chrome mobile address bar)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize, { passive: true });
  }
  
  // Also set on DOMContentLoaded as backup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setViewportHeight);
  }
  
  // Handle page visibility changes (when returning from background)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(setViewportHeight, 100);
    }
  }, { passive: true });
})();

// Initialize dev tools in development
if (import.meta.env.DEV) {
  import('./utils/devTools.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
