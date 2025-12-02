document.addEventListener('DOMContentLoaded', () => {

   
  chrome.storage.local.get(['videoCategories'], (result) => {
    const categories = result.videoCategories || {};
    const container = document.getElementById('categories');
    
    // Group by category
    const grouped = {};
    Object.entries(categories).forEach(([id, cat]) => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(id);
    });
    
    // Display
    Object.entries(grouped).forEach(([cat, ids]) => {
      const div = document.createElement('div');
      div.className = 'category';
      div.innerHTML = `<h4>${cat}</h4>`;
      ids.forEach(id => {
        const vidDiv = document.createElement('div');
        vidDiv.className = 'video';
        vidDiv.textContent = `Video ID: ${id}`;
        div.appendChild(vidDiv);
      });
      container.appendChild(div);
    });
  });
  
    
    document.getElementById('openExtensions').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  });  
});
