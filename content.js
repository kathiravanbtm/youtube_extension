console.log("Content script loaded on YouTube");

// Function to create and show category modal
function showCategoryModal(videoId, videoUrl) {
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'yt-category-modal';
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
      ">
        <h3 style="margin: 0 0 20px 0; color: #333;">Categorize Video</h3>
        <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Video ID: ${videoId}</p>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; color: #333;">Choose Category:</label>
          <select id="categorySelect" style="
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
          ">
            <option value="">Select a category</option>
            <option value="Educational">Educational</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="News">News</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button id="cancelBtn" style="
            padding: 10px 20px;
            border: 1px solid #ddd;
            background: #f5f5f5;
            border-radius: 5px;
            cursor: pointer;
          ">Cancel</button>
          <button id="submitBtn" style="
            padding: 10px 20px;
            border: none;
            background: #ff0000;
            color: white;
            border-radius: 5px;
            cursor: pointer;
          ">Submit</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle submit
  document.getElementById('submitBtn').addEventListener('click', () => {
    const category = document.getElementById('categorySelect').value;
    if (category) {
      console.log(`Video ${videoId} categorized as: ${category}`);
      modal.remove();
      // Navigate to video
      window.location.href = videoUrl;
    } else {
      alert('Please select a category');
    }
  });
  
  // Handle cancel
  document.getElementById('cancelBtn').addEventListener('click', () => {
    modal.remove();
  });
}

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
        event.preventDefault(); // Prevent default navigation
        showCategoryModal(videoId, href);
      }
    }
  }
});