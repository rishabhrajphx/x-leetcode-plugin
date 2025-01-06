const x_URL = "https://x.com/*";
const LEETCODE_URL = "https://leetcode.com/";

// Update the x URL pattern to match more precisely
const x_PATTERN = /^https:\/\/([\w-]+\.)?x\.com/;

let xTabId = null;
let xStartTime = null;

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and the tab is complete
  if (changeInfo.status === 'complete' && tab.url && x_PATTERN.test(tab.url)) {
    if (xTabId !== tabId) {
      xTabId = tabId;
      xStartTime = Date.now();

      // Set an alarm for 20 minutes (changed from 1 minute)
      chrome.alarms.create("xTimeout", { delayInMinutes: 20 });
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
    // Close x tab
    chrome.tabs.remove(xTabId, () => {
      // Open LeetCode
      chrome.tabs.create({ url: LEETCODE_URL });
      // Reset variables
      xTabId = null;
      xStartTime = null;
    });
  }
});
