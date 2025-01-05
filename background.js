const TWITTER_URL = "https://twitter.com/*";
const LEETCODE_URL = "https://leetcode.com/";

// Update the Twitter URL pattern to match more precisely
const TWITTER_PATTERN = /^https:\/\/([\w-]+\.)?twitter\.com/;

let twitterTabId = null;
let twitterStartTime = null;

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and the tab is complete
  if (changeInfo.status === 'complete' && tab.url && TWITTER_PATTERN.test(tab.url)) {
    if (twitterTabId !== tabId) {
      twitterTabId = tabId;
      twitterStartTime = Date.now();

      // Set an alarm for 30 minutes (changed from 1 minute)
      chrome.alarms.create("twitterTimeout", { delayInMinutes: 30 });
      console.log("Timer started for Twitter");
    }
  }
});

// Listener for tab removal
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === twitterTabId) {
    twitterTabId = null;
    twitterStartTime = null;
    chrome.alarms.clear("twitterTimeout");
  }
});

// Listener for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "twitterTimeout" && twitterTabId) {
    // Close Twitter tab
    chrome.tabs.remove(twitterTabId, () => {
      // Open LeetCode
      chrome.tabs.create({ url: LEETCODE_URL });
      // Reset variables
      twitterTabId = null;
      twitterStartTime = null;
    });
  }
});
