import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { SitemapViewer, SitemapLinkItem } from '@/components/SitemapViewer';
import { pageMetadata } from '@/lib/seo';
import { getProjects, getPublishedPosts, getPages } from '@/lib/store';
import { services } from '@/data/services';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Website Sitemap & Navigation Directory | Muyeed Sifat',
  description:
    'Comprehensive real-time directory and HTML sitemap of Muyeed Sifat portfolio. Browse all primary landing pages, service pillars, verified client case studies, and strategic growth publications.',
  path: '/sitemap.html',
});

export const dynamic = 'force-dynamic';

const faqs = [
  {
    question: 'How often is this sitemap updated?',
    answer:
      'This sitemap is dynamically generated and synchronizes automatically in real time whenever new case studies, service offerings, or strategic articles are published.',
  },
  {
    question: 'Where can I find the machine-readable XML sitemap for search crawlers?',
    answer:
      'The XML sitemap is available at /sitemap.xml. It complies with the Sitemaps.org 0.9 protocol and includes an integrated XSL stylesheet for in-browser visual inspection.',
  },
  {
    question: 'Is there an LLM or AI-readable version of this site?',
    answer:
      'Yes. An llms.txt file is provided at /llms.txt following the open standard for Large Language Models and conversational search engines, alongside an extended context feed at /llms-full.txt.',
  },
  {
    question: 'How are priority and change frequencies determined?',
    answer:
      'Core conversion corridors (Home, Services, Case Studies) carry 0.9–1.0 priorities with weekly check intervals, while individual published articles and informational pages carry 0.7–0.8 priorities with monthly review cycles.',
  },
];

