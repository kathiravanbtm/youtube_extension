// Default categories
let defaultCategories = ['Educational', 'Entertainment', 'Music', 'Gaming', 'Technology', 'Sports', 'News', 'Other'];
let categories = [];
let videos = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data from storage
function loadData() {
    chrome.storage.local.get(null, (result) => {
        // Load categories
        categories = result.categories || defaultCategories;
        
        // Load videos (filter out categories key)
        videos = {};
        Object.keys(result).forEach(key => {
            if (key !== 'categories' && result[key].category) {
                videos[key] = result[key];
            }
        });
        
        updateUI();
    });
}

// Update all UI elements
function updateUI() {
    updateAnalytics();
    updateCategoryList();
    updateVideoList();
}

// Update analytics
function updateAnalytics() {
    const totalVideos = Object.keys(videos).length;
    const totalCategories = categories.length;
    
    // Count today's videos
    const today = new Date().toDateString();
    const todayVideos = Object.values(videos).filter(video => 
        new Date(video.timestamp).toDateString() === today
    ).length;
    
    document.getElementById('totalVideos').textContent = totalVideos;
    document.getElementById('totalCategories').textContent = totalCategories;
    document.getElementById('todayVideos').textContent = todayVideos;
    
    // Category statistics
    const categoryStats = {};
    Object.values(videos).forEach(video => {
        categoryStats[video.category] = (categoryStats[video.category] || 0) + 1;
    });
    
    const statsHtml = Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .map(([category, count]) => `
            <div class="category-item">
                <span><strong>${category}</strong></span>
                <span>${count} videos</span>
            </div>
        `).join('');
    
    document.getElementById('categoryStats').innerHTML = `
        <h3>Videos per Category</h3>
        ${statsHtml || '<p>No videos categorized yet.</p>'}
    `;
}

// Update category list
function updateCategoryList() {
    const listHtml = categories.map(category => `
        <div class="category-item">
            <span>${category}</span>
            <button class="btn btn-danger" onclick="deleteCategory('${category}')">Delete</button>
        </div>
    `).join('');
    
    document.getElementById('categoryList').innerHTML = listHtml;
}

// Update video list
function updateVideoList() {
    const videoHtml = Object.entries(videos)
        .sort(([,a], [,b]) => b.timestamp - a.timestamp)
        .map(([videoId, video]) => `
            <div class="video-item">
                <div>
                    <strong>Video ID:</strong> ${videoId}<br>
                    <strong>Category:</strong> ${video.category}<br>
                    <strong>Date:</strong> ${new Date(video.timestamp).toLocaleDateString()}
                </div>
                <div>
                    <a href="${video.url}" target="_blank" class="btn btn-secondary">Open Video</a>
                    <button class="btn btn-danger" onclick="deleteVideo('${videoId}')">Delete</button>
                </div>
            </div>
        `).join('');
    
    document.getElementById('videoList').innerHTML = videoHtml || '<p>No videos categorized yet.</p>';
}

// Add new category
function addCategory() {
    const input = document.getElementById('newCategoryInput');
    const newCategory = input.value.trim();
    
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        chrome.storage.local.set({categories: categories}, () => {
            input.value = '';
            updateUI();
        });
    }
}

// Delete category
function deleteCategory(category) {
    if (confirm(`Delete category "${category}"? This will not affect already categorized videos.`)) {
        categories = categories.filter(cat => cat !== category);
        chrome.storage.local.set({categories: categories}, () => {
            updateUI();
        });
    }
}

// Delete video
function deleteVideo(videoId) {
    if (confirm('Delete this video categorization?')) {
        chrome.storage.local.remove(videoId, () => {
            delete videos[videoId];
            updateUI();
        });
    }
}

// Clear all data
function clearAllData() {
    if (confirm('Clear all data? This cannot be undone.')) {
        chrome.storage.local.clear(() => {
            categories = defaultCategories;
            videos = {};
            chrome.storage.local.set({categories: categories}, () => {
                updateUI();
            });
        });
    }
}

// Export data
function exportData() {
    const data = {
        categories: categories,
        videos: videos,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-categories-export.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Tab switching
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section and tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Allow Enter key to add category
document.getElementById('newCategoryInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addCategory();
    }
});