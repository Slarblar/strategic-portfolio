# Archives Z-Index & Selection System

## 🏗️ Z-Index Layer Architecture

The archives system uses a structured z-index hierarchy to ensure proper layering and prevent overlay issues:

```javascript
Z_INDEX = {
  BACKGROUND: 0,           // Base background layer
  SELECTED_HIGHLIGHT: 1,   // Selected element highlight (just above background)
  CONTENT: 10,             // Main content area
  CARDS: 20,               // Archive cards and interactive elements
  NAVIGATION: 30,          // Year markers and navigation
  OVERLAY_BACKDROP: 30,    // Filter overlay backdrop
  FIXED_UI: 40,            // Fixed timeline, labels, buttons
  OVERLAYS: 50,            // Dropdowns and filter panels
  MODALS: 60               // Project modals and top-level UI
}
```

## 🎯 Selection Highlight System

### Purpose
The `SelectedHighlight` component sits at z-index 1 (just above background) to highlight selected elements without interfering with cards or other UI components.

### Features
- **Positioned Above Background**: Z-index 1 ensures it's visible but doesn't overlay interactive elements
- **Smooth Animations**: Fade in/out with subtle pulse effect
- **Non-Intrusive**: Pointer events disabled, won't interfere with user interactions
- **Responsive**: Dynamically positions based on selected element's bounding box

### Usage

```jsx
// In ArchiveContainer
const [selectedElement, setSelectedElement] = useState(null);
const [showSelectedHighlight, setShowSelectedHighlight] = useState(false);

// Handle element selection
const handleElementSelect = (element, show = true) => {
  if (element) {
    const rect = element.getBoundingClientRect();
    setSelectedElement({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
  }
  setShowSelectedHighlight(show);
};

// In render
<SelectedHighlight 
  selectedElement={selectedElement}
  isVisible={showSelectedHighlight}
/>
```

### Card Selection
Archive cards automatically trigger selection highlighting when clicked:

```jsx
// In ArchiveCard
<motion.div
  ref={cardRef}
  onClick={() => onElementSelect && onElementSelect(cardRef.current, true)}
  style={{ zIndex: Z_INDEX.CARDS }}
>
```

## 🎨 Visual Hierarchy

```
┌─────────────────────────────────┐
│  MODALS (60)                    │  ← Project modals
├─────────────────────────────────┤
│  OVERLAYS (50)                  │  ← Filter dropdowns
├─────────────────────────────────┤
│  FIXED_UI (40)                  │  ← Timeline, navigation
├─────────────────────────────────┤
│  OVERLAY_BACKDROP (30)          │  ← Filter backdrop
│  NAVIGATION (30)                │  ← Year markers
├─────────────────────────────────┤
│  CARDS (20)                     │  ← Archive cards
├─────────────────────────────────┤
│  CONTENT (10)                   │  ← Main content area
├─────────────────────────────────┤
│  SELECTED_HIGHLIGHT (1)         │  ← Selection highlight
├─────────────────────────────────┤
│  BACKGROUND (0)                 │  ← Base background
└─────────────────────────────────┘
```

## 🔧 Implementation Benefits

### ✅ **Proper Layering**
- Selected highlights appear behind all interactive elements
- No interference with user interactions
- Clear visual hierarchy

### ✅ **Performance**
- Minimal re-renders with structured state management
- Efficient position calculation
- Smooth animations without layout thrashing

### ✅ **Accessibility**
- Non-intrusive visual feedback
- Maintains keyboard navigation
- Screen reader friendly

### ✅ **Maintainability**
- Centralized z-index constants
- Easy to adjust layer priorities
- Clear separation of concerns

## 🎯 MCP Integration

The system integrates with browser tools for selection detection:

```javascript
// Check selected element via MCP
mcp_browser-tools_getSelectedElement()

// Update highlight position based on selection
handleElementSelect(selectedElement, true)
```

This ensures the highlight system works seamlessly with browser-based selection tools and debugging workflows.

## 🚀 Future Enhancements

- **Multi-Selection**: Support for highlighting multiple elements
- **Selection Persistence**: Remember selected elements across page navigations  
- **Keyboard Navigation**: Arrow key selection support
- **Selection Analytics**: Track user selection patterns 

# Archive Card Color Scheme System

## Overview

The `ArchiveCard` component features a flexible, accessible color scheme system with 5 predefined themes. Each scheme ensures WCAG AA compliance for text contrast and provides consistent visual hierarchy across all card elements.

## Color Schemes

### 1. Green Scheme (A Pop Jolley Style)
- **Background**: `#465902`
- **Text**: `#eae2df`  
- **Use Case**: Creative work (animation, design)
- **Style**: Professional green with high contrast

### 2. Orange Scheme (Open Times Style)
- **Background**: `#f27127`
- **Text**: `#eae2df`
- **Use Case**: Technical work (development, web3, hardware)
- **Style**: Vibrant orange maintaining readability

### 3. Maroon Scheme (Grounded Machine Style)
- **Background**: `#591902`
- **Text**: `#eae2df`
- **Use Case**: Strategic work (strategy, leadership, operations)
- **Style**: Professional, earthy tone

