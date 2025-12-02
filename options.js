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
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active from tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected section
    document.getElementById(tabName).classList.add('active');

    // Add active to clicked tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    activeTab.classList.add('active');
}

function addCategory() {
    const input = document.getElementById('newCategoryInput');
    const categoryName = input.value.trim();
    if (categoryName) {
        chrome.storage.local.get(['categories'], (result) => {
            const categories = result.categories || [];
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
    chrome.storage.local.get(['videoCategories', 'categories'], (result) => {
        const videos = result.videoCategories || {};
        const categories = result.categories || [];

        document.getElementById('totalVideos').textContent = Object.keys(videos).length;
        document.getElementById('totalCategories').textContent = categories.length;

        // Today's videos (simplified, assuming no date tracking)
        document.getElementById('todayVideos').textContent = '0'; // Placeholder

        // Category stats
        const categoryStats = document.getElementById('categoryStats');
        categoryStats.innerHTML = '';
        const grouped = {};
        Object.values(videos).forEach(cat => {
            grouped[cat] = (grouped[cat] || 0) + 1;
        });
        Object.entries(grouped).forEach(([cat, count]) => {
            const div = document.createElement('div');
            div.className = 'stat-card';
            div.innerHTML = `<div class="stat-number">${count}</div><div>${cat}</div>`;
            categoryStats.appendChild(div);
        });
    });
}

function loadCategories() {
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || [];
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
    chrome.storage.local.get(['videoCategories'], (result) => {
        const videos = result.videoCategories || {};
        const list = document.getElementById('videoList');
        list.innerHTML = '';
        Object.entries(videos).forEach(([id, cat]) => {
            const div = document.createElement('div');
            div.className = 'video-item';
            div.innerHTML = `<span>Video ID: ${id} - Category: ${cat}</span>`;
            list.appendChild(div);
        });
    });
}

function removeCategory(cat) {
    chrome.storage.local.get(['categories', 'videoCategories'], (result) => {
        const categories = result.categories || [];
        const videos = result.videoCategories || {};
        const newCategories = categories.filter(c => c !== cat);
        const newVideos = {};
        Object.entries(videos).forEach(([id, vcat]) => {
            if (vcat !== cat) newVideos[id] = vcat;
        });
        chrome.storage.local.set({ categories: newCategories, videoCategories: newVideos }, () => {
            loadCategories();
            loadVideos();
            loadAnalytics();
        });
    });
}