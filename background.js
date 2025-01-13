const x_URL = "https://x.com/*";
let redirectURL = "https://leetcode.com/"; // default value

// Update the x URL pattern to match more precisely
const x_PATTERN = /^https:\/\/([\w-]+\.)?x\.com/;

let xTabId = null;
let xStartTime = null;

// Add this near the top to load saved redirect URL
chrome.storage.sync.get(['redirectURL'], function(result) {
    if (result.redirectURL) {
        redirectURL = result.redirectURL;
    }
});

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and the tab is complete
  if (changeInfo.status === 'complete' && tab.url && x_PATTERN.test(tab.url)) {
    if (xTabId !== tabId) {
      xTabId = tabId;
      xStartTime = Date.now();

      // Set an alarm for 15 minutes (changed from 1 minute)
      chrome.alarms.create("xTimeout", { delayInMinutes: 15 });
      console.log("Timer started for x");
    }
  }
});

// Listener for tab removal
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === xTabId) {
    xTabId = null;
    xStartTime = null;
    chrome.alarms.clear("xTimeout");
  }
});

// Listener for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "xTimeout" && xTabId) {
    chrome.tabs.remove(xTabId, () => {
      chrome.tabs.create({ url: redirectURL }); // Use the dynamic redirectURL
      xTabId = null;
      xStartTime = null;
    });
  }
});
