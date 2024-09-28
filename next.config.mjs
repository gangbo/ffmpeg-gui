/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                crypto: false,
                stream: false,
                path: false,
                os: false,
            };
        }
        return config;
    },
    async headers() {
        return [
            {
                source: "/static/:all*",
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=9999999999, must-revalidate',
                    }
                ],
            },
        ];
    },
};

export default nextConfig;
