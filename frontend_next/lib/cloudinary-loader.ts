/**
 * Custom Next.js Image loader pour Cloudinary.
 *
 * Branché via `images.loaderFile` dans next.config.ts.
 *
 * Comportement :
 *   - URL Cloudinary complète → extrait le public_id, rebuild avec
 *     w_${width},q_${q},f_auto,c_limit
 *   - URL non-Cloudinary (Unsplash, etc.) → passe en l'état
 *   - Slot path (sans http) → préfixé par CLOUD_NAME + transformé
 *
 * Bénéfices : srcset responsive auto + négociation AVIF/WebP/JPG + pas d'upscale.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dy9gp5pim';

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({ src, width, quality }: LoaderProps): string {
  // Cloudinary URL → extraire public_id et reconstruire
  const cloudinaryMatch = src.match(
    /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:.*?\/)?(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i
  );
  if (cloudinaryMatch) {
    const publicId = cloudinaryMatch[1];
    const params = [`w_${width}`, `q_${quality ?? 'auto'}`, 'f_auto', 'c_limit'];
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(',')}/${publicId}`;
  }

  // URL externe (Unsplash, Pexels, etc.) → on laisse passer
  if (/^https?:\/\//.test(src)) return src;

  // Slot path (rare ici, prévu pour migration future) → Cloudinary URL
  const cleanSlot = src.replace(/^\/+/, '').replace(/\.(jpe?g|webp|png|avif)$/i, '');
  const params = [`w_${width}`, `q_${quality ?? 'auto'}`, 'f_auto', 'c_limit'];
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(',')}/${cleanSlot}`;
}
