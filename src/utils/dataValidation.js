/**
 * Data Validation Utilities for Timeline Content
 * Ensures data integrity and provides helpful error messages
 */

// Valid enum values
export const VALID_PROJECT_TYPES = ['CASE_STUDY', 'PROJECT', 'EXPERIMENT'];
export const VALID_PROJECT_SIZES = ['large', 'small', 'active'];
export const VALID_CATEGORIES = [
  'Animation', 'Design', 'Development', 'Leadership', 'Operations', 'Strategy'
];
export const VALID_STATUS_VALUES = [
  'Completed', 'In Progress', 'On Hold', 'Cancelled', 'Planned'
];
export const VALID_VIDEO_TYPES = ['vimeo', 'gumlet'];

/**
 * Validate timeline index structure
 */
export function validateTimelineIndex(data) {
  const errors = [];
  
  if (!data) {
    errors.push('Index data is null or undefined');
    return { isValid: false, errors };
  }
  
  // Validate timeline metadata
  if (!data.timeline) {
    errors.push('Missing timeline metadata object');
  } else {
    if (!data.timeline.title) {
      errors.push('timeline.title is required');
    }
    if (!data.timeline.description) {
      errors.push('timeline.description is required');
    }
    if (!data.timeline.lastUpdated) {
      errors.push('timeline.lastUpdated is required');
    }
    if (typeof data.timeline.totalProjects !== 'number') {
      errors.push('timeline.totalProjects must be a number');
    }
  }
  
  // Validate years array
  if (!data.years || !Array.isArray(data.years)) {
    errors.push('years must be an array');
  } else {
    data.years.forEach((yearData, index) => {
      const yearErrors = validateYearIndexEntry(yearData, index);
      errors.push(...yearErrors);
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate individual year entry in index
 */
export function validateYearIndexEntry(yearData, index) {
  const errors = [];
  
  if (!yearData.year) {
    errors.push(`years[${index}].year is required`);
  } else if (typeof yearData.year !== 'number') {
    errors.push(`years[${index}].year must be a number`);
  } else if (yearData.year < 1900 || yearData.year > 2100) {
    errors.push(`years[${index}].year seems unrealistic: ${yearData.year}`);
  }
  
  if (!yearData.projects || !Array.isArray(yearData.projects)) {
    errors.push(`years[${index}].projects must be an array`);
  } else if (yearData.projects.length === 0) {
    errors.push(`years[${index}].projects cannot be empty`);
  } else {
    yearData.projects.forEach((projectSlug, projectIndex) => {
      if (!projectSlug || typeof projectSlug !== 'string') {
        errors.push(`years[${index}].projects[${projectIndex}] must be a non-empty string`);
      } else if (!/^[a-z0-9-]+$/.test(projectSlug)) {
        errors.push(`years[${index}].projects[${projectIndex}] slug "${projectSlug}" contains invalid characters (use lowercase, numbers, and hyphens only)`);
      }
    });
  }
  
  return errors;
}

/**
 * Validate year metadata
 */
export function validateYearMeta(data, year) {
  const errors = [];
  const warnings = [];
  
  if (!data) {
    errors.push('Year metadata is null or undefined');
    return { isValid: false, errors, warnings };
  }
  
  // Required fields
  if (!data.year) {
    errors.push('year is required');
  } else if (data.year !== year) {
    errors.push(`year field (${data.year}) does not match directory year (${year})`);
  }
  
  // Optional but recommended fields
  if (!data.title) {
    warnings.push('title is recommended for better UX');
  }
  
  if (!data.description) {
    warnings.push('description is recommended for context');
  }
  
  // Validate stats if present
  if (data.stats && typeof data.stats !== 'object') {
    errors.push('stats must be an object');
  }
  
  // Validate key milestones if present
  if (data.keyMilestones && !Array.isArray(data.keyMilestones)) {
    errors.push('keyMilestones must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate project data
 */
export function validateProject(data, year, projectSlug) {
  const errors = [];
  const warnings = [];
  
  if (!data) {
    errors.push('Project data is null or undefined');
    return { isValid: false, errors, warnings };
  }
  
  // Required fields
  const requiredFields = ['id', 'title', 'year', 'type', 'size', 'categories', 'description'];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });
  
  // Validate specific field types and values
  if (data.year && data.year !== year) {
    errors.push(`year field (${data.year}) does not match directory year (${year})`);
  }
  
  if (data.type && !VALID_PROJECT_TYPES.includes(data.type)) {
    errors.push(`type "${data.type}" is invalid. Must be one of: ${VALID_PROJECT_TYPES.join(', ')}`);
  }
  
  if (data.size && !VALID_PROJECT_SIZES.includes(data.size)) {
    errors.push(`size "${data.size}" is invalid. Must be one of: ${VALID_PROJECT_SIZES.join(', ')}`);
  }
  
  if (data.categories) {
    if (!Array.isArray(data.categories)) {
      errors.push('categories must be an array');
    } else {
      const invalidCategories = data.categories.filter(cat => !VALID_CATEGORIES.includes(cat));
      if (invalidCategories.length > 0) {
        errors.push(`Invalid categories: ${invalidCategories.join(', ')}. Valid categories: ${VALID_CATEGORIES.join(', ')}`);
      }
    }
  }
  
  if (data.status && !VALID_STATUS_VALUES.includes(data.status)) {
    warnings.push(`status "${data.status}" is not a standard value. Consider using: ${VALID_STATUS_VALUES.join(', ')}`);
  }
  
  // Validate video fields
  if (data.videoId) {
    if (!data.videoType) {
      warnings.push('videoType is recommended when videoId is provided');
    } else if (!VALID_VIDEO_TYPES.includes(data.videoType)) {
      errors.push(`videoType "${data.videoType}" is invalid. Must be one of: ${VALID_VIDEO_TYPES.join(', ')}`);
    }
    
    // Validate video ID format
    if (data.videoType === 'vimeo' && !/^\d+$/.test(data.videoId)) {
      warnings.push('Vimeo videoId should typically be numeric');
    }
    if (data.videoType === 'gumlet' && data.videoId.length < 20) {
      warnings.push('Gumlet videoId appears too short (should be ~24 characters)');
    }
  }
  
  if (data.videoThumbnail && !isValidImagePath(data.videoThumbnail)) {
    errors.push(`videoThumbnail path "${data.videoThumbnail}" appears invalid`);
  }
  
  if (data.hoverToPlay !== undefined && typeof data.hoverToPlay !== 'boolean') {
    errors.push('hoverToPlay must be a boolean value');
  }
  
  // Validate arrays
  const arrayFields = ['metrics', 'roles', 'technologies', 'team', 'gallery'];
  arrayFields.forEach(field => {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array`);
    }
  });
  
  // Validate image paths
  if (data.cover && !isValidImagePath(data.cover)) {
    errors.push(`cover image path "${data.cover}" appears invalid`);
  }
  
  if (data.gallery) {
    data.gallery.forEach((imagePath, index) => {
      if (!isValidImagePath(imagePath)) {
        errors.push(`gallery[${index}] image path "${imagePath}" appears invalid`);
      }
    });
  }
  
  // Recommendations
  if (!data.cover) {
    warnings.push('cover image is recommended for visual appeal');
  }
  
  if (!data.metrics || data.metrics.length === 0) {
    warnings.push('metrics are recommended to showcase project impact');
  }
  
  if (!data.technologies || data.technologies.length === 0) {
    warnings.push('technologies are recommended to show technical skills');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate image path format
 */
function isValidImagePath(path) {
  if (!path || typeof path !== 'string') return false;
  
  // Check for valid image extensions
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasValidExtension = validExtensions.some(ext => path.toLowerCase().endsWith(ext));
  
  // Check for proper timeline path structure
  const isTimelinePath = path.startsWith('/timeline/') || path.startsWith('timeline/');
  
  // Allow external URLs
  const isExternalUrl = path.startsWith('http://') || path.startsWith('https://');
  
  return hasValidExtension && (isTimelinePath || isExternalUrl);
}

/**
 * Comprehensive validation runner
 */
export function validateTimelineData(indexData, yearMetaData = {}, projectsData = {}) {
  const results = {
    overall: { isValid: true, errors: [], warnings: [] },
    index: null,
    years: {},
    projects: {}
  };
  
  // Validate index
  if (indexData) {
    results.index = validateTimelineIndex(indexData);
    if (!results.index.isValid) {
      results.overall.isValid = false;
      results.overall.errors.push(...results.index.errors);
    }
    results.overall.warnings.push(...results.index.warnings);
  }
  
  // Validate year metadata
  Object.entries(yearMetaData).forEach(([year, data]) => {
    results.years[year] = validateYearMeta(data, parseInt(year));
    if (!results.years[year].isValid) {
      results.overall.isValid = false;
      results.overall.errors.push(...results.years[year].errors.map(err => `Year ${year}: ${err}`));
    }
    results.overall.warnings.push(...results.years[year].warnings.map(warn => `Year ${year}: ${warn}`));
  });
  
  // Validate projects
  Object.entries(projectsData).forEach(([key, data]) => {
    const [year, projectSlug] = key.split('/');
    results.projects[key] = validateProject(data, parseInt(year), projectSlug);
    if (!results.projects[key].isValid) {
      results.overall.isValid = false;
      results.overall.errors.push(...results.projects[key].errors.map(err => `Project ${key}: ${err}`));
    }
    results.overall.warnings.push(...results.projects[key].warnings.map(warn => `Project ${key}: ${warn}`));
  });
  
  return results;
}

/**
 * Generate validation report
 */
export function generateValidationReport(validationResults) {
  const { overall, index, years, projects } = validationResults;
  
  let report = '# Timeline Data Validation Report\n\n';
  
  // Overall status
  report += `## Overall Status: ${overall.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`;
  
  if (overall.errors.length > 0) {
    report += '## ❌ Errors (Must Fix)\n';
    overall.errors.forEach(error => {
      report += `- ${error}\n`;
    });
    report += '\n';
  }
  
  if (overall.warnings.length > 0) {
    report += '## ⚠️ Warnings (Recommendations)\n';
    overall.warnings.forEach(warning => {
      report += `- ${warning}\n`;
    });
    report += '\n';
  }
  
  // Detailed breakdown
  if (Object.keys(years).length > 0 || Object.keys(projects).length > 0) {
    report += '## Detailed Results\n\n';
    
    // Year results
    Object.entries(years).forEach(([year, result]) => {
      report += `### Year ${year}: ${result.isValid ? '✅' : '❌'}\n`;
      if (result.errors.length > 0) {
        result.errors.forEach(error => report += `- ❌ ${error}\n`);
      }
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => report += `- ⚠️ ${warning}\n`);
      }
      report += '\n';
    });
    
    // Project results
    Object.entries(projects).forEach(([key, result]) => {
      report += `### Project ${key}: ${result.isValid ? '✅' : '❌'}\n`;
      if (result.errors.length > 0) {
        result.errors.forEach(error => report += `- ❌ ${error}\n`);
      }
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => report += `- ⚠️ ${warning}\n`);
      }
      report += '\n';
    });
  }
  
  return report;
} 