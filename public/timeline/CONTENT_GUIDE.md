# Timeline Content Guide

This guide will help you add new years and projects to your archives timeline without needing to code. Follow these step-by-step instructions to maintain consistency and ensure optimal performance.

## 🖼️ New Image System (Auto-Detection)

**Important**: Projects now use an automated image detection system that's much simpler than before!

### How It Works:
- Place webp images directly in your project folder using a numbered naming convention
- `project-slug_1.webp` = Cover image (automatically detected)
- `project-slug_2.webp` = First gallery image (automatically detected)  
- `project-slug_3.webp` = Second gallery image (automatically detected)
- Continue numbering for additional gallery images (_4, _5, etc.)

### Benefits:
- **No manual paths**: Don't specify image paths in JSON files anymore
- **Automatic ordering**: Images display in numerical order (_1, _2, _3...)
- **WebP optimization**: Better compression and quality than JPEG/PNG
- **Cleaner project folders**: No more separate gallery subfolders
- **Fallback support**: Old `cover` and `gallery` JSON fields still work if needed

### Example:
```
2024/my-awesome-project/
├── project.json
├── my-awesome-project_1.webp    ← Cover image
├── my-awesome-project_2.webp    ← Gallery image 1  
├── my-awesome-project_3.webp    ← Gallery image 2
└── my-awesome-project_4.webp    ← Gallery image 3
```

## 🚀 Quick Start

### Adding a New Year

1. **Copy the template year folder**
   - Navigate to `public/timeline/`
   - Copy `_TEMPLATE_YEAR` folder
   - Rename it to your year (e.g., `2024`)

2. **Edit the year metadata**
   - Open `meta.json` in your year folder
   - Replace all `REPLACE_WITH_*` placeholders with your content
   - Use specific numbers and achievements for stats
   - Remove the `_instructions` section when done

3. **Update the main index**
   - Open `projects.json` in the timeline root
   - Add your year to the `years` array with an empty projects list initially

### Adding a New Project

1. **Copy the template project folder**
   - Go into your year folder (e.g., `2024/`)
   - Copy `_TEMPLATE_PROJECT` folder from `_TEMPLATE_YEAR`
   - Rename it to your project slug (e.g., `my-awesome-project`)

2. **Edit the project data**
   - Open `project.json` in your project folder
   - Replace all `REPLACE_WITH_*` placeholders
   - Focus on impact-driven descriptions and specific metrics
   - Remove the `_instructions` section when done

3. **Add images**
   - Add your cover image as `cover.jpg` (800x600px recommended)
   - Add gallery images in the `gallery/` folder
   - Ensure all image paths in project.json match actual files

4. **Update the year's project list**
   - Open `projects.json` in the timeline root
   - Add your project slug to the appropriate year's `projects` array

## 📋 Content Guidelines

### Project Types & When to Use Them
- **CASE_STUDY**: Major client work, comprehensive projects with substantial impact and detailed documentation
- **PROJECT**: Standard projects and developments with clear deliverables
- **EXPERIMENT**: Small tests, prototypes, learning projects, or research work

### Project Sizes
- **large**: Major projects with significant scope, budget, team involvement, or strategic impact
- **small**: Smaller projects, experiments, focused initiatives, or personal work

### Categories (Choose 2-4 Most Relevant)
- **Animation**: Motion graphics, video production, 3D work, cinematic content
- **Design**: UI/UX, graphic design, brand work, visual identity
- **Development**: Web development, software engineering, technical implementation
- **Leadership**: Team management, strategic direction, organizational development
- **Operations**: Business operations, process improvement, workflow optimization
- **Strategy**: Business strategy, product strategy, market analysis

### File Structure Requirements
```
timeline/
├── projects.json                    # Main index (update this!)
├── 2024/                           # Your year folder
│   ├── meta.json                   # Year metadata
│   └── my-project/                 # Project folder (lowercase-with-hyphens)
│       ├── project.json            # Project data (required)
│       ├── cover.jpg              # Main project image (required)
│       └── gallery/               # Additional images (optional)
│           ├── screenshot1.jpg
│           └── demo.gif
```

