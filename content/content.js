console.log("Content script starting...");

/**
 * 在 IINA 中打开指定的 URL
 * @param {string} url - 要在 IINA 中打开的 URL
 */
function openInIINA(url) {
  // 对 URL 进行编码，确保特殊字符被正确处理
  const encodedUrl = encodeURIComponent(url);
  // 构造 IINA 的自定义 URL scheme
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  // 尝试打开 IINA
  window.location.href = iinaUrl;
}

/**
 * 处理捕获到的 m3u8 URL
 * @param {string[]} m3u8Urls - 捕获到的 m3u8 URL 数组
 */
function handleM3U8Action(m3u8Urls) {
  if (m3u8Urls && m3u8Urls.length > 0) {
    // 如果有捕获到的 URL，使用最后一个（最新的）URL
    const latestM3U8 = m3u8Urls[m3u8Urls.length - 1];
    openInIINA(latestM3U8);
  } else {
    // 如果没有捕获到 URL，显示错误消息
    alert('无法获取视频地址');
  }
}

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 检查消息是否是打开 IINA 的动作
  if (request.action === "openInIINA") {
    // 处理捕获到的 m3u8 URL
    handleM3U8Action(request.m3u8Urls);
  }
});

