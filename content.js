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
    const sources = video.querySelectorAll('source');
    sources.forEach(source => {
      if (source.src) {
        videoUrls.push(source.src);
      }
    });
  });
  
  // Find video URLs in iframes (YouTube, Vimeo, etc)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src');
    if (src && (src.includes('youtube') || src.includes('vimeo') || src.includes('video'))) {
      videoUrls.push(src);
    }
  });
  
  // Find video URLs in links
  const links = document.querySelectorAll('a[href*=".mp4"], a[href*=".webm"], a[href*=".avi"]');
  links.forEach(link => {
    if (link.href) {
      videoUrls.push(link.href);
    }
  });
  
  return videoUrls;
}
