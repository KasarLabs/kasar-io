/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "picsum.photos",
      "i.pravatar.cc",
      "github.com",
      "img.freepik.com",
      "images.ctfassets.net",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
