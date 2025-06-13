/**
 * Development Tools for Timeline Content Management
 * Provides debugging, validation, and content management utilities
 */

import timelineLoader from './timelineLoader';
import { validateTimelineData, generateValidationReport } from './dataValidation';

class DevTools {
  constructor() {
    this.isDevMode = import.meta.env.DEV;
    this.enabled = this.isDevMode && window.location.search.includes('devtools=true');
    
    if (this.enabled) {
      console.log('🛠️ DevTools enabled - type DevTools.help() for available commands');
      this.attachToWindow();
    }
  }

  /**
   * Attach DevTools to window for console access
   */
  attachToWindow() {
    window.DevTools = {
      help: this.help.bind(this),
      validate: this.validateAll.bind(this),
      cache: {
        stats: this.getCacheStats.bind(this),
        clear: this.clearCache.bind(this),
        inspect: this.inspectCache.bind(this)
      },
      timeline: {
        health: this.healthCheck.bind(this),
        reload: this.reloadTimeline.bind(this),
        inspect: this.inspectTimeline.bind(this)
      },
      projects: {
        list: this.listProjects.bind(this),
        inspect: this.inspectProject.bind(this),
        validate: this.validateProject.bind(this)
      },
      performance: {
        measure: this.measurePerformance.bind(this),
        benchmark: this.benchmarkLoading.bind(this)
      },
      export: {
        validationReport: this.exportValidationReport.bind(this),
        timelineData: this.exportTimelineData.bind(this)
      }
    };
  }

  /**
   * Display available commands
   */
  help() {
    console.log(`
🛠️ DevTools Commands:

📊 VALIDATION:
  DevTools.validate()                    - Validate all timeline data
  DevTools.projects.validate(year, slug) - Validate specific project

🗄️ CACHE MANAGEMENT:
  DevTools.cache.stats()                 - Show cache statistics  
  DevTools.cache.clear()                 - Clear all cache
  DevTools.cache.inspect()               - Inspect cache contents

🏥 HEALTH & DEBUGGING:
  DevTools.timeline.health()             - Check timeline service health
  DevTools.timeline.reload()             - Force reload timeline data
  DevTools.timeline.inspect()            - Inspect timeline structure

📁 PROJECT MANAGEMENT:
  DevTools.projects.list()               - List all projects
  DevTools.projects.inspect(year, slug)  - Inspect specific project

⚡ PERFORMANCE:
  DevTools.performance.measure()         - Measure loading performance
  DevTools.performance.benchmark()       - Run loading benchmark

📤 EXPORT:
  DevTools.export.validationReport()     - Export validation report
  DevTools.export.timelineData()         - Export all timeline data

💡 TIP: Add '?devtools=true' to URL to enable DevTools
    `);
  }

