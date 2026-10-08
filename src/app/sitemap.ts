import type { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { getPublishedPosts } from '@/lib/store';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/services', '/projects', '/locations', '/about', '/blog', '/contact'];
  const staticEntries = staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency: path === '/' ? 'weekly' as const : 'monthly' as const, priority: path === '/' ? 1 : 0.8 }));
  const serviceEntries = services.map((service) => ({ url: absoluteUrl(`/services/${service.slug}`), lastModified: new Date(), changeFrequency: 'monthly' as const, priority: service.primary ? 0.9 : 0.7 }));
  const posts = await getPublishedPosts();
  const postEntries = posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date(post.updatedAt), changeFrequency: 'monthly' as const, priority: 0.7 }));
  return [...staticEntries, ...serviceEntries, ...postEntries];
}
