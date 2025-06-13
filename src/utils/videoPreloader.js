class VideoPreloader {
  constructor() {
    this.loadingQueue = new Set();
    this.maxConcurrentLoads = 3; // Limit concurrent video loads
    this.loadingCount = 0;
  }

  async preloadVideo(url) {
    if (this.loadingQueue.has(url) || this.loadingCount >= this.maxConcurrentLoads) {
      return new Promise((resolve) => {
        // Queue the video for later loading
        setTimeout(() => this.preloadVideo(url).then(resolve), 1000);
      });
    }

    this.loadingQueue.add(url);
    this.loadingCount++;

    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      
      iframe.onload = () => {
        this.loadingQueue.delete(url);
        this.loadingCount--;
        document.body.removeChild(iframe);
        resolve();
      };

      iframe.onerror = () => {
        this.loadingQueue.delete(url);
        this.loadingCount--;
        document.body.removeChild(iframe);
        reject();
      };

      document.body.appendChild(iframe);
    });
  }

  getOptimizedVideoUrl(videoId, options = {}) {
    const {
      type = 'gumlet',
      quality = 'auto',
      preload = 'metadata',
      autoplay = false,
      loop = true,
      muted = true
    } = options;

    if (type === 'gumlet') {
      const params = new URLSearchParams({
        preload,
        autoplay: autoplay.toString(),
        loop: loop.toString(),
        background: 'true',
        disable_player_controls: 'true',
        quality,
        muted: muted.toString(),
        playsinline: 'true'
      });
      return `https://play.gumlet.io/embed/${videoId}?${params.toString()}`;
    }

    return '';
  }
}

export const videoPreloader = new VideoPreloader(); 