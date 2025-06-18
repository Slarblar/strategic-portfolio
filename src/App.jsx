import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AppRoutes from './AppRoutes';
import CursorInvert from './components/CursorInvert';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
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
