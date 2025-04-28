chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});

// Listen for capture requests from content.js or popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureVisibleTab') {
    // Use chrome.tabs.query to get the active tab from the current window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        const tab = tabs[0];
        chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function(dataUrl) {
          if (chrome.runtime.lastError) {
            console.error('Error capturing tab: ', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError });
          } else {
            sendResponse({ screenshot: dataUrl });
          }
        });
      } else {
        sendResponse({ error: 'No active tab found' });
      }
    });
    // Return true to indicate the response will be asynchronous
    return true;
  }
  if (request.action === 'openPopup') {
    // Open the popup by activating it
    chrome.action.openPopup();
  }
});



