# StreamLink-IINA

一键捕获网页视频流并在 IINA 播放器中打开的 Chrome 扩展。

A Chrome extension to capture web video streams and open them in IINA player with one click.

## 功能简介 | Features

StreamLink-IINA 是一个专为 macOS 用户设计的 Chrome 扩展，它能够：

StreamLink-IINA is a Chrome extension designed for macOS users that can:

- 自动检测网页中的视频流（特别是 m3u8 格式）
- 通过右键菜单，一键将视频在 IINA 播放器中打开
- 静默复制视频流地址到剪贴板

- Automatically detect video streams on web pages (especially m3u8 format)
- Open videos in IINA player with one click through the right-click menu
- Silently copy video stream URLs to the clipboard

## 安装要求 | Requirements

- Google Chrome 浏览器 | Google Chrome browser
- macOS 操作系统 | macOS operating system
- 已安装 IINA 播放器 | IINA player installed

## 安装步骤 | Installation

1. 下载本扩展的 ZIP 文件并解压，或克隆此仓库到本地。
2. 在 Chrome 浏览器中访问 `chrome://extensions/`。
3. 开启右上角的"开发者模式"。
4. 点击"加载已解压的扩展程序"，选择包含扩展文件的文件夹。

1. Download the ZIP file of this extension and extract it, or clone this repository locally.
2. Visit `chrome://extensions/` in Chrome browser.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the folder containing the extension files.

## 使用方法 | Usage

1. 在任何包含视频的网页上，右键点击视频元素。
2. 在弹出的菜单中选择"在 IINA 中打开"。
3. 视频将自动在 IINA 播放器中打开（如果已安装）。

1. On any webpage containing video, right-click on the video element.
2. Select "Open in IINA" from the pop-up menu.
3. The video will automatically open in IINA player (if installed).

## 注意事项 | Notes

- 本扩展仅在 macOS 系统上有效，因为 IINA 是 macOS 专用的播放器。
- 确保您的系统已正确安装 IINA 播放器。
- 某些网站可能会限制视频流的访问，在这些情况下扩展可能无法正常工作。

- This extension is only effective on macOS systems, as IINA is a macOS-specific player.
- Make sure IINA player is properly installed on your system.
- Some websites may restrict access to video streams, in which case the extension may not work properly.

## 隐私声明 | Privacy Statement

本扩展不会收集或传输任何个人数据。它只在本地运行，仅用于检测视频流并启动 IINA 播放器。

This extension does not collect or transmit any personal data. It runs locally only and is used solely to detect video streams and launch the IINA player.

## 贡献 | Contributing

欢迎提交 Issues 或 Pull Requests 来帮助改进这个项目。

Issues and Pull Requests are welcome to help improve this project.

## 许可证 | License

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.