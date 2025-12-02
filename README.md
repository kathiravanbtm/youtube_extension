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
