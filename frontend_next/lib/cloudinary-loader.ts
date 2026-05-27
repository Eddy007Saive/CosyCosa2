/**
 * Custom Next.js Image loader pour Cloudinary.
 *
 * Comportement (ordre prioritaire) :
 *   1. URL Cloudinary → extrait public_id et rebuild avec w_${width},q_${q},f_auto,c_limit
 *   2. URL externe (Airbnb, Unsplash, Pexels…) → PASSTHROUGH STRICT (rien n'est ajouté)
 *   3. Slot path (sans http) → URL Cloudinary depuis ROOT
 *
 * Bénéfices : srcset responsive auto + AVIF/WebP/JPG par négociation + pas d'upscale.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dy9gp5pim';

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({ src: rawSrc, width, quality }: LoaderProps): string {
  const src = (rawSrc ?? '').trim();
  const q = quality ?? 'auto';

  // 1. URL Cloudinary → reconstruire (en préservant le cloud d'origine)
  const cloudinaryMatch = src.match(
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:[^/]*?\/)?(?:v\d+\/)?(.+)$/i
  );
  if (cloudinaryMatch) {
    const sourceCloud = cloudinaryMatch[1];
    const publicId = cloudinaryMatch[2].replace(/\.[a-z]+$/i, '');
    return `https://res.cloudinary.com/${sourceCloud}/image/upload/w_${width},q_${q},f_auto,c_limit/${publicId}`;
  }

  // 2. Toute autre URL externe → passthrough strict
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // 3. Slot path (chemin relatif) → URL Cloudinary
  const cleanSlot = src.replace(/^\/+/, '').replace(/\.(jpe?g|webp|png|avif|gif)$/i, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${q},f_auto,c_limit/${cleanSlot}`;
}
