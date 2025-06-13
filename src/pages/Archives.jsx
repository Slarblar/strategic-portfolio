import React, { useEffect } from 'react';
import ArchiveContainer from '../components/archives/ArchiveContainer';
import { useTimelineData } from '../hooks/useTimelineData';
import { projects as fallbackProjects } from '../data/projects';

export default function Archives() {
  const { projects, loading, error, refreshData } = useTimelineData();

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
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
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
    };
  }, [refreshData]);

  // Add debugging
  useEffect(() => {
    console.log('Timeline data state:', { projects, loading, error });
  }, [projects, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink pb-32 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative text-center p-6 sm:p-8">
            <div className="w-8 h-8 border-2 border-cream border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-martian-mono text-cream/60 text-sm">Loading timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Timeline loading failed, using fallback data:', error);
    return (
      <div className="min-h-screen bg-ink pb-32">
        {/* Glass morphism error container */}
        <div className="relative m-4 mb-8">
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl"></div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-olive/5 to-sky/5 rounded-2xl opacity-50"></div>
          
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
    <div className="min-h-screen bg-ink pb-16 sm:pb-24 md:pb-32">
      {/* Subtle glass morphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange/[0.01] via-olive/[0.01] to-sky/[0.01] pointer-events-none"></div>
      
      {/* Timeline */}
      <div className="relative">
        <ArchiveContainer projects={projects || fallbackProjects} />
      </div>
    </div>
  );
} 