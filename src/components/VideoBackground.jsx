import React, { useEffect, useState } from 'react';
import { getGumletBackgroundUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

const VideoBackground = ({ videoId, customSrc, onLoad }) => {
  // Generate video URL once and keep it stable
  // Don't change autoplay based on intersection - let it autoplay and loop continuously
  const videoUrl = customSrc || getGumletBackgroundUrl(videoId, {
    autoplay: true,
    posterTime: 1
  });

  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden" style={{ isolation: 'isolate' }}>
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-[250vh] -top-[5%] video-container" style={{ zIndex: 1 }}>
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          <iframe 
            loading="eager"
            title="Gumlet video player"
            src={videoUrl}
            style={{
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
            allow={GUMLET_IFRAME_ATTRS.allow}
            allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
            onLoad={onLoad}
          />
        </div>
      </div>
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: 2,
          background: 'linear-gradient(180deg, rgba(14, 17, 17, 0.50) 0%, rgba(14, 17, 17, 0.35) 35%, rgba(14, 17, 17, 0.35) 65%, rgba(14, 17, 17, 0.50) 100%)',
          mixBlendMode: 'normal',
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default VideoBackground; 