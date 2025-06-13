import React from 'react';
import OptimizedVideoBackground from './OptimizedVideoBackground';

/**
 * PageVideoBackground - A simplified wrapper for OptimizedVideoBackground
 * Makes it easy to add optimized video backgrounds to any page with preset configurations
 */
const PageVideoBackground = ({
  videoId,
  type = "hero", // 'hero', 'section', 'subtle'
  enableMobile = true,
  fallbackImage,
  children,
  className = "",
  ...props
}) => {
  // Preset configurations for different types
  const getTypeConfig = (type) => {
    switch (type) {
      case 'hero':
        return {
          overlayOpacity: 0.4,
          enableNoiseTexture: true,
          enableChromaticAberration: false,
          scale: 1.4
        };
      case 'section':
        return {
          overlayOpacity: 0.6,
          enableNoiseTexture: false,
          enableChromaticAberration: false,
          scale: 1.2
        };
      case 'subtle':
        return {
          overlayOpacity: 0.8,
          enableNoiseTexture: false,
          enableChromaticAberration: false,
          scale: 1.1
        };
      default:
        return {
          overlayOpacity: 0.5,
          enableNoiseTexture: false,
          enableChromaticAberration: false,
          scale: 1.3
        };
    }
  };

  const typeConfig = getTypeConfig(type);

  return (
    <div className={`relative ${className}`}>
      <OptimizedVideoBackground
        videoId={videoId}
        enableMobileVideo={enableMobile}
        fallbackImage={fallbackImage}
        {...typeConfig}
        {...props}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageVideoBackground; 