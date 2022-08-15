/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
      domains: ['avatars.githubusercontent.com'],
      domains: ["api.lorem.space"],
  },
  output: "standalone",
};

module.exports = nextConfig
