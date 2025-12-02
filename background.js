// Background script for the extension
console.log("Background script loaded");

// Handle extension icon click to open options page
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});