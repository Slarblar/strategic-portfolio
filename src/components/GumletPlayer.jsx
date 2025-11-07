import React, { useEffect, useRef } from 'react';
import { getGumletEmbedUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

/**
 * GumletPlayer - Standardized Gumlet video player component
 * 
 * Uses the centralized gumletHelper utility for consistent URL generation
 * and proper iframe attributes.
 * 
 * @deprecated Consider using ModularVideoPlayer or FlexibleVideoPlayer for more features
 */
const GumletPlayer = ({
  videoId,
  className = "",
  style = {},
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  background = true,
  ui = false,
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize player when component mounts
    if (playerRef.current) {
      // You can add any initialization code here if needed
    }
  }, [videoId]);

  // Use standardized helper function for URL generation
  const videoUrl = getGumletEmbedUrl(videoId, {
    autoplay,
    loop,
    muted,
    controls,
    background,
    ui
  });

  return (
    <iframe
      ref={playerRef}
      src={videoUrl}
      className={`w-full h-full ${className}`}
      style={{
        border: 'none',
        ...style
      }}
      allow={GUMLET_IFRAME_ATTRS.allow}
      allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
    />
  );
};

export default GumletPlayer; 