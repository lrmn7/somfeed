import nextTranspileModules from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const withTM = nextTranspileModules(['@coinbase/wallet-sdk']);

const nextConfig = withTM({
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
});

export default nextConfig;