export default async function SitemapPage() {
  const nowIso = new Date().toISOString();

  // 1. Core Landing Pages
  const coreItems: SitemapLinkItem[] = [
    {
      id: 'core-home',
      title: 'Home – Portfolio & Growth Architecture Overview',
      url: absoluteUrl('/'),
      path: '/',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Main portfolio overview, primary service pillars, client outcomes, and consultation intake.',
      priority: '1.0',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'core-services',
      title: 'Services Hub – Growth & Acquisition Capabilities',
      url: absoluteUrl('/services'),
      path: '/services',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Comprehensive directory of digital marketing, AI SEO, paid search, and web performance services.',
      priority: '0.9',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'core-projects',
      title: 'Projects & Case Studies – 21 Verified Client Outlines',
      url: absoluteUrl('/projects'),
      path: '/projects',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Exhaustive repository of verified client case studies with sequential before/after proof screenshots.',
      priority: '0.9',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'core-about',
      title: 'About Muyeed Sifat – Professional Background & Credentials',
      url: absoluteUrl('/about'),
      path: '/about',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Career background, technical methodology, core competencies, and digital marketing credentials.',
      priority: '0.8',
      changefreq: 'monthly',
      updatedAt: nowIso,
    },
    {
      id: 'core-blog',
      title: 'Strategic Insights & Blog Hub',
      url: absoluteUrl('/blog'),
      path: '/blog',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'In-depth technical guides covering AI Overviews, AEO vs GEO vs SEO, and conversion optimization.',
      priority: '0.8',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'core-locations',
      title: 'Target Locations & International Service Corridors',
      url: absoluteUrl('/locations'),
      path: '/locations',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Geographic service coverage spanning the United States, United Kingdom, Australia, and Singapore.',
      priority: '0.8',
      changefreq: 'monthly',
      updatedAt: nowIso,
    },
    {
      id: 'core-contact',
      title: 'Contact & Project Consultation',
      url: absoluteUrl('/contact'),
      path: '/contact',
      category: 'core',
      categoryLabel: 'Core Page',
      description: 'Direct inquiry channel, consultation booking, WhatsApp messaging, and retainer discussions.',
      priority: '0.8',
      changefreq: 'monthly',
      updatedAt: nowIso,
    },
  ];

  // 2. Service Offerings
  const serviceItems: SitemapLinkItem[] = services.map((s) => ({
    id: `service-${s.slug}`,
    title: `${s.name} – ${s.title}`,
    url: absoluteUrl(`/services/${s.slug}`),
    path: `/services/${s.slug}`,
    category: 'service',
    categoryLabel: 'Service Pillar',
    description: s.description,
    priority: s.primary ? '0.9' : '0.8',
    changefreq: 'weekly',
    updatedAt: nowIso,
  }));

  // 3. Client Case Studies
  let projectItems: SitemapLinkItem[] = [];
  try {
    const rawProjects = await getProjects();
    projectItems = rawProjects.map((p) => ({
      id: `project-${p.slug}`,
      title: p.title,
      url: absoluteUrl(`/projects#${p.slug}`),
      path: `/projects#${p.slug}`,
      category: 'project',
      categoryLabel: 'Case Study',
      description: p.result || `Verified ${p.category} performance case study with interactive proof gallery.`,
      priority: '0.85',
      changefreq: 'weekly',
      updatedAt: nowIso,
    }));
  } catch (err) {
    console.error('Error fetching projects for sitemap:', err);
  }

  // 4. Published Blog Posts
  let postItems: SitemapLinkItem[] = [];
  try {
    const rawPosts = await getPublishedPosts();
    postItems = rawPosts.map((p) => ({
      id: `post-${p.slug}`,
      title: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      path: `/blog/${p.slug}`,
      category: 'post',
      categoryLabel: 'Strategic Article',
      description: p.excerpt || p.metaDescription || 'Technical analysis and practical implementation guide.',
      priority: '0.75',
      changefreq: 'monthly',
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : nowIso,
    }));
  } catch (err) {
    console.error('Error fetching posts for sitemap:', err);
  }

  // 5. Dynamic Custom Pages (if any new custom pages are created in Admin beyond default routes)
  const existingCoreAndServicePaths = new Set([
    ...coreItems.map((i) => i.path.toLowerCase()),
    ...serviceItems.map((i) => i.path.toLowerCase()),
  ]);

  let customPageItems: SitemapLinkItem[] = [];
  try {
    const rawPages = await getPages();
    customPageItems = rawPages
      .filter((p) => p.slug && p.slug !== 'home')
      .map((p) => {
        const cleanPath = `/${p.slug.replace(/^\//, '')}`;
        return {
          id: `page-${p.slug}`,
          title: p.title,
          url: absoluteUrl(cleanPath),
          path: cleanPath,
          category: 'core' as const,
          categoryLabel: 'Custom Page',
          description: p.metaDescription || p.lead || 'Custom published page.',
          priority: '0.7',
          changefreq: 'monthly' as const,
          updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : nowIso,
        };
      })
      .filter((p) => !existingCoreAndServicePaths.has(p.path.toLowerCase()));
  } catch (err) {
    console.error('Error fetching custom pages for sitemap:', err);
  }

  // 6. Protocols & Machine Feeds
  const protocolItems: SitemapLinkItem[] = [
    {
      id: 'proto-xml-sitemap',
      title: 'XML Sitemap (Sitemaps.org Feed with XSL)',
      url: absoluteUrl('/sitemap.xml'),
      path: '/sitemap.xml',
      category: 'protocol',
      categoryLabel: 'Machine Protocol',
      description: 'Official XML sitemap for search crawlers featuring integrated XSL styling for in-browser visual inspection.',
      priority: '0.7',
      changefreq: 'daily',
      updatedAt: nowIso,
    },
    {
      id: 'proto-html-sitemap',
      title: 'HTML Sitemap & Navigation Directory',
      url: absoluteUrl('/sitemap.html'),
      path: '/sitemap.html',
      category: 'protocol',
      categoryLabel: 'Machine Protocol',
      description: 'Human-navigable link directory organizing all published assets, services, case studies, and articles.',
      priority: '0.7',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'proto-llms-txt',
      title: 'LLM Manifest (llms.txt Standard)',
      url: absoluteUrl('/llms.txt'),
      path: '/llms.txt',
      category: 'protocol',
      categoryLabel: 'Machine Protocol',
      description: 'Standardized markdown manifest for Large Language Models, Perplexity, and AI search engines.',
      priority: '0.7',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'proto-llms-full',
      title: 'Extended LLM Knowledge Base (llms-full.txt)',
      url: absoluteUrl('/llms-full.txt'),
      path: '/llms-full.txt',
      category: 'protocol',
      categoryLabel: 'Machine Protocol',
      description: 'Comprehensive extended context repository containing full ~600-word case studies and strategic breakdowns.',
      priority: '0.7',
      changefreq: 'weekly',
      updatedAt: nowIso,
    },
    {
      id: 'proto-robots',
      title: 'Robots.txt Crawler Directives',
      url: absoluteUrl('/robots.txt'),
      path: '/robots.txt',
      category: 'protocol',
      categoryLabel: 'Machine Protocol',
      description: 'Crawler directives, indexation rules, and canonical sitemap references for search engine bots.',
      priority: '0.5',
      changefreq: 'monthly',
      updatedAt: nowIso,
    },
  ];

  const rawAllItems: SitemapLinkItem[] = [
    ...coreItems,
    ...serviceItems,
    ...projectItems,
    ...postItems,
    ...customPageItems,
    ...protocolItems,
  ];

  // Strictly deduplicate by canonical URL
  const seenUrls = new Set<string>();
  const allItems: SitemapLinkItem[] = [];
  for (const item of rawAllItems) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      allItems.push(item);
    }
  }

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]} />
          <span className="eyebrow">Real-Time Directory • Auto-Updating</span>
          <h1>Website Sitemap &amp; Link Directory</h1>
          <p className="lead">
            An exhaustive, continuously updated index of all primary landing pages, service capabilities, verified client case studies, and strategic growth publications across the website.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '16px' }}>
        <div className="container">
          <SitemapViewer items={allItems} />
        </div>
      </section>

      <FAQ title="Sitemap &amp; Indexation Questions" faqs={faqs} />
      <CTA
        title="Ready to Scale Your Search &amp; Paid Acquisition?"
        text="Review the case studies and strategic playbooks above, then reach out to map a structured growth roadmap tailored to your market."
      />
    </>
  );
}
