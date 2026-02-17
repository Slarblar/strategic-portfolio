# 2026 Timeline Projects

This folder contains projects for the year 2026.

## Adding a New Project

To add a new project to 2026:

1. Create a new folder with the project slug (lowercase, hyphenated)
   - Example: `my-new-project`

2. Inside that folder, create a `project.json` file with this structure:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "year": 2026,
  "slug": "my-new-project",
  "description": "Brief description of the project",
  "details": "More detailed information about the project, including key achievements, challenges, and outcomes.",
  "categories": ["Design", "Development", "Animation", "Leadership", "Strategy", "Operations"],
  "technologies": ["Technology 1", "Technology 2", "Technology 3"],
  "type": "CASE_STUDY",
  "size": "large",
  "colorScheme": "olive",
  "client": "Client Name (optional)",
  "role": "Your Role (optional)",
  "caseStudyUrl": "/case-study-url (optional)",
  "images": [
    "/timeline/2026/my-new-project/image1.jpg",
    "/timeline/2026/my-new-project/image2.jpg"
  ],
  "videoUrl": "https://gumlet.com/video-url (optional)"
}
```

### Field Explanations:

- **id**: Unique identifier (use project slug or similar)
- **title**: Display name of the project
- **year**: Must be 2026
- **slug**: URL-friendly project name (lowercase-hyphenated)
- **description**: Short description (1-2 sentences)
- **details**: Longer description with more context
- **categories**: Array of relevant categories
- **technologies**: Array of tools/tech used
- **type**: `CASE_STUDY`, `PROJECT`, or `EXPERIMENT`
- **size**: `large` (main project), `small` (experiment), or `active` (ongoing)
- **colorScheme**: `olive`, `orange`, `rust`, `sky`, or `stone`
- **client**: Optional client name
- **role**: Optional role description
- **caseStudyUrl**: Optional link to detailed case study page
- **images**: Array of image paths (place images in project folder)
- **videoUrl**: Optional Gumlet video URL

## Current Projects

(Add your projects below as you create them)

- [ ] Add project folders here as they're created
