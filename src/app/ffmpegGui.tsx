'use client'
import React, {useState, useEffect, useRef} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Inbox, Loader2, X} from 'lucide-react';
import {FFmpeg} from '@ffmpeg/ffmpeg'
import {fetchFile, toBlobURL} from '@ffmpeg/util'
import { PlayIcon} from 'lucide-react'

const baseURL = '/static/v0-12-6'

interface FileInfo {
    name: string;
    size: string;
}

const FFmpegGui: React.FC = () => {
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const [ready, setReady] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [outputFormat, setOutputFormat] = useState<string>('mp4');
    const [outputFileName, setOutputFileName] = useState<string>('output.mp4');
    const [outputFileSize, setOutputFileSize] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [outputUrl, setOutputUrl] = useState<string>('');
    const [resolution, setResolution] = useState<string>('original');
    const [selectedEncoder, setSelectedEncoder] = useState<string>('libx264');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const resolutionOptions = [
        {label: 'Original Resolution', value: 'original'},
        {label: '4K (3840x2160)', value: '3840:2160'},
        {label: '1080p (1920x1080)', value: '1920:1080'},
        {label: '720p (1280x720)', value: '1280:720'},
        {label: '480p (854x480)', value: '854:480'},
    ];

    const formatOptions = [
        { label: 'MP4', value: 'mp4' },
        { label: 'MP3 (Audio)', value: 'mp3' },
        { label: 'WebM', value: 'webm' },
        { label: 'MKV', value: 'mkv' },
        { label: 'AVI', value: 'avi' },
        { label: 'MOV', value: 'mov' },
        { label: 'FLV', value: 'flv' },
        { label: 'WMV', value: 'wmv' },
        { label: 'WAV', value: 'wav' },
    ];

    const videoEncoders = [
        { label: 'Copy (No re-encode)', value: 'copy' },
        { label: 'H.264 (Good compatibility)', value: 'libx264' },
        { label: 'H.265', value: 'libx265' },
        { label: 'VP9', value: 'libvpx-vp9' },
    ];

    const audioEncoders = [
        { label: 'Copy (No re-encode)', value: 'copy' },
        { label: 'MP3 (libmp3lame)', value: 'libmp3lame' },
        { label: 'AAC', value: 'aac' },
    ];

    const getEncoderOptions = () => {
        return ['mp3', 'wav'].includes(outputFormat) ? audioEncoders : videoEncoders;
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (selectedFile && resolution && selectedEncoder && outputFormat) {
            const baseFileName = selectedFile.name.split('.').slice(0, -1).join('.');
            const resolutionSuffix = resolution === 'original' ? '' : `_${resolution.replace(':', 'x')}`;
            const encoderSuffix = selectedEncoder === 'copy' ? '' : `_${selectedEncoder}`;
            const newFileName = `${baseFileName}${resolutionSuffix}${encoderSuffix}.${outputFormat}`;
            setOutputFileName(newFileName.replace(/\s+/g, '_'));
        }
    }, [selectedFile, resolution, selectedEncoder, outputFormat]);

    useEffect(() => {
        // 当输出格式改变时，重置编码器选择
        if (['mp3', 'wav'].includes(outputFormat)) {
            setSelectedEncoder('libmp3lame');
        } else {
            setSelectedEncoder('libx264');
        }
    }, [outputFormat]);

    const load = async () => {
        setIsLoading(true);
        try {
            const ffmpegInstance = new FFmpeg();
            ffmpegInstance.on('log', ({message}) => {
                console.log(message); // 改用 console.log
            });
            ffmpegInstance.on('progress', ({progress}) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFfmpeg(ffmpegInstance);
            setReady(true);
        } catch (error) {
            console.error('Failed to load FFmpeg:', error);
            setMessage('Failed to load FFmpeg. Please check your browser compatibility.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileInfo({
                name: file.name,
                size: formatFileSize(file.size),
            })
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileInfo({
                name: file.name,
                size: formatFileSize(file.size),
            })
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const runFFmpeg = async () => {
        if (!ffmpeg || !selectedFile) {
            setMessage('Please select a file first.');
            return;
        }

        setMessage('Processing...');
        setProgress(0);
        setIsProcessing(true);

        try {
            // Clean up any existing files
            try {
                await ffmpeg.deleteFile('input');
                await ffmpeg.deleteFile(outputFileName);
            } catch (e) {
                console.log(e)
                // Ignore errors if files don't exist
            }

            const fileData = await fetchFile(selectedFile);
            await ffmpeg.writeFile('input', fileData);

            const ffmpegCommand = ['-i', 'input'];

            if (resolution !== 'original') {
                ffmpegCommand.push('-vf', `scale=${resolution}`);
            }

            if (selectedEncoder !== 'copy') {
                if (outputFormat === 'mp3' || outputFormat === 'wav') {
                    ffmpegCommand.push('-c:a', selectedEncoder);
                } else {
                    ffmpegCommand.push('-c:v', selectedEncoder);
                }
            }

            ffmpegCommand.push('-f', outputFormat);
            ffmpegCommand.push(outputFileName);

            await ffmpeg.exec(ffmpegCommand);

            setMessage('Conversion complete!');

            const data = await ffmpeg.readFile(outputFileName);
            const url = URL.createObjectURL(new Blob([data as ArrayBuffer], { type: `video/${outputFormat}` }));
            setOutputUrl(url);
            setOutputFileSize(formatFileSize((data as ArrayBuffer).byteLength));

            // Clean up
            await ffmpeg.deleteFile('input');
            await ffmpeg.deleteFile(outputFileName);
        } catch (error) {
            console.error('FFmpeg processing error:', error);
            setMessage(`An error occurred during processing: ${error}`);
        } finally {
            setIsProcessing(false);
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

    const clearFile = () => {
        setSelectedFile(null);
        setFileInfo(null);
        setOutputUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">FFmpeg GUI</h1>

            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">1. Select File</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your file will be processed in the browser and not uploaded to any server</p>
                <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {selectedFile ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{fileInfo?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{fileInfo?.size}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Inbox className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Click or drag file to this area to upload</p>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="video/*"
                    />
                </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">2. Set Output Options</h2>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format</label>
                    <Select onValueChange={(value) => setOutputFormat(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select output format"/>
                        </SelectTrigger>
                        <SelectContent>
                            {formatOptions.map((option, index) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {!['mp3', 'wav'].includes(outputFormat) && (
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Resolution</label>
                        <Select onValueChange={(value) => setResolution(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select output resolution"/>
                            </SelectTrigger>
                            <SelectContent>
                                {resolutionOptions.map((option, index) => (
                                    <SelectItem key={index} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Encoder</label>
                    <Select 
                        onValueChange={(value) => setSelectedEncoder(value)} 
                        value={selectedEncoder}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select encoder"/>
                        </SelectTrigger>
                        <SelectContent>
                            {getEncoderOptions().map((option, index) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output Filename</label>
                    <Input
                        value={outputFileName}
                        onChange={(e) => setOutputFileName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    ffmpeg -i {selectedFile?.name || ''}
                    {resolution !== 'original' ? ` -vf scale=${resolution}` : ''}
                    {selectedEncoder !== 'copy' ? (outputFormat === 'mp3' || outputFormat === 'wav' ? ` -c:a ${selectedEncoder}` : ` -c:v ${selectedEncoder}`) : ''} {outputFileName}
                </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">3. Run and Get Output File</h2>
                <Button 
                    onClick={runFFmpeg} 
                    disabled={!ready || !selectedFile || isLoading || isProcessing} 
                    className="w-full md:w-48 mx-auto flex justify-center"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading
                        </>
                    ) : isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                        </>
                    ) : (
                        <>
                            <PlayIcon className="mr-2 h-4 w-4" />
                            Run
                        </>
                    )}
                </Button>
                {progress > 0 && (
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                                    {progress}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-700">
                            <div style={{width: `${progress}%`}}
                                 className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                        <p>
                        </p>
                    </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                {outputUrl && (
                    <div className="mt-4">
                        <Button onClick={downloadOutput} className="w-full md:w-auto">Download Output File</Button>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Filename: {outputFileName}<br/>
                            File size: {outputFileSize}
                        </p>
                    </div>
                )}
            </div>

            {outputUrl && (
                <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">4. Preview</h2>
                    <video src={outputUrl} controls className="w-full md:w-2/3 mx-auto rounded-lg shadow-lg"/>
                </div>
            )}
        </div>
    );
};

export default FFmpegGui;