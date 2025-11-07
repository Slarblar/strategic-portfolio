import React, { useEffect, useState } from 'react';
import { getGumletBackgroundUrl, GUMLET_IFRAME_ATTRS } from '../utils/gumletHelper';

/**
 * Video Test Page - Diagnose why videos work in static HTML but not in React
 */
const VideoTest = () => {
  const [logs, setLogs] = useState([]);
  const [videoStates, setVideoStates] = useState({});

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[VideoTest ${timestamp}]`, message);
  };

  useEffect(() => {
    addLog('VideoTest component mounted');
  }, []);

  const handleVideoLoad = (videoId) => {
    addLog(`✅ Video ${videoId} loaded successfully`, 'success');
    setVideoStates(prev => ({ ...prev, [videoId]: 'loaded' }));
  };

  const handleVideoError = (videoId, error) => {
    addLog(`❌ Video ${videoId} failed: ${error}`, 'error');
    setVideoStates(prev => ({ ...prev, [videoId]: 'error' }));
  };

  // Test videos
  const testVideos = [
    { id: '68411e53ed94500acc2ec4b2', name: 'A for Adley Hero' },
    { id: '684112f32ea48d13d446c58c', name: 'Quarter Machine Hero' },
    { id: '68414d69ed94500acc302885', name: 'Spacestation Hero' }
  ];

  return (
    <div className="min-h-screen bg-ink text-cream p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">🔬 React Video Diagnostic Test</h1>
        <p className="mb-8 text-cream/80">
          Testing Gumlet videos in React context. Compare with gumlet-test.html results.
        </p>

        {/* Test Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {testVideos.map((video) => {
            const videoUrl = getGumletBackgroundUrl(video.id);
            const state = videoStates[video.id] || 'loading';
            
            return (
              <div key={video.id} className="bg-ink/50 border border-cream/20 rounded-lg p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  {video.name}
                  <span className={`text-xs px-2 py-1 rounded ${
                    state === 'loaded' ? 'bg-green-500/20 text-green-300' :
                    state === 'error' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {state}
                  </span>
                </h3>
                
                <div className="text-xs mb-2 font-mono text-cream/60 break-all">
                  ID: {video.id}
                </div>

                {/* Video Container */}
                <div className="relative w-full aspect-video bg-black/40 rounded overflow-hidden">
                  <iframe
                    src={videoUrl}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                    allow={GUMLET_IFRAME_ATTRS.allow}
                    allowFullScreen={GUMLET_IFRAME_ATTRS.allowFullScreen}
                    onLoad={() => handleVideoLoad(video.id)}
                    onError={(e) => handleVideoError(video.id, e.message)}
                    title={video.name}
                  />
                </div>

                {/* Debug Info */}
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-cream/60 hover:text-cream">
                    Show URL
                  </summary>
                  <div className="mt-2 p-2 bg-black/40 rounded font-mono break-all">
                    {videoUrl}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* Console Logs */}
        <div className="bg-black/60 rounded-lg p-4 border border-cream/20">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            📝 Console Logs
            <button 
              onClick={() => setLogs([])}
              className="ml-auto text-xs px-3 py-1 bg-cream/10 hover:bg-cream/20 rounded"
            >
              Clear
            </button>
          </h2>
          
          <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-cream/40">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div 
                  key={i}
                  className={`${
                    log.type === 'error' ? 'text-red-300' :
                    log.type === 'success' ? 'text-green-300' :
                    'text-cream/80'
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-orange/10 border border-orange/30 rounded-lg p-4">
          <h3 className="font-bold mb-2">📋 Diagnostic Checklist:</h3>
          <ul className="space-y-1 text-sm">
            <li>1. Check if videos show "loaded" status above</li>
            <li>2. Open browser DevTools (F12) → Console tab</li>
            <li>3. Look for errors related to: CORS, CSP, iframe, Gumlet</li>
            <li>4. Check Network tab for failed requests to play.gumlet.io</li>
            <li>5. Compare behavior with gumlet-test.html</li>
          </ul>
        </div>

        {/* Browser Info */}
        <div className="mt-4 p-4 bg-ink/50 border border-cream/20 rounded-lg">
          <h3 className="font-bold mb-2">🌐 Browser Info:</h3>
          <div className="text-xs font-mono space-y-1">
            <div>User Agent: {navigator.userAgent}</div>
            <div>Window Size: {window.innerWidth} x {window.innerHeight}</div>
            <div>React StrictMode: Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTest;

