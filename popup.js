document.addEventListener('DOMContentLoaded', () => {
  console.log("Popup loaded");
  
  // Get data using the new storage format - load both videos AND categories
  chrome.storage.local.get(['videos', 'categories'], (result) => {
    const videos = result.videos || [];
    const categories = result.categories || [];
    const container = document.getElementById('categories');
    
    console.log("Loaded videos:", videos);
    console.log("Loaded categories:", categories);
    
    if (videos.length === 0) {
      const availableCats = categories.length > 0 ? categories.join(', ') : 'No categories yet';
      container.innerHTML = `
        <p style="text-align: center; color: #666; padding: 20px;">
          No categorized videos yet.<br>
          Click on YouTube videos to start categorizing!
        </p>
        <p style="text-align: center; color: #999; font-size: 12px; padding: 10px;">
          Available categories: ${availableCats}
        </p>
      `;
      return;
    }
    
    // Group by category
    const grouped = {};
    videos.forEach(video => {
      if (!grouped[video.category]) {
        grouped[video.category] = [];
      }
      grouped[video.category].push(video);
    });
    
    // Display grouped videos
    Object.entries(grouped).forEach(([category, categoryVideos]) => {
      const div = document.createElement('div');
      div.className = 'category';
      div.style.marginBottom = '15px';
      div.style.padding = '10px';
      div.style.border = '1px solid #ddd';
      div.style.borderRadius = '5px';
      div.style.backgroundColor = '#f9f9f9';
      
      const title = document.createElement('h4');
      title.textContent = `${category} (${categoryVideos.length})`;
      title.style.margin = '0 0 10px 0';
      title.style.color = '#ff0000';
      div.appendChild(title);
      
      categoryVideos.forEach(video => {
        const vidDiv = document.createElement('div');
        vidDiv.className = 'video';
        vidDiv.style.padding = '5px 0';
        vidDiv.style.fontSize = '12px';
        vidDiv.style.color = '#666';
        vidDiv.innerHTML = `
          <strong>ID:</strong> ${video.id}<br>
          <strong>Channel:</strong> ${video.channel}<br>
          <strong>Watched:</strong> ${video.watchCount} times<br>
          <strong>Last:</strong> ${new Date(video.dateWatched).toLocaleDateString()}
        `;
        div.appendChild(vidDiv);
      });
      
      container.appendChild(div);
    });
  });
  
  // Open options page
  document.getElementById('openExtensions').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  });
  
  // Debug: Log all storage data
  chrome.storage.local.get(null, (allData) => {
    console.log("All extension storage data:", allData);
  });
});
