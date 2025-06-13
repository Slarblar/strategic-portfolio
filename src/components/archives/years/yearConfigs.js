// Year-specific configurations for the archives
// This allows each year to have custom metadata, descriptions, and stats

export const yearConfigs = {
  2025: {
    highlight: "Current",
    description: "Active projects and ongoing initiatives. Exploring new technologies and pushing creative boundaries.",
    dateAdded: "2025-01-01",
    stats: {
      totalProjects: 5,
      completedProjects: 2,
      experimentsLaunched: 8,
      newTechnologies: 3
    }
  },
  
  2024: {
    highlight: "Peak Year",
    description: "A breakthrough year with major client wins and successful product launches. Established new design systems and workflows.",
    dateAdded: "2024-12-31",
    stats: {
      totalProjects: 12,
      clientRevenue: "$2.1M",
      teamGrowth: "150%",
      awards: 3
    }
  },
  
  2023: {
    highlight: "Growth",
    description: "Year of expansion and learning. Diversified into new markets and refined our design process.",
    dateAdded: "2023-12-31",
    stats: {
      totalProjects: 8,
      newClients: 6,
      skillsLearned: 12,
      certifications: 2
    }
  },
  
  2022: {
    description: "Foundation year focusing on building strong client relationships and establishing core methodologies.",
    dateAdded: "2022-12-31",
    stats: {
      totalProjects: 6,
      foundationClients: 4,
      processesCreated: 8,
      toolsAdopted: 5
    }
  },
  
  2021: {
    description: "Adaptation and innovation during challenging times. Pioneered remote collaboration workflows.",
    dateAdded: "2021-12-31",
    stats: {
      totalProjects: 4,
      remoteProjects: 4,
      innovationHours: 240,
      processOptimizations: 6
    }
  },
  
  2020: {
    description: "Pivot year with focus on digital transformation and virtual experiences.",
    dateAdded: "2020-12-31",
    stats: {
      totalProjects: 5,
      digitalTransformations: 3,
      virtualEvents: 2,
      adaptations: 8
    }
  },
  
  // Earlier years can have simpler configs or be expanded as needed
  2019: {
    description: "Early career projects and skill development. Building foundation expertise.",
    dateAdded: "2019-12-31"
  },
  
  2018: {
    description: "Learning and experimentation phase. Exploring different design disciplines.",
    dateAdded: "2018-12-31"
  },
  
  2017: {
    description: "Academic and personal projects. Developing core competencies.",
    dateAdded: "2017-12-31"
  },
  
  2016: {
    description: "Early experiments and educational work.",
    dateAdded: "2016-12-31"
  },
  
  2015: {
    description: "Beginning of the design journey. First projects and explorations.",
    dateAdded: "2015-12-31"
  }
};

// Helper function to get year config
export const getYearConfig = (year) => {
  return yearConfigs[year] || null;
};

// Helper function to get years with special highlights
export const getHighlightedYears = () => {
  return Object.entries(yearConfigs)
    .filter(([year, config]) => config.highlight)
    .map(([year, config]) => ({ year: parseInt(year), highlight: config.highlight }));
}; 