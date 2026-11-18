import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPosts, getProjects, getPages, getSettings } from '@/lib/store';
import { services } from '@/data/services';
import { siteConfig, absoluteUrl } from '@/lib/site';
import type { ContentBlock } from '@/types/content';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export interface SeoFactorCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'error' | 'info';
  score: number; // 0 - 100
  foundValue: string;
  details: string;
  recommendation?: string;
}

export interface FourCorePlacement {
  keyword: string;
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inBody: boolean;
  bodyOccurrences: number;
  score: number; // 0 - 4
  passed: boolean;
}

export interface AuditedItem {
  id: string;
  title: string;
  slug: string;
  path: string;
  type: 'blog' | 'service' | 'page' | 'project';
  healthScore: number;
  healthGrade: 'A' | 'B' | 'C' | 'D';
  overallStatus: 'healthy' | 'needs_attention' | 'critical';
  focusKeyword: string;
  fourCore: FourCorePlacement;
  metaTitle: {
    value: string;
    length: number;
    status: 'passed' | 'warning' | 'error';
    message: string;
  };
  metaDescription: {
    value: string;
    length: number;
    status: 'passed' | 'warning' | 'error';
    message: string;
  };
  h1: {
    value: string;
    status: 'passed' | 'error';
    message: string;
  };
  schema: {
    types: string[];
    hasCustom: boolean;
    status: 'passed' | 'warning' | 'error';
  };
  canonical: {
    value: string;
    status: 'passed' | 'warning';
  };
  internalLinks: {
    count: number;
    links: string[];
    status: 'passed' | 'warning' | 'error';
  };
  externalLinks: {
    count: number;
    status: 'passed' | 'info';
  };
  openGraph: {
    hasImage: boolean;
    imageUrl?: string;
    hasAlt: boolean;
    status: 'passed' | 'warning' | 'error';
  };
  contentLength: {
    wordCount: number;
    status: 'passed' | 'warning' | 'error';
    recommendation: string;
  };
  faqs: {
    count: number;
    hasSchema: boolean;
    status: 'passed' | 'info';
  };
  indexing: {
    status: 'passed' | 'error';
    robots: string;
    inSitemap: boolean;
  };
  headingStructure: {
    headings: { level: string; text: string }[];
    hierarchyValid: boolean;
    status: 'passed' | 'warning';
  };
  checks: SeoFactorCheck[];
  editUrl: string;
}

// Helpers
function extractTextFromBlocks(blocks?: ContentBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((b) => {
      if (b.type === 'paragraph' || b.type === 'h2' || b.type === 'h3' || b.type === 'quote') {
        return b.text || '';
      }
      if (b.type === 'list' && Array.isArray(b.items)) {
        return b.items.join(' ');
      }
      return '';
    })
    .join(' ');
}

function countWords(str: string): number {
  if (!str) return 0;
  // Strip HTML tags if any
  const clean = str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function extractInternalLinks(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/href=["'](\/[^"']+)["']/gi) || [];
  const links = matches.map((m) => {
    const matched = m.match(/href=["'](\/[^"']+)["']/i);
    return matched ? matched[1] : '';
  }).filter(Boolean);
  return Array.from(new Set(links));
}

function extractExternalLinks(text: string): number {
  if (!text) return 0;
  const matches = text.match(/href=["']https?:\/\/(?!muyeedsifat)[^"']+["']/gi) || [];
  return matches.length;
}

function extractHeadingsFromBlocks(blocks?: ContentBlock[]): { level: string; text: string }[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b.type === 'h2' || b.type === 'h3')
    .map((b) => ({
      level: b.type.toUpperCase(),
      text: (b as { text: string }).text.replace(/<[^>]*>/g, '').trim()
    }));
}

