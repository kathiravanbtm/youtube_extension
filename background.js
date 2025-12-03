// Background script for the extension
console.log("Background script loaded");

// Handle extension icon click to open options page
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Message listener for content script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  if (message.action === 'saveVideo') {
    const videoData = message.videoData;
    console.log("Saving video data:", videoData);
    
    // Get existing data
    chrome.storage.local.get(['videos', 'categories'], (result) => {
      const videos = result.videos || [];
      const categories = result.categories || ['Educational', 'Entertainment', 'Music', 'Gaming', 'Technology', 'Sports', 'News', 'Other'];
      
      // Check if video already exists
      const existingVideoIndex = videos.findIndex(v => v.id === videoData.id);
      
      if (existingVideoIndex !== -1) {
        // Update existing video - increment watch count and update date
        videos[existingVideoIndex].watchCount += 1;
        videos[existingVideoIndex].dateWatched = videoData.dateWatched;
        videos[existingVideoIndex].category = videoData.category; // Allow category changes
        console.log("Updated existing video:", videos[existingVideoIndex]);
      } else {
        // Add new video
        videos.push(videoData);
        console.log("Added new video:", videoData);
      }
      
      // Add category if it doesn't exist
      if (!categories.includes(videoData.category)) {
        categories.push(videoData.category);
        console.log("Added new category:", videoData.category);
      }
      
      // Save back to storage
      chrome.storage.local.set({ videos, categories }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving to storage:", chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log("Data saved successfully");
          sendResponse({ success: true, videoCount: videos.length });
        }
      });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});