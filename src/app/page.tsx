import React from 'react';
import FFmpegGui from "@/app/ffmpegGui";
import { Metadata } from 'next';

//export const runtime = "edge";

export const metadata: Metadata = {
    title: "FFmpeg Web GUI",
    description: "A web-based GUI for FFmpeg",
};

export default function Home() {
    return (
        <main className="max-w-4xl p-2 mx-auto">
            <FFmpegGui />
        </main>
    );
}