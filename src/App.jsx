import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AppRoutes from './AppRoutes';
import CursorInvert from './components/CursorInvert';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();

    const handleResize = () => setVh();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="full-height-container flex flex-col relative">
        <Navigation />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
        {/* Cursor effect at root level */}
        <CursorInvert />
      </div>
    </Router>
  );
};

export default App;
