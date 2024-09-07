// YouTube视频处理主函数
async function youtubeHandler() {
    console.log('YouTube handler activated');
    return await extractYoutubeVideoInfo();
}

// 提取YouTube视频信息
async function extractYoutubeVideoInfo() {
    console.log('Attempting to extract YouTube video info');
    const videoId = getYoutubeVideoId();
    if (!videoId) {
        console.log('Failed to get YouTube video ID');
        return null;
    }

    console.log('YouTube video ID:', videoId);
    
    // 使用嵌入式播放器 URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log('Using YouTube embed URL:', embedUrl);
    return { type: 'youtube', url: embedUrl, videoId: videoId };
}

// 从URL获取YouTube视频ID
function getYoutubeVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
}

// 为项目结构适配的 getVideoUrl 函数
window.getVideoUrl = async function() {
    const result = await youtubeHandler();
    if (result && result.url) {
        return result.url;
    }
    throw new Error('无法获取 YouTube 视频地址');
};