## 📝 Step-by-Step Example

Let's add a 2024 project called "Design System Redesign":

### Step 1: Create the Year (if needed)
```
1. Copy: _TEMPLATE_YEAR → 2024
2. Edit 2024/meta.json:
```

```json
{
  "year": 2024,
  "title": "Year of Systematic Innovation",
  "description": "Focused on creating scalable systems, optimizing workflows, and building foundation for future growth through strategic design and operational improvements.",
  "highlight": "Systems",
  "stats": {
    "projects": 3,
    "teamMembers": 12,
    "clientSatisfaction": "96%"
  },
  "keyMilestones": [
    "Launched comprehensive design system",
    "Streamlined development workflows",
    "Reduced project delivery time by 40%"
  ]
}
```

### Step 2: Create the Project
```
1. Copy: 2024/_TEMPLATE_PROJECT → 2024/design-system-redesign
2. Edit 2024/design-system-redesign/project.json:
```

```json
{
  "id": "design-system-redesign-2024",
  "title": "Design System Redesign",
  "year": 2024,
  "type": "CASE_STUDY",
  "size": "large",
  "categories": ["Design", "Strategy", "Operations"],
  "description": "Complete overhaul of design system architecture to improve consistency, reduce development time, and scale design operations across multiple product teams.",
  "_imageNote": "Images are auto-detected! Place webp files named: design-system-redesign_1.webp (cover), design-system-redesign_2.webp (gallery), etc.",
  "metrics": [
    "Reduced design-to-development handoff time by 60%",
    "Improved design consistency across 8 product teams",
    "Created 150+ reusable components and patterns",
    "Decreased bug reports related to UI inconsistencies by 75%"
  ],
  "roles": ["Design Systems Lead", "UX Strategy", "Team Coordination"],
  "technologies": ["Figma", "React", "Storybook", "Design Tokens"],
  "team": ["Product Designers", "Frontend Developers", "Product Managers"],
  "client": "Internal - Product Teams",
  "duration": "4 months",
  "status": "Completed",
  "impact": "Established scalable design foundation that accelerated product development and improved user experience consistency across all platforms"
}
```

### Step 3: Update Main Index
Edit `projects.json`:

```json
{
  "timeline": {
    "title": "Strategic Portfolio Timeline",
    "description": "A comprehensive archive of projects, case studies, and experiments",
    "lastUpdated": "2024-01-15",
    "totalProjects": 5
  },
  "years": [
    {
      "year": 2024,
      "projects": ["design-system-redesign"]
    },
    {
      "year": 2023,
      "projects": ["spacestation-animation", "proper-hemp-co"]
    }
  ]
}
```

### Step 4: Add Images
- Add webp images using the numbering convention:
  - `2024/design-system-redesign/design-system-redesign_1.webp` (cover image)
  - `2024/design-system-redesign/design-system-redesign_2.webp` (first gallery image)  
  - `2024/design-system-redesign/design-system-redesign_3.webp` (second gallery image)
  - Continue numbering as needed (_4, _5, etc.)
- Images are automatically detected by the system - no need to specify paths in JSON!
- Ensure webp images are optimized for web (recommend 800x600px for covers)

### Step 5: Test
- Use `Ctrl+Shift+R` on the Archives page to reload timeline data
- Check browser console for validation errors or warnings
- Verify project appears correctly in the timeline

## 💡 Writing Tips

### Compelling Descriptions
- **Start with the challenge**: What problem were you solving?
- **Explain your approach**: What was unique about your solution?
- **Highlight the impact**: What measurable outcomes did you achieve?

**Good Example:**
> "Redesigned core mobile banking experience for 2M+ users, implementing user-centered design principles that increased engagement by 40% and reduced support tickets by 60%."

**Avoid:**
> "Worked on a mobile app redesign project using modern design principles."

