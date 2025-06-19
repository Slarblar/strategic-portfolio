import { useState, useEffect, useCallback, useRef } from 'react';
import timelineLoader from '../utils/timelineLoader';

/**
 * Enhanced custom hook for loading timeline data
 * Provides loading states, error handling, and performance optimizations
 */
export const useTimelineData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing...');
  const abortController = useRef(null);
  const mounted = useRef(true);

  const loadData = useCallback(async (isRefresh = false) => {
    // Cancel any ongoing requests
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      if (isRefresh) {
        console.log('Refreshing timeline data...');
        setLoadingStage('Refreshing timeline data...');
      } else {
        console.log('Loading timeline data...');
        setLoadingStage('Initializing timeline...');
      }
      
      // Initial setup (5% progress)
      setLoadingStage('Initializing...');
      setLoadingProgress(5);
      await new Promise(resolve => setTimeout(resolve, 100)); // Brief pause for visual feedback
      
      // Perform health check (15% progress)
      setLoadingStage('Checking timeline health...');
      setLoadingProgress(15);
      const health = await timelineLoader.healthCheck();
      if (mounted.current) setHealthStatus(health);
      
      if (health.status === 'unhealthy') {
        throw new Error(`Timeline service unhealthy: ${health.error}`);
      }
      
      // Health check complete (25% progress)
      setLoadingProgress(25);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Load the main index (35% progress)
      setLoadingStage('Loading project index...');
      setLoadingProgress(35);
      const indexData = await timelineLoader.loadIndex();
      if (!mounted.current) return;
      
      // Index loaded (45% progress)
      setLoadingProgress(45);
      console.log(`Index loaded: ${indexData.timeline.totalProjects} total projects`);
      setIndex(indexData);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Start loading projects (55% progress)
      setLoadingStage('Loading project data...');
      setLoadingProgress(55);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Load all projects with enhanced error handling (75% progress)
      setLoadingProgress(75);
      const projectsData = await timelineLoader.loadAllProjects();
      if (!mounted.current) return;
      
      if (!Array.isArray(projectsData)) {
        throw new Error('Invalid projects data format');
      }
      
      // Projects loaded (85% progress)
      setLoadingProgress(85);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Final processing (95% progress)
      setLoadingStage('Finalizing...');
      setLoadingProgress(95);
      console.log(`Timeline data loaded successfully: ${projectsData.length} projects`);
      setProjects(projectsData);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Complete (100% progress)
      setLoadingProgress(100);
      setLoadingStage('Complete');
      await new Promise(resolve => setTimeout(resolve, 200)); // Brief pause before completion
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Timeline data loading was cancelled');
        return;
      }
      
      console.error('Failed to load timeline data:', err);
      if (mounted.current) {
        setError(err);
        setHealthStatus({ status: 'unhealthy', error: err.message });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadData();
    
    return () => {
      mounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [loadData]);

  const refreshData = useCallback(() => {
    timelineLoader.clearCache();
    loadData(true);
  }, [loadData]);

  // Enhanced cache management
  const clearCache = useCallback((pattern) => {
    timelineLoader.clearCache(pattern);
  }, []);

  const getCacheStats = useCallback(() => {
    return timelineLoader.getCacheStats();
  }, []);

  return {
    projects,
    loading,
    error,
    index,
    healthStatus,
    loadingProgress,
    loadingStage,
    refreshData,
    clearCache,
    getCacheStats,
    // Computed properties for better UX
    isEmpty: !loading && !error && projects.length === 0,
    hasData: projects.length > 0,
    totalProjects: index?.timeline?.totalProjects || projects.length
  };
};

/**
 * Enhanced hook for loading year-specific data with optimizations
 */
export const useYearData = (year) => {
  const [yearConfig, setYearConfig] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortController = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    if (!year) {
      setLoading(false);
      return;
    }

    const loadYearData = async () => {
      // Cancel any ongoing requests
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading data for year ${year}...`);
        
        // Load year config and projects in parallel for better performance
        const [config, yearProjects] = await Promise.allSettled([
          timelineLoader.getYearConfig(year),
          timelineLoader.loadYearProjects(year)
        ]);
        
        if (!mounted.current) return;
        
        // Handle year config result
        if (config.status === 'fulfilled') {
          setYearConfig(config.value);
        } else {
          console.warn(`Failed to load year config for ${year}:`, config.reason);
          setYearConfig(timelineLoader.getDefaultYearMeta(year));
        }
        
        // Handle projects result
        if (yearProjects.status === 'fulfilled') {
          setProjects(yearProjects.value || []);
          console.log(`Loaded ${yearProjects.value?.length || 0} projects for year ${year}`);
        } else {
          console.warn(`Failed to load projects for ${year}:`, yearProjects.reason);
          setProjects([]);
        }
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`Year ${year} data loading was cancelled`);
          return;
        }
        
        console.error(`Failed to load data for year ${year}:`, err);
        if (mounted.current) {
          setError(err);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    mounted.current = true;
    loadYearData();
    
    return () => {
      mounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [year]);

  return {
    yearConfig,
    projects,
    loading,
    error,
    // Computed properties
    isEmpty: !loading && !error && projects.length === 0,
    hasData: projects.length > 0,
    isDefaultConfig: yearConfig?.isDefault === true
  };
};

/**
 * Enhanced hook for loading a single project with caching optimizations
 */
export const useProject = (year, projectSlug) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortController = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    if (!year || !projectSlug) {
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      // Cancel any ongoing requests
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading project ${projectSlug} (${year})...`);
        
        const projectData = await timelineLoader.loadProject(year, projectSlug);
        
        if (!mounted.current) return;
        
        if (!projectData) {
          throw new Error(`Project ${projectSlug} not found`);
        }
        
        setProject(projectData);
        console.log(`Project ${projectSlug} loaded successfully`);
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`Project ${projectSlug} loading was cancelled`);
          return;
        }
        
        console.error(`Failed to load project ${projectSlug}:`, err);
        if (mounted.current) {
          setError(err);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    mounted.current = true;
    loadProject();
    
    return () => {
      mounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [year, projectSlug]);

  return {
    project,
    loading,
    error,
    // Computed properties
    notFound: !loading && !error && !project,
    hasData: !!project
  };
};

