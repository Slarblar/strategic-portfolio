import { useEffect, useRef } from 'react';
import { isMobileDevice } from '../utils/mobileOptimizations';

/**
 * Performance monitoring hook specifically for mobile devices
 * Helps debug memory leaks and performance issues that could cause crashes
 */
export const usePerformanceMonitor = (componentName = 'Unknown', options = {}) => {
  const {
    memoryThreshold = 100, // MB
    intervalMs = 15000, // 15 seconds
    enableOnDesktop = false,
    onHighMemory = null,
    onPerformanceWarning = null
  } = options;

  const lastMemoryCheck = useRef(0);
  const warningCount = useRef(0);
  const isMobile = isMobileDevice();

  useEffect(() => {
    // Only monitor on mobile unless explicitly enabled for desktop
    if (!isMobile && !enableOnDesktop) return;

    const monitorPerformance = () => {
      try {
        // Memory monitoring
        if (performance.memory) {
          const memoryInfo = performance.memory;
          const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
          const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024);
          const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024);
          
          // Log memory usage in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`[${componentName}] Memory: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`);
          }
          
          // Check for high memory usage
          const memoryPercentage = (usedMB / limitMB) * 100;
          if (usedMB > memoryThreshold || memoryPercentage > 75) {
            warningCount.current++;
            const warning = {
              component: componentName,
              usedMB,
              totalMB,
              limitMB,
              percentage: memoryPercentage,
              warningCount: warningCount.current
            };
            
            console.warn(`[${componentName}] High memory usage:`, warning);
            
            if (onHighMemory) {
              onHighMemory(warning);
            }
            
            // If memory is critically high, suggest aggressive cleanup
            if (memoryPercentage > 90) {
              console.error(`[${componentName}] Critical memory usage! Consider reducing component complexity.`);
              
              if (onPerformanceWarning) {
                onPerformanceWarning({
                  type: 'critical-memory',
                  ...warning
                });
              }
            }
          }
          
          lastMemoryCheck.current = usedMB;
        }

        // FPS monitoring (simplified)
        if (window.performance && window.performance.now) {
          const now = performance.now();
          if (lastMemoryCheck.frameTime) {
            const frameDuration = now - lastMemoryCheck.frameTime;
            if (frameDuration > 32) { // Slower than 30fps
              console.warn(`[${componentName}] Slow frame detected: ${Math.round(frameDuration)}ms`);
              
              if (onPerformanceWarning) {
                onPerformanceWarning({
                  type: 'slow-frame',
                  frameDuration,
                  component: componentName
                });
              }
            }
          }
          lastMemoryCheck.frameTime = now;
        }

        // DOM node count monitoring
        if (document.body) {
          const nodeCount = document.body.getElementsByTagName('*').length;
          if (nodeCount > 5000) {
            console.warn(`[${componentName}] High DOM node count: ${nodeCount}`);
            
            if (onPerformanceWarning) {
              onPerformanceWarning({
                type: 'high-dom-count',
                nodeCount,
                component: componentName
              });
            }
          }
        }

      } catch (error) {
        console.error(`[${componentName}] Performance monitoring error:`, error);
      }
    };

    // Initial check
    monitorPerformance();

    // Set up interval monitoring
    const interval = setInterval(monitorPerformance, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [componentName, memoryThreshold, intervalMs, enableOnDesktop, onHighMemory, onPerformanceWarning, isMobile]);

  // Return utility functions
  return {
    isMobile,
    getMemoryUsage: () => {
      if (performance.memory) {
        return {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      return null;
    },
    getDOMNodeCount: () => document.body ? document.body.getElementsByTagName('*').length : 0,
    warningCount: warningCount.current
  };
}; 