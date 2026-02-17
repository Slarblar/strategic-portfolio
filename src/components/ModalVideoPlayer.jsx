import React, { useState, useRef, useEffect } from 'react';
import { getGumletModalUrl, getGumletThumbnailUrl, GUMLET_IFRAME_ATTRS, extractGumletId } from '../utils/gumletHelper';
import AutoplayVideoPlayer from './AutoplayVideoPlayer';

const ModalVideoPlayer = ({ videoData, onPlayStateChange, allowClickToToggle = false, onLoadingComplete, videoMode = 'manual' }) => {
  const isAutoplayMode = videoMode === 'autoplay';
  const iframeRef = useRef(null);
  
  // For autoplay mode, use the dedicated AutoplayVideoPlayer component
  if (isAutoplayMode) {
    return <AutoplayVideoPlayer videoData={videoData} onLoadingComplete={onLoadingComplete} />;
  }

  // Manual mode - traditional player with controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLoadedPlayer, setHasLoadedPlayer] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const [gumletPosterFailed, setGumletPosterFailed] = useState(false);
  
  // Construct the correct URL for the modal video player using standardized helper
  const getModalVideoUrl = (item) => {
    const url = item.url;
    
    // Check if it's a Gumlet URL
    if (url.includes('play.gumlet.io')) {
      const gumletId = extractGumletId(url);
      if (gumletId) {
        // Manual mode: traditional player with controls
        return getGumletModalUrl(gumletId, false, true);
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}api=1&autoplay=0&controls=0&title=0&byline=0&portrait=0&muted=1`;
    }

    return url;
  };

  const isGumletVideo = videoData?.url?.includes('play.gumlet.io');
  const gumletId = isGumletVideo ? extractGumletId(videoData?.url) : null;
  const gumletPosterUrl = gumletId ? getGumletThumbnailUrl(gumletId, 1) : null;

  // Reset player state when media item changes.
  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(true);
    setHasLoadedPlayer(false);
    setPendingPlay(false);
    setGumletPosterFailed(false);
  }, [videoData?.url]);

  // Handle iframe load completion
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      if (isGumletVideo) {
        if (pendingPlay) {
          const startPlayback = () => {
            sendPlayerCommand('play');
            sendPlayerCommand('setMuted', isMuted);
            setIsPlaying(true);
            onPlayStateChange?.(true);
            setPendingPlay(false);
          };
          setTimeout(startPlayback, 120);
          setTimeout(startPlayback, 300);
        } else {
          // Ensure player stays paused until user explicitly presses play.
          const stopPlayback = () => {
            sendPlayerCommand('pause');
            sendPlayerCommand('setMuted', true);
            setIsPlaying(false);
            setIsMuted(true);
            onPlayStateChange?.(false);
          };
          setTimeout(stopPlayback, 120);
          setTimeout(stopPlayback, 300);
          setTimeout(stopPlayback, 600);
          setTimeout(stopPlayback, 1000);
        }
      }

      onLoadingComplete?.();
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [isGumletVideo, isMuted, pendingPlay, onLoadingComplete, onPlayStateChange]);

  // Effect to control mute/unmute
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const message = { method: 'setMuted', value: isMuted };
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  }, [isMuted]);

  // Pause player when this instance unmounts.
  useEffect(() => {
    return () => {
      try {
        iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), '*');
      } catch (error) {
        // Ignore cross-origin cleanup errors.
      }
    };
  }, []);

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Send command to the video player via postMessage
  const sendPlayerCommand = (command, value) => {
    if (iframeRef.current?.contentWindow) {
      const message = value !== undefined ? { method: command, value: value } : { method: command };
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();

    // For Gumlet, delay iframe load until first user interaction to guarantee no autoplay.
    if (isGumletVideo && !hasLoadedPlayer) {
      setHasLoadedPlayer(true);
      setPendingPlay(true);
      return;
    }

    const newState = !isPlaying;
    setIsPlaying(newState);
    sendPlayerCommand(newState ? 'play' : 'pause');
    onPlayStateChange?.(newState);
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-ink/20 p-2">
      {/* Delay Gumlet iframe mount until user presses play to eliminate autoplay races */}
      {(hasLoadedPlayer || !isGumletVideo) ? (
        <iframe
          ref={iframeRef}
          src={getModalVideoUrl(videoData)}
          className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-lg pointer-events-none"
          frameBorder="0"
          allow={videoData.url?.includes('gumlet') ? GUMLET_IFRAME_ATTRS.allow : "autoplay; fullscreen; picture-in-picture"}
          allowFullScreen={videoData.url?.includes('gumlet') ? GUMLET_IFRAME_ATTRS.allowFullScreen : true}
          title={videoData.title}
        />
      ) : (
        <div className="absolute inset-2 rounded-lg overflow-hidden bg-ink/40">
          {(gumletPosterUrl && !gumletPosterFailed) ? (
            <img
              src={gumletPosterUrl}
              alt={`${videoData.title || 'Video'} thumbnail`}
              className="w-full h-full object-cover"
              onError={() => setGumletPosterFailed(true)}
            />
          ) : null}
        </div>
      )}
      
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