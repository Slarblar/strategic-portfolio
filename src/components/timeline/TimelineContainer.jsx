import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import TimelineYear from './TimelineYear';
import { useInView } from 'react-intersection-observer';

const TimelineContainer = ({ projects }) => {
  const [activeYear, setActiveYear] = useState(2023);
  const [filters, setFilters] = useState({
    size: 'all',
    categories: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const categories = ['Animation', 'Design', 'Development', 'Leadership', 'Operations', 'Strategy'];
  
  const handleYearClick = (year) => {
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveYear(year);
  };

  const handleSizeFilter = (size) => {
    setFilters({ ...filters, size });
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const clearFilters = () => {
    setFilters({ size: 'all', categories: [] });
  };

  const filteredProjects = projects?.filter(project => {
    // Handle the new size/type filtering
    let matchesSize = true;
    if (filters.size !== 'all') {
      if (filters.size === 'experiments') {
        matchesSize = project.size === 'small' || project.type === 'EXPERIMENT';
      } else if (filters.size === 'projects') {
        matchesSize = project.size === 'large' || (project.type !== 'CASE_STUDY' && project.type !== 'EXPERIMENT');
      } else if (filters.size === 'case studies') {
        matchesSize = project.type === 'CASE_STUDY';
      }
    }
    
    const matchesCategories = filters.categories.length === 0 || 
      filters.categories.some(cat => project.categories?.includes(cat));

    return matchesSize && matchesCategories;
  });

  const activeFiltersCount = (filters.size !== 'all' ? 1 : 0) + filters.categories.length;

  return (
    <div className="relative min-h-screen pt-32" ref={containerRef}>
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone/20 z-40">
        <motion.div 
          className="h-full bg-cream origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Vertical Archives Label */}
      <div className="fixed top-1/2 -translate-y-1/2 left-8 z-40 hidden lg:block">
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
          <h2 className="font-display text-8xl text-stone/40 tracking-wider whitespace-nowrap" 
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            ARCHIVES
          </h2>
        </motion.div>
      </div>

      {/* Vertical Timeline with Filter */}
      <div className="fixed top-1/2 -translate-y-1/2 right-8 z-40 hidden lg:block">
        <div className="relative flex flex-col items-center">
          {/* Control Container - UP and Filter buttons */}
          <div className="bg-ink/90 backdrop-blur-sm border border-stone/20 rounded-xl p-3 mb-8 flex gap-3 relative z-10 -ml-6">
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
                    className="absolute top-0 right-full mr-4 w-72 bg-ink/95 backdrop-blur-sm border border-stone/20 rounded-lg p-6 shadow-xl"
                  >
                    {/* Size Filter */}
                    <div className="mb-6">
                      <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                        Project Size
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {['All', 'Experiments', 'Projects', 'Case Studies'].map((size) => (
                          <button
                            key={size}
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
                        {categories.map((category) => (
                          <button
                            key={category}
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

          {/* Progress Line - starts from container */}
          <div className="absolute top-[3.25rem] bottom-0 left-[2.25rem] w-px bg-stone/20 rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-cream origin-top rounded-full"
              style={{ 
                height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
                opacity: useTransform(scrollYProgress, [0, 0.02], [0, 1])
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>

          {/* Year Markers */}
          <div className="relative flex flex-col gap-8 py-4">
            {years.map((year, index) => {
              const dotProgress = getYearProgress(index);
              return (
                <motion.button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`relative pl-12 font-martian-mono text-sm transition-colors group ${
                    activeYear === year ? 'text-cream' : 'text-stone hover:text-cream/80'
                  }`}
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Marker Dot Container */}
                  <div 
                    className={`absolute left-[1.75rem] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 border-2
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
                  {year}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="fixed bottom-8 right-8 z-40 lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-full shadow-lg transition-colors ${
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

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-4 w-72 bg-ink/95 backdrop-blur-sm border border-stone/20 rounded-lg p-6 shadow-xl"
            >
              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-martian-mono text-cream uppercase text-xs tracking-wider mb-3">
                  Project Size
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Experiments', 'Projects', 'Case Studies'].map((size) => (
                    <button
                      key={size}
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
                  {categories.map((category) => (
                    <button
                      key={category}
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

      {/* Timeline Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:pr-32">
        {years.map(year => (
          <TimelineYear
            key={year}
            year={year}
            projects={filteredProjects?.filter(p => p.year === year)}
            isActive={year === activeYear}
            onInView={() => setActiveYear(year)}
          />
        ))}
      </div>

      {/* Click outside to close filters */}
      {showFilters && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default TimelineContainer; 