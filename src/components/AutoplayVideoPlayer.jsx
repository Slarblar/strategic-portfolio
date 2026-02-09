import React, { useRef, useEffect } from 'react';
import { getGumletModalUrl, GUMLET_IFRAME_ATTRS, extractGumletId } from '../utils/gumletHelper';

/**
 * AutoplayVideoPlayer - GIF-style video player
 * 
 * A simple, clean video player that autoplays and loops continuously
 * like a performant GIF. No controls, no buttons - just pure looping video.
 * 
 * Perfect for: Logo animations, short motion graphics, 3-10 second loops
 * 
 * @param {Object} videoData - { url: string, title: string }
 * @param {Function} onLoadingComplete - Callback when video loads
 */
const AutoplayVideoPlayer = ({ videoData, onLoadingComplete }) => {
  const iframeRef = useRef(null);

  // Construct the autoplay video URL
  const getAutoplayVideoUrl = (item) => {
    const url = item.url;
    
    // Check if it's a Gumlet URL
    if (url.includes('play.gumlet.io')) {
      const gumletId = extractGumletId(url);
      if (gumletId) {
        // Autoplay mode: like a performant GIF - autoplay, loop, no controls, muted
        return getGumletModalUrl(gumletId, true, true, { 
          loop: true,
          controls: false,
          ui: false,
          background: true
        });
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}api=1&autoplay=1&loop=1&controls=0&title=0&byline=0&portrait=0&muted=1&background=1`;
    }

    return url;
  };

  // Handle iframe load completion
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && onLoadingComplete) {
      const handleLoad = () => {
        onLoadingComplete();
      };
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [onLoadingComplete]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-ink/20 p-2">
      <iframe
        ref={iframeRef}
        src={getAutoplayVideoUrl(videoData)}
        className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-lg"
        frameBorder="0"
        allow={GUMLET_IFRAME_ATTRS.allow}
        allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
        title={videoData.title}
      />
    </div>
  );
};

export default AutoplayVideoPlayer;
