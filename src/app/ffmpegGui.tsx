'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Inbox, Loader2 } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

const FFmpegOnline: React.FC = () => {
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const [ready, setReady] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [outputOptions, setOutputOptions] = useState<string>('-c:v libx264 -crf 23');
    const [outputFileName, setOutputFileName] = useState<string>('output.mp4');
    const [message, setMessage] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [outputUrl, setOutputUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const ffmpegInstance = new FFmpeg();
            ffmpegInstance.on('log', ({ message }) => {
                console.log(message);
            });
            ffmpegInstance.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            // 加载 FFmpeg 核心
            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFfmpeg(ffmpegInstance);
            setReady(true);
        } catch (error) {
            console.error('Failed to load FFmpeg:', error);
            setMessage('加载 FFmpeg 失败。请检查您的浏览器兼容性。');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const runFFmpeg = async () => {
        if (!ffmpeg || !selectedFile) {
            setMessage('请先选择一个文件。');
            return;
        }

        setMessage('处理中...');
        setProgress(0);

        try {
            const inputFileName = selectedFile.name;
            await ffmpeg.writeFile(inputFileName, await fetchFile(selectedFile));

            await ffmpeg.exec(['-i', inputFileName, ...outputOptions.split(' '), outputFileName]);

            setMessage('转换完成！');

            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
            setOutputUrl(url);
        } catch (error) {
            console.error('FFmpeg 处理错误:', error);
            setMessage('处理过程中发生错误。请检查您的选项并重试。');
        }
    };

    const downloadOutput = () => {
        if (outputUrl) {
            const a = document.createElement('a');
            a.href = outputUrl;
            a.download = outputFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">ffmpeg-online</h1>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">1. 选择文件</h2>
                <p className="text-sm text-gray-600">您的文件不会上传到服务器，只会在浏览器中处理</p>
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">点击或拖拽文件</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="video/*"
                    />
                </div>
                <p className="text-sm text-gray-600">{selectedFile?.name || '未选择文件'}</p>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">2. 设置 ffmpeg 选项</h2>
                <p className="font-medium">ffmpeg</p>
                <Input value="-i" readOnly className="mb-2" />
                <Input value={selectedFile?.name || ''} readOnly className="mb-2" />
                <Input
                    placeholder="请输入输出选项"
                    value={outputOptions}
                    onChange={(e) => setOutputOptions(e.target.value)}
                    className="mb-2"
                />
                <Input
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    className="mb-2"
                />
                <p className="text-sm text-gray-600">
                    ffmpeg -i {selectedFile?.name || ''} {outputOptions} {outputFileName}
                </p>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">3. 运行并获取输出文件</h2>
                <Button onClick={runFFmpeg} disabled={!ready || !selectedFile}>
                    {ready ? '运行' : <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                </Button>
                {progress > 0 && <progress value={progress} max="100" className="w-full" />}
                <p className="text-sm text-gray-600">{message}</p>
                {outputUrl && (
                    <Button onClick={downloadOutput} className="mt-2">下载输出文件</Button>
                )}
            </div>

            {outputUrl && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">4. 预览</h2>
                    <video src={outputUrl} controls className="w-full" />
                </div>
            )}
        </div>
    );
};

export default FFmpegOnline;