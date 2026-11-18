import { services } from '@/data/services';
import { getPublishedPosts, getProjects } from '@/lib/store';
import { getSiteUrl, siteConfig } from '@/lib/site';
import type { Project } from '@/types/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = getSiteUrl();

  let posts: Array<{ title: string; slug: string; excerpt?: string; content?: string }> = [];
  try {
    const rawPosts = await getPublishedPosts();
    posts = rawPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || p.metaDescription || '',
      content: p.content || '',
    }));
  } catch (err) {
    console.error('Error fetching posts for llms-full.txt:', err);
  }

  let projects: Project[] = [];
  try {
    projects = await getProjects();
  } catch (err) {
    console.error('Error fetching projects for llms-full.txt:', err);
  }

  const markdown = `# ${siteConfig.fullName} – Complete Technical & Strategic Knowledge Base

> Extended LLM Knowledge Base for ${siteConfig.fullName} (Full-Stack Growth Marketer & Technical AI SEO Architect).
> Canonical URL: ${baseUrl}
> Contact: ${siteConfig.email} | WhatsApp: ${siteConfig.whatsappNumber}

---

## 1. Executive Summary & Core Identity

${siteConfig.fullName} is an ROI-focused growth marketing strategist and technical SEO architect specializing in AI SEO (SEO, AEO, and GEO), high-intent Google Ads management, scalable Meta Ads creative testing, and sub-second WordPress speed engineering.

With deep experience bridging technical computer science foundations with commercial customer acquisition, ${siteConfig.fullName} has architected campaigns for clients spanning North America, Europe, Australia, and Southeast Asia.

---

## 2. Piller Category Pages (Core Service Pillars)

${services
  .map(
    (s) => `### ${s.name} (${s.eyebrow})
- **URL:** ${baseUrl}/services/${s.slug}
- **Description:** ${s.description}
- **Target Audiences:** ${s.audiences.join(', ')}
- **Core Value Drivers:**
${s.reasons.map((r) => `  * **${r.title}:** ${r.description}`).join('\n')}
- **Packages & Retainers:**
${s.packages.map((pkg) => `  * **${pkg.name} (${pkg.label}):** ${pkg.description} [Features: ${pkg.features.join('; ')}]`).join('\n')}
`
  )
  .join('\n\n')}

---

## 3. Verified Client Projects & Case Studies

${projects
  .map(
    (p, i) => `### Case Study ${i + 1}: ${p.title}
- **Category:** ${p.category}
- **Client:** ${p.client || 'Confidential'} | **Timeline:** ${p.timeline || 'Ongoing'}
- **URL:** ${baseUrl}/projects#${p.slug}
- **Verified Outcome:** ${p.result || 'Consistent commercial growth'}
- **Key Metrics:** ${p.metrics ? p.metrics.map((m) => `${m.value} ${m.label}`).join(' | ') : 'N/A'}

#### Detailed Strategic Report & Technical Methodology
${(p.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
`
  )
  .join('\n\n')}

---

## 4. Strategic Articles & Technical Frameworks

${posts
  .map(
    (p) => `### Article: ${p.title}
- **URL:** ${baseUrl}/blog/${p.slug}
- **Summary:** ${p.excerpt || 'Technical analysis on modern digital growth.'}

${p.content ? p.content.slice(0, 1200) + '...' : ''}
`
  )
  .join('\n\n')}

---

## 5. Contact, Credentials & Direct Verification

- **Website:** ${baseUrl}
- **HTML Sitemap:** ${baseUrl}/sitemap.html
- **XML Sitemap:** ${baseUrl}/sitemap.xml
- **LLM Manifest:** ${baseUrl}/llms.txt
- **Email:** ${siteConfig.email}
- **WhatsApp Direct:** ${siteConfig.whatsappNumber}
- **LinkedIn:** ${siteConfig.linkedIn}
- **Upwork:** ${siteConfig.upwork}
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
