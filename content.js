console.log("Content script loaded on YouTube");
console.log("Chrome runtime available:", !!chrome.runtime);
console.log("Extension ID:", chrome.runtime?.id);

// Simple categories array
const categories = ['Educational', 'Entertainment', 'Music', 'Gaming', 'Technology', 'Sports', 'News', 'Other'];

// Function to show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.style.position = 'fixed';
  successDiv.style.top = '20px';
  successDiv.style.right = '20px';
  successDiv.style.background = '#4CAF50';
  successDiv.style.color = 'white';
  successDiv.style.padding = '15px 20px';
  successDiv.style.borderRadius = '5px';
  successDiv.style.zIndex = '10001';
  successDiv.style.fontFamily = 'Arial, sans-serif';
  successDiv.style.fontSize = '14px';
  successDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 3000);
}

// Function to create and show category modal
function showCategoryModal(videoId, videoUrl) {
  // Prevent multiple modals
  if (document.getElementById('yt-category-modal')) return;

  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'yt-category-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0, 0, 0, 0.7)';
  modal.style.zIndex = '10000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.fontFamily = 'Arial, sans-serif';

  // Create modal dialog
  const dialog = document.createElement('div');
  dialog.style.background = 'white';
  dialog.style.padding = '30px';
  dialog.style.borderRadius = '15px';
  dialog.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  dialog.style.maxWidth = '500px';
  dialog.style.width = '90%';

  // Title
  const title = document.createElement('h3');
  title.textContent = 'Categorize Video';
  title.style.margin = '0 0 10px 0';
  title.style.color = '#333';
  title.style.textAlign = 'center';

  // Video ID
  const vid = document.createElement('p');
  vid.textContent = `Video ID: ${videoId}`;
  vid.style.margin = '0 0 20px 0';
  vid.style.color = '#666';
  vid.style.fontSize = '12px';
  vid.style.textAlign = 'center';

  // Label
  const label = document.createElement('label');
  label.textContent = 'Choose Category:';
  label.style.display = 'block';
  label.style.marginBottom = '15px';
  label.style.color = '#333';
  label.style.fontWeight = 'bold';
  label.style.textAlign = 'center';

  // Category container
  const categoryContainer = document.createElement('div');
  categoryContainer.id = 'categoryContainer';
  categoryContainer.style.display = 'flex';
  categoryContainer.style.flexWrap = 'wrap';
  categoryContainer.style.justifyContent = 'center';
  categoryContainer.style.gap = '8px';
  categoryContainer.style.marginBottom = '20px';

  // Create category buttons dynamically
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    btn.textContent = cat;
    btn.style.padding = '12px 20px';
    btn.style.margin = '5px';
    btn.style.border = '2px solid #ddd';
    btn.style.background = '#f9f9f9';
    btn.style.borderRadius = '25px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.color = '#333';
    btn.style.transition = 'all 0.2s';
    categoryContainer.appendChild(btn);
  });

  // Input for new category
  const newCategoryInput = document.createElement('input');
  newCategoryInput.id = 'newCategoryInput';
  newCategoryInput.placeholder = 'Or create new category...';
  newCategoryInput.type = 'text';
  newCategoryInput.style.width = '100%';
  newCategoryInput.style.padding = '12px';
  newCategoryInput.style.border = '2px solid #ddd';
  newCategoryInput.style.borderRadius = '8px';
  newCategoryInput.style.fontSize = '14px';
  newCategoryInput.style.boxSizing = 'border-box';
  newCategoryInput.style.marginBottom = '20px';

  // Actions container
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '10px';
  actions.style.justifyContent = 'center';

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancelBtn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.padding = '12px 20px';
  cancelBtn.style.border = '1px solid #ddd';
  cancelBtn.style.background = '#f5f5f5';
  cancelBtn.style.borderRadius = '8px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '14px';

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.id = 'submitBtn';
  submitBtn.textContent = 'Submit';
  submitBtn.disabled = true;
  submitBtn.style.padding = '12px 20px';
  submitBtn.style.border = 'none';
  submitBtn.style.background = '#ff0000';
  submitBtn.style.color = 'white';
  submitBtn.style.borderRadius = '8px';
  submitBtn.style.cursor = 'pointer';
  submitBtn.style.fontSize = '14px';
  submitBtn.style.opacity = '0.5';

  // Assemble dialog
  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);
  dialog.appendChild(title);
  dialog.appendChild(vid);
  dialog.appendChild(label);
  dialog.appendChild(categoryContainer);
  dialog.appendChild(newCategoryInput);
  dialog.appendChild(actions);
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  let selectedCategory = '';

  // Handle category button clicks
  categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset all buttons
      categoryContainer.querySelectorAll('.category-btn').forEach(b => {
        b.style.background = '#f9f9f9';
        b.style.borderColor = '#ddd';
        b.style.color = '#333';
      });
      // Highlight selected
      btn.style.background = '#ff0000';
      btn.style.borderColor = '#ff0000';
      btn.style.color = 'white';
      selectedCategory = btn.dataset.category;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      newCategoryInput.value = '';
    });
  });

  // Handle new category input
  newCategoryInput.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    if (v) {
      // Reset buttons
      categoryContainer.querySelectorAll('.category-btn').forEach(b => {
        b.style.background = '#f9f9f9';
        b.style.borderColor = '#ddd';
        b.style.color = '#333';
      });
      selectedCategory = v;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    } else {
      selectedCategory = '';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
    }
  });

  
submitBtn.addEventListener('click', () => {
  if (selectedCategory) {
    console.log(`Video ${videoId} categorized as: ${selectedCategory}`);
    modal.remove();

    // Extract channel from the current page DOM
    const channel = document.querySelector('#owner #channel-name a')?.textContent?.trim() || 'Unknown';

    // Send message to background script to save/update video
    try {
      chrome.runtime.sendMessage({
        action: 'saveVideo',
        videoData: {
          id: videoId,
          category: selectedCategory,
          channel,
          watchCount: 1,  // Will be incremented if existing
          dateWatched: new Date().toISOString()
        }
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          // Show user-friendly error message
          alert('Extension error: Please reload the page and try again.');
        } else {
          console.log('Video saved successfully:', response);
          // Show success message
          showSuccessMessage(`Video categorized as "${selectedCategory}"!`);
        }
      });
    } catch (error) {
      console.error('Extension context error:', error);
      alert('Extension context error: Please reload the page and try again.');
    }
  }
});

  // Handle cancel
  cancelBtn.addEventListener('click', () => {
    modal.remove();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Video click detection
document.addEventListener('click', function(event) {
  console.log("Click detected on:", event.target);
  
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
      
      const videoId = new URL(href).searchParams.get('v');
      if (videoId) {
        event.preventDefault();
        showCategoryModal(videoId, href);
      }
    }
  }
});