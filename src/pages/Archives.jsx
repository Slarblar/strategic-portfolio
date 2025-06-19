import React, { useState, useEffect } from 'react';
import ArchiveContainer from '../components/archives/ArchiveContainer';
import { useTimelineData } from '../hooks/useTimelineData';
import { projects as fallbackProjects } from '../data/projects';
import { isMobileDevice, monitorMemoryUsage, cleanupMobileOptimizations } from '../utils/mobileOptimizations';

// Simple hook to check for mobile viewport with optimizations
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(isMobileDevice());
      }, 150); // Debounced resize
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

export default function Archives() {
  const { projects, loading, error, refreshData } = useTimelineData();
  const isMobile = useIsMobile();

  // Test basic fetch capability
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('Testing basic fetch to /timeline/projects.json...');
        const response = await fetch('/timeline/projects.json');
        console.log('Fetch response:', response.status, response.statusText);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetch data:', data);
        }
      } catch (err) {
        console.error('Basic fetch test failed:', err);
      }
    };
    
    testFetch();
  }, []);

  useEffect(() => {
    // Update document title
    document.title = 'Archives | Strategic Portfolio';
    
    // Optimize scroll behavior for mobile
    document.documentElement.style.scrollBehavior = isMobile ? 'auto' : 'smooth';
    
    // Add keyboard shortcut to refresh timeline data (Ctrl/Cmd + R)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        console.log('Refreshing timeline data...');
        refreshData();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
      
      // Clean up mobile optimizations to prevent memory leaks
      cleanupMobileOptimizations();
    };
  }, [refreshData, isMobile]);

  // Monitor memory usage on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        const highMemory = monitorMemoryUsage('Archives');
        if (highMemory) {
          // Could trigger cleanup or warnings here
          console.warn('[Archives] Consider reducing component complexity due to high memory usage');
        }
      }, 15000); // Check every 15 seconds on mobile
      
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  // Add debugging
  useEffect(() => {
    console.log('Timeline data state:', { projects, loading, error });
  }, [projects, loading, error]);

  if (loading) {
    return (
      <div 
        className={`min-h-screen bg-ink pb-32 flex items-center justify-center px-4 ${
          isMobile ? 'mobile-archive-optimized' : ''
        }`}
        style={{ 
          backgroundColor: '#1A1717',
          color: '#EAE2DF',
          opacity: 1,
          visibility: 'visible'
        }}
      >
        <div className="relative w-full max-w-sm">
          {/* Glass morphism background - simplified on mobile */}
          <div className={`absolute inset-0 bg-white/[0.03] border border-white/[0.08] rounded-2xl ${
            !isMobile ? 'backdrop-blur-xl' : ''
          }`}></div>
          
          {/* Content */}
          <div className="relative text-center p-6 sm:p-8">
            <div className="w-8 h-8 border-2 border-cream border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-martian-mono text-cream/60 text-sm">
              {isMobile ? 'Loading...' : 'Loading timeline...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Timeline loading failed, using fallback data:', error);
    return (
      <div 
        className={`min-h-screen bg-ink pb-32 ${isMobile ? 'mobile-archive-optimized' : ''}`}
        style={{ 
          backgroundColor: '#1A1717',
          color: '#EAE2DF',
          opacity: 1,
          visibility: 'visible'
        }}
      >
        {/* Glass morphism error container - simplified on mobile */}
        <div className="relative m-4 mb-8">
          {/* Glass background */}
          <div className={`absolute inset-0 bg-white/[0.03] border border-white/[0.08] rounded-2xl ${
            !isMobile ? 'backdrop-blur-xl' : ''
          }`}></div>
          
          {/* Subtle glow effect - disabled on mobile */}
          {!isMobile && (
            <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-olive/5 to-sky/5 rounded-2xl opacity-50"></div>
          )}
          
          {/* Content */}
          <div className="relative p-4 sm:p-6">
            <p className="font-martian-mono text-cream/60 text-sm mb-2">
              Using fallback data (timeline loader failed)
            </p>
            <p className="font-martian-mono text-stone/60 text-xs break-words">{error.message}</p>
          </div>
        </div>
        <ArchiveContainer projects={fallbackProjects} />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-ink pb-16 sm:pb-24 md:pb-32 ${
        isMobile ? 'mobile-archive-optimized mobile-perf-optimized' : ''
      }`}
      style={{ 
        backgroundColor: '#1A1717',
        color: '#EAE2DF',
        opacity: 1,
        visibility: 'visible'
      }}
    >
      {/* Subtle glass morphism background overlay - disabled on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange/[0.01] via-olive/[0.01] to-sky/[0.01] pointer-events-none"></div>
      )}
      
      {/* Timeline */}
      <div className="relative">
        <ArchiveContainer projects={projects || fallbackProjects} />
      </div>
    </div>
  );
} 