/**
 * Hook for filtered timeline data with debouncing
 */
export const useFilteredTimelineData = (filters, debounceMs = 300) => {
  const { projects, loading, error, ...rest } = useTimelineData();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsFiltering(true);

    // Debounce the filtering operation
    debounceTimer.current = setTimeout(() => {
      if (!projects || projects.length === 0) {
        setFilteredProjects([]);
        setIsFiltering(false);
        return;
      }

      let filtered = [...projects];

      // Apply size filter
      if (filters?.size && filters.size !== 'all') {
        filtered = filtered.filter(project => project.size === filters.size);
      }

      // Apply category filters
      if (filters?.categories && filters.categories.length > 0) {
        filtered = filtered.filter(project =>
          project.categories?.some(category =>
            filters.categories.includes(category)
          )
        );
      }

      // Apply year filter
      if (filters?.year) {
        filtered = filtered.filter(project => project.year === filters.year);
      }

      // Apply type filter
      if (filters?.type && filters.type !== 'all') {
        filtered = filtered.filter(project => project.type === filters.type);
      }

      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(project =>
          project.title?.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm) ||
          project.categories?.some(cat => cat.toLowerCase().includes(searchTerm)) ||
          project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm))
        );
      }

      setFilteredProjects(filtered);
      setIsFiltering(false);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [projects, filters, debounceMs]);

  return {
    projects: filteredProjects,
    loading: loading || isFiltering,
    error,
    ...rest,
    // Additional filter-specific properties
    totalUnfiltered: projects.length,
    totalFiltered: filteredProjects.length,
    isFiltered: JSON.stringify(filters) !== JSON.stringify({}),
    filterStats: {
      removed: projects.length - filteredProjects.length,
      remaining: filteredProjects.length
    }
  };
};

export default useTimelineData; 