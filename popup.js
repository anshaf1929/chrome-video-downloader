document.getElementById('detectBtn').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "detectVideos"}, function(response) {
      if (response && response.videos) {
        displayVideos(response.videos);
      }
    });
  });
});

function displayVideos(videos) {
  const videoList = document.getElementById('videoList');
  videoList.innerHTML = '';
  
  if (videos.length === 0) {
    videoList.innerHTML = '<p>No videos found on this page</p>';
    return;
  }
  
  videos.forEach((video, index) => {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video-item';
    videoDiv.innerHTML = `
      <strong>Video ${index + 1}</strong><br>
      <small>${video}</small><br>
      <button onclick="downloadVideo('${video}')">Download</button>
    `;
    videoList.appendChild(videoDiv);
  });
}

function downloadVideo(videoUrl) {
  chrome.downloads.download({
    url: videoUrl,
    filename: 'video-' + Date.now() + '.mp4'
  });
}
