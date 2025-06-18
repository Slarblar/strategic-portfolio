import React, { useState } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  quality = 75,
  sizes = "100vw",
  loading = "lazy",
  onLoadingComplete,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  const handleError = (e) => {
    console.error('Image failed to load:', src);
    setError(true);
    e.target.style.display = 'none';
  };

  if (!src || src === '/placeholder.jpg') {
    return (
      <div className={`relative ${className}`} style={props.style}>
        <div className="absolute inset-0 bg-ink/20 flex items-center justify-center">
          <p className="text-sm text-sand/60">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={props.style}>
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-full"
        loading={priority ? "eager" : loading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading state - subtle and non-conflicting */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-ink/5" />
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-ink/20 flex items-center justify-center">
          <p className="text-sm text-sand/60">Failed to load image</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 