// 存储捕获到的 m3u8 URL 的集合
let m3u8Urls = new Set();

// 监听所有网络请求，捕获 m3u8 URL
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // 检查 URL 是否包含 '.m3u8'
    if (details.url.includes('.m3u8')) {
      // 将捕获到的 m3u8 URL 添加到集合中
      m3u8Urls.add(details.url);
    }
  },
  {urls: ["<all_urls>"]},  // 监听所有 URL
  ["requestBody"]  // 包括请求体
);

// 当扩展安装或更新时运行的代码
chrome.runtime.onInstalled.addListener(() => {
  // 创建一个右键菜单项
  chrome.contextMenus.create({
    id: "openInIINA",  // 菜单项的唯一标识符
    title: "在IINA中打开",  // 显示的菜单文本
    contexts: ["video"]  // 仅在视频元素上显示此菜单
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 检查是否点击了我们的菜单项
  if (info.menuItemId === "openInIINA") {
    // 向内容脚本发送消息，包含捕获到的 m3u8 URL
    chrome.tabs.sendMessage(tab.id, {
      action: "openInIINA", 
      m3u8Urls: Array.from(m3u8Urls)  // 将 Set 转换为数组
    });
  }
});

// 当标签页更新时，清除 m3u8Urls 集合
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 仅在页面开始加载时清除
  if (changeInfo.status === 'loading') {
    m3u8Urls.clear();
  }
});
