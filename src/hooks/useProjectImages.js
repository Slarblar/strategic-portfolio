import { useState, useEffect } from 'react';
import timelineLoader from '../utils/timelineLoader';

/**
 * Hook to load project images using the robust timelineLoader.
 * Uses the same reliable image detection as the main timeline system.
 */
export const useProjectImages = (year, projectSlug) => {
  const [images, setImages] = useState({
    cover: null,
    gallery: [],
    allImages: [],
    count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure we have the necessary info before fetching
    if (!year || !projectSlug) {
      setLoading(false);
      return;
    }

    let isMounted = true; // Prevent state updates on unmounted component

    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the timelineLoader's robust image detection
        const detectedImages = await timelineLoader.autoDetectImages(year, projectSlug);
        
        const imageData = {
          cover: detectedImages[0] || null,
          gallery: detectedImages.slice(1),
          allImages: detectedImages,
          count: detectedImages.length
        };
        
        if (isMounted) {
          setImages(imageData);
        }
        
      } catch (err) {
        console.error(`Failed to load images for ${projectSlug}:`, err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [year, projectSlug]);

  return { images, loading, error };
}; 