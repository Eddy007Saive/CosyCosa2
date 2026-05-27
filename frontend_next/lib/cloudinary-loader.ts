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

export default function cloudinaryLoader({ src, width, quality }: LoaderProps): string {
  const q = quality ?? 'auto';

  // 1. URL Cloudinary → reconstruire
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(src)) {
    // Capture tout ce qui suit /image/upload/, en sautant les transforms et version
    const match = src.match(/\/image\/upload\/(?:[^/]*?\/)?(?:v\d+\/)?(.+)$/i);
    if (match && match[1]) {
      const publicId = match[1].replace(/\.[a-z]+$/i, '');
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${q},f_auto,c_limit/${publicId}`;
    }
    return src;
  }

  // 2. Toute autre URL externe → passthrough strict
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // 3. Slot path (chemin relatif) → URL Cloudinary
  const cleanSlot = src.replace(/^\/+/, '').replace(/\.(jpe?g|webp|png|avif|gif)$/i, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${q},f_auto,c_limit/${cleanSlot}`;
}
