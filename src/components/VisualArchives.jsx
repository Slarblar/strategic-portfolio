import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import SplitLayoutModal from './SplitLayoutModal';

const VisualArchives = ({ media }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  return (
    <section className="py-16 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.header 
          className="text-center mb-16"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="font-header text-5xl md:text-6xl lg:text-7xl text-ink mb-6">
            <GlitchText text="Visual Archives" />
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange to-rust mx-auto mb-6"></div>
          <p className="font-martian-mono text-lg text-ink leading-relaxed max-w-2xl mx-auto">
            A curated collection of visual work spanning various mediums and creative explorations.
          </p>
        </motion.header>

        {/* Media Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-16 pb-16 relative">
          {media.map((item, index) => (
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
                className="font-martian-mono text-xl tracking-wider mb-6 text-ink"
              >
                <GlitchText text={item.title} />
              </motion.h3>

              {/* Media Container - Thumbnail always 16:9 */}
              <motion.div 
                className="relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl bg-ink/10"
                onClick={() => handleMediaClick(item)}
                whileHover={{ scale: 1.02 }}
                transition={{
                  scale: {
                    duration: 0.4,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }
                }}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={item.images ? 
                      // Look for thumbnail in image array
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
                  <p className="font-martian-mono text-[14px] text-sand leading-relaxed">{item.description}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Modal for enlarged view */}
        <SplitLayoutModal
          isOpen={!!selectedMedia}
          onClose={closeModal}
          project={selectedMedia ? {
            title: selectedMedia.title,
            description: selectedMedia.description,
            images: selectedMedia.images || [selectedMedia.url]
          } : null}
          currentImageIndex={0}
          onImageChange={() => {}}
          totalImages={selectedMedia?.images?.length || 1}
        />
      </motion.div>
    </section>
  );
};

export default VisualArchives; 