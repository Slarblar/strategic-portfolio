import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Chrome iOS viewport height fix - INSTANT execution
(function() {
  function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Set immediately - before any React rendering
  setViewportHeight();
  
  // Debounced resize handler for performance
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setViewportHeight, 100);
  }
  
  // Re-calculate on resize and orientation change
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', setViewportHeight, { passive: true });
  
  // Also set on DOMContentLoaded as backup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setViewportHeight);
  }
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
