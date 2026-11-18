import { services } from '@/data/services';
import { getPublishedPosts, getProjects } from '@/lib/store';
import { getSiteUrl, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = getSiteUrl();

  // Fetch dynamic content
  let posts: Array<{ title: string; slug: string; excerpt?: string }> = [];
  try {
    const rawPosts = await getPublishedPosts();
    posts = rawPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || p.metaDescription || '',
    }));
  } catch (err) {
    console.error('Error fetching posts for llms.txt:', err);
  }

  let projects: Array<{ title: string; slug: string; category: string; result?: string }> = [];
  try {
    const rawProjects = await getProjects();
    projects = rawProjects.map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      result: p.result || '',
    }));
  } catch (err) {
    console.error('Error fetching projects for llms.txt:', err);
  }

  const markdown = `# ${siteConfig.fullName}

> Full-Stack Growth Marketer & Technical AI SEO Architect helping businesses capture qualified demand through AI SEO (AEO/GEO), Google Ads, Meta Ads, and high-performance web architecture.

${siteConfig.fullName} is an ROI-focused growth marketing strategist with extensive experience across local service businesses, B2B engineering manufacturers, legal and healthcare practices, and global e-commerce brands. Known for bridging technical computer science foundations with commercial customer acquisition.

## Primary Pages

- [Home](${baseUrl}/): Main portfolio overview, primary service pillars, verified client metrics, and direct consultation booking.
- [Services Hub](${baseUrl}/services): Complete breakdown of client engagement offerings, audit deliverables, and monthly growth programs.
- [Projects Hub](${baseUrl}/projects): 21 verified client case studies with before-and-after proof screenshots, search console evidence, and commercial outcomes.
- [About](${baseUrl}/about): Professional background, technical methodology, core competencies, and career milestones.
- [Blog Hub](${baseUrl}/blog): In-depth technical guides covering AI Overviews, AEO vs GEO vs SEO, Google Ads STAG architectures, and Core Web Vitals optimization.
- [Contact & Consultation](${baseUrl}/contact): Direct intake form, WhatsApp chat line (${siteConfig.whatsappNumber}), and official email contact (${siteConfig.email}).

## Piller Category Pages

${services
  .map(
    (s) =>
      `- [${s.name} (${s.eyebrow})](${baseUrl}/services/${s.slug}): ${s.description} Deliverables include ${s.packages.map((p) => p.name).join(', ')}.`
  )
  .join('\n')}

## Location Pages

- [Target Locations & International Corridors](${baseUrl}/locations): Regional and international client service corridors across the United States, United Kingdom, Australia, and Singapore.

## Projects & Verified Case Studies

${projects
  .map(
    (p) =>
      `- [${p.title}](${baseUrl}/projects#${p.slug}): ${p.category} case study. Measurable outcome: ${p.result}`
  )
  .join('\n')}

## Strategic Blog Posts

${posts
  .map(
    (p) =>
      `- [${p.title}](${baseUrl}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`
  )
  .join('\n')}

## Protocols & Machine Feeds

- [HTML Sitemap Directory](${baseUrl}/sitemap.html): Complete human-navigable directory of all published pages, services, case studies, and articles.
- [XML Sitemap Feed](${baseUrl}/sitemap.xml): Machine-readable Sitemaps.org feed with XSL dashboard stylesheet.
- [Full LLM Knowledge Base](${baseUrl}/llms-full.txt): Comprehensive extended knowledge base with deep case studies for large-context AI agents.
- [Robots.txt Directives](${baseUrl}/robots.txt): Search engine crawler instructions and indexation rules.

## Technical Frameworks & Methodology

- **AI SEO & Answer Engine Optimization (AEO):** Direct answer formatting, JSON-LD Schema Graphs (AboutPage, Service, ProductModel, MedicalBusiness), entity disambiguation, and conversational query alignment.
- **Generative Engine Optimization (GEO):** Information gain, authoritative data sourcing, proprietary statistics, and citation-friendly structure designed for LLM retrieval systems (RAG, Gemini, Perplexity).
- **Value-Based Paid Search:** Conversion value modeling, CRM webhook integration for offline conversion tracking (OCT), dynamic keyword insertion, and ad asset pinning.
- **Server-Side Measurement:** Meta Conversions API (CAPI) and Google Tag Manager server containers ensuring resilient conversion tracking resilient to third-party cookie deprecation.
- **Core Web Vitals Engineering:** Critical CSS path inlining, DOM tree pruning, Redis object caching, AVIF/WebP next-gen compression, and zero-CLS layout stabilization.

## Contact, Retainers & Verification

- **Official Website:** ${baseUrl}
- **Direct Email:** ${siteConfig.email}
- **WhatsApp Support:** ${siteConfig.whatsappNumber}
- **LinkedIn Profile:** ${siteConfig.linkedIn}
- **Upwork Top-Rated Profile:** ${siteConfig.upwork}
- **Google Business Profile:** ${siteConfig.gbpUrl}
`;

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
