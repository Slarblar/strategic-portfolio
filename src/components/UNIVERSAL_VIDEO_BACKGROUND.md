# Universal Video Background System

## 🎯 Overview

A single, consolidated video background component that handles all device optimization and is used across all pages. This replaces multiple legacy video background components with one optimized solution.

## 🚀 Key Features

### Device Optimization
- **Mobile (< 768px):** 360p-540p quality, enhanced zoom for better framing
- **Tablet (768px-1024px):** 720p quality, moderate zoom
- **Large Tablet (1024px-1366px):** 1080p quality, minimal zoom  
- **Desktop (> 1366px):** 720p-1440p quality based on screen size

### Height-Based Scaling
- Automatically calculates optimal scale to fit video height
- Ensures video covers full viewport on all devices
- Prevents letterboxing and maintains aspect ratio

### Performance Optimizations
- Network-aware quality adjustment (2G, 3G, 4G+)
- Intersection Observer for lazy loading
- Debounced resize events
- Hardware acceleration
- Reduced motion support

### Visual Features
- Semi-dark gradient overlay for text readability
- Configurable overlay opacity
- Fallback image support
- Loading indicators
- Development debug info

## 📁 File Structure

```
src/
├── components/
│   └── UniversalVideoBackground.jsx    # Main component
├── data/
│   └── videoBackgrounds.js             # Video ID configuration
└── hooks/
    └── useOptimizedVideo.js             # Optimization hook (legacy)
```

## 🎛️ Configuration

### Video IDs (`src/data/videoBackgrounds.js`)
```javascript
export const videoBackgrounds = {
  home: {
    videoId: "6840c728ed94500acc2d7621",
    fallbackImage: "/images/hero-fallback.jpg"
  },
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
      videoId: "TBD", // To be added
      fallbackImage: "/images/proper-hemp/hero-fallback.jpg"
    }
  }
};
```

## 💻 Usage

### Basic Usage (Project Pages)
```jsx
import UniversalVideoBackground from '../components/UniversalVideoBackground';
import { getProjectVideoConfig } from '../data/videoBackgrounds';

// In your component
<UniversalVideoBackground 
  {...getProjectVideoConfig('a-for-adley')}
  enableMobileVideo={true}
  overlayOpacity={0.4}
/>
```

### Home Page Usage
```jsx
import { getHomeVideoConfig } from '../data/videoBackgrounds';

<UniversalVideoBackground 
  {...getHomeVideoConfig()}
  enableMobileVideo={true}
  overlayOpacity={0.4}
/>
```

### Custom Configuration
```jsx
<UniversalVideoBackground 
  videoId="custom-video-id"
  fallbackImage="/path/to/fallback.jpg"
  enableMobileVideo={false}
  overlayOpacity={0.6}
  customSrc="https://custom-video-url.com"
/>
```

## 🔧 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoId` | string | - | Gumlet video ID |
| `customSrc` | string | - | Custom video URL (overrides videoId) |
| `fallbackImage` | string | null | Image shown when video fails/disabled |
| `enableMobileVideo` | boolean | true | Enable video on mobile devices |
| `overlayOpacity` | number | 0.4 | Opacity of dark overlay (0-1) |
| `enableIntersectionObserver` | boolean | true | Enable lazy loading |
| `onLoad` | function | - | Callback when video loads |
| `className` | string | "" | Additional CSS classes |

## 📱 Device Behavior

### Mobile (< 768px)
- Uses 360p-540p quality based on screen width
- Enhanced zoom scale for better mobile framing
- Optional video disable for performance
- Conservative autoplay handling for iOS

### Tablet (768px-1024px)  
- Uses 720p quality
- Moderate zoom scale
- Full autoplay support

### Large Tablet (1024px-1366px)
- Uses 1080p quality  
- Minimal zoom scale
- Optimized for iPad Pro and similar devices

### Desktop (> 1366px)
- Uses 720p-1440p based on screen size
- Height-based scaling
- Full feature support

## 🌐 Network Adaptation

- **2G/Slow 2G:** Forces 240p quality
- **3G:** Limits to 720p maximum
- **4G+:** Full quality based on device capabilities

## ♿ Accessibility

- Respects `prefers-reduced-motion` setting
- Proper ARIA labels
- Keyboard accessible (no focus traps)
- Semantic HTML structure

## 🏗️ Current Implementation

### Migrated Pages ✅
- **Home Page** (`src/pages/Home.jsx`)
- **Project Details** (`src/pages/ProjectDetails.jsx`) 
- **Case Study Layout** (`src/components/CaseStudyLayout.jsx`)

### Legacy Components (To Remove) ⚠️
- `VideoBackground.jsx` 
- `AdleyVideoBackground.jsx`
- `BaseVideoBackground.jsx`
- `PageVideoBackground.jsx`
- `OptimizedVideoBackground.jsx`

## 🔄 Adding New Projects

1. **Add video config** in `src/data/videoBackgrounds.js`:
```javascript
"new-project": {
  videoId: "your-gumlet-video-id",
  fallbackImage: "/images/new-project/hero-fallback.jpg"
}
```

2. **Use in component**:
```jsx
<UniversalVideoBackground 
  {...getProjectVideoConfig('new-project')}
  enableMobileVideo={true}
  overlayOpacity={0.4}
/>
```

## 🐛 Development Debug

In development mode, a debug overlay shows:
- Current device type
- Video quality being used
- Scale factor applied

## 🚀 Performance Benefits

1. **Single optimized component** instead of multiple variants
2. **Centralized configuration** for easy management
3. **Height-based scaling** ensures proper video coverage
4. **Network-aware quality** reduces bandwidth usage
5. **Device-specific optimizations** improve mobile performance
6. **Lazy loading** prevents unnecessary video loads

## 📋 Migration Checklist

- [x] Created UniversalVideoBackground component
- [x] Created centralized video configuration
- [x] Migrated Home page
- [x] Migrated ProjectDetails page  
- [x] Migrated CaseStudyLayout component
- [ ] Remove legacy components
- [ ] Add Proper Hemp Co. video ID
- [ ] Test on all device types
- [ ] Performance audit 