### Effective Metrics
- **Use specific numbers**: "40% increase" vs "significant improvement"
- **Include timeframes**: "Delivered 2 weeks ahead of schedule"
- **Focus on business impact**: Revenue, efficiency, user satisfaction
- **Highlight scale**: Team size, user count, budget range

**Examples of Strong Metrics:**
- "Recruited and scaled team to 30 talented professionals"
- "Secured $85K deal with NBC Universal"
- "Reduced load times by 60% across all pages"
- "Improved user satisfaction score from 3.2 to 4.7"

### Professional Roles & Technologies
- **Be Specific**: "Creative Director" vs "Leader"
- **Show Progression**: Lead roles, strategic involvement
- **Current Tech**: Use relevant, modern technologies
- **Avoid Overloading**: 3-6 key technologies, not every tool used

## 🔧 Troubleshooting

### Common Issues

**Project not showing up:**
- Check that project slug is added to `projects.json`
- Verify year folder name matches year in project.json
- Ensure no typos in folder names or file paths

**Images not loading:**
- Ensure webp files follow the numbering convention: `project-slug_1.webp`, `project-slug_2.webp`, etc.
- Check that webp files are placed directly in the project folder (not in subfolders)
- Verify file names match exactly (case-sensitive) - use lowercase project slug with underscores and numbers

**Timeline data not updating:**
- Use `Ctrl+Shift+R` to force refresh timeline data
- Check browser console for JSON syntax errors
- Validate JSON format using online JSON validators

**Validation warnings/errors:**
- Missing required fields: Add `id`, `title`, `year`, `type`, `size`, `categories`, `description`
- Invalid field values: Check that `type` and `size` use valid options  
- Year mismatch: Ensure project year matches folder year
- No images detected: Ensure webp files follow the `project-slug_#.webp` naming convention

### Performance Optimization

**Image Optimization:**
- Use WebP format exclusively for optimal compression and quality
- Target file sizes under 300KB for covers, 150KB for gallery images
- Recommended dimensions: 800x600px for covers, 600x400px for gallery
- Use `project-slug_1.webp` for cover, `project-slug_2.webp`, `project-slug_3.webp`, etc. for gallery

**JSON Validation:**
- Use consistent formatting and indentation
- Remove all `_instructions` sections from final files
- Validate syntax before deploying

## 📊 Validation Checklist

Before publishing your project, verify:

- [ ] All `REPLACE_WITH_*` placeholders are updated
- [ ] `_instructions` sections are removed from JSON files
- [ ] Project slug is added to `projects.json`
- [ ] Cover image exists as `project-slug_1.webp`
- [ ] Gallery images exist as `project-slug_2.webp`, `project-slug_3.webp`, etc.
- [ ] Year in project.json matches folder year
- [ ] Required fields are present and valid
- [ ] Categories are from the approved list
- [ ] ID uses lowercase-with-hyphens format
- [ ] Metrics include specific, measurable outcomes
- [ ] Description follows problem → solution → impact structure

## 🎯 Content Strategy

### Building a Compelling Timeline

**Showcase Progression:**
- Demonstrate growth in responsibility and scope
- Show evolution of skills and technologies
- Highlight increasing impact and value delivery

**Maintain Balance:**
- Mix of different project types and sizes
- Variety of categories and roles
- Recent work plus foundational experiences

**Focus on Impact:**
- Quantify results wherever possible
- Emphasize strategic and business value
- Connect individual projects to broader career narrative

### Long-term Maintenance

**Regular Updates:**
- Add new projects quarterly or bi-annually
- Update project statuses and impacts as they evolve
- Refresh images and descriptions to maintain relevance

**Archive Organization:**
- Keep consistent naming conventions
- Regularly review and consolidate similar projects
- Maintain template consistency for future additions

**Performance Monitoring:**
- Monitor loading times and user engagement
- Optimize images and content for better performance
- Use analytics to understand which projects resonate most 