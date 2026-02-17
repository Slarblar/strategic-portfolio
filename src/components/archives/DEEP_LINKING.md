# Archive Card Deep Linking

## Overview
Each archive card now supports deep linking via URL hash anchors, making it easy to share direct links to specific projects.

## How It Works

### 1. Anchor IDs
Each card automatically gets an ID based on the project slug:
```
id="project-{slug}"
```

Examples:
- `project-barbacoa`
- `project-sao`
- `project-invita-head-spa`
- `project-veefriends`

### 2. URL Format
To link directly to a project:
```
https://yoursite.com/archives#project-barbacoa
```

### 3. Features
- ✅ **Smooth scroll** - Automatically scrolls to the card with smooth animation
- ✅ **Centered view** - Card is centered in the viewport for best visibility
- ✅ **Subtle highlight** - Brief pulse animation draws attention to the card
- ✅ **Copy link button** - Hover over cards to reveal a link icon (desktop only)
- ✅ **Scroll margin** - 100px top margin ensures header doesn't overlap

### 4. Copy Link Button
On desktop, hover over any card to reveal a link icon in the top-right corner. Click it to copy the direct link to your clipboard.

## Technical Details

### Component Structure
- **ArchiveCard.jsx**: Contains anchor ID and copy functionality
- **Archives.jsx**: Handles hash detection and scrolling on page load
- **index.css**: Includes pulse animation for highlighting

### Scroll Behavior
```javascript
scrollMarginTop: '100px' // Prevents header overlap
behavior: 'smooth'        // Smooth scrolling
block: 'center'           // Centers card in viewport
```

## Usage Examples

### Share a Project
```html
<!-- Link to Barbacoa project -->
<a href="/archives#project-barbacoa">View Barbacoa Project</a>
```

### Programmatic Navigation
```javascript
// Navigate to a specific project
window.location.href = '/archives#project-sao';
```

### From Another Component
```jsx
import { Link } from 'react-router-dom';

<Link to="/archives#project-veefriends">
  View VeeFriends Project
</Link>
```

## Benefits
- 📱 **Shareable** - Easy to share specific projects on social media
- 🔗 **SEO Friendly** - Each project can be directly linked
- 📧 **Email Marketing** - Link directly to projects in newsletters
- 💼 **Portfolio Presentations** - Quick access to specific work examples
- 🎯 **Better UX** - Reduced friction for users finding specific projects
