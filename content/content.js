console.log("Content script starting...");

// 在 IINA 中打开指定的 URL
function openInIINA(url) {
  const encodedUrl = encodeURIComponent(url);
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  window.location.href = iinaUrl;
}

// 处理视频 URL
function handleVideoUrl(videoUrl) {
  if (videoUrl) {
    openInIINA(videoUrl);
  } else {
    alert('无法获取视频地址');
  }
}

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openInIINA") {
    if (window.getVideoUrl) {
      // 如果存在特定网站的 getVideoUrl 函数，使用它
      window.getVideoUrl().then(handleVideoUrl).catch(() => {
        alert('无法获取视频地址');
      });
    } else if (request.m3u8Urls && request.m3u8Urls.length > 0) {
      // 对于普通网站，使用捕获的 m3u8 URL
      const latestM3U8 = request.m3u8Urls[request.m3u8Urls.length - 1];
      handleVideoUrl(latestM3U8);
    } else {
      alert('无法获取视频地址');
    }
  }
});

