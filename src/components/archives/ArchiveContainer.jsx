import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import ArchiveYear from './ArchiveYear';
import SelectedHighlight from './SelectedHighlight';
import AnimatedStars from './AnimatedStars';
import { useInView } from 'react-intersection-observer';
import { Z_INDEX } from './constants/zIndexLayers';
import timelineLoader from '../../utils/timelineLoader';

const ArchiveContainer = React.memo(({ projects }) => {
  const [activeYear, setActiveYear] = useState(2023);
  const [filters, setFilters] = useState({
    size: 'all',
    categories: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showSelectedHighlight, setShowSelectedHighlight] = useState(false);
  const [yearConfigs, setYearConfigs] = useState({});
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const timelineHeight = useMotionValue(0);

  const years = useMemo(() => [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], []);
  const categories = useMemo(() => ['Animation', 'Design', 'Development', 'Leadership', 'Operations', 'Strategy'], []);

  // Transform values for ARCHIVES movement
  const archivesY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const archivesOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 0.6, 0.6, 0.3]);
  const archivesRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-90, -92, -88]);
  const archivesScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.05, 0.98, 1.02]);

  // Calculate dot fill based on scroll position
  const getYearProgress = (yearIndex) => {
    const totalYears = years.length - 1;
    const yearStart = yearIndex / totalYears;
    const yearEnd = (yearIndex + 1) / totalYears;
    return useTransform(scrollYProgress, 
      [yearStart, yearEnd], 
      [0, 1],
      { clamp: true }
    );
  };

  // Load year configurations
  useEffect(() => {
    const loadYearConfigs = async () => {
      const configs = {};
      for (const year of years) {
        configs[year] = await timelineLoader.getYearConfig(year);
      }
      setYearConfigs(configs);
    };
    
    loadYearConfigs();
  }, [years]);
  
  // Update timeline height when active year changes
  useEffect(() => {
    const activeYearIndex = years.indexOf(activeYear);
    const targetHeight = (activeYearIndex / (years.length - 1)) * 100;

    animate(timelineHeight, targetHeight, {
      type: "spring",
      stiffness: 200,
      damping: 20,
    });
  }, [activeYear, timelineHeight, years]);

  // Update active year based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Map scroll progress (0-1) to year index
      const yearIndex = Math.round(latest * (years.length - 1));
      const newActiveYear = years[yearIndex];
      
      if (newActiveYear && newActiveYear !== activeYear) {
        setActiveYear(newActiveYear);
      }
    });

    return unsubscribe;
  }, [scrollYProgress, years, activeYear]);

  const handleYearClick = useCallback((year) => {
    // First set the active year
    setActiveYear(year);
    
    // Try to find the year element
    const element = document.getElementById(`year-${year}`);
    if (element) {
      // Scroll to the year with some offset for better positioning
      const yOffset = -100; // Offset for header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      // If no year element exists (no projects for that year), just scroll smoothly to approximate position
      const yearIndex = years.indexOf(year);
      if (yearIndex !== -1) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = (yearIndex / (years.length - 1)) * totalHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, [years]);

  const handleSizeFilter = useCallback((size) => {
    setFilters(prev => ({ ...prev, size }));
  }, []);

  const handleCategoryToggle = useCallback((category) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ size: 'all', categories: [] });
  }, []);

  // Handle element selection for highlighting
  const handleElementSelect = useCallback((element, show = true) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      setSelectedElement({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
    setShowSelectedHighlight(show);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setShowSelectedHighlight(false);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects?.filter(project => {
      // Handle the new size/type filtering
      let matchesSize = true;
      if (filters.size !== 'all') {
        if (filters.size === 'experiments') {
          matchesSize = project.size === 'small' || project.type === 'EXPERIMENT';
        } else if (filters.size === 'projects') {
          matchesSize = project.size === 'large' || (project.type !== 'CASE_STUDY' && project.type !== 'EXPERIMENT');
        } else if (filters.size === 'case studies') {
          matchesSize = project.type === 'CASE_STUDY';
        } else if (filters.size === 'active') {
          matchesSize = project.size === 'active';
        }
      }
      
      const matchesCategories = filters.categories.length === 0 || 
        filters.categories.some(cat => project.categories?.includes(cat));

      return matchesSize && matchesCategories;
    });
  }, [projects, filters.size, filters.categories]);

  const activeFiltersCount = useMemo(() => 
    (filters.size !== 'all' ? 1 : 0) + filters.categories.length, 
    [filters.size, filters.categories.length]
  );

  // Performance monitoring for memory leaks
  useEffect(() => {
    let performanceInterval;
    
    if (process.env.NODE_ENV === 'development') {
      performanceInterval = setInterval(() => {
        if (performance.memory) {
          const memory = performance.memory;
          console.log(`Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB used, ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB total`);
        }
      }, 5000); // Log every 5 seconds
    }

    return () => {
      if (performanceInterval) {
        clearInterval(performanceInterval);
      }
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen pt-20 sm:pt-24 md:pt-32" 
      ref={containerRef}
      style={{ 
        backgroundColor: '#1A1717',
        color: '#EAE2DF',
        opacity: 1,
        visibility: 'visible'
      }}
    >
      {/* Animated Stars Background */}
      <AnimatedStars />
      
      {/* Selected Element Highlight - Only render when needed */}
      {showSelectedHighlight && selectedElement && (
        <SelectedHighlight 
          selectedElement={selectedElement}
          isVisible={showSelectedHighlight}
        />
      )}

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone/20" style={{ zIndex: Z_INDEX.FIXED_UI }}>
        <motion.div 
          className="h-full bg-cream origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Vertical Archives Label */}
      <div className="fixed top-1/2 -translate-y-1/2 left-4 md:left-6 lg:left-8 hidden md:block" style={{ zIndex: Z_INDEX.CONTENT }}>
        <motion.div 
          className="transform origin-center rotate-180"
          style={{ 
            y: archivesY,
            opacity: archivesOpacity
          }}
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 0.3
          }}
        >
          <h2 className="font-display text-4xl md:text-6xl lg:text-8xl text-stone/40 tracking-wider whitespace-nowrap" 
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            ARCHIVES
          </h2>
        </motion.div>
      </div>

      {/* Vertical Timeline with Filter */}
      <div className="fixed top-1/2 -translate-y-1/2 right-4 md:right-6 lg:right-8 hidden xl:block" style={{ zIndex: Z_INDEX.FIXED_UI }}>
        <div className="relative flex flex-col items-center">
          {/* Control Container - UP and Filter buttons */}
          <div className="bg-ink/90 backdrop-blur-3xl border border-white/[0.08] rounded-xl p-3 mb-8 flex gap-3 relative z-10 transform -translate-x-20 hover:border-white/20 transition-all duration-300">
            {/* Back to Top Button */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-cream text-ink p-3 rounded-full shadow-lg hover:bg-sand transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </motion.button>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-full transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-cream text-ink' 
                    : 'bg-stone/20 text-stone hover:bg-stone/30 hover:text-cream'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                </svg>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cream text-ink text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Filter Overlay */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute top-0 right-full mr-4 w-72 bg-ink/95 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all duration-300"
                    style={{ zIndex: Z_INDEX.OVERLAYS }}
                  >
                    {/* Archive Type Filter */}
                    <div className="mb-6">
                      <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                        Archive Type
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {['All', 'Active', 'Experiments', 'Projects', 'Case Studies'].map((size, index) => (
                          <button
                            key={`desktop-size-${size}-${index}`}
                            onClick={() => handleSizeFilter(size.toLowerCase())}
                            className={`px-3 py-1 rounded font-martian-mono text-xs uppercase tracking-wider transition-colors ${
                              filters.size === size.toLowerCase()
                                ? 'bg-cream text-ink'
                                : 'bg-stone/20 text-stone hover:text-cream'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                      <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                        Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category, index) => (
                          <button
                            key={`desktop-category-${category}-${index}`}
                            onClick={() => handleCategoryToggle(category)}
                            className={`px-3 py-2 rounded text-left font-martian-mono text-xs transition-colors ${
                              filters.categories.includes(category)
                                ? 'bg-cream text-ink'
                                : 'bg-stone/20 text-stone hover:text-cream'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="w-full py-2 text-cream/60 font-martian-mono text-sm hover:text-cream transition-colors border-t border-stone/20 pt-4"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Line - aligned with dots */}
          <div className="absolute top-[3.25rem] bottom-0 left-[2.25rem] w-px bg-stone/20 rounded-full overflow-hidden transform -translate-x-0.5">
            <motion.div 
              className="w-full bg-cream origin-top rounded-full"
              style={{ 
                height: useTransform(timelineHeight, (v) => `${v}%`),
                opacity: useTransform(scrollYProgress, [0, 0.02], [0, 1])
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>

          {/* Year Markers */}
          <div className="relative flex flex-col gap-8 py-4">
            {years.map((year, index) => {
              const dotProgress = getYearProgress(index);
              const yearConfig = yearConfigs[year];
              
              return (
                <motion.button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`relative pl-16 font-martian-mono text-sm transition-colors group ${
                    activeYear === year ? 'text-cream' : 'text-stone hover:text-cream/80'
                  }`}
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Marker Dot Container */}
                  <div 
                    className={`absolute left-[2.1875rem] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 border-2
                      ${activeYear === year 
                        ? 'border-cream' 
                        : 'border-stone group-hover:border-cream'
                      }`}
                  >
                    {/* Dot Fill Animation */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-cream origin-center"
                      style={{ 
                        scale: dotProgress,
                        opacity: useTransform(dotProgress, [0, 0.1, 1], [0, 1, 1])
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  </div>
                  
                  {/* Year with optional highlight badge */}
                  <div className="flex items-center gap-2">
                    {year}
                    {yearConfig?.highlight && (
                      <span className="px-1 py-0.5 bg-cream/20 text-cream text-xs rounded">
                        {yearConfig.highlight}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Repositioned for better accessibility */}
      <div className="fixed bottom-6 right-4 lg:hidden" style={{ zIndex: Z_INDEX.FIXED_UI }}>
        {/* Mobile Back to Top - Additional button for mobile */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white/[0.03] border border-white/[0.08] text-stone hover:bg-white/[0.08] hover:border-white/20 hover:text-cream p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </motion.button>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm ${
              showFilters || activeFiltersCount > 0
                ? 'bg-cream text-ink border border-cream/20' 
                : 'bg-white/[0.03] border border-white/[0.08] text-stone hover:bg-white/[0.08] hover:border-white/20 hover:text-cream'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cream text-ink text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-4 w-80 max-w-[calc(100vw-2rem)] bg-ink/95 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl hover:border-white/20 transition-all duration-300"
              style={{ zIndex: Z_INDEX.OVERLAYS }}
            >
              {/* Archive Type Filter */}
              <div className="mb-6">
                <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                  Archive Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Active', 'Experiments', 'Projects', 'Case Studies'].map((size, index) => (
                    <button
                      key={`mobile-size-${size}-${index}`}
                      onClick={() => handleSizeFilter(size.toLowerCase())}
                      className={`px-3 py-2 rounded font-martian-mono text-xs uppercase tracking-wider transition-colors text-center ${
                        filters.size === size.toLowerCase()
                          ? 'bg-cream text-ink'
                          : 'bg-stone/20 text-stone hover:text-cream'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={`mobile-category-${category}-${index}`}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-2 rounded text-center font-martian-mono text-xs transition-colors ${
                        filters.categories.includes(category)
                          ? 'bg-cream text-ink'
                          : 'bg-stone/20 text-stone hover:text-cream'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-cream/60 font-martian-mono text-sm hover:text-cream transition-colors border-t border-stone/20 pt-4"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Archive Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:pr-32" style={{ zIndex: Z_INDEX.CONTENT }}>
        <AnimatePresence>
          {years.map((year) => {
            const projectsForYear = filteredProjects?.filter(p => p.year === year);
            if (!projectsForYear || projectsForYear.length === 0) return null;

            return (
              <ArchiveYear
                key={year}
                year={year}
                projects={projectsForYear}
                isActive={year === activeYear}
                yearConfig={yearConfigs[year]}
                onElementSelect={handleElementSelect}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Click outside to close filters */}
      {showFilters && (
        <div 
          className="fixed inset-0" 
          style={{ zIndex: Z_INDEX.OVERLAY_BACKDROP }}
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
});

ArchiveContainer.displayName = 'ArchiveContainer';

export default ArchiveContainer; 