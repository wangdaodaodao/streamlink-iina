// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openInIINA") {
    bilibiliHandler().then(result => {
      if (result && result.url) {
        openInIINA(result.url);
      } else {
        alert('无法获取 Bilibili 视频地址');
      }
    }).catch(() => {
      alert('无法获取 Bilibili 视频地址');
    });
  }
});

// Bilibili视频处理主函数
async function bilibiliHandler() {
  const videoInfo = await getVideoInfo();
  if (videoInfo && videoInfo.bvid) {
    const playUrl = `https://www.bilibili.com/video/${videoInfo.bvid}`;
    return { url: playUrl };
  }
  return null;
}

// 获取视频信息
async function getVideoInfo() {
  const initialState = window.__INITIAL_STATE__;
  if (initialState && initialState.bvid) {
    return { bvid: initialState.bvid };
  }

  const bvid = getVideoId();
  if (bvid) {
    return { bvid: bvid };
  }

  return null;
}

// 从URL获取视频ID
function getVideoId() {
  const match = window.location.pathname.match(/\/video\/(BV[\w]+)/);
  return match ? match[1] : null;
}

// 在 IINA 中打开指定的 URL
function openInIINA(url) {
  const encodedUrl = encodeURIComponent(url);
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  window.location.href = iinaUrl;
}

// 为项目结构适配的 getVideoUrl 函数
window.getVideoUrl = async function() {
  const result = await bilibiliHandler();
  if (result && result.url) {
    return result.url;
  }
  throw new Error('无法获取 Bilibili 视频地址');
};

// 以下是备用代码，可以获取b站 .MP4格式视频 URL的方法
//  可以直接 使用   
//editby 王导导 2024.9.7 11.08.43 


/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openInIINA") {
    bilibiliHandler().then(result => {
      if (result && result.url) {
        openInIINA(result.url);
      }
      // 移除了所有可能的错误提示
    });
  }
});

// Bilibili视频处理主函数
async function bilibiliHandler() {
  return await extractBilibiliVideoInfo();
}

// 提取Bilibili视频信息
async function extractBilibiliVideoInfo() {
  if (window.__playinfo__ && window.__playinfo__.data) {
    return extractFromPlayInfo(window.__playinfo__.data);
  }

  const playinfoFromScript = extractPlayinfoFromScript();
  if (playinfoFromScript) {
    return playinfoFromScript;
  }

  return await fetchBilibiliVideoInfo();
}

// 从script标签提取playinfo
function extractPlayinfoFromScript() {
  const scripts = Array.from(document.getElementsByTagName('script'));
  for (const script of scripts) {
    if (script.textContent.includes('window.__playinfo__')) {
      const match = script.textContent.match(/window\.__playinfo__\s*=\s*({.+?});/);
      if (match) {
        try {
          const playinfo = JSON.parse(match[1]);
          if (playinfo.data) {
            return extractFromPlayInfo(playinfo.data);
          }
        } catch (error) {
          // 静默处理错误，不显示任何提示
        }
      }
    }
  }
  return null;
}

// 从playinfo数据中提取视频URL
function extractFromPlayInfo(data) {
  if (data.dash && data.dash.video && data.dash.video.length > 0) {
    const highestQualityVideo = data.dash.video.reduce((prev, current) => 
      (prev.bandwidth > current.bandwidth) ? prev : current
    );
    return { type: 'dash', url: highestQualityVideo.baseUrl };
  } else if (data.durl && data.durl.length > 0) {
    return { type: 'durl', url: data.durl[0].url };
  }
  return null;
}

// 从API获取视频信息
async function fetchBilibiliVideoInfo() {
  const { aid, cid } = await getVideoParams();
  if (!aid || !cid) return null;

  const apiUrl = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=112&type=&otype=json&platform=html5&high_quality=1`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.data && data.data.durl && data.data.durl.length > 0) {
      return { type: 'durl', url: data.data.durl[0].url };
    }
  } catch (error) {
    // 静默处理错误，不显示任何提示
  }
  return null;
}

// 获取视频参数（aid和cid）
async function getVideoParams() {
  const initialState = window.__INITIAL_STATE__;
  if (initialState && initialState.aid && initialState.cid) {
    return { aid: initialState.aid, cid: initialState.cid };
  }

  const bvid = getVideoId();
  if (!bvid) return { aid: null, cid: null };

  try {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
    const data = await response.json();
    if (data.data && data.data.aid && data.data.cid) {
      return { aid: data.data.aid, cid: data.data.cid };
    }
  } catch (error) {
    // 静默处理错误，不显示任何提示
  }
  return { aid: null, cid: null };
}

// 从URL获取视频ID
function getVideoId() {
  const match = window.location.pathname.match(/\/video\/(BV[\w]+)/);
  return match ? match[1] : null;
}

// 在 IINA 中打开指定的 URL
function openInIINA(url) {
  const encodedUrl = encodeURIComponent(url);
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  window.location.href = iinaUrl;
}

// Bilibili 视频 URL 获取函数
window.getVideoUrl = async function() {
  const result = await extractBilibiliVideoInfo();
  if (result && result.url) {
    return result.url;
  }
  throw new Error('无法获取 Bilibili 视频地址');
};

*/