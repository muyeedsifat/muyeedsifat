import JSZip from 'jszip';
import { getProjects, getPublishedPosts } from '@/lib/store';
import { services } from '@/data/services';
import { getSiteUrl, absoluteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return html
    .replace(/<h4>(.*?)<\/h4>/gi, '\n### $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<ul>([\s\S]*?)<\/ul>/gi, '\n$1\n')
    .replace(/<li>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET() {
  const baseUrl = getSiteUrl();
  const nowIso = new Date().toISOString();
  const dateStr = nowIso.split('T')[0];
  const zip = new JSZip();

  // Fetch all live dynamic content
  const projects = await getProjects().catch(() => []);
  const posts = await getPublishedPosts().catch(() => []);

  // 1. Primary Pages
  const primaryPages = [
    {
      title: 'Home – Portfolio & Growth Architecture Overview',
      slug: '',
      path: '/',
      url: absoluteUrl('/'),
      priority: '1.0',
      changefreq: 'weekly',
      desc: 'Main portfolio overview, primary service pillars, client outcomes, and consultation intake.',
    },
    {
      title: 'Services Hub – Growth & Acquisition Capabilities',
      slug: 'services',
      path: '/services',
      url: absoluteUrl('/services'),
      priority: '0.9',
      changefreq: 'weekly',
      desc: 'Comprehensive directory of digital marketing, AI SEO, paid search, and web performance services.',
    },
    {
      title: 'Projects & Case Studies – 21 Verified Client Outlines',
      slug: 'projects',
      path: '/projects',
      url: absoluteUrl('/projects'),
      priority: '0.9',
      changefreq: 'weekly',
      desc: 'Exhaustive repository of verified client case studies with sequential before/after proof screenshots.',
    },
    {
      title: 'Strategic Insights & Blog Hub',
      slug: 'blog',
      path: '/blog',
      url: absoluteUrl('/blog'),
      priority: '0.8',
      changefreq: 'weekly',
      desc: 'In-depth technical guides covering AI Overviews, AEO vs GEO vs SEO, and conversion optimization.',
    },
    {
      title: 'About Muyeed Sifat – Professional Background & Credentials',
      slug: 'about',
      path: '/about',
      url: absoluteUrl('/about'),
      priority: '0.8',
      changefreq: 'monthly',
      desc: 'Career background, technical methodology, core competencies, and digital marketing credentials.',
    },
    {
      title: 'Contact & Project Consultation',
      slug: 'contact',
      path: '/contact',
      url: absoluteUrl('/contact'),
      priority: '0.8',
      changefreq: 'monthly',
      desc: 'Direct inquiry channel, consultation booking, WhatsApp messaging, and retainer discussions.',
    },
    {
      title: 'HTML Sitemap & Navigation Directory',
      slug: 'sitemap.html',
      path: '/sitemap.html',
      url: absoluteUrl('/sitemap.html'),
      priority: '0.7',
      changefreq: 'weekly',
      desc: 'Human-navigable link directory organizing all published assets, services, case studies, and articles.',
    },
  ];

  // 2. Piller Category Pages (Core Service Pillars)
  const pillarCategoryPages = services.map((s) => ({
    title: `${s.name} – ${s.title}`,
    slug: s.slug,
    path: `/services/${s.slug}`,
    url: absoluteUrl(`/services/${s.slug}`),
    priority: s.primary ? '0.9' : '0.8',
    changefreq: 'weekly',
    desc: s.description,
    data: s,
  }));

  // 3. Location Pages
  const locationPages = [
    {
      title: 'Target Locations & International Service Corridors',
      slug: 'locations',
      path: '/locations',
      url: absoluteUrl('/locations'),
      priority: '0.8',
      changefreq: 'monthly',
      desc: 'Geographic service coverage spanning the United States, United Kingdom, Australia, and Singapore.',
    },
  ];

  // 4. Projects (Client Case Studies)
  const projectList = projects.map((p) => ({
    title: p.title,
    slug: p.slug,
    path: `/projects#${p.slug}`,
    url: absoluteUrl(`/projects#${p.slug}`),
    priority: '0.85',
    changefreq: 'weekly',
    desc: p.result || `Verified ${p.category} performance case study.`,
    data: p,
  }));

  // 5. Blog Posts & Articles
  const postList = posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    path: `/blog/${post.slug}`,
    url: absoluteUrl(`/blog/${post.slug}`),
    priority: '0.75',
    changefreq: 'monthly',
    desc: post.excerpt || post.metaDescription || 'Strategic technical publication.',
    data: post,
  }));

  // 6. Machine Protocols
  const protocolList = [
    {
      title: 'XML Sitemap (Sitemaps.org 0.9 with XSL)',
      path: '/sitemap.xml',
      url: absoluteUrl('/sitemap.xml'),
      priority: '0.7',
      changefreq: 'daily',
    },
    {
      title: 'HTML Sitemap & Navigation Directory',
      path: '/sitemap.html',
      url: absoluteUrl('/sitemap.html'),
      priority: '0.7',
      changefreq: 'weekly',
    },
    {
      title: 'LLM Manifest (llms.txt standard)',
      path: '/llms.txt',
      url: absoluteUrl('/llms.txt'),
      priority: '0.7',
      changefreq: 'weekly',
    },
    {
      title: 'Extended LLM Knowledge Base (llms-full.txt)',
      path: '/llms-full.txt',
      url: absoluteUrl('/llms-full.txt'),
      priority: '0.7',
      changefreq: 'weekly',
    },
    {
      title: 'Robots.txt Crawler Directives',
      path: '/robots.txt',
      url: absoluteUrl('/robots.txt'),
      priority: '0.5',
      changefreq: 'monthly',
    },
  ];

  // Consolidate website published pages (39 canonical pages matching HTML & XML sitemaps)
  const websitePages = [
    ...primaryPages.map((c) => ({ ...c, section: 'Primary Page' })),
    ...pillarCategoryPages.map((s) => ({ ...s, section: 'Piller Category Page' })),
    ...projectList.map((p) => ({ ...p, section: 'Project' })),
    ...locationPages.map((l) => ({ ...l, section: 'Location Page' })),
    ...postList.map((b) => ({ ...b, section: 'Blog Post' })),
  ];

  const allLinks = [
    ...websitePages,
    ...protocolList.map((pr) => ({ ...pr, desc: 'Machine Feed', section: 'Machine Protocol' })),
  ];

  // -------------------------------------------------------------
  // ROOT LEVEL EXPORT FILES
  // -------------------------------------------------------------

  // README.md
  const readmeContent = `# ${siteConfig.fullName} – Complete Sitemap Export Archive

> Generated: ${nowIso}
> Canonical Website: ${baseUrl}
> Total Published Website URLs: ${websitePages.length}
> Contact: ${siteConfig.email} | WhatsApp: ${siteConfig.whatsappNumber}

## Directory Organization

This archive organizes all website URLs and content assets into segregated, structured folders:

- **01_primary_pages/**: Primary landing pages and core navigation hubs (${primaryPages.length} URLs).
- **02_piller_category_pages/**: Core pillar category pages for services (${pillarCategoryPages.length} URLs).
- **03_projects/**: 21 verified client case studies with full reports (${projectList.length} URLs).
- **04_location_pages/**: Geographic service hubs and regional corridors (${locationPages.length} URLs).
- **05_blog_posts/**: Published strategic articles and technical guides (${postList.length} URLs).
- **06_machine_protocols/**: Standard XML sitemap, HTML sitemap, and LLM manifests (${protocolList.length} URLs).

## Master Links Summary

| Section | Link Count | Target Path Corridor |
|---|---|---|
| Primary Pages | ${primaryPages.length} | / |
| Piller Category Pages | ${pillarCategoryPages.length} | /services/* |
| Projects | ${projectList.length} | /projects#* |
| Location Pages | ${locationPages.length} | /locations |
| Blog Posts | ${postList.length} | /blog/* |
| **Total Published Pages** | **${websitePages.length}** | |
| Machine Feeds (Reference) | ${protocolList.length} | /sitemap.xml, /llms.txt |
`;
  zip.file('README.md', readmeContent);

  // all-urls.txt (newline delimited raw URLs for published pages)
  const allUrlsContent = websitePages.map((l) => l.url).join('\n') + '\n';
  zip.file('all-urls.txt', allUrlsContent);

  // all-urls.csv
  const csvHeaders = 'Title,URL,Path,Category,Priority,ChangeFreq,LastModified\n';
  const csvRows = websitePages
    .map(
      (l) =>
        `"${l.title.replace(/"/g, '""')}","${l.url}","${l.path}","${l.section}","${l.priority}","${l.changefreq}","${dateStr}"`
    )
    .join('\n');
  zip.file('all-urls.csv', csvHeaders + csvRows);

  // sitemap.json
  const jsonExport = {
    generatedAt: nowIso,
    website: baseUrl,
    totalLinks: allLinks.length,
    sections: {
      primaryPages,
      pillarCategoryPages,
      projects: projectList,
      locationPages,
      blogPosts: postList,
      protocols: protocolList,
    },
    allLinks,
  };
  zip.file('sitemap.json', JSON.stringify(jsonExport, null, 2));

  // -------------------------------------------------------------
  // FOLDER 1: 01_primary_pages/
  // -------------------------------------------------------------
  const primFolder = zip.folder('01_primary_pages');
  if (primFolder) {
    primFolder.file('urls.txt', primaryPages.map((c) => c.url).join('\n') + '\n');
    let primIndex = `# Primary Pages\n\nTotal URLs: ${primaryPages.length}\n\n`;
    for (const c of primaryPages) {
      primIndex += `- [${c.title}](${c.url})\n  Path: \`${c.path}\` | Priority: ${c.priority} | ChangeFreq: ${c.changefreq}\n  ${c.desc}\n\n`;
      const fileName = `${c.slug ? c.slug : 'home'}.md`;
      const fileBody = `# ${c.title}

- **URL:** ${c.url}
- **Path:** \`${c.path}\`
- **Category:** Primary Page
- **Priority:** ${c.priority}
- **Change Frequency:** ${c.changefreq}
- **Last Modified:** ${dateStr}

## Overview
${c.desc}
`;
      primFolder.file(fileName, fileBody);
    }
    primFolder.file('index.md', primIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 2: 02_piller_category_pages/
  // -------------------------------------------------------------
  const pillarFolder = zip.folder('02_piller_category_pages');
  if (pillarFolder) {
    pillarFolder.file('urls.txt', pillarCategoryPages.map((s) => s.url).join('\n') + '\n');
    let pillarIndex = `# Piller Category Pages\n\nTotal Pillars: ${pillarCategoryPages.length}\n\n`;
    for (const s of pillarCategoryPages) {
      const data = s.data;
      pillarIndex += `- [${s.title}](${s.url})\n  ${s.desc}\n\n`;
      const fileName = `${s.slug}.md`;
      const fileBody = `# ${s.title}

- **URL:** ${s.url}
- **Path:** \`${s.path}\`
- **Category:** Piller Category Page
- **Priority:** ${s.priority}
- **Change Frequency:** ${s.changefreq}
- **Last Modified:** ${dateStr}

## Overview & Value Proposition
${s.desc}

## Target Audiences
${data.audiences.map((a) => `- ${a}`).join('\n')}

## Core Value Drivers & Methodology
${data.reasons.map((r) => `### ${r.title}\n${r.description}`).join('\n\n')}

## Service Packages & Deliverables
${data.packages
  .map(
    (pkg) =>
      `### ${pkg.name} (${pkg.label})\n${pkg.description}\n**Included Features:**\n${pkg.features.map((f) => `- ${f}`).join('\n')}`
  )
  .join('\n\n')}

## Frequently Asked Questions
${data.faqs.map((faq) => `**Q: ${faq.question}**\nA: ${faq.answer}`).join('\n\n')}
`;
      pillarFolder.file(fileName, fileBody);
    }
    pillarFolder.file('index.md', pillarIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 3: 03_projects/
  // -------------------------------------------------------------
  const projFolder = zip.folder('03_projects');
  if (projFolder) {
    projFolder.file('urls.txt', projectList.map((p) => p.url).join('\n') + '\n');
    let projIndex = `# Verified Client Projects\n\nTotal Projects: ${projectList.length}\n\n`;
    projectList.forEach((p, idx) => {
      const d = p.data;
      projIndex += `### ${idx + 1}. [${p.title}](${p.url})\n- Category: ${d.category} | Client: ${d.client || 'Confidential'}\n- Verified Outcome: ${d.result || p.desc}\n\n`;

      const numPrefix = String(idx + 1).padStart(2, '0');
      const fileName = `${numPrefix}_${p.slug}.md`;
      const markdownDescription = htmlToMarkdown(d.description || '');

      const fileBody = `# ${p.title}

- **URL:** ${p.url}
- **Anchor Slug:** \`${p.slug}\`
- **Category:** Project
- **Client:** ${d.client || 'Confidential'}
- **Timeline:** ${d.timeline || 'Multi-Month Campaign'}
- **Verified Result:** ${d.result || 'Significant organic and commercial growth'}

## Key Performance Indicators & Bento Metrics
${d.metrics && d.metrics.length > 0 ? d.metrics.map((m) => `- **${m.value}:** ${m.label}`).join('\n') : '- Verified metrics on file'}

## Comprehensive Case Study & Technical Methodology
${markdownDescription}
`;
      projFolder.file(fileName, fileBody);
    });
    projFolder.file('index.md', projIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 4: 04_location_pages/
  // -------------------------------------------------------------
  const locFolder = zip.folder('04_location_pages');
  if (locFolder) {
    locFolder.file('urls.txt', locationPages.map((l) => l.url).join('\n') + '\n');
    let locIndex = `# Location Pages\n\nTotal Location Pages: ${locationPages.length}\n\n`;
    for (const l of locationPages) {
      locIndex += `- [${l.title}](${l.url})\n  Path: \`${l.path}\` | Priority: ${l.priority}\n  ${l.desc}\n\n`;
      const fileName = `${l.slug}.md`;
      const fileBody = `# ${l.title}

- **URL:** ${l.url}
- **Path:** \`${l.path}\`
- **Category:** Location Page
- **Priority:** ${l.priority}
- **Change Frequency:** ${l.changefreq}
- **Last Modified:** ${dateStr}

## Overview
${l.desc}
`;
      locFolder.file(fileName, fileBody);
    }
    locFolder.file('index.md', locIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 5: 05_blog_posts/
  // -------------------------------------------------------------
  const blogFolder = zip.folder('05_blog_posts');
  if (blogFolder) {
    blogFolder.file('urls.txt', postList.map((b) => b.url).join('\n') + '\n');
    let blogIndex = `# Strategic Blog Posts\n\nTotal Articles: ${postList.length}\n\n`;
    postList.forEach((b, idx) => {
      const post = b.data;
      blogIndex += `- [${b.title}](${b.url})\n  ${b.desc}\n\n`;
      const numPrefix = String(idx + 1).padStart(2, '0');
      const fileName = `${numPrefix}_${b.slug}.md`;
      const fileBody = `# ${b.title}

- **URL:** ${b.url}
- **Path:** \`${b.path}\`
- **Category:** Blog Post
- **Published:** ${post.createdAt || dateStr}
- **Last Updated:** ${post.updatedAt || dateStr}
- **Author:** ${siteConfig.fullName}

## Summary & Abstract
${b.desc}

## Article Content
${post.content ? htmlToMarkdown(post.content) : 'Full article available online.'}
`;
      blogFolder.file(fileName, fileBody);
    });
    blogFolder.file('index.md', blogIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 6: 06_machine_protocols/
  // -------------------------------------------------------------
  const protoFolder = zip.folder('06_machine_protocols');
  if (protoFolder) {
    protoFolder.file('urls.txt', protocolList.map((pr) => pr.url).join('\n') + '\n');
    let protoIndex = `# Machine Protocols & Search Crawler Directives\n\n`;
    for (const pr of protocolList) {
      protoIndex += `- [${pr.title}](${pr.url}) (Priority: ${pr.priority})\n`;
    }
    protoFolder.file('index.md', protoIndex);
  }

  // Generate ZIP archive buffer
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return new Response(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="muyeedsifat-sitemap-export.zip"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
