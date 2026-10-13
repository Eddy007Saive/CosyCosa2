import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inline le CSS global dans le HTML : supprime la requete CSS bloquante
    // (~560 ms sur la chaine critique d'apres Lighthouse).
    inlineCss: true,
  },
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
      { protocol: "https", hostname: "a0.muscache.com" },
      { protocol: "https", hostname: "media.xmlcal.com" },
    ],
  },
};

export default nextConfig;
