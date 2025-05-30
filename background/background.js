// 存储捕获到的视频 URL 的集合 (包括 m3u8 和 mp4)
// 使用 Set 确保 URL 的唯一性
let videoUrls = new Set();

// 监听所有网络请求，捕获 m3u8 和 mp4 URL
// 当页面发起网络请求之前触发
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // details.url 是当前请求的 URL
    // 检查 URL 是否包含 '.m3u8' 或 '.mp4' 后缀
    if (details.url.includes('.m3u8') || details.url.includes('.mp4')) {
      // 将捕获到的视频 URL 添加到 videoUrls 集合中
      videoUrls.add(details.url);
      // 打印捕获到的 URL 到控制台，方便调试
      console.log("Captured video URL:", details.url);
    }
    // 返回 {cancel: false} 表示不取消当前请求，继续正常加载
    return {cancel: false};
  },
  // 过滤器：监听所有 URL 的请求
  {urls: ["<all_urls>"]},
  // 额外的选项：这里我们不需要特别处理请求体，但保留了示例中的 ["requestBody"]
  // 如果只需要监听 URL，这个参数可以省略或为空数组 []
  []
);

// 当扩展安装或更新时运行的代码
chrome.runtime.onInstalled.addListener(() => {
  // 创建一个右键菜单项
  chrome.contextMenus.create({
    id: "openInIINA",  // 菜单项的唯一标识符，用于区分不同的菜单项
    title: "在IINA中打开视频",  // 显示在右键菜单中的文本
    // contexts 定义了菜单项出现的上下文环境
    // "page": 在网页的任何位置右键点击时显示 (除非有更具体的元素覆盖)
    // "video": 在 HTML <video> 元素上右键点击时显示
    contexts: ["page", "video"]
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // info.menuItemId 是被点击的菜单项的 ID
  // 检查是否点击了我们创建的 "openInIINA" 菜单项
  if (info.menuItemId === "openInIINA") {
    // tab 是当前活动标签页的信息
    // 向当前标签页的内容脚本发送消息
    chrome.tabs.sendMessage(tab.id, {
      action: "openInIINA", // 消息的类型或动作标识
      // 将捕获到的所有视频 URL (m3u8 和 mp4) 从 Set 转换为数组发送给内容脚本
      videoUrls: Array.from(videoUrls)
    });
    // 在发送消息后，清空 videoUrls 集合
    // 这样做是为了避免在同一个标签页多次右键点击时，发送重复的或旧的 URL
    videoUrls.clear();
  }
});

// 当标签页更新时触发
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // changeInfo 包含了标签页状态变化的详细信息
  // changeInfo.status 表示标签页的加载状态
  // 'loading' 状态表示标签页开始加载新的内容
  // 仅在页面开始加载新内容时清空 videoUrls 集合
  // 这确保了在导航到新页面时，我们重新开始捕获该页面的视频链接
  if (changeInfo.status === 'loading') {
    videoUrls.clear();
  }
});