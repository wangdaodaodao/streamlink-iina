let floatingMenu = null;

function createFloatingMenu() {
  if (floatingMenu) {
    document.body.removeChild(floatingMenu);
  }
  floatingMenu = document.createElement('div');
  floatingMenu.className = 'floating-menu';
  floatingMenu.innerHTML = `
    <button id="copy-and-open-m3u8">在IINA中打开</button>
  `;
  document.body.appendChild(floatingMenu);
  return floatingMenu;
}

function positionMenu(menu, x, y) {
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
}

function hideMenu() {
  if (floatingMenu) {
    floatingMenu.style.display = 'none';
  }
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function openInIINA(url) {
  const encodedUrl = encodeURIComponent(url);
  const iinaUrl = `iina://open?url=${encodedUrl}`;
  window.location.href = iinaUrl;
}

function handleM3U8Action(m3u8Urls) {
  if (m3u8Urls.length > 0) {
    const latestM3U8 = m3u8Urls[m3u8Urls.length - 1];
    copyToClipboard(latestM3U8)
      .then(() => {
        console.log('m3u8地址已复制到剪贴板');
        openInIINA(latestM3U8);
      })
      .catch((err) => {
        console.error('无法复制到剪贴板: ', err);
        openInIINA(latestM3U8);
      });
  } else {
    console.log('未找到m3u8地址');
  }
}

function handleVideoContextMenu(e) {
  e.preventDefault();
  const menu = createFloatingMenu();
  positionMenu(menu, e.clientX, e.clientY);
  menu.style.display = 'block';

  document.getElementById('copy-and-open-m3u8').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "getM3U8Urls"}, function(response) {
      handleM3U8Action(response.m3u8Urls);
    });
    hideMenu();
  });

  document.addEventListener('click', hideMenu, { once: true });
}

function initializeVideoContextMenu() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.addEventListener('contextmenu', handleVideoContextMenu);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeVideoContextMenu);
} else {
  initializeVideoContextMenu();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyAndOpenM3U8") {
    handleM3U8Action(request.m3u8Urls);
  }
});