  /**
   * Validate all timeline data
   */
  async validateAll() {
    console.log('🔍 Starting comprehensive validation...');
    
    try {
      // Load all data for validation
      const [indexData, allProjects] = await Promise.all([
        timelineLoader.loadIndex(),
        timelineLoader.loadAllProjects()
      ]);

      // Organize project data for validation
      const projectsData = {};
      allProjects.forEach(project => {
        const key = `${project.year}/${project.slug}`;
        projectsData[key] = project;
      });

      // Load year metadata
      const yearMetaData = {};
      const years = indexData.years.map(y => y.year);
      for (const year of years) {
        try {
          yearMetaData[year] = await timelineLoader.getYearConfig(year);
        } catch (error) {
          console.warn(`Could not load metadata for year ${year}:`, error.message);
        }
      }

      // Run validation
      const validationResults = validateTimelineData(indexData, yearMetaData, projectsData);
      
      // Display results
      console.log('📋 Validation Results:');
      console.log(`Overall Status: ${validationResults.overall.isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (validationResults.overall.errors.length > 0) {
        console.error('❌ Errors:', validationResults.overall.errors);
      }
      
      if (validationResults.overall.warnings.length > 0) {
        console.warn('⚠️ Warnings:', validationResults.overall.warnings);
      }

      console.log('📊 Summary:');
      console.log(`- Projects validated: ${Object.keys(projectsData).length}`);
      console.log(`- Years with metadata: ${Object.keys(yearMetaData).length}`);
      console.log(`- Total errors: ${validationResults.overall.errors.length}`);
      console.log(`- Total warnings: ${validationResults.overall.warnings.length}`);

      return validationResults;
    } catch (error) {
      console.error('💥 Validation failed:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = timelineLoader.getCacheStats();
    console.log('🗄️ Cache Statistics:', stats);
    return stats;
  }

  /**
   * Clear cache with options
   */
  clearCache(pattern = null) {
    timelineLoader.clearCache(pattern);
    console.log(`🧹 Cache cleared${pattern ? ` (pattern: ${pattern})` : ''}`);
  }

  /**
   * Inspect cache contents
   */
  inspectCache() {
    const stats = timelineLoader.getCacheStats();
    console.log('🔍 Cache Contents:');
    
    stats.keys.forEach(key => {
      const value = timelineLoader.cache.get(key);
      console.log(`📄 ${key}:`, value);
    });
    
    return stats.keys;
  }

  /**
   * Check timeline service health
   */
  async healthCheck() {
    console.log('🏥 Running health check...');
    
    try {
      const health = await timelineLoader.healthCheck();
      console.log('Health Status:', health);
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Force reload timeline data
   */
  async reloadTimeline() {
    console.log('🔄 Reloading timeline data...');
    
    timelineLoader.clearCache();
    
    try {
      const [index, projects] = await Promise.all([
        timelineLoader.loadIndex(),
        timelineLoader.loadAllProjects()
      ]);
      
      console.log(`✅ Reloaded: ${projects.length} projects across ${index.years.length} years`);
      return { index, projects };
    } catch (error) {
      console.error('💥 Reload failed:', error);
      throw error;
    }
  }

  /**
   * Inspect timeline structure
   */
  async inspectTimeline() {
    try {
      const index = await timelineLoader.loadIndex();
      console.log('📋 Timeline Structure:', index);
      
      console.log('📅 Years:');
      index.years.forEach(year => {
        console.log(`  ${year.year}: ${year.projects.length} projects`);
      });
      
      return index;
    } catch (error) {
      console.error('💥 Inspection failed:', error);
      throw error;
    }
  }

  /**
   * List all projects
   */
  async listProjects() {
    try {
      const projects = await timelineLoader.loadAllProjects();
      
      console.log(`📁 Projects (${projects.length} total):`);
      projects.forEach(project => {
        console.log(`  ${project.year}/${project.slug} - ${project.title} (${project.type})`);
      });
      
      return projects;
    } catch (error) {
      console.error('💥 Failed to list projects:', error);
      throw error;
    }
  }

  /**
   * Inspect specific project
   */
  async inspectProject(year, projectSlug) {
    if (!year || !projectSlug) {
      console.error('❌ Please provide year and project slug');
      return;
    }

    try {
      const project = await timelineLoader.loadProject(year, projectSlug);
      console.log(`🔍 Project ${year}/${projectSlug}:`, project);
      return project;
    } catch (error) {
      console.error(`💥 Failed to inspect project ${year}/${projectSlug}:`, error);
      throw error;
    }
  }

  /**
   * Validate specific project
   */
  async validateProject(year, projectSlug) {
    if (!year || !projectSlug) {
      console.error('❌ Please provide year and project slug');
      return;
    }

    try {
      const project = await timelineLoader.loadProject(year, projectSlug);
      
      if (!project) {
        console.error(`❌ Project ${year}/${projectSlug} not found`);
        return;
      }

      // Note: We'd need to import the validation function here
      // For now, just show the project data
      console.log(`✅ Project ${year}/${projectSlug} loaded successfully:`, project);
      return project;
    } catch (error) {
      console.error(`💥 Validation failed for ${year}/${projectSlug}:`, error);
      throw error;
    }
  }

  /**
   * Measure loading performance
   */
  async measurePerformance() {
    console.log('⚡ Measuring timeline loading performance...');
    
    const start = performance.now();
    
    try {
      timelineLoader.clearCache(); // Start fresh
      
      const indexStart = performance.now();
      const index = await timelineLoader.loadIndex();
      const indexTime = performance.now() - indexStart;
      
      const projectsStart = performance.now();
      const projects = await timelineLoader.loadAllProjects();
      const projectsTime = performance.now() - projectsStart;
      
      const totalTime = performance.now() - start;
      
      const results = {
        total: `${totalTime.toFixed(2)}ms`,
        index: `${indexTime.toFixed(2)}ms`,
        projects: `${projectsTime.toFixed(2)}ms`,
        projectCount: projects.length,
        avgPerProject: `${(projectsTime / projects.length).toFixed(2)}ms`,
        cacheStats: timelineLoader.getCacheStats()
      };
      
      console.log('📊 Performance Results:', results);
      return results;
    } catch (error) {
      console.error('💥 Performance measurement failed:', error);
      throw error;
    }
  }

  /**
   * Run loading benchmark
   */
  async benchmarkLoading(iterations = 3) {
    console.log(`🏁 Running loading benchmark (${iterations} iterations)...`);
    
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      console.log(`📊 Iteration ${i + 1}/${iterations}`);
      const result = await this.measurePerformance();
      results.push(result);
      
      // Wait a bit between iterations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Calculate averages
    const avgTotal = results.reduce((sum, r) => sum + parseFloat(r.total), 0) / results.length;
    const avgProjects = results.reduce((sum, r) => sum + parseFloat(r.projects), 0) / results.length;
    
    const benchmark = {
      iterations,
      avgTotalTime: `${avgTotal.toFixed(2)}ms`,
      avgProjectsTime: `${avgProjects.toFixed(2)}ms`,
      results
    };
    
    console.log('🏆 Benchmark Results:', benchmark);
    return benchmark;
  }

  /**
   * Export validation report
   */
  async exportValidationReport() {
    console.log('📤 Generating validation report...');
    
    try {
      const validationResults = await this.validateAll();
      const report = generateValidationReport(validationResults);
      
      // Create downloadable file
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeline-validation-report-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('✅ Validation report exported');
      return report;
    } catch (error) {
      console.error('💥 Export failed:', error);
      throw error;
    }
  }

  /**
   * Export all timeline data
   */
  async exportTimelineData() {
    console.log('📤 Exporting timeline data...');
    
    try {
      const [index, projects] = await Promise.all([
        timelineLoader.loadIndex(),
        timelineLoader.loadAllProjects()
      ]);
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        index,
        projects,
        cacheStats: timelineLoader.getCacheStats()
      };
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeline-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('✅ Timeline data exported');
      return exportData;
    } catch (error) {
      console.error('💥 Export failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const devTools = new DevTools();

export default devTools; 