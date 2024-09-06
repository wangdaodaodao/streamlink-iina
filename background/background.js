let m3u8Urls = new Set();

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('.m3u8')) {
      m3u8Urls.add(details.url);
    }
  },
  {urls: ["<all_urls>"]},
  ["requestBody"]
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyAndOpenM3U8",
    title: "在IINA中打开",
    contexts: ["video"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyAndOpenM3U8") {
    chrome.tabs.sendMessage(tab.id, {action: "copyAndOpenM3U8", m3u8Urls: Array.from(m3u8Urls)});
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getM3U8Urls") {
    sendResponse({m3u8Urls: Array.from(m3u8Urls)});
  }
});
