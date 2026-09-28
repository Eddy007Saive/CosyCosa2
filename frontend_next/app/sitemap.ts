import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/conciergerie', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/conciergerie-pour-proprietaires-corse', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/locations-vacances-cosy-casa', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog-conciergerie-corse', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/partenaires-conciergerie-corse', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/a-propos-conciergerie-cosy-casa-en-corse', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact-conciergerie-cosy-casa', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/legal', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.1 },
  { path: '/cgv', changeFrequency: 'yearly', priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    if (Array.isArray(posts)) {
      blogEntries = posts
        .filter((post: any) => post?.slug && post.is_published !== false)
        .map((post: any) => ({
          url: `${SITE_URL}/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch {
    // Backend unreachable at build/request time: ship the static routes only,
    // the sitemap should never fail the build because of the remote API.
  }

  return [...staticEntries, ...blogEntries];
}
