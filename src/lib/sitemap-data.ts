import { services } from '@/data/services';
import { getPublishedPosts, getProjects, getPages } from '@/lib/store';
import { absoluteUrl } from '@/lib/site';

export interface SitemapItemData {
  id: string;
  url: string;
  path: string;
  title: string;
  category: 'primary' | 'pillar' | 'project' | 'location' | 'post';
  categoryLabel: string;
  description: string;
  lastmod: string;
  formattedDate: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export interface SitemapSummary {
  items: SitemapItemData[];
  counts: {
    all: number;
    primary: number;
    pillar: number;
    project: number;
    location: number;
    post: number;
  };
}

export async function getSitemapData(): Promise<SitemapSummary> {
  const now = new Date();
  const nowIso = now.toISOString();

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString.split('T')[0];
    }
  };

  // 1. Primary Pages (7 core canonical pages)
  const primaryItems: SitemapItemData[] = [
    {
      id: 'primary-home',
      url: absoluteUrl('/'),
      path: '/',
      title: 'Home – Portfolio & Growth Architecture Overview',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Main portfolio overview, primary service pillars, client outcomes, and consultation intake.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      id: 'primary-services',
      url: absoluteUrl('/services'),
      path: '/services',
      title: 'Services Hub – Growth & Acquisition Capabilities',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Comprehensive directory of digital marketing, AI SEO, paid search, and web performance services.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      id: 'primary-projects',
      url: absoluteUrl('/projects'),
      path: '/projects',
      title: 'Projects & Case Studies – 21 Verified Client Outlines',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Exhaustive repository of verified client case studies with sequential before/after proof screenshots.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      id: 'primary-about',
      url: absoluteUrl('/about'),
      path: '/about',
      title: 'About Muyeed Sifat – Professional Background & Credentials',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Career background, technical methodology, core competencies, and digital marketing credentials.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      id: 'primary-blog',
      url: absoluteUrl('/blog'),
      path: '/blog',
      title: 'Strategic Insights & Blog Hub',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'In-depth technical guides covering AI Overviews, AEO vs GEO vs SEO, and conversion optimization.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      id: 'primary-contact',
      url: absoluteUrl('/contact'),
      path: '/contact',
      title: 'Contact & Project Consultation',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Direct inquiry channel, consultation booking, WhatsApp messaging, and retainer discussions.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      id: 'primary-sitemap',
      url: absoluteUrl('/sitemap.html'),
      path: '/sitemap.html',
      title: 'HTML Sitemap & Navigation Directory',
      category: 'primary',
      categoryLabel: 'Primary Page',
      description: 'Human-navigable link directory organizing all published assets, services, case studies, and articles.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '0.7',
    },
  ];

  // 2. Piller Category Pages (Core Service Pillars)
  const pillarItems: SitemapItemData[] = services.map((s) => ({
    id: `pillar-${s.slug}`,
    url: absoluteUrl(`/services/${s.slug}`),
    path: `/services/${s.slug}`,
    title: `${s.name} – ${s.title}`,
    category: 'pillar',
    categoryLabel: 'Piller Category Page',
    description: s.description,
    lastmod: nowIso,
    formattedDate: formatDate(nowIso),
    changefreq: 'weekly',
    priority: s.primary ? '0.9' : '0.8',
  }));

  // 3. Location Pages
  const locationItems: SitemapItemData[] = [
    {
      id: 'location-main',
      url: absoluteUrl('/locations'),
      path: '/locations',
      title: 'Target Locations & International Service Corridors',
      category: 'location',
      categoryLabel: 'Location Page',
      description: 'Geographic service coverage spanning the United States, United Kingdom, Australia, and Singapore.',
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'monthly',
      priority: '0.8',
    },
  ];

  // 4. Projects (Client Case Studies)
  let projectItems: SitemapItemData[] = [];
  try {
    const rawProjects = await getProjects();
    projectItems = rawProjects.map((p) => ({
      id: `project-${p.slug}`,
      url: absoluteUrl(`/projects#${p.slug}`),
      path: `/projects#${p.slug}`,
      title: p.title,
      category: 'project',
      categoryLabel: 'Project',
      description: p.result || `Verified ${p.category} performance case study with interactive proof gallery.`,
      lastmod: nowIso,
      formattedDate: formatDate(nowIso),
      changefreq: 'weekly',
      priority: '0.85',
    }));
  } catch (err) {
    console.error('Error fetching projects for sitemap:', err);
  }

  // 5. Blog Posts
  let postItems: SitemapItemData[] = [];
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
        id: `post-${post.slug}`,
        url: absoluteUrl(`/blog/${post.slug}`),
        path: `/blog/${post.slug}`,
        title: post.title,
        category: 'post',
        categoryLabel: 'Blog Post',
        description: post.excerpt || post.metaDescription || 'Technical analysis and practical implementation guide.',
        lastmod: postDate,
        formattedDate: formatDate(postDate),
        changefreq: 'monthly',
        priority: '0.75',
      };
    });
  } catch (err) {
    console.error('Error fetching published posts for sitemap:', err);
  }

  // 6. Dynamic Custom Pages (if any new custom pages are created in Admin beyond default routes)
  const existingKnownPaths = new Set([
    ...primaryItems.map((i) => i.path.toLowerCase()),
    ...pillarItems.map((i) => i.path.toLowerCase()),
    ...locationItems.map((i) => i.path.toLowerCase()),
  ]);

  let customPageItems: SitemapItemData[] = [];
  try {
    const pages = await getPages();
    customPageItems = pages
      .filter((p) => p.slug && p.slug !== 'home')
      .map((p) => {
        const cleanPath = `/${p.slug.replace(/^\//, '')}`;
        const pDate = p.updatedAt ? new Date(p.updatedAt).toISOString() : nowIso;
        return {
          id: `page-${p.slug}`,
          url: absoluteUrl(cleanPath),
          path: cleanPath,
          title: p.title,
          category: 'primary' as const,
          categoryLabel: 'Primary Page',
          description: p.metaDescription || p.lead || 'Custom published page.',
          lastmod: pDate,
          formattedDate: formatDate(pDate),
          changefreq: 'monthly' as const,
          priority: '0.7',
        };
      })
      .filter((p) => !existingKnownPaths.has(p.path.toLowerCase()));
  } catch (err) {
    console.error('Error fetching custom pages for sitemap:', err);
  }

  // Combine and strictly deduplicate by canonical URL
  const allRawItems = [
    ...primaryItems,
    ...pillarItems,
    ...locationItems,
    ...projectItems,
    ...postItems,
    ...customPageItems,
  ];

  const uniqueMap = new Map<string, SitemapItemData>();
  for (const item of allRawItems) {
    uniqueMap.set(item.url, item);
  }
  const items = Array.from(uniqueMap.values());

  return {
    items,
    counts: {
      all: items.length,
      primary: items.filter((i) => i.category === 'primary').length,
      pillar: items.filter((i) => i.category === 'pillar').length,
      project: items.filter((i) => i.category === 'project').length,
      location: items.filter((i) => i.category === 'location').length,
      post: items.filter((i) => i.category === 'post').length,
    },
  };
}
