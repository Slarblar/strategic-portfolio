import React, { useEffect, useState } from 'react';

const AdleyVideoBackground = ({ onLoad }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [quality, setQuality] = useState('360p');

  useEffect(() => {
    // Set video quality based on viewport width
    const updateQuality = () => {
      const width = window.innerWidth;
      if (width >= 1920) {
        setQuality('1080p');
      } else if (width >= 1280) {
        setQuality('720p');
      } else if (width >= 768) {
        setQuality('540p');
      } else {
        setQuality('360p');
      }
    };

    // Initial quality set
    updateQuality();

    // Update quality on resize
    window.addEventListener('resize', updateQuality);

    // Intersection observer for progressive loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const videoContainer = document.querySelector('.adley-video-container');
    if (videoContainer) {
      observer.observe(videoContainer);
    }

    return () => {
      window.removeEventListener('resize', updateQuality);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden" style={{ isolation: 'isolate' }}>
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-[250vh] -top-[5%] adley-video-container" style={{ zIndex: 1 }}>
        <div style={{ position: 'relative', aspectRatio: '341/180' }}>
          <iframe 
            loading="lazy"
            title="Gumlet video player"
            src={`https://play.gumlet.io/embed/68411e53ed94500acc2ec4b2?preload=${isIntersecting}&autoplay=${isIntersecting}&loop=true&background=true&disable_player_controls=true&quality=${quality}&muted=true`}
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
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
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

export default AdleyVideoBackground; 