# FFmpeg GUI Web Application

## 1. Project Introduction

This project is a web-based Graphical User Interface (GUI) for FFmpeg. It allows users to utilize core FFmpeg functionalities directly in their browser without the need for local FFmpeg installation. Key features include:

- File Upload: Users can upload video files for processing.
- Output Options: Users can select output format, resolution, and encoder.
- Online Processing: Uses the WebAssembly version of FFmpeg for in-browser video processing.
- Real-time Progress: Displays processing progress.
- Result Preview: Preview and download the processed file upon completion.
- Responsive Design: Adapts to different screen sizes.
- Dark Mode Support: Provides a comfortable experience for night-time use.

## 2. Deployment

You can deploy this project to Vercel using the following one-click deployment links:

- Deploy to Vercel:
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gangbo/ffmpeg-gui)


Note: Replace `gangbo/ffmpeg-gui` in the above links with your actual GitHub username and repository name.

Deployment Steps:
1. Click on the deployment button above.
2. Log in or sign up for a Vercel account.
3. Authorize access to your GitHub repository.
4. Select the repository and branch you want to deploy.
5. Follow the platform's instructions to complete the deployment process.

## 3. FFmpeg Introduction

FFmpeg is an open-source, cross-platform solution for recording, converting, and streaming audio and video. It includes a set of libraries and tools:

- ffmpeg: A command-line tool for converting multimedia files.
- ffplay: A simple media player.
- ffprobe: A multimedia stream analyzer.

Main features of FFmpeg include:

- Transcoding: Convert media files from one format to another.
- Transmuxing: Change the container format of the media file.
- Resizing: Alter the resolution of videos.
- Audio Extraction: Extract audio tracks from video files.
- Watermarking: Add image or text watermarks to videos.
- Trimming and Concatenation: Cut or join video segments.
- Audio Adjustment: Modify volume, sample rate, etc.

In this project, we use FFmpeg.wasm, which is the WebAssembly version of FFmpeg. This allows us to run FFmpeg directly in the browser, eliminating the need for server-side processing. This approach provides a fully client-side solution, protecting user privacy and reducing server load.

## 4. License

This project is licensed under the MIT License. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the inclusion of the copyright notice and license statement in all copies.

The full text of the license can be found in the LICENSE file in the root directory of this project.
