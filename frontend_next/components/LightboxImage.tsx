'use client';

import { useState, useEffect } from 'react';
import { buildBlurUrl, buildCloudinaryUrl } from '@/lib/cloudinary';

type Props = {
  src: string;
  alt: string;
  onClick?: (e: React.MouseEvent) => void;
};

/**
 * Image lightbox plein écran avec blur-up.
 *   - URL Cloudinary : version 1920px max via buildCloudinaryUrl (bandwidth ↓)
 *   - Blur background pendant le chargement
 *   - object-contain pour préserver l'aspect ratio
 */
export function LightboxImage({ src, alt, onClick }: Props) {
  const [loaded, setLoaded] = useState(false);
  const isCloudinary = src.includes('res.cloudinary.com');
  const hdSrc = isCloudinary ? buildCloudinaryUrl(src, { width: 1920, quality: 85 }) : src;
  const blurUrl = isCloudinary ? buildBlurUrl(src) : null;

  // Reset au changement d'image
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative" onClick={onClick}>
      {blurUrl && !loaded && (
        <img
          src={blurUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain blur-2xl scale-110"
        />
      )}
      <img
        src={hdSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`max-w-[95vw] max-h-[90vh] object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
