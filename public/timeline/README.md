# Timeline Content Structure

This directory contains the structured content for the Strategic Portfolio timeline. Content is organized by year with metadata and project details, utilizing an enhanced loading system with intelligent caching and performance optimizations.

## 📁 Directory Structure

```
timeline/
├── projects.json              # Main project index
├── README.md                  # This documentation
├── CONTENT_GUIDE.md          # Step-by-step content creation guide
├── _TEMPLATE_YEAR/           # Template for new years
│   ├── meta.json             # Template year metadata
│   └── _TEMPLATE_PROJECT/    # Template for new projects
│       └── project.json      # Template project data (images auto-detected)
├── 2023/
│   ├── meta.json             # Year metadata
│   ├── spacestation-animation/
│   │   ├── project.json      # Project details
│   │   ├── spacestation-animation_1.webp  # Cover image (auto-detected)
│   │   ├── spacestation-animation_2.webp  # Gallery image 1 (auto-detected)
│   │   └── spacestation-animation_3.webp  # Gallery image 2 (auto-detected)
│   └── proper-hemp-co/
│       ├── project.json
│       ├── proper-hemp-co_1.webp          # Cover image (auto-detected)
│       └── proper-hemp-co_2.webp          # Gallery image (auto-detected)
├── 2020/
│   ├── meta.json
│   └── neural-interface/
│       ├── project.json
│       ├── neural-interface_1.webp        # Cover image (auto-detected)
│       └── neural-interface_2.webp        # Gallery image (auto-detected)
└── 2018/
    ├── meta.json
    └── proper-hemp-co/
        ├── project.json
        ├── proper-hemp-co_1.webp          # Cover image (auto-detected)
        └── proper-hemp-co_2.webp          # Gallery image (auto-detected)
```

## 📋 Content Schemas

### projects.json (Main Index)
Central index file that lists all years and their projects:

```json
{
  "timeline": {
    "title": "Strategic Portfolio Timeline",
    "description": "A comprehensive archive of projects, case studies, and experiments",
    "lastUpdated": "2024-01-15",
    "totalProjects": 4
  },
  "years": [
    {
      "year": 2023,
      "projects": ["spacestation-animation", "proper-hemp-co"]
    },
    {
      "year": 2020,
      "projects": ["neural-interface"]
    }
  ]
}
```

### Year Metadata (meta.json)
Enhanced metadata for each year with comprehensive tracking:

```json
{
  "year": 2023,
  "title": "Strategic Growth & Leadership", 
  "description": "A pivotal year focused on scaling creative operations, building high-performance teams, and delivering breakthrough projects across animation, branding, and strategic consulting.",
  "highlight": "Leadership",
  "theme": "Scale & Innovation",
  "stats": {
    "projects": 3,
    "teamMembers": 45,
    "revenue": "$2.1M",
    "clientSatisfaction": "98%"
  },
  "keyMilestones": [
    "Scaled animation studio to 30+ professionals",
    "Secured major partnerships with NBC Universal",
    "Launched comprehensive brand strategy practice",
    "Implemented scalable production pipelines"
  ]
}
```

### Project Details (project.json)
Complete project information with validation and enhanced fields:

```json
{
  "id": "spacestation-animation-2023",
  "title": "Spacestation Animation",
  "year": 2023,
  "type": "CASE_STUDY",
  "size": "large", 
  "categories": ["Animation", "Leadership", "Operations"],
  "description": "Built complete animation studio from concept to execution, recruiting and scaling team to 30 professionals while establishing comprehensive production pipelines and securing major client partnerships.",
  "_imageNote": "Images are auto-detected! Place webp files named: spacestation-animation_1.webp (cover), spacestation-animation_2.webp (gallery), etc.",
  "metrics": [
    "Recruited and scaled team to 30 talented professionals",
    "Secured $85K deal with NBC Universal for Battlestar Galactica video game cinematic",
    "Produced 'Adley Lost in the Movies' with nationwide premiere in 96 theaters",
    "Established comprehensive production pipelines for internal and client projects"
  ],
  "roles": ["Creative Director", "Operations Manager", "Team Lead"],
  "technologies": ["Cinema 4D", "After Effects", "Houdini", "Nuke"],
  "team": ["30+ Animation Professionals", "Technical Directors", "Compositors"],
  "client": "NBC Universal / Battlestar Galactica",
  "duration": "12 months",
  "budget": "$850K+",
  "status": "Completed",
  "impact": "Established studio as premier animation house with nationwide theatrical release and major network partnership"
}
```

## 🎨 Project Classifications

### Project Types
- `CASE_STUDY`: Major client work or significant projects with detailed documentation and substantial impact
- `PROJECT`: Standard projects and developments with clear deliverables  
- `EXPERIMENT`: Research, learning, prototypes, or experimental work

### Project Sizes
- `large`: Major projects with significant scope, budget, team size, or strategic impact
- `small`: Smaller projects, experiments, focused initiatives, or personal work

