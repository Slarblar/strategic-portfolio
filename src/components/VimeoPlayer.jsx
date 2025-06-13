import React from 'react';

const VimeoPlayer = ({
  videoUrlIdentifier, // Expects 'VIDEO_ID' or 'VIDEO_ID/HASH'
  className,
  style,
}) => {
  return (
    <iframe
      src={`https://player.vimeo.com/video/${videoUrlIdentifier}&background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0`}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        ...style
      }}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      allowFullScreen
    />
  );
};

export default VimeoPlayer; 