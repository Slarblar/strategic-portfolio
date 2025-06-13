import React from 'react';
import styled from 'styled-components';
import VimeoPlayer from './VimeoPlayer';

// This is the "card" itself
const VideoCardContainer = styled.div`
  position: relative;
  /* width: 100%; // Width and height will be controlled by passed className or style */
  /* aspect-ratio: 1; // Aspect ratio will be controlled by passed className or style */
  border-radius: 8px; /* Consider making this a prop or theme variable if it varies */
  overflow: hidden;
  isolation: isolate; /* New stacking context for better rendering consistency */

  background: rgba(26, 26, 26, 0.9); /* Semi-transparent card background */
  backdrop-filter: blur(10px);      /* Blur content BEHIND this container */
  -webkit-backdrop-filter: blur(10px);

  /* Hardware acceleration for the container and its children */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
`;

// This wrapper ensures the iframe is layered correctly and handles scaling
const VideoPlayerWrapper = styled.div`
  position: absolute;
  inset: 0;
  /* z-index: 1; // Generally not needed if it's a direct child and container has isolation */

  & iframe {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Video content covers the iframe area */
    border: none !important; /* Explicitly remove any iframe border */
    
    transform: scale(1.25); /* Scale the video content up to prevent letterboxing and cover */
    transform-origin: center center;

    /* Additional properties for potentially smoother rendering in WebKit */
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
`;

const ApproachVideo = ({ videoId, className, style }) => {
  return (
    <VideoCardContainer className={className} style={style}>
      <VideoPlayerWrapper>
        <VimeoPlayer
          videoId={videoId}
          // className "w-full h-full" ensures iframe initially fills VideoPlayerWrapper
          // before its own styles (like transform:scale) are applied.
          className="w-full h-full" 
        />
      </VideoPlayerWrapper>
    </VideoCardContainer>
  );
};

export default ApproachVideo; 