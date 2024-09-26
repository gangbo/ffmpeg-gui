import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from 'lucide-react';

export default function Home() {
    return (
        <main className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">视频处理中心</h2>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">点击上传</span> 或拖放文件</p>
                            <p className="text-xs text-gray-400">MP4, AVI, MOV (最大 100MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>

                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择输出格式" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="avi">AVI</SelectItem>
                        <SelectItem value="mov">MOV</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="压缩质量 (1-100)" min="1" max="100" className="flex-grow" />
                    <span className="text-sm">%</span>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    开始处理
                </Button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">处理进度</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm mt-2 text-center">45% - 正在压缩...</p>
            </div>
        </main>
    );
}