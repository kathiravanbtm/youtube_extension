console.log("Content script loaded on YouTube");

// Simple click detection with console log
document.addEventListener('click', function(event) {
  console.log("Click detected on:", event.target);
  
  // Try multiple selectors to catch video clicks
  const target = event.target;
  const videoLink = target.closest('a[href*="/watch"]') || 
                    target.closest('a[href*="youtu.be"]') ||
                    target.closest('[id*="video-title"]') ||
                    target.closest('[class*="video"]');
  
  if (videoLink) {
    console.log("VIDEO CLICKED!", videoLink);
    const href = videoLink.href;
    if (href && href.includes('watch')) {
      console.log("Video URL:", href);
      
      // Extract video ID
      const videoId = new URL(href).searchParams.get('v');
      if (videoId) {
        alert(`Video detected: ${videoId}`);
      }
    }
  }
});