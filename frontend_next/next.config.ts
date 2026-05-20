import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Custom loader Cloudinary : voir lib/cloudinary-loader.ts
    // → URL Cloudinary rebuild avec srcset responsive + AVIF/WebP auto
    // → URL non-Cloudinary (Unsplash, Pexels) passe en l'état
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cosycasa.fr" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
