// Video Background Configuration
// Centralized management of video IDs for different pages and projects

export const videoBackgrounds = {
  // Home page
  home: {
    videoId: "684be5bc84f5064184ad49e9",
    fallbackImage: "/images/hero-fallback.jpg"
  },

  // Project case studies
  projects: {
    "a-for-adley": {
      videoId: "68411e53ed94500acc2ec4b2",
      fallbackImage: "/images/a4/hero-fallback.jpg"
    },
    "quarter-machine": {
      videoId: "683ff702ed94500acc26edab", 
      fallbackImage: "/images/quarter-machine/hero-fallback.jpg"
    },
    "spacestation-animation": {
      videoId: "68409ea22ea48d13d4445fd8",
      fallbackImage: "/images/spacestation/hero-fallback.jpg"
    },
    "proper-hemp-co": {
      videoId: "684b9feae78588ecc9339a87",
      fallbackImage: "/images/proper-hemp/hero-fallback.jpg"
    }
  },

  // Case study layout template
  caseStudyTemplate: {
    // Used when no specific project video is available
    default: {
      videoId: "6840c728ed94500acc2d7621",
      fallbackImage: "/images/default-case-study-fallback.jpg"
    }
  }
};

// Helper function to get video config by project ID
export const getProjectVideoConfig = (projectId) => {
  return videoBackgrounds.projects[projectId] || videoBackgrounds.caseStudyTemplate.default;
};

// Helper function to get home video config
export const getHomeVideoConfig = () => {
  return videoBackgrounds.home;
}; 