### Categories
- `Animation`: Motion graphics, video production, 3D work, cinematic content
- `Design`: UI/UX, graphic design, brand work, visual identity
- `Development`: Web development, software engineering, technical implementation
- `Leadership`: Team management, strategic direction, organizational development
- `Operations`: Business operations, process improvement, workflow optimization
- `Strategy`: Business strategy, product strategy, market analysis

## 🔧 Adding New Content

### Quick Start Guide
1. **Add to Index**: Update `projects.json` with new year/project
2. **Copy Templates**: Use `_TEMPLATE_YEAR` and `_TEMPLATE_PROJECT` folders
3. **Update Data**: Replace all `REPLACE_WITH_*` placeholders in JSON files
4. **Add Images**: Place webp images named `project-slug_1.webp` (cover), `project-slug_2.webp` (gallery), etc.
5. **Test**: Use `Ctrl+Shift+R` on Archives page to refresh timeline data

### Detailed Instructions
See `CONTENT_GUIDE.md` for comprehensive step-by-step instructions on creating new years and projects.

## 🚀 Technical Architecture

### Enhanced Timeline Loader
The content is loaded dynamically by `src/utils/timelineLoader.js` with:
- **Auto-Image Detection**: Automatically scans for webp files using numbering convention (`_1`, `_2`, `_3`, etc.)
- **Intelligent Caching**: Multi-layer caching with configurable expiration
- **Batch Loading**: Concurrent requests with rate limiting for optimal performance
- **Retry Logic**: Automatic retry with exponential backoff for network resilience
- **Request Deduplication**: Prevents duplicate network calls
- **Graceful Degradation**: Fallback to static data if external loading fails

### Image System
Projects now use auto-detected webp images:
- **Cover Image**: `project-slug_1.webp` - automatically used as the cover image
- **Gallery Images**: `project-slug_2.webp`, `project-slug_3.webp`, etc. - automatically included in slideshow
- **No Manual Paths**: No need to specify image paths in JSON files - the system finds them automatically
- **WebP Only**: All images should be in webp format for optimal performance
- **Fallback Support**: If numbered webp files aren't found, falls back to old `cover` and `gallery` JSON fields

### Performance Features
- **Target Load Times**: < 2 seconds initial load, < 100ms cache hits
- **Validation**: Automatic data validation with detailed error reporting
- **Health Checks**: Built-in health monitoring and cache statistics
- **Hot Reload**: Real-time development feedback with refresh shortcuts

### Development Tools
- **Cache Management**: `timelineLoader.clearCache()` to clear all cached data
- **Health Check**: `timelineLoader.healthCheck()` for system diagnostics
- **Statistics**: `timelineLoader.getCacheStats()` for performance monitoring
- **Refresh Shortcut**: `Ctrl+Shift+R` on Archives page to reload timeline data

## 📊 Data Validation

### Required Fields
All projects must include: `id`, `title`, `year`, `type`, `size`, `categories`, `description`, `cover`

### Validation Rules
- **ID Format**: Lowercase, numbers, and hyphens only (e.g., `project-name-2023`)
- **Year Consistency**: Project year must match containing folder year
- **Type/Size**: Must use valid enum values from defined options
- **Categories**: Must be from the predefined category list
- **Images**: Paths must be valid and files must exist

### Error Handling
- **Missing Required Fields**: Causes loading failures with console errors
- **Invalid Values**: Generates warnings and may cause display issues
- **Missing Images**: Generates warnings but doesn't break functionality
- **Malformed JSON**: Prevents project loading with detailed error messages

## 🎯 Best Practices

### Content Creation
- **Descriptions**: Focus on problem → solution → impact narrative
- **Metrics**: Use specific numbers, percentages, and measurable outcomes
- **Images**: Use high-quality images at 800x600px or similar aspect ratios
- **Categories**: Choose 2-4 most relevant categories, avoid over-categorization

### File Organization
- **Consistent Naming**: Use descriptive, lowercase slugs with hyphens
- **Image Optimization**: Compress images for web while maintaining quality
- **Path Accuracy**: Ensure all file paths in JSON exactly match actual file locations
- **Template Usage**: Always start with templates to ensure consistent structure

### Development Workflow
1. Copy and rename template folders
2. Update all placeholder values in JSON files
3. Add and optimize images
4. Test with refresh shortcut (`Ctrl+Shift+R`)
5. Validate in browser console for errors/warnings
6. Deploy and verify production functionality

## 📈 Analytics & Monitoring

The timeline system provides comprehensive monitoring:
- **Load Performance**: Track initial load times and cache hit rates
- **Error Rates**: Monitor validation failures and loading errors
- **Usage Patterns**: Understand which projects and years are most viewed
- **Cache Efficiency**: Optimize caching strategies based on usage data

For development insights, use the browser console to access timeline loader statistics and health checks. 