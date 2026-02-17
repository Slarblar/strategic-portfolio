/**
 * Gumlet Video Helper Utility
 * 
 * Standardized Gumlet URL generation to ensure consistent behavior
 * across all video components in the application.
 * 
 * CRITICAL PARAMETERS FOR GUMLET:
 * - autoplay: Must be true for background videos
 * - muted: REQUIRED for autoplay to work (browser policy)
 * - playsinline: REQUIRED for iOS devices (prevents fullscreen)
 * - preload: 'auto' is better than 'metadata' for immediate playback
 * 
 * IFRAME PERMISSIONS REQUIRED:
 * allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
 */

/**
 * Generate a standardized Gumlet embed URL
 * @param {string} videoId - The Gumlet video ID
 * @param {Object} options - Configuration options
 * @returns {string} Complete Gumlet embed URL
 */
export const getGumletEmbedUrl = (videoId, options = {}) => {
  if (!videoId) {
    console.error('Gumlet Helper: No video ID provided');
    return '';
  }

  const {
    autoplay = true,
    loop = true,
    muted = true,
    background = true,
    preload = 'auto',
    controls = false,
    ui = false,
    posterTime = null,
    startTime = null
  } = options;

  const params = new URLSearchParams({
    autoplay: autoplay.toString(),
    loop: loop.toString(),
    muted: muted.toString(),
    playsinline: 'true', // CRITICAL: Always true for mobile support
    preload,
    api: '1'
  });

  // Add optional parameters
  if (background) {
    params.append('background', 'true');
  }
  
  if (!controls && !background) {
    // Only add if explicitly needed and not using background mode
    params.append('controls', 'false');
  }

  if (!ui && !background) {
    // Only add if explicitly needed and not using background mode
    params.append('ui', 'false');
  }

  if (posterTime !== null) {
    params.append('poster_time', posterTime.toString());
  }

  if (startTime !== null) {
    params.append('start_time', startTime.toString());
  }

  return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
};

/**
 * Generate Gumlet URL for background videos (hero sections, etc.)
 * @param {string} videoId - The Gumlet video ID
 * @param {Object} options - Additional options
 * @returns {string} Gumlet URL optimized for backgrounds
 */
export const getGumletBackgroundUrl = (videoId, options = {}) => {
  return getGumletEmbedUrl(videoId, {
    autoplay: true,
    loop: true,
    muted: true,
    background: true,
    preload: 'auto',
    ...options
  });
};

/**
 * Generate Gumlet URL for interactive/hover videos
 * @param {string} videoId - The Gumlet video ID
 * @param {boolean} isPlaying - Whether video should be playing
 * @param {Object} options - Additional options
 * @returns {string} Gumlet URL for interactive playback
 */
export const getGumletInteractiveUrl = (videoId, isPlaying = false, options = {}) => {
  return getGumletEmbedUrl(videoId, {
    autoplay: isPlaying,
    loop: options.loop !== undefined ? options.loop : true,
    muted: true,
    background: true,
    preload: 'metadata',
    ...options
  });
};

/**
 * Generate Gumlet URL for modal/fullscreen videos
 * @param {string} videoId - The Gumlet video ID
 * @param {boolean} autoplay - Whether to autoplay
 * @param {boolean} muted - Whether video is muted
 * @param {Object} options - Additional options
 * @returns {string} Gumlet URL for modal playback
 */
export const getGumletModalUrl = (videoId, autoplay = false, muted = true, options = {}) => {
  return getGumletEmbedUrl(videoId, {
    autoplay, // Keep modal behavior manual unless explicitly requested
    loop: false,
    muted,
    background: true, // Most reliable way to suppress native Gumlet UI
    controls: false,
    ui: false,
    preload: 'auto',
    ...options
  });
};

/**
 * Generate Gumlet thumbnail URL
 * @param {string} videoId - The Gumlet video ID
 * @param {number} time - Time in seconds for thumbnail
 * @returns {string} Thumbnail URL
 */
export const getGumletThumbnailUrl = (videoId, time = 1) => {
  if (!videoId) return '';
  // Gumlet thumbnail URLs require workspace + asset ID.
  // Fallback to known workspace to avoid CORS-restricted oEmbed requests on client.
  const workspaceId = import.meta.env.VITE_GUMLET_WORKSPACE_ID || '683fd1bbed94500acc25ecf1';
  return `https://video.gumlet.io/${workspaceId}/${videoId}/thumbnail-1-0.png?time=${time}`;
};

/**
 * Standard iframe attributes for Gumlet embeds
 * Use this to ensure consistent iframe configuration
 */
export const GUMLET_IFRAME_ATTRS = {
  allow: 'autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write',
  allowFullScreen: true,
  style: {
    border: 'none'
  }
};

/**
 * Validate a Gumlet video ID
 * @param {string} videoId - The video ID to validate
 * @returns {boolean} Whether the ID is valid
 */
export const isValidGumletId = (videoId) => {
  if (!videoId || typeof videoId !== 'string') return false;
  // Gumlet IDs are typically 24 character hex strings
  return /^[a-f0-9]{24}$/i.test(videoId);
};

/**
 * Extract video ID from a Gumlet URL
 * @param {string} url - Full Gumlet URL
 * @returns {string|null} Extracted video ID or null
 */
export const extractGumletId = (url) => {
  if (!url) return null;
  const match = url.match(/play\.gumlet\.io\/embed\/([a-f0-9]{24})/i);
  return match ? match[1] : null;
};

/**
 * Get optimal preload strategy based on context
 * @param {string} context - Context: 'hero', 'above-fold', 'below-fold', 'hover'
 * @returns {string} Preload value
 */
export const getOptimalPreload = (context) => {
  switch (context) {
    case 'hero':
    case 'above-fold':
      return 'auto';
    case 'below-fold':
      return 'metadata';
    case 'hover':
      return 'none';
    default:
      return 'metadata';
  }
};

export default {
  getGumletEmbedUrl,
  getGumletBackgroundUrl,
  getGumletInteractiveUrl,
  getGumletModalUrl,
  getGumletThumbnailUrl,
  GUMLET_IFRAME_ATTRS,
  isValidGumletId,
  extractGumletId,
  getOptimalPreload
};