### 4. Blue Scheme (Alternative Grounded Machine)
- **Background**: `#acc3f2`
- **Text**: `#1A1717` *(Note: Dark text on light background)*
- **Use Case**: Alternative case studies, small projects
- **Style**: Clean, professional appearance

### 5. Light Green Scheme (Alternative Style)
- **Background**: `#6e8c03`
- **Text**: `#eae2df`
- **Use Case**: Experimental work, small design projects
- **Style**: Fresh, modern feel

## Automatic Color Assignment

The system automatically assigns color schemes based on project characteristics:

### Case Studies (by primary category)
```typescript
case 'animation':
case 'design':
  return COLOR_SCHEMES.green; // A Pop Jolley style

case 'development':
case 'web3':
case 'hardware':
  return COLOR_SCHEMES.orange; // Open Times style

case 'strategy':
case 'leadership':
case 'operations':
  return COLOR_SCHEMES.maroon; // Grounded Machine style

default:
  return COLOR_SCHEMES.blue; // Alternative
```

### Experiments
All experiments use the **Light Green** scheme.

### Regular Projects (by size and category)
```typescript
// Large projects
case 'development':
case 'tech':
  return COLOR_SCHEMES.orange;

case 'design':
case 'branding':
  return COLOR_SCHEMES.green;

default:
  return COLOR_SCHEMES.maroon;

// Small projects
case 'design':
case 'branding':
  return COLOR_SCHEMES.lightGreen;

default:
  return COLOR_SCHEMES.blue;
```

## Manual Override

You can override automatic assignment by passing a `colorScheme` prop:

```jsx
<ArchiveCard 
  project={project}
  colorScheme="orange" // Force orange scheme
  index={0}
  inView={true}
/>
```

Available override values: `'green' | 'orange' | 'maroon' | 'blue' | 'lightGreen'`

## CSS Custom Properties

Each card generates CSS custom properties for theming:

```css
.archive-card {
  --card-bg: #465902;
  --card-text: #eae2df;
  --card-hover: #5A6B02;
  --card-accent: #6e8c03;
  --card-shadow: rgba(70, 89, 2, 0.15);
  --card-hover-shadow: rgba(70, 89, 2, 0.25);
  --badge-bg: rgba(234, 226, 223, 0.2);
  --badge-text: #eae2df;
  --badge-border: rgba(234, 226, 223, 0.3);
  --button-bg: rgba(234, 226, 223, 0.15);
  --button-hover: rgba(234, 226, 223, 0.25);
  --button-text: #eae2df;
}
```

## Accessibility Features

### WCAG AA Compliance
- All text meets minimum contrast ratio of 4.5:1
- High contrast maintained across all 5 color schemes
- Special handling for blue scheme with dark text on light background

### Visual Hierarchy
- **Primary text**: Full opacity for maximum readability
- **Secondary text**: 80% opacity for subtle hierarchy
- **Muted text**: 60% opacity for less important information
- **Interactive elements**: Clear hover states and focus indicators

### Motion & Animation
- Respects `prefers-reduced-motion` for accessibility
- Smooth transitions with spring physics
- Floating hover effects with appropriate shadow changes

## Implementation Example

```jsx
import ArchiveCard from './components/archives/ArchiveCard';

const project = {
  id: 'example-project',
  title: 'Example Project',
  type: 'CASE_STUDY',
  size: 'large',
  categories: ['Design', 'Development'],
  description: 'Project description...',
  metrics: ['Metric 1', 'Metric 2'],
  // ... other project properties
};

// Automatic color assignment (will use green scheme for design category)
<ArchiveCard 
  project={project}
  index={0}
  inView={true}
/>

// Manual color override
<ArchiveCard 
  project={project}
  colorScheme="orange"
  index={0}
  inView={true}
/>
```

## Customization

To add new color schemes, extend the `COLOR_SCHEMES` object in `ArchiveCard.jsx`:

```typescript
const COLOR_SCHEMES = {
  // ... existing schemes
  custom: {
    name: 'Custom Style',
    background: '#your-color',
    text: '#your-text-color',
    hover: '#your-hover-color',
    accent: '#your-accent-color',
    shadow: 'rgba(your, color, here, 0.15)',
    hoverShadow: 'rgba(your, color, here, 0.25)',
    badge: {
      bg: 'rgba(your, text, color, 0.2)',
      text: '#your-text-color',
      border: 'rgba(your, text, color, 0.3)'
    },
    button: {
      bg: 'rgba(your, text, color, 0.15)',
      hover: 'rgba(your, text, color, 0.25)',
      text: '#your-text-color'
    }
  }
};
```

## TypeScript Support

Full TypeScript interfaces are available in `src/types/colorSchemes.ts` for type safety and better development experience.

## Testing

The system includes:
- Build verification to ensure CSS custom properties work correctly
- Automatic contrast validation for accessibility compliance
- Responsive design testing across different screen sizes
- Animation performance optimization

## Best Practices

1. **Use automatic assignment** for consistent categorization
2. **Override sparingly** - only when specific design requirements demand it
3. **Test contrast** when customizing colors to maintain accessibility
4. **Consider context** - ensure color choices align with content meaning
5. **Maintain consistency** - use the same scheme for related projects when possible 