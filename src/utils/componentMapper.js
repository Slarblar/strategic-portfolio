// Component imports
import MajorProjects from '../components/MajorProjects';
import VisualWorks from '../components/VisualWorks';

/**
 * Component mapping registry for dynamic component selection
 * This allows projects to specify which components to use in their data configuration
 * rather than hardcoding conditional logic throughout the application.
 * 
 * To add a new component variant:
 * 1. Import the component above
 * 2. Add it to the appropriate section in the componentMap
 * 3. Update project data to specify the component name
 * 
 * Example project data configuration:
 * {
 *   components: {
 *     visualArchives: 'VisualWorks' // or 'MajorProjects'
 *   }
 * }
 */
export const componentMap = {
  visualArchives: {
    MajorProjects: MajorProjects,
    VisualWorks: VisualWorks,
    // Add new visual archive component variants here
    // Example: 'MediaGallery': MediaGallery,
  },
  
  // Future component types can be added here
  // Example:
  // hero: {
  //   'DefaultHero': DefaultHero,
  //   'VideoHero': VideoHero,
  //   'ImageHero': ImageHero
  // },
  // 
  // approach: {
  //   'GridApproach': GridApproach,
  //   'TimelineApproach': TimelineApproach
  // }
};

/**
 * Utility function to get a component from the mapping
 * @param {string} componentType - Type of component (e.g., 'visualArchives')
 * @param {string} componentName - Name of specific component (e.g., 'VisualWorks')
 * @param {React.Component} fallback - Fallback component if not found
 * @returns {React.Component} The requested component or fallback
 */
export const getComponent = (componentType, componentName, fallback = null) => {
  const typeMap = componentMap[componentType];
  if (!typeMap) {
    console.warn(`Component type '${componentType}' not found in componentMap`);
    return fallback;
  }
  
  const component = typeMap[componentName];
  if (!component) {
    console.warn(`Component '${componentName}' not found in '${componentType}' map`);
    return fallback || typeMap[Object.keys(typeMap)[0]]; // Return first available component as fallback
  }
  
  return component;
};

/**
 * Helper function to get component configuration from project data
 * @param {Object} project - Project data object
 * @param {string} componentType - Type of component to get
 * @param {string} defaultComponent - Default component name if not specified
 * @returns {React.Component} The component to render
 */
export const getProjectComponent = (project, componentType, defaultComponent) => {
  const componentName = project.components?.[componentType] || defaultComponent;
  return getComponent(componentType, componentName, componentMap[componentType]?.[defaultComponent]);
}; 