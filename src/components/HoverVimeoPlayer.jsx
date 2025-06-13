import React, { useState } from 'react';
import styled from 'styled-components';
import VimeoPlayer from './VimeoPlayer';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  isolation: isolate;
  background: rgba(26, 26, 26, 0.1); /* Slight background for the container */
  cursor: pointer;
`;

const HoverVimeoPlayer = ({ 
  videoIdentifier, 
  className,
  style,
}) => {
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  console.log(`[HoverVimeoPlayer] Render: videoIdentifier=${videoIdentifier}, shouldPlayVideo=${shouldPlayVideo}`);

  const handleMouseEnter = () => {
    console.log('[HoverVimeoPlayer] Mouse enter - setting shouldPlayVideo to true');
    setShouldPlayVideo(true);
  };

  const handleMouseLeave = () => {
    console.log('[HoverVimeoPlayer] Mouse leave - setting shouldPlayVideo to false');
    setShouldPlayVideo(false);
  };

  return (
    <Container 
      className={className} 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <VimeoPlayer
        videoUrlIdentifier={videoIdentifier} 
        className="vimeo-iframe-wrapper w-full h-full" // Ensure it fills the container
        style={{ 
            width: '100%', 
            height: '100%', 
            // The iframe inside VimeoPlayer is styled to object-fit: contain and scale(1)
        }}
        shouldPlay={shouldPlayVideo}
        onReady={() => console.log('[HoverVimeoPlayer] VimeoPlayer ready')}
        onPlay={() => console.log('[HoverVimeoPlayer] VimeoPlayer playing')}
        onPause={() => console.log('[HoverVimeoPlayer] VimeoPlayer paused')}
        // onReady, onPlay, onPause can be passed if parent needs to react to these
      />
    </Container>
  );
};

export default HoverVimeoPlayer; 