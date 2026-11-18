import JSZip from 'jszip';
import { getProjects, getPublishedPosts, getPages } from '@/lib/store';
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
  const pages = await getPages().catch(() => []);

  // 1. Core Category Pages
  const categoryPages = [
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
      title: 'Target Locations & International Service Corridors',
      slug: 'locations',
      path: '/locations',
      url: absoluteUrl('/locations'),
      priority: '0.8',
      changefreq: 'monthly',
      desc: 'Geographic service coverage spanning the United States, United Kingdom, Australia, and Singapore.',
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
  ];

  // 2. Sub-Category Pages (Service Pillars)
  const subCategoryPages = services.map((s) => ({
    title: `${s.name} – ${s.title}`,
    slug: s.slug,
    path: `/services/${s.slug}`,
    url: absoluteUrl(`/services/${s.slug}`),
    priority: s.primary ? '0.9' : '0.8',
    changefreq: 'weekly',
    desc: s.description,
    data: s,
  }));

  // 3. Projects & Case Studies
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

  // 4. Blog Posts & Articles
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

  // 5. Machine Protocols
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

  // Consolidate all links for root exports
  const allLinks = [
    ...categoryPages.map((c) => ({ ...c, section: 'Category Page' })),
    ...subCategoryPages.map((s) => ({ ...s, section: 'Sub-Category / Service' })),
    ...projectList.map((p) => ({ ...p, section: 'Case Study / Project' })),
    ...postList.map((b) => ({ ...b, section: 'Blog Post' })),
    ...protocolList.map((pr) => ({ ...pr, desc: 'Machine Feed', section: 'Machine Protocol' })),
  ];

  // -------------------------------------------------------------
  // ROOT LEVEL EXPORT FILES
  // -------------------------------------------------------------

  // README.md
  const readmeContent = `# ${siteConfig.fullName} – Complete Sitemap Export Archive

> Generated: ${nowIso}
> Canonical Website: ${baseUrl}
> Total Published URLs: ${allLinks.length}
> Contact: ${siteConfig.email} | WhatsApp: ${siteConfig.whatsappNumber}

## Directory Organization

This archive organizes all website URLs and content assets into segregated, structured folders:

- **01_category_pages/**: Core landing pages and primary category hubs (${categoryPages.length} URLs).
- **02_sub_category_pages/**: Specialized service pillar sub-categories (${subCategoryPages.length} URLs).
- **03_projects_case_studies/**: 21 verified client case studies with full ~600-word reports (${projectList.length} URLs).
- **04_blog_posts/**: Published strategic articles and technical guides (${postList.length} URLs).
- **05_machine_protocols/**: Standard XML sitemap, HTML sitemap, and LLM manifests (${protocolList.length} URLs).

## Master Links Summary

| Section | Link Count | Target Path Corridor |
|---|---|---|
| Category Pages | ${categoryPages.length} | / |
| Sub-Category Pages | ${subCategoryPages.length} | /services/* |
| Projects & Case Studies | ${projectList.length} | /projects#* |
| Blog Posts | ${postList.length} | /blog/* |
| Machine Feeds | ${protocolList.length} | /sitemap.xml, /llms.txt |
| **Total** | **${allLinks.length}** | |
`;
  zip.file('README.md', readmeContent);

  // all-urls.txt (newline delimited raw URLs)
  const allUrlsContent = allLinks.map((l) => l.url).join('\n') + '\n';
  zip.file('all-urls.txt', allUrlsContent);

  // all-urls.csv
  const csvHeaders = 'Title,URL,Path,Category,Priority,ChangeFreq,LastModified\n';
  const csvRows = allLinks
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
      categoryPages,
      subCategoryPages,
      projects: projectList,
      blogPosts: postList,
      protocols: protocolList,
    },
    allLinks,
  };
  zip.file('sitemap.json', JSON.stringify(jsonExport, null, 2));

  // -------------------------------------------------------------
  // FOLDER 1: 01_category_pages/
  // -------------------------------------------------------------
  const catFolder = zip.folder('01_category_pages');
  if (catFolder) {
    catFolder.file('urls.txt', categoryPages.map((c) => c.url).join('\n') + '\n');
    let catIndex = `# Category & Core Landing Pages\n\nTotal URLs: ${categoryPages.length}\n\n`;
    for (const c of categoryPages) {
      catIndex += `- [${c.title}](${c.url})\n  Path: \`${c.path}\` | Priority: ${c.priority} | ChangeFreq: ${c.changefreq}\n  ${c.desc}\n\n`;
      const fileName = `${c.slug ? c.slug : 'home'}.md`;
      const fileBody = `# ${c.title}

- **URL:** ${c.url}
- **Path:** \`${c.path}\`
- **Priority:** ${c.priority}
- **Change Frequency:** ${c.changefreq}
- **Last Modified:** ${dateStr}

## Overview
${c.desc}
`;
      catFolder.file(fileName, fileBody);
    }
    catFolder.file('index.md', catIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 2: 02_sub_category_pages/
  // -------------------------------------------------------------
  const subFolder = zip.folder('02_sub_category_pages');
  if (subFolder) {
    subFolder.file('urls.txt', subCategoryPages.map((s) => s.url).join('\n') + '\n');
    let subIndex = `# Sub-Category & Service Pillar Pages\n\nTotal Services: ${subCategoryPages.length}\n\n`;
    for (const s of subCategoryPages) {
      const data = s.data;
      subIndex += `- [${s.title}](${s.url})\n  ${s.desc}\n\n`;
      const fileName = `${s.slug}.md`;
      const fileBody = `# ${s.title}

- **URL:** ${s.url}
- **Path:** \`${s.path}\`
- **Category:** Service Pillar
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
      subFolder.file(fileName, fileBody);
    }
    subFolder.file('index.md', subIndex);
  }

  // -------------------------------------------------------------
  // FOLDER 3: 03_projects_case_studies/
  // -------------------------------------------------------------
  const projFolder = zip.folder('03_projects_case_studies');
  if (projFolder) {
    projFolder.file('urls.txt', projectList.map((p) => p.url).join('\n') + '\n');
    let projIndex = `# Verified Client Case Studies & Commercial Track Record\n\nTotal Case Studies: ${projectList.length}\n\n`;
    projectList.forEach((p, idx) => {
      const d = p.data;
      projIndex += `### ${idx + 1}. [${p.title}](${p.url})\n- Category: ${d.category} | Client: ${d.client || 'Confidential'}\n- Verified Outcome: ${d.result || p.desc}\n\n`;

      const numPrefix = String(idx + 1).padStart(2, '0');
      const fileName = `${numPrefix}_${p.slug}.md`;
      const markdownDescription = htmlToMarkdown(d.description || '');

      const fileBody = `# ${p.title}

- **URL:** ${p.url}
- **Anchor Slug:** \`${p.slug}\`
- **Category:** ${d.category}
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
  // FOLDER 4: 04_blog_posts/
  // -------------------------------------------------------------
  const blogFolder = zip.folder('04_blog_posts');
  if (blogFolder) {
    blogFolder.file('urls.txt', postList.map((b) => b.url).join('\n') + '\n');
    let blogIndex = `# Strategic Articles & Technical Knowledge Base\n\nTotal Articles: ${postList.length}\n\n`;
    postList.forEach((b, idx) => {
      const post = b.data;
      blogIndex += `- [${b.title}](${b.url})\n  ${b.desc}\n\n`;
      const numPrefix = String(idx + 1).padStart(2, '0');
      const fileName = `${numPrefix}_${b.slug}.md`;
      const fileBody = `# ${b.title}

- **URL:** ${b.url}
- **Path:** \`${b.path}\`
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
  // FOLDER 5: 05_machine_protocols/
  // -------------------------------------------------------------
  const protoFolder = zip.folder('05_machine_protocols');
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
