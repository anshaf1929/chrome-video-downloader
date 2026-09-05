// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detectVideos") {
    const videos = detectVideos();
    sendResponse({videos: videos});
  }
});

function detectVideos() {
  let videoUrls = [];
  
  // Find all video tags
  const videoElements = document.querySelectorAll('video');
  videoElements.forEach(video => {
    // Get video source from src attribute
    if (video.src) {
      videoUrls.push(video.src);
    }
    
    // Get video sources from source tags
    const sources = video.querySelectorAll('source');
    sources.forEach(source => {
      if (source.src) {
        videoUrls.push(source.src);
      }
    });
  });
  
  // Find YouTube video IDs
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  const pageContent = document.body.innerHTML;
  let match;
  while ((match = youtubeRegex.exec(pageContent)) !== null) {
    videoUrls.push(`https://www.youtube.com/watch?v=${match[1]}`);
  }
  
  // Find video URLs in iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src');
    if (src && (src.includes('youtube') || src.includes('youtu.be') || src.includes('vimeo') || src.includes('video'))) {
      videoUrls.push(src);
    }
  });
  
  // Find video URLs in links and data attributes
  const links = document.querySelectorAll('a[href*=".mp4"], a[href*=".webm"], a[href*=".avi"], a[href*=".mov"]');
  links.forEach(link => {
    if (link.href) {
      videoUrls.push(link.href);
    }
  });
  
  // Remove duplicates
  videoUrls = [...new Set(videoUrls)];
  
  return videoUrls;
}
