import {ThemeProvider} from "@/components/theme-provider"
import type {Metadata} from "next";
import "./globals.css";
import {Zap} from 'lucide-react';
import {Inter} from 'next/font/google';
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: "FFmpeg GUI",
    description: "A web-based GUI for FFmpeg",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-screen flex flex-col">
                <header className="shadow-sm">
                    <nav className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                        <ul className="flex space-x-4 items-center">
                            <li>
                                <a href="#" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <Zap className="w-6 h-6"/>
                                    <span className="text-xs mt-1">FFmpeg GUI</span>
                                </a>
                            </li>
                        </ul>
                        <ThemeToggle />
                    </nav>
                </header>
                <div className="flex-grow">
                    {children}
                </div>
                <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    © 2024 FFmpeg GUI. All rights reserved.
                </footer>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
