const VIMEO_TOKEN = 'ebd1f474796ef001b66ac925fc0613a6';

export const getVimeoThumbnail = async (videoId) => {
  // videoId parameter should be the base numeric ID like "1089216914"
  // This robust cleaning ensures we only use the pure numeric part.
  const numericId = String(videoId).split('/')[0].split(':')[0];

  console.log(`[vimeoApi] Original videoId param: "${videoId}", Using numericId for API call: "${numericId}"`);

  try {
    const apiUrl = `https://api.vimeo.com/videos/${numericId}`;
    console.log(`[vimeoApi] Attempting to fetch from URL: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `bearer ${VIMEO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    });
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, just use an empty object
      }
      console.error('[vimeoApi] Vimeo API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorResponse: errorData
      });
      throw new Error(`Failed to fetch video data from ${apiUrl}. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[vimeoApi] Vimeo API response (full):', data);
    console.log('[vimeoApi] Vimeo API response (pictures object):', data.pictures);
    
    if (!data.pictures || !data.pictures.sizes || data.pictures.sizes.length === 0) {
      console.error('[vimeoApi] Invalid or empty pictures data in API response:', data.pictures);
      throw new Error('Invalid video data structure or no pictures available');
    }
    
    const pictures = data.pictures.sizes;
    const thumbnail = pictures[pictures.length - 1]; // Get the largest thumbnail
    
    if (!thumbnail || !thumbnail.link) {
      console.error('[vimeoApi] No valid thumbnail link found in pictures array:', pictures);
      throw new Error('No thumbnail link available in API response');
    }
    
    return thumbnail.link;
  } catch (error) {
    console.error('[vimeoApi] Error in getVimeoThumbnail function:', error.message);
    return null;
  }
}; 