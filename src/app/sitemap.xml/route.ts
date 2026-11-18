import { services } from '@/data/services';
import { getPublishedPosts, getProjects, getPages } from '@/lib/store';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SitemapItem {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export async function GET() {
  const nowIso = new Date().toISOString();

  // 1. Core Category & Landing URLs
  const staticItems: SitemapItem[] = [
    { url: absoluteUrl('/'), lastmod: nowIso, changefreq: 'weekly', priority: '1.0' },
    { url: absoluteUrl('/services'), lastmod: nowIso, changefreq: 'weekly', priority: '0.9' },
    { url: absoluteUrl('/projects'), lastmod: nowIso, changefreq: 'weekly', priority: '0.9' },
    { url: absoluteUrl('/about'), lastmod: nowIso, changefreq: 'monthly', priority: '0.8' },
    { url: absoluteUrl('/blog'), lastmod: nowIso, changefreq: 'weekly', priority: '0.8' },
    { url: absoluteUrl('/contact'), lastmod: nowIso, changefreq: 'monthly', priority: '0.8' },
    { url: absoluteUrl('/locations'), lastmod: nowIso, changefreq: 'monthly', priority: '0.8' },
    { url: absoluteUrl('/sitemap.html'), lastmod: nowIso, changefreq: 'weekly', priority: '0.7' },
  ];

  // 2. Dynamic Service Sub-Categories
  const serviceItems: SitemapItem[] = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastmod: nowIso,
    changefreq: 'weekly',
    priority: s.primary ? '0.9' : '0.8',
  }));

  // 3. Dynamic Client Case Studies & Projects (21 projects)
  let projectItems: SitemapItem[] = [];
  try {
    const rawProjects = await getProjects();
    projectItems = rawProjects.map((p) => ({
      url: absoluteUrl(`/projects#${p.slug}`),
      lastmod: nowIso,
      changefreq: 'weekly',
      priority: '0.85',
    }));
  } catch (err) {
    console.error('Error fetching projects for sitemap.xml:', err);
  }

  // 4. Dynamic Blog Posts (auto-updates when a new post is published)
  let postItems: SitemapItem[] = [];
  try {
    const posts = await getPublishedPosts();
    postItems = posts.map((post) => {
      let postDate = nowIso;
      if (post.updatedAt) {
        postDate = new Date(post.updatedAt).toISOString();
      } else if (post.createdAt) {
        postDate = new Date(post.createdAt).toISOString();
      }
      return {
        url: absoluteUrl(`/blog/${post.slug}`),
        lastmod: postDate,
        changefreq: 'monthly',
        priority: '0.75',
      };
    });
  } catch (err) {
    console.error('Error fetching published posts for sitemap.xml:', err);
  }

  // 5. Dynamic Custom Pages (if any created in Admin)
  let customPageItems: SitemapItem[] = [];
  try {
    const pages = await getPages();
    customPageItems = pages
      .filter((p) => p.slug)
      .map((p) => ({
        url: absoluteUrl(`/${p.slug.replace(/^\//, '')}`),
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : nowIso,
        changefreq: 'monthly',
        priority: '0.7',
      }));
  } catch (err) {
    console.error('Error fetching custom pages for sitemap.xml:', err);
  }

  // Combine and deduplicate
  const allItems = [
    ...staticItems,
    ...serviceItems,
    ...projectItems,
    ...postItems,
    ...customPageItems,
  ];

  const uniqueItemsMap = new Map<string, SitemapItem>();
  for (const item of allItems) {
    uniqueItemsMap.set(item.url, item);
  }
  const uniqueItems = Array.from(uniqueItemsMap.values());

  // Generate standard Sitemaps.org XML with XSL stylesheet link
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueItems
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
