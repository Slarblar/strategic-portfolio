import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="full-height-container flex flex-col bg-ink">
      <Navigation />
      <main className="flex-grow pb-16 sm:pb-20 md:pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 