# FFmpeg GUI 网页应用

## 1. 项目介绍

本项目是一个基于网页的FFmpeg图形用户界面(GUI)。它允许用户直接在浏览器中使用FFmpeg的核心功能,无需在本地安装FFmpeg。主要特点包括:

- 文件上传:用户可以上传视频文件进行处理。
- 输出选项:用户可以选择输出格式、分辨率和编码器。
- 在线处理:使用FFmpeg的WebAssembly版本在浏览器中进行视频处理。
- 实时进度:显示处理进度。
- 结果预览:处理完成后可以预览和下载处理后的文件。
- 响应式设计:适应不同的屏幕尺寸。
- 深色模式支持:为夜间使用提供舒适的体验。

## 2. 部署

您可以使用以下一键部署链接将此项目部署到Vercel或Cloudflare:

- 部署到Vercel:
  [![使用Vercel部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gangyang/ffmpeg-gui)

- 部署到Cloudflare:
  [![部署到Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gangyang/ffmpeg-gui)

注意:请将上述链接中的`gangbo/ffmpeg-gui`替换为您实际的GitHub用户名和仓库名。

部署步骤:
1. 点击上面的部署按钮。
2. 登录或注册Vercel/Cloudflare账户。
3. 授权访问您的GitHub仓库。
4. 选择您要部署的仓库和分支。
5. 按照平台的说明完成部署过程。

## 3. FFmpeg简介

FFmpeg是一个开源的跨平台解决方案,用于录制、转换和流式传输音频和视频。它包括一组库和工具:

- ffmpeg:用于转换多媒体文件的命令行工具。
- ffplay:一个简单的媒体播放器。
- ffprobe:一个多媒体流分析器。

FFmpeg的主要功能包括:

- 转码:将媒体文件从一种格式转换为另一种格式。
- 转封装:更改媒体文件的容器格式。
- 调整大小:改变视频的分辨率。
- 音频提取:从视频文件中提取音轨。
- 水印:为视频添加图像或文字水印。
- 剪辑和拼接:剪切或连接视频片段。
- 音频调整:修改音量、采样率等。

在本项目中,我们使用FFmpeg.wasm,这是FFmpeg的WebAssembly版本。这允许我们直接在浏览器中运行FFmpeg,无需服务器端处理。这种方法提供了一个完全客户端的解决方案,保护用户隐私并减少服务器负载。

## 4. 许可证

本项目采用MIT许可证。这意味着您可以自由地使用、复制、修改、合并、出版发行、散布、再授权和/或销售本软件的副本,但需要在所有副本上包含原始的版权声明和许可声明。

完整的许可证文本可以在项目根目录的LICENSE文件中找到。
