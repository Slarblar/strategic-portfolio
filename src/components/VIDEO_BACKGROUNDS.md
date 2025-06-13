# Optimized Video Background Components

This documentation covers the optimized video background components that are fully device-responsive and reusable across pages.

## Components

### 1. `OptimizedVideoBackground`
The core component with full customization options.

**Features:**
- Device-aware quality optimization (240p to 1440p)
- Mobile-specific optimizations (disable autoplay on mobile when needed)
- Network-aware quality adjustment
- Intersection Observer for performance
- Reduced motion preference support
- Accessibility features
- Error handling with fallbacks
- Hardware acceleration optimizations

### 2. `PageVideoBackground`
A simplified wrapper with preset configurations for common use cases.

**Usage:**
```jsx
import PageVideoBackground from '../components/PageVideoBackground';

// Hero section
<PageVideoBackground 
  videoId="your-video-id"
  type="hero"
  enableMobile={true}
  fallbackImage="/images/hero-fallback.jpg"
>
  <YourContent />
</PageVideoBackground>

// Section background
<PageVideoBackground 
  videoId="your-video-id"
  type="section"
  enableMobile={false}
>
  <YourContent />
</PageVideoBackground>

// Subtle background
<PageVideoBackground 
  videoId="your-video-id"
  type="subtle"
>
  <YourContent />
</PageVideoBackground>
```

### 3. `useOptimizedVideo` Hook
A custom hook that handles all the video optimization logic.

**Usage:**
```jsx
import { useOptimizedVideo } from '../hooks/useOptimizedVideo';

const MyComponent = ({ videoId }) => {
  const {
    containerRef,
    shouldShowVideo,
    isVideoLoaded,
    handleVideoLoad,
    getVideoUrl
  } = useOptimizedVideo({
    videoId,
    enableMobileVideo: true,
    enableIntersectionObserver: true
  });

  return (
    <div ref={containerRef}>
      {shouldShowVideo && (
        <iframe 
          src={getVideoUrl()}
          onLoad={handleVideoLoad}
        />
      )}
    </div>
  );
};
```

## Type Presets

### Hero (`type="hero"`)
- **Use case:** Main hero sections
- **Overlay opacity:** 0.4 (low, for text readability)
- **Scale:** 1.4
- **Noise texture:** Enabled
- **Best for:** Landing pages, main hero areas

### Section (`type="section"`)
- **Use case:** Content sections with overlaid text
- **Overlay opacity:** 0.6 (medium)
- **Scale:** 1.2
- **Noise texture:** Disabled
- **Best for:** About sections, feature highlights

### Subtle (`type="subtle"`)
- **Use case:** Background ambiance
- **Overlay opacity:** 0.8 (high, very subtle video)
- **Scale:** 1.1
- **Noise texture:** Disabled
- **Best for:** Footer sections, subtle backgrounds

## Device Optimizations

### Mobile Devices
- Conservative quality settings (360p-540p)
- Optional autoplay disable (iOS compatibility)
- Fallback image support
- Network-aware quality adjustment

### Desktop/Tablet
- High-quality video (720p-1440p based on screen size)
- Full autoplay support
- Hardware acceleration

### Network Conditions
- **2G/Slow 2G:** 240p-360p
- **3G:** 360p-720p
- **4G+:** Full quality based on screen size

## Props

### OptimizedVideoBackground Props
```jsx
{
  videoId: string,              // Gumlet video ID
  customSrc?: string,           // Custom video URL
  onLoad?: function,            // Callback when video loads
  className?: string,           // Additional CSS classes
  overlayOpacity?: number,      // Overlay opacity (0-1)
  enableMobileVideo?: boolean,  // Enable video on mobile
  fallbackImage?: string,       // Fallback image URL
  aspectRatio?: string,         // Video aspect ratio
  scale?: number,               // Video scale factor
  overlayGradient?: string,     // Custom gradient overlay
  enableIntersectionObserver?: boolean, // Lazy loading
  enableNoiseTexture?: boolean, // Film grain effect
  enableChromaticAberration?: boolean // Chromatic effect
}
```

### PageVideoBackground Props
```jsx
{
  videoId: string,              // Gumlet video ID
  type?: 'hero'|'section'|'subtle', // Preset configuration
  enableMobile?: boolean,       // Enable video on mobile
  fallbackImage?: string,       // Fallback image URL
  children?: ReactNode,         // Content to overlay
  className?: string,           // Additional CSS classes
  ...props                      // Additional props passed to OptimizedVideoBackground
}
```

## Best Practices

1. **Always provide a fallback image** for mobile users or when video fails to load
2. **Use appropriate type presets** for your use case
3. **Consider network conditions** in your target markets
4. **Test on mobile devices** to ensure good performance
5. **Provide meaningful `onLoad` callbacks** for loading states
6. **Use semantic markup** for accessibility

## Examples

### Basic Hero Video
```jsx
<PageVideoBackground 
  videoId="6840c728ed94500acc2d7621"
  type="hero"
  fallbackImage="/images/hero-bg.jpg"
>
  <div className="hero-content">
    <h1>Your Hero Title</h1>
    <p>Your hero description</p>
  </div>
</PageVideoBackground>
```

### Advanced Custom Configuration
```jsx
<OptimizedVideoBackground 
  videoId="your-video-id"
  enableMobileVideo={false}
  fallbackImage="/images/fallback.jpg"
  overlayOpacity={0.3}
  scale={1.5}
  enableNoiseTexture={true}
  enableChromaticAberration={true}
  onLoad={() => console.log('Video loaded!')}
/>
```

### Section with Content
```jsx
<section className="relative min-h-screen">
  <PageVideoBackground 
    videoId="section-video-id"
    type="section"
    enableMobile={false}
  />
  <div className="relative z-10 p-8">
    <h2>Section Title</h2>
    <p>Section content that overlays the video</p>
  </div>
</section>
``` 