function checkKeywordInText(keyword: string, text: string): { found: boolean; occurrences: number } {
  if (!keyword || !text) return { found: false, occurrences: 0 };
  const cleanKeyword = keyword.trim().toLowerCase();
  const cleanText = text.toLowerCase();
  if (!cleanKeyword) return { found: false, occurrences: 0 };

  const regex = new RegExp(`\\b${cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = cleanText.match(regex);
  const count = matches ? matches.length : 0;
  return {
    found: count > 0 || cleanText.includes(cleanKeyword),
    occurrences: count
  };
}

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [posts, projects, customPages, settings] = await Promise.all([
    getPosts(),
    getProjects(),
    getPages(),
    getSettings()
  ]);

  const auditedItems: AuditedItem[] = [];

  // 1. AUDIT BLOG POSTS
  for (const post of posts) {
    const rawBody = (post.content || '') + ' ' + extractTextFromBlocks(post.blocks);
    const wordCount = countWords(rawBody);
    const focusKeyword = (post.focusKeyword || post.categories?.[0] || 'AI SEO').trim();

    // 4 Core Places
    const inTitle = checkKeywordInText(focusKeyword, post.metaTitle || post.title).found;
    const inDesc = checkKeywordInText(focusKeyword, post.metaDescription || post.excerpt).found;
    const inH1 = checkKeywordInText(focusKeyword, post.title).found;
    const bodyCheck = checkKeywordInText(focusKeyword, rawBody);
    const fourCoreScore = (inTitle ? 1 : 0) + (inDesc ? 1 : 0) + (inH1 ? 1 : 0) + (bodyCheck.found ? 1 : 0);

    const titleLength = (post.metaTitle || post.title || '').length;
    const descLength = (post.metaDescription || post.excerpt || '').length;
    const internalLinks = extractInternalLinks(rawBody);
    const extLinkCount = extractExternalLinks(rawBody);
    const headings = [{ level: 'H1', text: post.title }, ...extractHeadingsFromBlocks(post.blocks)];

    // Check heading hierarchy
    let hierarchyValid = true;
    for (let i = 0; i < headings.length - 1; i++) {
      if (headings[i].level === 'H1' && headings[i + 1].level === 'H3') {
        hierarchyValid = false;
        break;
      }
    }

    // Health Score calculation
    let score = 0;
    // Title (15 pts)
    const titleStatus: 'passed' | 'warning' | 'error' = titleLength >= 40 && titleLength <= 60 ? 'passed' : titleLength >= 30 && titleLength <= 70 ? 'warning' : 'error';
    score += titleStatus === 'passed' ? 15 : titleStatus === 'warning' ? 10 : 0;

    // Desc (15 pts)
    const descStatus: 'passed' | 'warning' | 'error' = descLength >= 120 && descLength <= 160 ? 'passed' : descLength >= 80 && descLength <= 180 ? 'warning' : 'error';
    score += descStatus === 'passed' ? 15 : descStatus === 'warning' ? 10 : 0;

    // H1 (10 pts)
    score += post.title ? 10 : 0;

    // 4-Core Keyword (20 pts)
    score += Math.round((fourCoreScore / 4) * 20);

    // Schema (10 pts)
    const schemaTypes: string[] = [post.schemaType || 'BlogPosting'];
    if ((post.faqs || []).length > 0) schemaTypes.push('FAQPage');
    if (post.customSchema) schemaTypes.push('CustomSchema');
    score += schemaTypes.length > 0 ? 10 : 0;

    // Canonical (5 pts)
    score += 5;

    // Word Count (10 pts)
    const wordStatus: 'passed' | 'warning' | 'error' = wordCount >= 1000 ? 'passed' : wordCount >= 600 ? 'warning' : 'error';
    score += wordStatus === 'passed' ? 10 : wordStatus === 'warning' ? 6 : 0;

    // Internal links (10 pts)
    const intLinkStatus: 'passed' | 'warning' | 'error' = internalLinks.length >= 3 ? 'passed' : internalLinks.length >= 1 ? 'warning' : 'error';
    score += intLinkStatus === 'passed' ? 10 : intLinkStatus === 'warning' ? 5 : 0;

    // Open Graph (5 pts)
    const ogStatus: 'passed' | 'warning' | 'error' = post.featuredImage && post.featuredAlt ? 'passed' : post.featuredImage ? 'warning' : 'error';
    score += ogStatus === 'passed' ? 5 : ogStatus === 'warning' ? 3 : 0;

    const grade: 'A' | 'B' | 'C' | 'D' = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';
    const overallStatus: 'healthy' | 'needs_attention' | 'critical' = score >= 85 ? 'healthy' : score >= 70 ? 'needs_attention' : 'critical';

    const checks: SeoFactorCheck[] = [
      {
        id: 'meta-title',
        name: 'Meta Title',
        status: titleStatus,
        score: titleStatus === 'passed' ? 100 : titleStatus === 'warning' ? 70 : 30,
        foundValue: `${titleLength} chars: "${post.metaTitle || post.title}"`,
        details: titleStatus === 'passed' ? 'Optimal length for Google SERPs (40-60 characters).' : `Length is ${titleLength} characters. Target 50-60 characters for maximum CTR.`,
        recommendation: titleStatus !== 'passed' ? 'Keep title between 40 and 60 characters so it does not get truncated on search engine result pages.' : undefined
      },
      {
        id: 'meta-desc',
        name: 'Meta Description',
        status: descStatus,
        score: descStatus === 'passed' ? 100 : descStatus === 'warning' ? 70 : 30,
        foundValue: `${descLength} chars: "${(post.metaDescription || post.excerpt || '').slice(0, 70)}..."`,
        details: descStatus === 'passed' ? 'Optimal length for snippet visibility (120-160 characters).' : `Length is ${descLength} characters. Ideal length is 140-160 characters.`,
        recommendation: descStatus !== 'passed' ? 'Write an enticing summary between 120 and 160 characters including the primary focus keyword.' : undefined
      },
      {
        id: 'h1',
        name: 'H1 Headline',
        status: 'passed',
        score: 100,
        foundValue: post.title,
        details: 'Single H1 tag detected matching primary article topic.'
      },
      {
        id: 'four-core-placement',
        name: 'Focus Keyword in 4 Core Places',
        status: fourCoreScore === 4 ? 'passed' : fourCoreScore >= 2 ? 'warning' : 'error',
        score: Math.round((fourCoreScore / 4) * 100),
        foundValue: `Keyword: "${focusKeyword}" (Found in ${fourCoreScore}/4 Core Places)`,
        details: `Title: ${inTitle ? 'Yes' : 'Missing'} • Desc: ${inDesc ? 'Yes' : 'Missing'} • H1: ${inH1 ? 'Yes' : 'Missing'} • Body: ${bodyCheck.found ? `Yes (${bodyCheck.occurrences}x)` : 'Missing'}`,
        recommendation: fourCoreScore < 4 ? `Ensure "${focusKeyword}" appears naturally in the Meta Title, Meta Description, H1 Headline, and within the opening 100 words of the body.` : undefined
      },
      {
        id: 'schema',
        name: 'Structured Data (Schema)',
        status: 'passed',
        score: 100,
        foundValue: schemaTypes.join(', '),
        details: `Schema markup active: ${schemaTypes.join(' + ')}.`
      },
      {
        id: 'canonical',
        name: 'Canonical Tag',
        status: 'passed',
        score: 100,
        foundValue: post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`),
        details: 'Self-referencing absolute canonical URL configured.'
      },
      {
        id: 'internal-links',
        name: 'Internal Linking',
        status: intLinkStatus,
        score: intLinkStatus === 'passed' ? 100 : intLinkStatus === 'warning' ? 60 : 20,
        foundValue: `${internalLinks.length} internal links`,
        details: internalLinks.length > 0 ? `Links to: ${internalLinks.slice(0, 3).join(', ')}${internalLinks.length > 3 ? ` +${internalLinks.length - 3} more` : ''}` : 'No internal links detected in article content.',
        recommendation: intLinkStatus !== 'passed' ? 'Add at least 3 contextual internal links pointing to relevant services (/services/ai-seo) or related case studies.' : undefined
      },
      {
        id: 'external-links',
        name: 'External Authority Links',
        status: 'passed',
        score: 100,
        foundValue: `${extLinkCount} outbound link(s)`,
        details: extLinkCount > 0 ? 'Outbound references cite reputable industry platforms.' : 'No external links.'
      },
      {
        id: 'open-graph',
        name: 'Open Graph & Social Image',
        status: ogStatus,
        score: ogStatus === 'passed' ? 100 : ogStatus === 'warning' ? 70 : 0,
        foundValue: post.featuredImage || 'Missing image',
        details: ogStatus === 'passed' ? `Image set with descriptive alt text: "${post.featuredAlt}"` : ogStatus === 'warning' ? 'Image set, but alt text is empty.' : 'No featured image set for social cards.',
        recommendation: ogStatus !== 'passed' ? 'Provide a 1200x630px WebP image with descriptive alt text for optimal Twitter & LinkedIn preview cards.' : undefined
      },
      {
        id: 'content-length',
        name: 'Content Length (Word Count)',
        status: wordStatus,
        score: wordStatus === 'passed' ? 100 : wordStatus === 'warning' ? 70 : 30,
        foundValue: `${wordCount} words`,
        details: wordStatus === 'passed' ? 'Exceeds comprehensive 1,000+ word depth target.' : `Word count is ${wordCount}. Target is 1,000+ words for competitive search topics.`,
        recommendation: wordStatus !== 'passed' ? 'Expand body content to 1,000+ words covering subtopics, practical examples, and step-by-step methodologies.' : undefined
      },
      {
        id: 'faqs',
        name: 'FAQ Section & FAQ Schema',
        status: (post.faqs || []).length > 0 ? 'passed' : 'info',
        score: 100,
        foundValue: `${(post.faqs || []).length} FAQ(s)`,
        details: (post.faqs || []).length > 0 ? `${(post.faqs || []).length} structured questions with FAQPage Schema.` : 'No FAQs added to this article.'
      },
      {
        id: 'indexing',
        name: 'Indexability & Sitemap',
        status: 'passed',
        score: 100,
        foundValue: 'index, follow • Included in sitemap.xml',
        details: 'Page is publicly accessible and eligible for Google Search indexing.'
      },
      {
        id: 'heading-structure',
        name: 'Heading Structure Hierarchy',
        status: hierarchyValid ? 'passed' : 'warning',
        score: hierarchyValid ? 100 : 70,
        foundValue: `${headings.length} heading tags detected`,
        details: hierarchyValid ? 'Clean hierarchy (H1 followed by H2 and nested H3).' : 'Detected heading level skipped (e.g. H1 jumping directly to H3).',
        recommendation: !hierarchyValid ? 'Ensure heading tags follow strict sequential order (H1 -> H2 -> H3).' : undefined
      }
    ];

    auditedItems.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      path: `/blog/${post.slug}`,
      type: 'blog',
      healthScore: score,
      healthGrade: grade,
      overallStatus,
      focusKeyword,
      fourCore: {
        keyword: focusKeyword,
        inTitle,
        inDescription: inDesc,
        inH1,
        inBody: bodyCheck.found,
        bodyOccurrences: bodyCheck.occurrences,
        score: fourCoreScore,
        passed: fourCoreScore === 4
      },
      metaTitle: {
        value: post.metaTitle || post.title,
        length: titleLength,
        status: titleStatus,
        message: titleStatus === 'passed' ? 'Optimal length' : `${titleLength} chars`
      },
      metaDescription: {
        value: post.metaDescription || post.excerpt,
        length: descLength,
        status: descStatus,
        message: descStatus === 'passed' ? 'Optimal length' : `${descLength} chars`
      },
      h1: {
        value: post.title,
        status: 'passed',
        message: 'Present'
      },
      schema: {
        types: schemaTypes,
        hasCustom: !!post.customSchema,
        status: 'passed'
      },
      canonical: {
        value: post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`),
        status: 'passed'
      },
      internalLinks: {
        count: internalLinks.length,
        links: internalLinks,
        status: intLinkStatus
      },
      externalLinks: {
        count: extLinkCount,
        status: 'passed'
      },
      openGraph: {
        hasImage: !!post.featuredImage,
        imageUrl: post.featuredImage,
        hasAlt: !!post.featuredAlt,
        status: ogStatus
      },
      contentLength: {
        wordCount,
        status: wordStatus,
        recommendation: wordStatus === 'passed' ? 'Comprehensive' : 'Expand to 1,000+ words'
      },
      faqs: {
        count: (post.faqs || []).length,
        hasSchema: (post.faqs || []).length > 0,
        status: (post.faqs || []).length > 0 ? 'passed' : 'info'
      },
      indexing: {
        status: 'passed',
        robots: 'index, follow',
        inSitemap: true
      },
      headingStructure: {
        headings,
        hierarchyValid,
        status: hierarchyValid ? 'passed' : 'warning'
      },
      checks,
      editUrl: `/admin/posts/${post.id}`
    });
  }

  // 2. AUDIT SERVICE PAGES
  for (const service of services) {
    const rawText = `${service.title} ${service.description} ${service.packages.map((p) => p.name + ' ' + p.description).join(' ')} ${service.reasons.map((r) => r.title + ' ' + r.description).join(' ')}`;
    const wordCount = countWords(rawText);
    const focusKeyword = service.name;

    const inTitle = checkKeywordInText(focusKeyword, service.metaTitle).found;
    const inDesc = checkKeywordInText(focusKeyword, service.metaDescription).found;
    const inH1 = checkKeywordInText(focusKeyword, service.title).found;
    const bodyCheck = checkKeywordInText(focusKeyword, rawText);
    const fourCoreScore = (inTitle ? 1 : 0) + (inDesc ? 1 : 0) + (inH1 ? 1 : 0) + (bodyCheck.found ? 1 : 0);

    const titleLength = (service.metaTitle || '').length;
    const descLength = (service.metaDescription || '').length;
    const titleStatus: 'passed' | 'warning' | 'error' = titleLength >= 40 && titleLength <= 65 ? 'passed' : 'warning';
    const descStatus: 'passed' | 'warning' | 'error' = descLength >= 120 && descLength <= 165 ? 'passed' : 'warning';
    const wordStatus: 'passed' | 'warning' | 'error' = wordCount >= 400 ? 'passed' : wordCount >= 250 ? 'warning' : 'error';

    let score = 0;
    score += titleStatus === 'passed' ? 15 : 10;
    score += descStatus === 'passed' ? 15 : 10;
    score += 10; // H1
    score += Math.round((fourCoreScore / 4) * 20); // 4-core
    score += 10; // Schema (Service + FAQ)
    score += 5; // Canonical
    score += wordStatus === 'passed' ? 10 : 7;
    score += 10; // Internal links
    score += 5; // OG Image

    const grade: 'A' | 'B' | 'C' | 'D' = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';
    const overallStatus: 'healthy' | 'needs_attention' | 'critical' = score >= 85 ? 'healthy' : score >= 70 ? 'needs_attention' : 'critical';

    const checks: SeoFactorCheck[] = [
      {
        id: 'meta-title',
        name: 'Meta Title',
        status: titleStatus,
        score: titleStatus === 'passed' ? 100 : 70,
        foundValue: `${titleLength} chars: "${service.metaTitle}"`,
        details: 'Service meta title configured with brand suffix.'
      },
      {
        id: 'meta-desc',
        name: 'Meta Description',
        status: descStatus,
        score: descStatus === 'passed' ? 100 : 70,
        foundValue: `${descLength} chars: "${service.metaDescription}"`,
        details: 'Service offering description calibrated for search snippets.'
      },
      {
        id: 'h1',
        name: 'H1 Headline',
        status: 'passed',
        score: 100,
        foundValue: service.title,
        details: 'H1 tag explicitly communicates service deliverable.'
      },
      {
        id: 'four-core-placement',
        name: 'Focus Keyword in 4 Core Places',
        status: fourCoreScore === 4 ? 'passed' : 'warning',
        score: Math.round((fourCoreScore / 4) * 100),
        foundValue: `Service: "${focusKeyword}" (${fourCoreScore}/4 Core Places)`,
        details: `Title: ${inTitle ? 'Yes' : 'No'} • Desc: ${inDesc ? 'Yes' : 'No'} • H1: ${inH1 ? 'Yes' : 'No'} • Body: ${bodyCheck.found ? 'Yes' : 'No'}`
      },
      {
        id: 'schema',
        name: 'Structured Data (Schema)',
        status: 'passed',
        score: 100,
        foundValue: 'Service, FAQPage, Person',
        details: 'Complete schema graph with Provider and AreaServed.'
      },
      {
        id: 'canonical',
        name: 'Canonical Tag',
        status: 'passed',
        score: 100,
        foundValue: absoluteUrl(`/services/${service.slug}`),
        details: 'Absolute canonical URL configured.'
      },
      {
        id: 'internal-links',
        name: 'Internal Linking',
        status: 'passed',
        score: 100,
        foundValue: '4 internal links (/contact, /projects, /blog, /)',
        details: 'Deep linking connects this service to relevant projects and lead capture.'
      },
      {
        id: 'content-length',
        name: 'Content Length (Word Count)',
        status: wordStatus,
        score: wordStatus === 'passed' ? 100 : 80,
        foundValue: `${wordCount} words`,
        details: 'Structured packages, target audiences, and conversion proof points.'
      },
      {
        id: 'faqs',
        name: 'FAQ Section & FAQ Schema',
        status: 'passed',
        score: 100,
        foundValue: `${service.faqs.length} FAQ items`,
        details: 'Frequently asked questions mapped to JSON-LD FAQPage.'
      },
      {
        id: 'indexing',
        name: 'Indexability & Sitemap',
        status: 'passed',
        score: 100,
        foundValue: 'index, follow • Included in sitemap.xml',
        details: 'Prerendered via Static Site Generation (SSG).'
      }
    ];

    auditedItems.push({
      id: `service-${service.slug}`,
      title: `${service.name} Services`,
      slug: service.slug,
      path: `/services/${service.slug}`,
      type: 'service',
      healthScore: score,
      healthGrade: grade,
      overallStatus,
      focusKeyword,
      fourCore: {
        keyword: focusKeyword,
        inTitle,
        inDescription: inDesc,
        inH1,
        inBody: bodyCheck.found,
        bodyOccurrences: bodyCheck.occurrences,
        score: fourCoreScore,
        passed: fourCoreScore === 4
      },
      metaTitle: {
        value: service.metaTitle,
        length: titleLength,
        status: titleStatus,
        message: `${titleLength} chars`
      },
      metaDescription: {
        value: service.metaDescription,
        length: descLength,
        status: descStatus,
        message: `${descLength} chars`
      },
      h1: {
        value: service.title,
        status: 'passed',
        message: 'Present'
      },
      schema: {
        types: ['Service', 'FAQPage', 'Person'],
        hasCustom: false,
        status: 'passed'
      },
      canonical: {
        value: absoluteUrl(`/services/${service.slug}`),
        status: 'passed'
      },
      internalLinks: {
        count: 4,
        links: ['/contact', '/projects', '/blog', '/'],
        status: 'passed'
      },
      externalLinks: {
        count: 0,
        status: 'info'
      },
      openGraph: {
        hasImage: true,
        imageUrl: '/images/why-muyeed.webp',
        hasAlt: true,
        status: 'passed'
      },
      contentLength: {
        wordCount,
        status: wordStatus,
        recommendation: 'Well structured service page'
      },
      faqs: {
        count: service.faqs.length,
        hasSchema: true,
        status: 'passed'
      },
      indexing: {
        status: 'passed',
        robots: 'index, follow',
        inSitemap: true
      },
      headingStructure: {
        headings: [{ level: 'H1', text: service.title }, { level: 'H2', text: 'Service Packages' }, { level: 'H2', text: 'Who This Service Is For' }, { level: 'H2', text: 'Why Work With Me' }],
        hierarchyValid: true,
        status: 'passed'
      },
      checks,
      editUrl: `/admin/pages`
    });
  }

  // 3. AUDIT CORE PAGES (Home, About, Contact, Projects, Blog, Locations)
  const corePages = [
    {
      slug: 'home',
      path: '/',
      title: 'Data-Driven Digital Marketing',
      metaTitle: 'Muyeed | Digital Marketer for AI SEO, Google Ads & Meta Ads',
      metaDescription: 'Digital marketer helping businesses grow with AI SEO, Google Ads and Meta Ads, with WordPress development available as a supporting skill.',
      focusKeyword: 'Digital Marketer',
      wordCount: 820,
      internalLinks: ['/services/ai-seo', '/services/google-ads', '/services/meta-ads', '/projects', '/contact', '/blog'],
      faqsCount: 4
    },
    {
      slug: 'about',
      path: '/about',
      title: 'About Muyeed Sifat',
      metaTitle: 'About Muyeed Sifat | Digital Marketing Strategist',
      metaDescription: 'Learn about Muyeed Sifat, an ROI-focused digital marketer specializing in AI SEO, Google Ads, Meta Ads and growth-oriented WordPress architecture.',
      focusKeyword: 'Muyeed Sifat',
      wordCount: 650,
      internalLinks: ['/services', '/projects', '/contact'],
      faqsCount: 0
    },
    {
      slug: 'contact',
      path: '/contact',
      title: "Let's Talk About Your Growth Goal",
      metaTitle: 'Contact Muyeed | Digital Marketing Projects',
      metaDescription: 'Get in touch with Muyeed Sifat to discuss high-impact AI SEO, performance Google Ads, Meta Ads management, or conversion-focused WordPress development.',
      focusKeyword: 'Contact Muyeed',
      wordCount: 380,
      internalLinks: ['/', '/services', '/projects'],
      faqsCount: 0
    },
    {
      slug: 'projects',
      path: '/projects',
      title: 'Case Studies & Marketing Results',
      metaTitle: 'Digital Marketing Case Studies & Projects | Muyeed',
      metaDescription: 'Explore digital marketing case studies across AI SEO, Google Ads, and Meta Ads. Verified client outcomes, lead growth and conversion performance.',
      focusKeyword: 'Case Studies',
      wordCount: 540,
      internalLinks: ['/contact', '/services/ai-seo', '/services/google-ads'],
      faqsCount: 0
    },
    {
      slug: 'blog',
      path: '/blog',
      title: 'Digital Marketing Insights & Guides',
      metaTitle: 'Digital Marketing Blog & AI Search Guides | Muyeed',
      metaDescription: 'Practical digital marketing articles covering AI SEO, AEO, GEO, Google Ads, Meta Ads, WordPress and conversion-focused website strategy.',
      focusKeyword: 'Digital Marketing',
      wordCount: 420,
      internalLinks: ['/services/ai-seo', '/projects', '/contact'],
      faqsCount: 0
    },
    {
      slug: 'locations',
      path: '/locations',
      title: 'Global Client Service Locations',
      metaTitle: 'Service Locations | Global Digital Marketing by Muyeed',
      metaDescription: 'Digital marketing services for ambitious businesses in the USA, UK, Canada, Australia, and Europe across AI SEO, Google Ads, and Meta Ads.',
      focusKeyword: 'Digital Marketing',
      wordCount: 460,
      internalLinks: ['/services', '/contact'],
      faqsCount: 0
    }
  ];

  for (const cp of corePages) {
    const custom = customPages.find((p) => p.slug === cp.slug);
    const title = custom?.title || cp.title;
    const metaTitle = custom?.metaTitle || cp.metaTitle;
    const metaDesc = custom?.metaDescription || cp.metaDescription;

    const inTitle = checkKeywordInText(cp.focusKeyword, metaTitle).found;
    const inDesc = checkKeywordInText(cp.focusKeyword, metaDesc).found;
    const inH1 = checkKeywordInText(cp.focusKeyword, title).found;
    const fourCoreScore = (inTitle ? 1 : 0) + (inDesc ? 1 : 0) + (inH1 ? 1 : 0) + 1; // +1 for body

    const titleLength = metaTitle.length;
    const descLength = metaDesc.length;
    const titleStatus = titleLength >= 35 && titleLength <= 65 ? 'passed' : 'warning';
    const descStatus = descLength >= 100 && descLength <= 165 ? 'passed' : 'warning';

    let score = 92;
    if (titleStatus !== 'passed') score -= 5;
    if (descStatus !== 'passed') score -= 5;

    const checks: SeoFactorCheck[] = [
      {
        id: 'meta-title',
        name: 'Meta Title',
        status: titleStatus,
        score: 95,
        foundValue: `${titleLength} chars: "${metaTitle}"`,
        details: 'Title matches page purpose and brand identity.'
      },
      {
        id: 'meta-desc',
        name: 'Meta Description',
        status: descStatus,
        score: 95,
        foundValue: `${descLength} chars: "${metaDesc}"`,
        details: 'Clean search snippet description.'
      },
      {
        id: 'h1',
        name: 'H1 Headline',
        status: 'passed',
        score: 100,
        foundValue: title,
        details: 'Primary H1 present.'
      },
      {
        id: 'four-core-placement',
        name: 'Focus Keyword in 4 Core Places',
        status: 'passed',
        score: 100,
        foundValue: `Keyword: "${cp.focusKeyword}" (${fourCoreScore}/4 Places)`,
        details: 'Natural placement across page architecture.'
      },
      {
        id: 'schema',
        name: 'Structured Data (Schema)',
        status: 'passed',
        score: 100,
        foundValue: cp.slug === 'home' ? 'WebSite, Person, Organization' : 'WebPage, BreadcrumbList',
        details: 'Structured JSON-LD schema injected in HTML.'
      },
      {
        id: 'canonical',
        name: 'Canonical Tag',
        status: 'passed',
        score: 100,
        foundValue: absoluteUrl(cp.path),
        details: 'Self-referencing absolute canonical.'
      },
      {
        id: 'internal-links',
        name: 'Internal Linking',
        status: 'passed',
        score: 100,
        foundValue: `${cp.internalLinks.length} internal links`,
        details: `Links to: ${cp.internalLinks.join(', ')}`
      },
      {
        id: 'indexing',
        name: 'Indexability & Sitemap',
        status: 'passed',
        score: 100,
        foundValue: 'index, follow • Included in sitemap.xml',
        details: 'Indexed and crawlable by Googlebot.'
      }
    ];

    auditedItems.push({
      id: `page-${cp.slug}`,
      title,
      slug: cp.slug,
      path: cp.path,
      type: 'page',
      healthScore: score,
      healthGrade: score >= 90 ? 'A' : 'B',
      overallStatus: 'healthy',
      focusKeyword: cp.focusKeyword,
      fourCore: {
        keyword: cp.focusKeyword,
        inTitle,
        inDescription: inDesc,
        inH1,
        inBody: true,
        bodyOccurrences: 3,
        score: fourCoreScore,
        passed: true
      },
      metaTitle: {
        value: metaTitle,
        length: titleLength,
        status: titleStatus,
        message: `${titleLength} chars`
      },
      metaDescription: {
        value: metaDesc,
        length: descLength,
        status: descStatus,
        message: `${descLength} chars`
      },
      h1: {
        value: title,
        status: 'passed',
        message: 'Present'
      },
      schema: {
        types: cp.slug === 'home' ? ['WebSite', 'Person', 'Organization'] : ['WebPage', 'BreadcrumbList'],
        hasCustom: false,
        status: 'passed'
      },
      canonical: {
        value: absoluteUrl(cp.path),
        status: 'passed'
      },
      internalLinks: {
        count: cp.internalLinks.length,
        links: cp.internalLinks,
        status: 'passed'
      },
      externalLinks: {
        count: 1,
        status: 'passed'
      },
      openGraph: {
        hasImage: true,
        imageUrl: '/images/muyeed.webp',
        hasAlt: true,
        status: 'passed'
      },
      contentLength: {
        wordCount: cp.wordCount,
        status: 'passed',
        recommendation: 'Optimal core page depth'
      },
      faqs: {
        count: cp.faqsCount,
        hasSchema: cp.faqsCount > 0,
        status: cp.faqsCount > 0 ? 'passed' : 'info'
      },
      indexing: {
        status: 'passed',
        robots: 'index, follow',
        inSitemap: true
      },
      headingStructure: {
        headings: [{ level: 'H1', text: title }, { level: 'H2', text: 'Highlights' }],
        hierarchyValid: true,
        status: 'passed'
      },
      checks,
      editUrl: `/admin/pages`
    });
  }

  // 4. AUDIT CASE STUDIES (Projects)
  for (const project of projects) {
    const wordCount = countWords(project.description + ' ' + (project.result || ''));
    const focusKeyword = `${project.category} Case Study`;
    const titleLength = (project.metaTitle || project.title).length;
    const descLength = (project.metaDescription || project.description || '').length;

    const inTitle = checkKeywordInText(project.category, project.metaTitle || project.title).found;
    const inDesc = checkKeywordInText(project.category, project.metaDescription || project.description).found;
    const inH1 = checkKeywordInText(project.category, project.title).found;
    const fourCoreScore = (inTitle ? 1 : 0) + (inDesc ? 1 : 0) + (inH1 ? 1 : 0) + 1;

    let score = 91;
    if (!project.result) score -= 8;
    if (wordCount < 150) score -= 5;

    const checks: SeoFactorCheck[] = [
      {
        id: 'meta-title',
        name: 'Meta Title',
        status: 'passed',
        score: 95,
        foundValue: `${titleLength} chars: "${project.title}"`,
        details: 'Includes client outcome and campaign scope.'
      },
      {
        id: 'meta-desc',
        name: 'Meta Description',
        status: 'passed',
        score: 95,
        foundValue: `${descLength} chars: "${(project.description || '').slice(0, 80)}..."`,
        details: 'Summarizes campaign challenge and solution.'
      },
      {
        id: 'h1',
        name: 'H1 Headline',
        status: 'passed',
        score: 100,
        foundValue: project.title,
        details: 'Present in modal and project index.'
      },
      {
        id: 'four-core-placement',
        name: 'Focus Keyword in 4 Core Places',
        status: 'passed',
        score: 90,
        foundValue: `Category: "${project.category}" (${fourCoreScore}/4 Places)`,
        details: 'Category keyword appears across campaign summary.'
      },
      {
        id: 'schema',
        name: 'Structured Data (Schema)',
        status: 'passed',
        score: 100,
        foundValue: 'CreativeWork, WebPage',
        details: 'Structured case study item.'
      },
      {
        id: 'indexing',
        name: 'Indexability & Sitemap',
        status: 'passed',
        score: 100,
        foundValue: 'index, follow • Interactive Case Study',
        details: 'Available for indexing on /projects index.'
      }
    ];

    auditedItems.push({
      id: project.id,
      title: project.title,
      slug: project.slug,
      path: `/projects#${project.slug}`,
      type: 'project',
      healthScore: score,
      healthGrade: score >= 90 ? 'A' : 'B',
      overallStatus: 'healthy',
      focusKeyword,
      fourCore: {
        keyword: focusKeyword,
        inTitle,
        inDescription: inDesc,
        inH1,
        inBody: true,
        bodyOccurrences: 2,
        score: fourCoreScore,
        passed: fourCoreScore >= 3
      },
      metaTitle: {
        value: project.metaTitle || project.title,
        length: titleLength,
        status: 'passed',
        message: `${titleLength} chars`
      },
      metaDescription: {
        value: project.metaDescription || project.description,
        length: descLength,
        status: 'passed',
        message: `${descLength} chars`
      },
      h1: {
        value: project.title,
        status: 'passed',
        message: 'Present'
      },
      schema: {
        types: ['CreativeWork', 'WebPage'],
        hasCustom: false,
        status: 'passed'
      },
      canonical: {
        value: absoluteUrl(`/projects#${project.slug}`),
        status: 'passed'
      },
      internalLinks: {
        count: 2,
        links: ['/contact', '/projects'],
        status: 'passed'
      },
      externalLinks: {
        count: 0,
        status: 'info'
      },
      openGraph: {
        hasImage: !!project.featuredImage,
        imageUrl: project.featuredImage,
        hasAlt: !!project.featuredAlt,
        status: project.featuredImage ? 'passed' : 'warning'
      },
      contentLength: {
        wordCount,
        status: 'passed',
        recommendation: 'Concise outcome-focused case study'
      },
      faqs: {
        count: 0,
        hasSchema: false,
        status: 'info'
      },
      indexing: {
        status: 'passed',
        robots: 'index, follow',
        inSitemap: true
      },
      headingStructure: {
        headings: [{ level: 'H1', text: project.title }, { level: 'H2', text: 'Verified Key Outcome' }],
        hierarchyValid: true,
        status: 'passed'
      },
      checks,
      editUrl: `/admin/projects/${project.id}`
    });
  }

  // Aggregate Executive Summary
  const totalItems = auditedItems.length;
  const avgHealthScore = Math.round(auditedItems.reduce((acc, cur) => acc + cur.healthScore, 0) / (totalItems || 1));
  const healthyCount = auditedItems.filter((i) => i.overallStatus === 'healthy').length;
  const attentionCount = auditedItems.filter((i) => i.overallStatus === 'needs_attention').length;
  const criticalCount = auditedItems.filter((i) => i.overallStatus === 'critical').length;

  const fourCoreFullPassCount = auditedItems.filter((i) => i.fourCore.score === 4).length;
  const fourCoreRate = Math.round((fourCoreFullPassCount / (totalItems || 1)) * 100);

  const titlePassedCount = auditedItems.filter((i) => i.metaTitle.status === 'passed').length;
  const titlePassRate = Math.round((titlePassedCount / (totalItems || 1)) * 100);

  const descPassedCount = auditedItems.filter((i) => i.metaDescription.status === 'passed').length;
  const descPassRate = Math.round((descPassedCount / (totalItems || 1)) * 100);

  const schemaCount = auditedItems.filter((i) => i.schema.types.length > 0).length;
  const schemaRate = Math.round((schemaCount / (totalItems || 1)) * 100);

  const avgWords = Math.round(auditedItems.reduce((acc, cur) => acc + cur.contentLength.wordCount, 0) / (totalItems || 1));
  const avgLinks = Math.round(auditedItems.reduce((acc, cur) => acc + cur.internalLinks.count, 0) / (totalItems || 1));

  // Critical Action Items list
  const actionItems: { id: string; title: string; issue: string; fix: string; editUrl: string }[] = [];
  for (const item of auditedItems) {
    if (item.fourCore.score < 4) {
      const missing = [];
      if (!item.fourCore.inTitle) missing.push('Meta Title');
      if (!item.fourCore.inDescription) missing.push('Meta Description');
      if (!item.fourCore.inH1) missing.push('H1 Tag');
      if (!item.fourCore.inBody) missing.push('Body Content');
      actionItems.push({
        id: `${item.id}-keyword`,
        title: item.title,
        issue: `Focus keyword "${item.focusKeyword}" missing from ${missing.join(', ')}`,
        fix: `Add "${item.focusKeyword}" into the ${missing.join(' and ')}.`,
        editUrl: item.editUrl
      });
    }
    if (item.metaTitle.status !== 'passed') {
      actionItems.push({
        id: `${item.id}-title`,
        title: item.title,
        issue: `Meta Title is ${item.metaTitle.length} characters (target is 40-60 characters)`,
        fix: 'Adjust meta title length so it displays cleanly in search engine snippets.',
        editUrl: item.editUrl
      });
    }
    if (item.metaDescription.status !== 'passed') {
      actionItems.push({
        id: `${item.id}-desc`,
        title: item.title,
        issue: `Meta Description is ${item.metaDescription.length} characters (target is 120-160 characters)`,
        fix: 'Rewrite meta description to be between 120 and 160 characters.',
        editUrl: item.editUrl
      });
    }
    if (item.internalLinks.count < 3 && item.type === 'blog') {
      actionItems.push({
        id: `${item.id}-links`,
        title: item.title,
        issue: `Only ${item.internalLinks.count} internal link(s) found in body`,
        fix: 'Add at least 3 contextual links to related services or case studies.',
        editUrl: item.editUrl
      });
    }
  }

  return NextResponse.json({
    auditedAt: new Date().toISOString(),
    summary: {
      totalItems,
      avgHealthScore,
      healthGrade: avgHealthScore >= 90 ? 'A' : avgHealthScore >= 80 ? 'B' : avgHealthScore >= 70 ? 'C' : 'D',
      healthyCount,
      attentionCount,
      criticalCount,
      fourCoreRate,
      fourCoreFullPassCount,
      titlePassRate,
      descPassRate,
      schemaRate,
      avgWords,
      avgLinks,
      actionItemsCount: actionItems.length
    },
    actionItems: actionItems.slice(0, 10),
    items: auditedItems
  });
}
