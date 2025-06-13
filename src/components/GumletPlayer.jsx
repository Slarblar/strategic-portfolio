import React, { useEffect, useRef } from 'react';

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

  const videoUrl = `https://play.gumlet.io/embed/${videoId}?` + 
    `autoplay=${autoplay ? 'true' : 'false'}` +
    `&loop=${loop ? 'true' : 'false'}` +
    `&muted=${muted ? 'true' : 'false'}` +
    `&controls=${controls ? 'true' : 'false'}` +
    `&background=${background ? 'true' : 'false'}` +
    `&ui=${ui ? 'true' : 'false'}`;

  return (
    <iframe
      ref={playerRef}
      src={videoUrl}
      className={`w-full h-full ${className}`}
      style={{
        border: 'none',
        ...style
      }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
};

export default GumletPlayer; 