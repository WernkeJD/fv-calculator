// window.onload = function() {
//   if (window.location.href.includes('checkout') || window.location.href.includes('cart')) {
//       // Simulate user interaction for opening the popup (use alternative methods if necessary)
//       chrome.runtime.sendMessage({ action: 'openPopup' });
//   } else {
//       console.log('Not on a checkout or cart page');
//   }
// };

// Send a message to the background script to capture the visible tab
chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (response) => {
  if (response.screenshot) {
    console.log('Captured Screenshot:', response.screenshot);
    // You can do something with the screenshot data URL here, e.g., display it in a new image element
    const img = document.createElement('img');
    img.src = response.screenshot;
    document.body.appendChild(img); // Appends the screenshot to the page
  } else if (response.error) {
    console.error('Error capturing tab:', response.error);
  }
});







