/**
 * Helpers Cloudinary client-safe.
 *
 * NB : pas de SDK Cloudinary ici (importe `cloudinary` dans un fichier
 * server-only séparé pour les opérations admin upload/destroy).
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dy9gp5pim';

/** Extrait le public_id d'une URL Cloudinary (avec ou sans version, avec ou sans extension). */
export function extractPublicId(url: string): string | null {
  const match = url.match(
    /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:.*?\/)?(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i
  );
  return match ? match[1] : null;
}

/**
 * Construit une URL Cloudinary pour un public_id donné.
 * Si l'argument est déjà une URL complète, l'extrait d'abord.
 */
export function buildCloudinaryUrl(
  srcOrPublicId: string,
  opts: { width?: number; height?: number; quality?: number | 'auto'; blur?: number } = {}
): string {
  const publicId = srcOrPublicId.startsWith('http')
    ? extractPublicId(srcOrPublicId)
    : srcOrPublicId.replace(/^\/+/, '').replace(/\.(jpe?g|webp|png|avif)$/i, '');

  if (!publicId) return srcOrPublicId;

  const { width, height, quality = 'auto', blur } = opts;
  const params: string[] = ['f_auto', `q_${quality}`];
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  if (width || height) params.push('c_limit');
  if (blur) params.push(`e_blur:${blur}`);

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(',')}/${publicId}`;
}

/**
 * URL d'une mini-image floutée (~2-3 KB) pour effet "blur-up".
 * À utiliser comme background-image CSS en attendant le chargement de l'image HD.
 */
export function buildBlurUrl(src: string): string {
  return buildCloudinaryUrl(src, { width: 30, quality: 30, blur: 1000 });
}
