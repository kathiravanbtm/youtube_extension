// filepath: /home/baymax/Documents/projects/youtube extension/options.js
const defaultCategories = ['Educational', 'Entertainment', 'Music', 'Gaming', 'Technology', 'Sports', 'News', 'Other'];

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Add Category
    document.getElementById('addCategoryBtn').addEventListener('click', addCategory);

    // Clear Data
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

    // Export Data
    document.getElementById('exportDataBtn').addEventListener('click', exportData);

    // Load initial data
    loadAnalytics();
    loadCategories();
    loadVideos();
});

function showTab(tabName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    activeTab.classList.add('active');
}

function addCategory() {
    const input = document.getElementById('newCategoryInput');
    const categoryName = input.value.trim();
    if (categoryName) {
        chrome.storage.local.get(['categories'], (result) => {
            const categories = result.categories || defaultCategories.slice(); // Use defaults if empty
            if (!categories.includes(categoryName)) {
                categories.push(categoryName);
                chrome.storage.local.set({ categories }, () => {
                    input.value = '';
                    loadCategories();
                });
            }
        });
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data?')) {
        chrome.storage.local.clear(() => {
            loadAnalytics();
            loadCategories();
            loadVideos();
        });
    }
}

function exportData() {
    chrome.storage.local.get(null, (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-extension-data.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function loadAnalytics() {
    chrome.storage.local.get(['videos', 'categories'], (result) => {
        const videos = result.videos || [];
        const categories = result.categories || defaultCategories;
        document.getElementById('totalVideos').textContent = videos.length;
        document.getElementById('totalCategories').textContent = categories.length;
        const today = new Date().toISOString().split('T')[0];
        const todayVideos = videos.filter(v => v.dateWatched.startsWith(today)).length;
        document.getElementById('todayVideos').textContent = todayVideos;
        const categoryStats = document.getElementById('categoryStats');
        categoryStats.innerHTML = '<h3>Category Stats</h3>';
        const grouped = {};
        videos.forEach(v => {
            grouped[v.category] = (grouped[v.category] || 0) + v.watchCount;
        });
        Object.entries(grouped).forEach(([cat, count]) => {
            const div = document.createElement('div');
            div.className = 'stat-card';
            div.innerHTML = `<div class="stat-number">${count}</div><div>${cat}</div>`;
            categoryStats.appendChild(div);
        });
        // Top channels
        const channelStats = {};
        videos.forEach(v => {
            channelStats[v.channel] = (channelStats[v.channel] || 0) + v.watchCount;
        });
        const topChannels = Object.entries(channelStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topChannelsDiv = document.getElementById('topChannels') || document.createElement('div'); // Add if missing
        topChannelsDiv.id = 'topChannels';
        topChannelsDiv.innerHTML = '<h3>Top Channels</h3>';
        topChannels.forEach(([channel, count]) => {
            topChannelsDiv.innerHTML += `<div>${channel}: ${count} watches</div>`;
        });
        if (!document.getElementById('topChannels')) categoryStats.appendChild(topChannelsDiv);
    });
}

function loadCategories() {
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || defaultCategories.slice(); // Show defaults
        const list = document.getElementById('categoryList');
        list.innerHTML = '';
        categories.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.innerHTML = `<span>${cat}</span><button class="btn btn-danger" onclick="removeCategory('${cat}')">Remove</button>`;
            list.appendChild(div);
        });
    });
}

function loadVideos() {
    chrome.storage.local.get(['videos'], (result) => {
        const videos = result.videos || [];
        const list = document.getElementById('videoList');
        list.innerHTML = '';
        videos.forEach(v => {
            const div = document.createElement('div');
            div.className = 'video-item';
            div.innerHTML = `<span>ID: ${v.id}, Category: ${v.category}, Channel: ${v.channel}, Watches: ${v.watchCount}, Last Watched: ${new Date(v.dateWatched).toLocaleDateString()}</span>`;
            list.appendChild(div);
        });
    });
}

function removeCategory(cat) {
    chrome.storage.local.get(['categories', 'videos'], (result) => {
        const categories = result.categories || defaultCategories.slice();
        const videos = result.videos || [];
        const newCategories = categories.filter(c => c !== cat);
        const newVideos = videos.filter(v => v.category !== cat); // Remove videos in category
        chrome.storage.local.set({ categories: newCategories, videos: newVideos }, () => {
            loadCategories();
            loadVideos();
            loadAnalytics();
        });
    });
}