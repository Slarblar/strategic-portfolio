import React, { useState, useRef, useEffect } from 'react';

const ModalVideoPlayer = ({ videoData, onPlayStateChange, allowClickToToggle = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const iframeRef = useRef(null);

  // Send command to the video player via postMessage
  const sendPlayerCommand = (command, value) => {
    if (iframeRef.current?.contentWindow) {
      const message = value !== undefined ? { method: command, value: value } : { method: command };
      // Use the video player's origin for security, or '*' for simplicity if origins vary
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };
  
  // Construct the correct URL for the modal video player
  const getModalVideoUrl = (item) => {
    const url = item.url;
    const initialMutedState = 1; // Always start muted, let user unmute

    if (url.includes('play.gumlet.io')) {
      const gumletId = url.split('/embed/')[1]?.split('?')[0];
      // Use preload=true for faster start, disable native controls
      return `https://play.gumlet.io/embed/${gumletId}?preload=true&autoplay=false&loop=false&background=false&disable_player_controls=true&muted=${initialMutedState}`;
    }
    
    if (url.includes('vimeo.com')) {
      const separator = url.includes('?') ? '&' : '?';
      // Enable Vimeo's player API
      return `${url}${separator}api=1&autoplay=0&controls=0&title=0&byline=0&portrait=0&muted=${initialMutedState}`;
    }

    return url; // Fallback for other URLs
  };

  // Effect to control play/pause
  useEffect(() => {
    sendPlayerCommand(isPlaying ? 'play' : 'pause');
    onPlayStateChange?.(isPlaying);
  }, [isPlaying]);

  // Effect to control mute/unmute
  useEffect(() => {
    // Gumlet and Vimeo both use 'setMuted' with a boolean value
    sendPlayerCommand('setMuted', isMuted);
  }, [isMuted]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-ink/20">
      {/* The iframe no longer uses a key that forces reloads */}
      <iframe
        ref={iframeRef}
        src={getModalVideoUrl(videoData)}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={videoData.title}
      />
      
      {/* Single overlay for all controls */}
      <div className="absolute inset-0 z-20">
        
        {/* Click-to-pause overlay when playing (if allowed) */}
        {allowClickToToggle && isPlaying && (
          <div 
            className="absolute inset-0 cursor-pointer z-10 group"
            onClick={handlePlayPause}
          >
            {/* Hover hint for pause */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/0 group-hover:bg-black/40 backdrop-blur-sm rounded-full items-center justify-center text-white hover:text-orange opacity-0 group-hover:opacity-100 transition-all duration-200 hidden group-hover:flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        {/* Play Button - Center (only when paused) */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer z-20"
            onClick={handlePlayPause}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-orange transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Controls bar - bottom (always visible) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          <div className="flex justify-end items-center">
            
            {/* Mute/Unmute Toggle Button */}
            <button
              onClick={handleMuteToggle}
              className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white hover:text-orange transition-colors duration-200"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M17.657 6.343a9 9 0 010 12.728" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVideoPlayer;