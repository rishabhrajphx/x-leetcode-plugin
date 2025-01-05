const TWITTER_URL = "https://twitter.com/*";
const LEETCODE_URL = "https://leetcode.com/";

let twitterTabId = null;
let twitterStartTime = null;

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.match(/^https?:\/\/(www\.)?twitter\.com\/.*/)) {
    if (twitterTabId !== tabId) {
      twitterTabId = tabId;
      twitterStartTime = Date.now();

      // Set an alarm for 30 minutes
      chrome.alarms.create("twitterTimeout", { delayInMinutes: 1 });
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
