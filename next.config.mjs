/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'yt3.ggpht.com',
            port: '',
            pathname: '/ytc/**',
          },
        ],
      },
    
};

export default nextConfig;
