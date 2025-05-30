console.log("Content script starting...");

// 在 IINA 中打开指定的 URL
// url: 需要打开的视频链接
function openInIINA(url) {
  // 检查传入的 URL 是否有效
  if (!url) {
    alert('无法获取视频地址');
    console.error("Attempted to open empty URL in IINA"); // 打印错误到控制台
    return;
  }
  // 对 URL 进行编码，以确保在 URL 参数中传递特殊字符时不会出错
  const encodedUrl = encodeURIComponent(url);
  // 构建 IINA 的自定义 URL Scheme
  // iina://open?url=...
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  // 打印即将打开的 IINA URL，方便调试
  console.log("Opening in IINA:", iinaUrl);
  // 通过修改 window.location.href 来尝试打开 IINA
  // 这会触发浏览器尝试处理 iina:// 链接
  window.location.href = iinaUrl;
}

// 处理从背景脚本接收到的视频 URL 列表
// videoUrls: 包含捕获到的 m3u8 和 mp4 链接的数组
function handleVideoUrls(videoUrls) {
  // 检查是否接收到了有效的 URL 数组
  if (videoUrls && videoUrls.length > 0) {
    // 可以根据需要选择打开哪个 URL
    // 例如，如果捕获到多个链接（不同分辨率或格式），可以在这里实现选择逻辑
    // 这里简单地选择数组中的最后一个 URL 来尝试打开
    // 通常情况下，最后一个捕获的链接可能是页面加载后期找到的，可能是主要的或更高质量的流
    const urlToOpen = videoUrls[videoUrls.length - 1];
    // 调用 openInIINA 函数打开选定的 URL
    openInIINA(urlToOpen);
  } else {
    // 如果没有捕获到任何视频 URL，弹出提示
    alert('无法获取视频地址');
    console.warn("No video URLs received from background script."); // 打印警告
  }
}

// 监听来自背景脚本的消息
// request: 背景脚本发送过来的消息对象
// sender: 发送消息的脚本信息
// sendResponse: 用于向发送者回复消息的函数 (在本例中未使用)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 打印接收到的消息，方便调试
  console.log("Received message in content script:", request);
  // 检查消息的 action 是否是 "openInIINA"
  if (request.action === "openInIINA") {
    // 这里的逻辑是为了兼容特定网站可能存在的自定义获取视频 URL 的方法
    // 如果当前页面的 window 对象上存在一个名为 getVideoUrl 的函数
    if (window.getVideoUrl) {
      // 调用这个自定义函数来获取视频 URL
      // 假设 window.getVideoUrl 返回一个 Promise
      window.getVideoUrl()
        .then(url => {
          // 如果自定义函数成功获取到 URL，则直接使用它打开 IINA
          openInIINA(url);
        })
        .catch((error) => {
          // 如果自定义函数执行失败或返回错误
          console.error("window.getVideoUrl failed:", error); // 打印错误
          // 则退而求其次，使用背景脚本捕获到的 videoUrls 列表来处理
          handleVideoUrls(request.videoUrls);
        });
    } else {
      // 如果当前页面没有定义 window.getVideoUrl 函数
      // 直接使用背景脚本捕获到的 videoUrls 列表来处理
      handleVideoUrls(request.videoUrls);
    }
  }
});

