import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    // Inline le CSS global dans le HTML : supprime la requete CSS bloquante
    // (~560 ms sur la chaine critique d'apres Lighthouse).
    inlineCss: true,
  },
  webpack: (config, { webpack }) => {
    // Audit Lighthouse "Ancien JavaScript" : Next.js embarque d'office
    // polyfill-module (Array.prototype.at/flat/flatMap, Object.fromEntries/hasOwn,
    // String trimStart/trimEnd, Promise.finally, Symbol.description), tous
    // Baseline depuis Safari 15.4 (2022). On le remplace par un module vide.
    // A retirer si un support iOS < 15.4 devient necessaire.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /[\/]polyfills[\/]polyfill-module$/,
        path.join(process.cwd(), "lib", "empty-module.js")
      )
    );
    return config;
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
