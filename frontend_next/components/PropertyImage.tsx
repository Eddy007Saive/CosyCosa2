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
};

/**
 * Image avec effet blur-up :
 *   - Mini Cloudinary floutée affichée en background CSS dès le mount
 *   - Image HD chargée par Next/Image en avant-plan, fade-in à la fin du load
 *   - URL non-Cloudinary : pas de blur, juste le fade-in
 *
 * Pour le carrousel, mets le wrapper en `relative` et passe `fill`.
 * Pour une taille fixe, passe `width` + `height`.
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
    : { backgroundColor: '#f0f0f0' };

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
        className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        style={{ objectFit }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
