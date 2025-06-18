import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import SplitLayoutModal from './SplitLayoutModal';

const MajorProjects = ({ 
  media = [],
  title = "MAJOR WORKS",
  backgroundColor = "bg-[#6e8c03]",
  textColor = "text-sand"
}) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeThumbnailVideoId, setActiveThumbnailVideoId] = useState(null);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  
  const thumbnailVideoRefs = useRef({});

  // Normalize data to ensure consistent field names
  const normalizedData = media.map((item, index) => ({
    id: item.id || `item-${index}`,
    type: item.type || 'image',
    url: item.url || item.src || item.videoSrc || '',
    title: item.title || `Item ${index + 1}`,
    description: item.description || '',
    images: item.images || (item.type !== 'video' ? [item.url || item.src] : undefined)
  }));

  const sendPlayerCommand = (iframeRef, command, value) => {
    if (iframeRef?.contentWindow) {
      const message = value !== undefined ? { method: command, value: value } : { method: command };
      console.log('Sending command:', command, 'with value:', value);
      iframeRef.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  const getVideoUrl = (item, isModal = false) => {
    const url = item.url;
    
    // Check if it's a Gumlet URL
    if (url.includes('play.gumlet.io')) {
      // Extract video ID from Gumlet URL
      const gumletId = url.split('/embed/')[1]?.split('?')[0];
      if (isModal) {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=false&background=false&disable_player_controls=false&muted=true`;
      } else {
        return `https://play.gumlet.io/embed/${gumletId}?preload=false&autoplay=false&loop=true&background=true&disable_player_controls=true&muted=true`;
      }
    }
    
    // Fallback for any remaining Vimeo URLs
    if (isModal) {
      return `${url}&autoplay=0&controls=0&title=0&byline=0&portrait=0&muted=1&api=1`;
    } else {
      return `${url}&background=1&autoplay=0&loop=1&byline=0&title=0&muted=1`;
    }
  };

  useEffect(() => {
    if (selectedMedia?.type === 'video') {
      setIsModalVideoPlaying(false);
    }
    // When a modal opens/changes, pause any active thumbnail video.
    if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
      sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      setActiveThumbnailVideoId(null);
    }
  }, [selectedMedia]);

  const handleThumbnailVideoTogglePlay = (itemId) => {
    const targetRef = thumbnailVideoRefs.current[itemId];
    if (!targetRef) return;

    if (activeThumbnailVideoId === itemId) { // If it's already active, pause it
      sendPlayerCommand(targetRef, 'pause');
      setActiveThumbnailVideoId(null);
    } else { // Otherwise, play it and pause others
      // Pause the previously active thumbnail video, if any
      if (activeThumbnailVideoId && thumbnailVideoRefs.current[activeThumbnailVideoId]) {
        sendPlayerCommand(thumbnailVideoRefs.current[activeThumbnailVideoId], 'pause');
      }
      sendPlayerCommand(targetRef, 'play');
      setActiveThumbnailVideoId(itemId);

      // Reset modal video playing state
      if (isModalVideoPlaying) {
        setIsModalVideoPlaying(false);
      }
    }
  };

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <section className={`w-full ${backgroundColor} rounded-2xl p-8 md:p-12 mb-32`}>
      <h2 className={`font-display text-[40px] leading-none mb-16 ${textColor}`}>
        <GlitchText text={title} />
      </h2>

      {/* Media Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 pb-16 relative">
        {normalizedData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8,
              delay: index * 0.2,
              ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className="group"
          >
            {/* Title */}
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: (index * 0.2) + 0.3
              }}
                              className={`font-martian-mono text-xl tracking-wider mb-6 ${textColor}`}
            >
              <GlitchText text={item.title} />
            </motion.h3>

            {/* Media Container - Thumbnail always 16:9 */}
            <motion.div 
              className="relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl bg-ink/10"
              onClick={(e) => handleMediaClick(item)}
              whileHover={{ scale: 1.02 }}
              transition={{
                scale: {
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }
              }}
            >
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <iframe
                    ref={el => thumbnailVideoRefs.current[item.id] = el}
                    src={getVideoUrl(item, false)} // background video for thumbnail
                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" // autoplay still needed in allow for postMessage to work
                    allowFullScreen
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailVideoTogglePlay(item.id);
                    }}
                  />
                  <div className="absolute bottom-6 right-6 z-20">
                    {/* This button now controls the THUMBNAIL video */}
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); // Prevent card click if button is for in-place play
                        handleThumbnailVideoTogglePlay(item.id); 
                      }}
                      className="p-3 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full text-sand hover:text-orange transition-colors duration-200"
                    >
                      {activeThumbnailVideoId === item.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Optional: Mute/Unmute for thumbnail if needed, but currently hardcoded to muted=1 */}
                </div>
              ) : (
                <img
                  src={item.images ? 
                    item.images.find(img => img.toLowerCase().includes('thumbnail')) || item.images[0]
                    : item.url}
                  alt={item.description || `Design work ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Description Overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-ink/90 backdrop-blur-sm p-6"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <p className="font-martian-mono text-[14px] text-ink leading-relaxed">{item.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Modal for enlarged view - Use ContentModal for consistent UI */}
      <SplitLayoutModal
        isOpen={!!selectedMedia}
        onClose={closeModal}
        project={selectedMedia ? {
          title: selectedMedia.title,
          description: selectedMedia.description,
          details: selectedMedia.details && selectedMedia.details !== selectedMedia.description ? selectedMedia.details : undefined,
          type: selectedMedia.type,
          videoUrl: selectedMedia.type === 'video' ? getVideoUrl(selectedMedia, true) : undefined,
          images: selectedMedia.type === 'video' ? [] : (selectedMedia.images || [selectedMedia.url])
        } : null}
        currentImageIndex={0}
        onImageChange={() => {}}
        totalImages={selectedMedia?.type === 'video' ? 0 : (selectedMedia?.images?.length || 1)}
      />
    </section>
  );
};

export default MajorProjects; 