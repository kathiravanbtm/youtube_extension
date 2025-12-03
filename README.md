# YouTube Extension Boilerplate

This is a basic boilerplate for a browser extension compatible with Chrome and Firefox using Manifest V3.

## Files

- `manifest.json`: Extension manifest defining permissions, scripts, and UI.
- `background.js`: Service worker for background tasks.
- `content.js`: Script injected into YouTube pages.
- `popup.html`: HTML for the extension popup.
- `popup.js`: JavaScript for popup interactions.
- `icons/`: Directory for extension icons (add your own PNG files).

## Loading the Extension

### Chrome
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked" and select this folder.

### Firefox
1. Open Firefox and go to `about:debugging`.
2. Click "This Firefox" in the left sidebar.
3. Click "Load Temporary Add-on" and select the `manifest.json` file.

## Development
- Edit the scripts as needed.
- Add icons to the `icons/` folder.
- Test in both browsers.

Note: For production, you'll need to package and publish the extension.


# YouTube Extension Testing Guide

## Setup Instructions

### Loading the Extension in Chrome

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in top-right corner)
3. **Click "Load unpacked"** and select the extension folder: `/home/baymax/Documents/projects/youtube extension`
4. The extension should appear with the YouTube Extension icon

### Fixing "Extension context invalidated" Errors

If you see "Extension context invalidated" errors:
1. Go to `chrome://extensions/`
2. Click the **refresh/reload button** on the YouTube Extension
3. **Refresh any YouTube tabs** you have open
4. Try using the extension again

## Testing Steps

### 1. Basic Functionality Test
1. Go to **YouTube.com**
2. **Click on any video thumbnail or title**
3. A modal should appear asking you to categorize the video
4. **Select a category** (e.g., "Music", "Educational")
5. **Click "Submit"**
6. You should see a green success message in the top-right

### 2. Popup Test
1. **Click the extension icon** in Chrome toolbar
2. You should see your categorized videos listed by category
3. If no videos are categorized yet, you'll see a message prompting you to categorize videos
4. **Click "Open Full Analytics"** to access the full options page

### 3. Options Page Test
1. From the popup, click **"Open Full Analytics"**
2. **Analytics Tab**: Should show total videos, categories, and today's count
3. **Categories Tab**: Should show all available categories with "Remove" buttons
4. **Videos Tab**: Should list all categorized videos with details
5. **Settings Tab**: Has buttons for clearing data and exporting

### 4. Data Persistence Test
1. Categorize a few videos
2. **Close Chrome completely**
3. **Reopen Chrome** and check the extension popup
4. Your categorized videos should still be there

## Troubleshooting

### No Modal Appears When Clicking Videos
- Make sure you're on YouTube.com
- Check that the extension is enabled in `chrome://extensions/`
- Look for console errors (F12 → Console tab)
- Try refreshing the YouTube page

### "Extension context invalidated" Error
- This happens when the extension is reloaded while content scripts are running
- **Solution**: Refresh all YouTube tabs after reloading the extension

### No Data in Popup/Options
- Check Chrome DevTools: F12 → Application → Storage → Local Storage → Extension
- Look for console errors in both the popup and options pages
- Try categorizing a video first to generate data

### CSP (Content Security Policy) Errors
- These are security restrictions that prevent inline JavaScript
- Our extension avoids inline event handlers to prevent these errors

## Development Notes

### File Structure
- `manifest.json` - Extension configuration
- `content.js` - Runs on YouTube pages, handles video clicks
- `background.js` - Service worker, handles data storage
- `popup.html/js` - Extension popup interface
- `options.html/js` - Full analytics and management page

### Data Storage Format
```json
{
  "videos": [
    {
      "id": "video_id_here",
      "category": "Music",
      "channel": "Channel Name",
      "watchCount": 1,
      "dateWatched": "2024-12-03T10:30:00.000Z"
    }
  ],
  "categories": ["Educational", "Entertainment", "Music", ...]
}
```

### Debugging Tips
1. **Content Script Logs**: F12 on YouTube → Console
2. **Background Script Logs**: `chrome://extensions/` → "service worker" link
3. **Popup Logs**: Right-click extension icon → "Inspect popup"
4. **Storage Data**: F12 → Application → Storage → Local Storage
