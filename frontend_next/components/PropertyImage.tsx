'use client';

import Image from 'next/image';
import { useState } from 'react';
import { buildBlurUrl } from '@/lib/cloudinary';

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  onClick?: () => void;
  objectFit?: 'cover' | 'contain';
  quality?: number;
};

/**
 * Image avec effet blur-up :
 *   - Mini Cloudinary floutée en background CSS dès le mount (parallèle au HD)
 *   - Image HD chargée par Next/Image, fade-in 300ms à la fin du load
 *   - URL non-Cloudinary : pas de blur, juste fond gris
 *
 * Pour le carrousel/listing : passer `fill` dans un container `relative`.
 * Quality 65 par défaut = bon compromis taille/qualité pour vignettes.
 */
export function PropertyImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = '',
  imgClassName = '',
  priority,
  onClick,
  objectFit = 'cover',
  quality = 65,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const isCloudinary = src.includes('res.cloudinary.com');
  const blurUrl = isCloudinary ? buildBlurUrl(src) : null;

  const containerStyle = blurUrl
    ? {
        backgroundImage: `url(${blurUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: '#e5e5e5' };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        preload={priority}
        quality={quality}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        style={{ objectFit }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
