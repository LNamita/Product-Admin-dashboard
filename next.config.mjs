/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // DummyJSON serves all product images from this CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.dummyjson.com" }],
  },
};

export default nextConfig;
