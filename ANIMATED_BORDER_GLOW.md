# Animated Border Glow - Active Projects

## Overview

Active projects in the archives now feature an elegant animated border glow that cycles through brand colors, creating a premium "alive" feeling.

## Implementation

### CSS Animation

Added to `src/index.css`:

```css
@keyframes borderGlow {
  0%, 100% {
    /* Olive green phase */
    box-shadow: 
      0 0 20px rgba(70, 89, 2, 0.4),
      0 0 40px rgba(70, 89, 2, 0.2),
      inset 0 0 20px rgba(70, 89, 2, 0.1);
    border-color: rgba(70, 89, 2, 0.6);
  }
  33% {
    /* Orange phase */
    box-shadow: 
      0 0 25px rgba(255, 92, 26, 0.5),
      0 0 50px rgba(255, 92, 26, 0.25),
      inset 0 0 25px rgba(255, 92, 26, 0.15);
    border-color: rgba(255, 92, 26, 0.7);
  }
  66% {
    /* Sky blue phase */
    box-shadow: 
      0 0 22px rgba(172, 194, 255, 0.45),
      0 0 45px rgba(172, 194, 255, 0.22),
      inset 0 0 22px rgba(172, 194, 255, 0.12);
    border-color: rgba(172, 194, 255, 0.65);
  }
}
```

### Features

1. **Border Glow Animation** (8s loop)
   - Cycles through 3 brand colors
   - Olive → Orange → Sky Blue → Olive
   - Smooth ease-in-out transitions
   - Outer glow + inner glow effect

2. **Subtle Inner Gradient** (4s pulse)
   - Radial gradient from top
   - Gentle breathing effect
   - Adds depth and dimension
   - Synchronized with border

3. **Enhanced Border**
   - 2px solid border (vs 1px normal)
   - Color synced with glow animation
   - More prominent than standard cards

## Visual Effect

### Color Cycle Timing:
```
0s ─────── Olive (start)
2.64s ──── Orange (peak at 33%)
5.28s ──── Sky Blue (peak at 66%)
8s ─────── Olive (loop)
```

### Glow Intensity:
- **Outer Glow**: 20-25px radius
- **Mid Glow**: 40-50px radius (softer)
- **Inner Glow**: Subtle radial from top
- **Opacity**: 0.4-0.7 for breathing effect

## Usage

Mark a project as active in `project.json`:

```json
{
  "id": "sao-2025",
  "title": "Sao House",
  "size": "active",  ← Triggers animated glow
  "year": 2025
}
```

## Technical Details

### Component: ArchiveCard.jsx

```jsx
<div
  className={`
    archive-card 
    ${project.size === 'active' ? 'active-project-card' : ''}
  `}
>
```

### CSS Classes:

- `.active-project-card` - Main animation class
- `.active-project-card::before` - Inner glow overlay

### Performance:

- ✅ GPU-accelerated (box-shadow, opacity)
- ✅ Smooth 60fps animation
- ✅ Low resource usage (CSS-only)
- ✅ No JavaScript required
- ✅ Works on mobile (optional disable if needed)

## Brand Colors Used

| Color | Hex | Usage |
|-------|-----|-------|
| Olive | `#465902` | Start/end of cycle |
| Orange | `#FF5C1A` | Peak energy point |
| Sky Blue | `#ACC2FF` | Cool transition |

## Design Philosophy

### Why This Works:

1. **Subtle Yet Noticeable**
   - Doesn't overpower content
   - Catches eye without distraction
   - Premium, high-end feel

2. **Brand Integration**
   - Uses your existing color palette
   - Reinforces visual identity
   - Consistent with site aesthetic

3. **Ambient Animation**
   - Slow 8-second cycle
   - Smooth transitions
   - Breathing, alive quality

4. **Glass Morphism Synergy**
   - Complements existing glass effects
   - Adds dimension and depth
   - Modern, elegant appearance

## Mobile Optimization

Currently active on all devices. To disable on mobile:

```css
@media (max-width: 768px) {
  .active-project-card {
    animation: none;
    border: 1px solid rgba(70, 89, 2, 0.4);
    box-shadow: 0 0 10px rgba(70, 89, 2, 0.2);
  }
  
  .active-project-card::before {
    display: none;
  }
}
```

## Future Enhancements

Possible additions:
- [ ] Hover pause animation
- [ ] Click ripple effect
- [ ] Intensity control (subtle/normal/bold)
- [ ] Custom color sequences per project
- [ ] Sync with project progress/timeline

## Example: Sao House

**Project**: Sao House (2025)  
**Status**: Active - Launching End 2026  
**Effect**: Animated border cycling Olive → Orange → Sky Blue  
**Result**: Immediately recognizable as ongoing project

---

**Created**: 2026-02-08  
**Status**: ✅ Production Ready  
**Performance**: Excellent (CSS-only, GPU-accelerated)  
**Browser Support**: All modern browsers
