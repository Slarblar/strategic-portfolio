/**
 * MODULAR VIDEO CONFIGURATION SYSTEM
 * 
 * This centralized config makes video components work like "lego pieces" - 
 * easy to use, reuse, and maintain across all case studies.
 * 
 * HOW TO ADD A NEW PROJECT:
 * 1. Add a new project key to the videoConfigs object
 * 2. Define sections with videoId, thumbnailSrc, and videoDuration
 * 3. Always include a 'default' section as fallback
 * 
 * EXAMPLE:
 * 'my-new-project': {
 *   default: {
 *     videoId: 'your-video-id',
 *     thumbnailSrc: '/images/my-project/default-thumb.jpg',
 *     videoDuration: 10
 *   },
 *   'hero-video': {
 *     videoId: 'hero-video-id', 
 *     thumbnailSrc: '/images/my-project/hero-thumb.jpg',
 *     videoDuration: 15
 *   }
 * }
 * 
 * THEN USE ANYWHERE:
 * <ModularVideoPlayer projectId="my-new-project" section="hero-video" />
 */

export const videoConfigs = {
  // Quarter Machine Project Videos
  'quarter-machine': {
    // Default/Hero video for general use
    default: {
      videoId: '684289e8ed94500acc381c4b',
      thumbnailSrc: '/images/general/paper.jpg',
      videoDuration: 10
    },
    'hero': {
      videoId: '684112f32ea48d13d446c58c',
      thumbnailSrc: '/images/qm/thumbnails/hero-thumb-1.webp',
      videoDuration: 10
    },
    // Specific approach section videos
    'technical-architecture': {
      videoId: '684289e8ed94500acc381c4b',
      thumbnailSrc: '/images/qm/thumbnails/qm-myapproach/technical-architecture/7s-qm-planning-thumb1.webp',
      videoDuration: 7
    },
    'user-experience': {
      videoId: '684290b02ea48d13d4506ae6',
      thumbnailSrc: '/images/qm/thumbnails/qm-myapproach/user-experience-design/user-experience-design-thumb1.webp',
      videoDuration: 10
    },
    'platform-innovation': {
      videoId: '684295daed94500acc386298',
      thumbnailSrc: '/images/qm/thumbnails/qm-myapproach/platform-innovation/platforminnovation-thumb1.webp',
      videoDuration: 10
    },
    'partnerships': {
      videoId: '68429aac0f8d7a05184138e0',
      thumbnailSrc: '/images/qm/thumbnails/qm-myapproach/partnerships-collaborations/partnerships-collaborations-thumb1.webp',
      videoDuration: 10
    },
    'hero-mobile': {
      videoId: '6842a319ed94500acc38fa5c',
      thumbnailSrc: '/images/general/paper.jpg',
      videoDuration: 10
    },
    'hero-desktop': {
      videoId: '6842a319ed94500acc38fa5c',
      thumbnailSrc: '/images/general/paper.jpg',
      videoDuration: 10
    },
    'mobile-square': {
      videoId: '684289e8ed94500acc381c4b',
      thumbnailSrc: '/images/general/paper.jpg',
      videoDuration: 10
    }
  },

  // Spacestation Animation Project Videos
  'spacestation-animation': {
    // Default video for general use
    default: {
      videoId: '6840d19e2ea48d13d445d48b',
      thumbnailSrc: '/images/general/paper.jpg',
      videoDuration: 15
    },
    'hero': {
      videoId: '68414d69ed94500acc302885',
      thumbnailSrc: '/images/ssa/ssa-hero-thumb.webp',
      videoDuration: 10
    },
    // Specific approach section videos
    'strategic-team': {
      videoId: '6840072a0f8d7a05183029b8',
      thumbnailSrc: '/images/ssa/thumbnails/strategic-team-thumb.webp',
      videoDuration: 10
    },
    'production-pipeline': {
      videoId: '683ff9330f8d7a05182fb176',
      thumbnailSrc: '/images/ssa/thumbnails/production-pipeline-thumb.webp',
      videoDuration: 12
    },
    'diversified-content': {
      videoId: '6840affaed94500acc2ced6a',
      thumbnailSrc: '/images/ssa/thumbnails/diversified-content-thumb.webp',
      videoDuration: 11
    },
    'business-development': {
      videoId: '68451246ed94500acc484fa8',
      thumbnailSrc: '/images/ssa/thumbnails/business-development-thumb.webp',
      videoDuration: 13
    }
  },

  // A for Adley Project Videos
  'a-for-adley': {
    default: {
      videoId: '684208c62ea48d13d44df9d1',
      thumbnailSrc: '/images/a4/simplehover-thumbnail.jpg',
      videoDuration: 8
    },
    'hero': {
      videoId: '68411e53ed94500acc2ec4b2',
      thumbnailSrc: '/images/a4/a4-hero-thumb-1.webp',
      videoDuration: 10
    }
  },

  // Proper Hemp Co Project Videos
  'proper-hemp-co': {
    default: {
      videoId: '6847c67ff923a3909d01b53b',
      thumbnailSrc: '/images/properhempco/simplehover-thumbnail-proper.webp',
      videoDuration: 8
    },
    'ecommerce': {
      videoId: '6847c67ff923a3909d01b53b',
      thumbnailSrc: '/images/properhempco/simplehover-thumbnail-proper.webp',
      videoDuration: 8
    }
  }
};

// Helper function to get video config by project and section
export const getVideoConfig = (projectId, section = 'default') => {
  const projectConfig = videoConfigs[projectId];
  if (!projectConfig) {
    console.warn(`No video config found for project: ${projectId}`);
    return null;
  }

  const sectionConfig = projectConfig[section] || projectConfig.default;
  if (!sectionConfig) {
    console.warn(`No video config found for project: ${projectId}, section: ${section}`);
    return projectConfig.default || null;
  }

  return sectionConfig;
};

// Helper function to get thumbnail by video ID
export const getThumbnailByVideoId = (videoId) => {
  // Search through all projects and sections to find matching video ID
  for (const [projectId, projectConfig] of Object.entries(videoConfigs)) {
    for (const [section, config] of Object.entries(projectConfig)) {
      if (config.videoId === videoId) {
        return config.thumbnailSrc;
      }
    }
  }
  return '/images/thumbnails/default-thumb.webp';
};

// Helper function to get all available sections for a project
export const getAvailableSections = (projectId) => {
  const projectConfig = videoConfigs[projectId];
  if (!projectConfig) return [];
  
  return Object.keys(projectConfig);
}; 