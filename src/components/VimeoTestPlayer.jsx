import React from 'react';

const VimeoTestPlayer = () => {
  // Test video IDs and hashes
  const workingVideoId = '1089591890';
  const workingVideoHash = 'b248214ffd';
  const originalVideoId = '1088908222';
  const originalVideoHash = 'b9d7dfec1e';

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Working Video</h2>
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={`https://player.vimeo.com/video/${workingVideoId}?h=${workingVideoHash}&background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Original Video</h2>
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={`https://player.vimeo.com/video/${originalVideoId}?h=${originalVideoHash}&background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&badge=0&autopause=0`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VimeoTestPlayer; 