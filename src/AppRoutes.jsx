import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Archives from './pages/Archives';
import Capabilities from './pages/Capabilities';
import Connect from './pages/Connect';
import AboutMe from './pages/AboutMe';
import PageTransition from './components/PageTransition';

// Individual Case Study Components
import SpacestationAnimationCase from './pages/SpacestationAnimationCase';
import AForAdleyCase from './pages/AForAdleyCase';
import QuarterMachineCase from './pages/QuarterMachineCase';
import ProperHempCoCase from './pages/ProperHempCoCase';

// Fallback for any case studies not yet migrated
import ProjectDetails from './pages/ProjectDetails';

// Demo Components
import SplitLayoutModalExample from './components/SplitLayoutModalExample';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/archives" element={<PageTransition><Archives /></PageTransition>} />
      
      {/* Individual Case Study Routes */}
      <Route path="/archives/spacestation-animation" element={<PageTransition><SpacestationAnimationCase /></PageTransition>} />
      <Route path="/archives/a-for-adley" element={<PageTransition><AForAdleyCase /></PageTransition>} />
      <Route path="/archives/quarter-machine" element={<PageTransition><QuarterMachineCase /></PageTransition>} />
      <Route path="/archives/proper-hemp-co" element={<PageTransition><ProperHempCoCase /></PageTransition>} />
      
      {/* Fallback route for case studies not yet migrated */}
      <Route path="/archives/:id" element={<PageTransition><ProjectDetails /></PageTransition>} />
      
      <Route path="/capabilities" element={<PageTransition><Capabilities /></PageTransition>} />
      <Route path="/about-me" element={<PageTransition><AboutMe /></PageTransition>} />
      <Route path="/connect" element={<PageTransition><Connect /></PageTransition>} />
      
      {/* Demo Routes */}
      <Route path="/demo/split-modal" element={<PageTransition><SplitLayoutModalExample /></PageTransition>} />
    </Routes>
  );
};

export default AppRoutes; 