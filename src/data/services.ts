export type ServiceFaq = { question: string; answer: string };
export type ServiceData = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  metaTitle: string;
  metaDescription: string;
  packages: { label: string; name: string; description: string; featured?: boolean }[];
  audiences: string[];
  reasons: { title: string; description: string }[];
  projects: { title: string; description: string }[];
  articles: string[];
  faqs: ServiceFaq[];
  primary: boolean;
};

export const services: ServiceData[] = [
  {
    slug: 'ai-seo',
    name: 'AI SEO',
    eyebrow: 'SEO • AEO • GEO',
    title: 'AI SEO for Search and AI Visibility',
    description:
      'Build stronger visibility across Google Search, AI Overviews and answer engines with a strategy that combines technical SEO, content, authority, AEO and GEO.',
    cta: 'Improve Visibility',
    metaTitle: 'AI SEO Services for Search & AI Visibility | Muyeed',
    metaDescription:
      'AI SEO services combining SEO, AEO and GEO to improve visibility across Google Search, AI Overviews, ChatGPT, Gemini and other answer engines.',
    packages: [
      { label: 'One-Time', name: 'AI SEO Audit', description: 'Technical SEO, content, internal linking, authority and AI visibility analysis with prioritized actions.' },
      { label: 'Ongoing', name: 'Monthly AI SEO', description: 'Ongoing SEO, AEO, GEO, content optimization, technical improvements and authority growth.', featured: true },
      { label: 'Flexible', name: 'Custom AI SEO', description: 'A tailored engagement built around your site, priorities, growth targets and available resources.' }
    ],
    audiences: ['SaaS companies', 'Ecommerce brands', 'Local businesses', 'Professional services', 'Brands losing organic visibility', 'Teams targeting AI search'],
    reasons: [
      { title: 'SEO, AEO and GEO together', description: 'Traditional search and AI visibility are treated as connected parts of the same discoverability strategy.' },
      { title: 'Search intent first', description: 'Pages and content are mapped to the questions, comparisons and commercial searches that matter.' },
      { title: 'Technical foundations', description: 'Crawlability, indexation, site structure, internal links and schema are reviewed before scaling content.' },
      { title: 'Entity and authority signals', description: 'Brand clarity, topical coverage and third-party mentions support both search and answer engines.' },
      { title: 'Content built for usefulness', description: 'Content is structured to answer users directly while still supporting depth, trust and conversion.' },
      { title: 'Measurable execution', description: 'Actions are tied to visibility, rankings, organic traffic and business-relevant outcomes.' }
    ],
    projects: [
      { title: 'Organic Growth Strategy', description: 'Search strategy, content optimization and internal linking that supported substantial organic growth.' },
      { title: 'AI Visibility Optimization', description: 'Content and entity improvements designed to increase discoverability across search and AI answer experiences.' },
      { title: 'Technical SEO Cleanup', description: 'Indexation, architecture and on-page improvements to strengthen crawlability and relevance.' }
    ],
    articles: ['How Generative AI Changes Search Results', 'AEO vs GEO vs SEO', 'How to Improve Brand Visibility in AI Answers'],
    faqs: [
      { question: 'What is AI SEO?', answer: 'AI SEO combines traditional search optimization with content, entity and authority strategies that improve visibility in both search engines and AI-generated answers.' },
      { question: 'What is the difference between SEO, AEO and GEO?', answer: 'SEO focuses on organic search visibility, AEO on answer-oriented experiences, and GEO on improving how brands and content surface in generative AI systems.' },
      { question: 'Can AI SEO improve ChatGPT visibility?', answer: 'It can improve discoverability signals such as authoritative mentions, crawlable content, entity clarity and topical coverage, but no provider can guarantee inclusion in a specific AI response.' },
      { question: 'How long does AI SEO take?', answer: 'Timing depends on competition, site health, content quality, authority and the amount of implementation required.' },
      { question: 'Do I still need traditional SEO?', answer: 'Yes. Technical SEO, crawlability, indexation, content quality and authority remain foundational.' }
    ],
    primary: true
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    eyebrow: 'Paid Search',
    title: 'Google Ads Built Around Conversions',
    description:
      'Capture high-intent search demand with campaigns structured around relevant keywords, reliable measurement, controlled spend and continuous optimization.',
    cta: 'Improve PPC Performance',
    metaTitle: 'Google Ads Management Services | Muyeed',
    metaDescription:
      'Google Ads management for qualified search traffic, stronger conversion tracking, campaign optimization and better control over paid search performance.',
    packages: [
      { label: 'One-Time', name: 'Campaign Setup', description: 'Keyword research, account structure, campaign build, conversion setup and launch preparation.' },
      { label: 'Ongoing', name: 'Monthly Management', description: 'Search-term analysis, bidding review, testing, optimization, budget control and reporting.', featured: true },
      { label: 'Flexible', name: 'Google Ads Audit', description: 'A focused review of structure, search terms, tracking, ads, bidding and landing-page alignment.' }
    ],
    audiences: ['Service businesses', 'B2B companies', 'Local lead generation', 'High-intent ecommerce', 'Businesses needing immediate demand', 'Teams with underperforming accounts'],
    reasons: [
      { title: 'Intent-led keyword strategy', description: 'Campaigns are organized around commercial intent instead of broad traffic volume.' },
      { title: 'Search term control', description: 'Query analysis and negative keywords help reduce irrelevant spend.' },
      { title: 'Conversion tracking', description: 'Optimization decisions need reliable conversion data and clearly defined actions.' },
      { title: 'Ad copy testing', description: 'Messaging can be tested around offer, intent and landing-page alignment.' },
      { title: 'Budget and bidding review', description: 'Spend is monitored against campaign priorities and available conversion data.' },
      { title: 'Landing-page alignment', description: 'WordPress skills are useful when the ad click experience needs a stronger landing page.' }
    ],
    projects: [
      { title: 'Search Campaign Restructure', description: 'Campaign architecture rebuilt around high-intent themes, tighter ad groups and cleaner measurement.' },
      { title: 'Lead Generation PPC', description: 'Paid search strategy aligned with commercial queries, conversion actions and landing pages.' },
      { title: 'Search-Term Cleanup', description: 'Query review and negative keyword controls designed to reduce irrelevant clicks and wasted spend.' }
    ],
    articles: ['How to Structure Google Ads Campaigns', 'High-Intent Keyword Research for PPC', 'Landing Page Alignment for Google Ads'],
    faqs: [
      { question: 'What does Google Ads management include?', answer: 'Campaign structure, keyword strategy, ad copy, negative keywords, conversion tracking, ongoing optimization and performance reporting.' },
      { question: 'Can you improve an existing Google Ads account?', answer: 'Yes. Existing accounts can be audited, cleaned up and restructured before ongoing optimization.' },
      { question: 'Do you guarantee a specific ROAS?', answer: 'No. Performance depends on competition, offer strength, landing pages, tracking quality, budget and market conditions.' },
      { question: 'Do you set up conversion tracking?', answer: 'Conversion measurement can be included where account access and technical setup allow it.' },
      { question: 'Can Google Ads work with SEO?', answer: 'Yes. Paid search can capture immediate demand while SEO builds longer-term organic visibility.' }
    ],
    primary: true
  },
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    eyebrow: 'Facebook • Instagram',
    title: 'Meta Ads That Reach the Right Audience',
    description:
      'Build Facebook and Instagram campaigns around audience targeting, creative testing, retargeting and clear conversion goals.',
    cta: 'Launch Better Campaigns',
    metaTitle: 'Meta Ads Management for Facebook & Instagram | Muyeed',
    metaDescription:
      'Meta Ads management for Facebook and Instagram with audience strategy, creative testing, retargeting and conversion-focused campaign optimization.',
    packages: [
      { label: 'One-Time', name: 'Campaign Setup', description: 'Audience planning, campaign structure, tracking checks, ad setup and launch preparation.' },
      { label: 'Ongoing', name: 'Monthly Management', description: 'Creative testing, audience refinement, retargeting, budget optimization and reporting.', featured: true },
      { label: 'Flexible', name: 'Meta Ads Audit', description: 'A focused review of audiences, creatives, campaign structure, tracking and funnel alignment.' }
    ],
    audiences: ['Ecommerce brands', 'Local businesses', 'Lead generation companies', 'Personal brands', 'Product launches', 'Retargeting campaigns'],
    reasons: [
      { title: 'Audience segmentation', description: 'Campaigns are structured around audience intent, stage and available first-party data.' },
      { title: 'Creative testing', description: 'Hooks, formats and messages are tested systematically instead of changing everything at once.' },
      { title: 'Retargeting strategy', description: 'Warm audiences can be re-engaged based on meaningful site or content behavior.' },
      { title: 'Conversion focus', description: 'Campaign goals and tracking are aligned with actions that matter to the business.' },
      { title: 'Budget discipline', description: 'Spend is allocated based on campaign goals, data quality and testing priorities.' },
      { title: 'Landing-page support', description: 'When needed, WordPress landing pages can be improved to support the paid social funnel.' }
    ],
    projects: [
      { title: 'Retargeting Funnel', description: 'Audience segmentation and retargeting setup designed to create a clearer follow-up path.' },
      { title: 'Creative Testing Campaign', description: 'Structured testing across hooks, formats and offers for stronger learning and iteration.' },
      { title: 'Lead Generation Campaign', description: 'Audience and campaign structure aligned to lead quality rather than reach alone.' }
    ],
    articles: ['Meta Ads Audience Testing Framework', 'How to Build Better Retargeting Campaigns', 'Creative Testing for Facebook and Instagram'],
    faqs: [
      { question: 'What platforms are included in Meta Ads?', answer: 'Meta Ads typically covers Facebook and Instagram placements managed through Meta Ads Manager.' },
      { question: 'Do you create ad creatives?', answer: 'Creative strategy and direction can be included. Final design production depends on the agreed scope.' },
      { question: 'Can you run lead generation campaigns?', answer: 'Yes. Meta can be used for lead forms, landing-page campaigns, retargeting and offer promotion.' },
      { question: 'How many audiences should be tested?', answer: 'The right number depends on budget, market size, offer and the amount of usable data.' },
      { question: 'Do you manage retargeting?', answer: 'Yes. Retargeting can be included in both campaign setup and monthly management.' }
    ],
    primary: true
  },
  {
    slug: 'wordpress-development',
    name: 'WordPress Development',
    eyebrow: 'Supporting Skill',
    title: 'WordPress Support for Better Marketing',
    description:
      'When the website becomes the bottleneck, I can build or improve WordPress pages that support SEO, paid campaigns and conversion goals.',
    cta: 'Improve Your Website',
    metaTitle: 'WordPress Development for Marketing Websites | Muyeed',
    metaDescription:
      'WordPress development for service websites and landing pages with responsive layouts, SEO-ready structure, performance awareness and conversion-focused design.',
    packages: [
      { label: 'One-Time', name: 'Website Build', description: 'Responsive WordPress website with core pages, SEO-ready structure and conversion-focused layouts.' },
      { label: 'Ongoing', name: 'Monthly Support', description: 'Content updates, landing pages, layout changes, maintenance and performance improvements.', featured: true },
      { label: 'Flexible', name: 'Landing Page Project', description: 'Focused WordPress landing pages built to support paid campaigns or organic search goals.' }
    ],
    audiences: ['Service businesses', 'Personal brands', 'New businesses', 'Marketing teams', 'Companies redesigning older sites', 'Campaigns needing better landing pages'],
    reasons: [
      { title: 'Marketing-first structure', description: 'Pages are designed around the traffic source, user intent and next conversion step.' },
      { title: 'Elementor-friendly builds', description: 'Layouts remain practical to edit and maintain without unnecessary custom-code dependency.' },
      { title: 'Responsive layouts', description: 'Desktop, tablet and mobile experiences are treated as part of the same conversion path.' },
      { title: 'SEO-ready foundations', description: 'Semantic structure, metadata, internal links and performance considerations are built in.' },
      { title: 'Performance awareness', description: 'Image handling, page weight and unnecessary plugins are considered during implementation.' },
      { title: 'Supports paid media', description: 'Landing pages can be aligned to Google Ads and Meta Ads campaigns when needed.' }
    ],
    projects: [
      { title: 'Service Business Website', description: 'Responsive website structure designed around clear services, search intent and lead generation.' },
      { title: 'Portfolio Website', description: 'Professional personal-brand website with reusable sections and easier content management.' },
      { title: 'Campaign Landing Page', description: 'Focused landing page built around message match, credibility and a clear call to action.' }
    ],
    articles: ['WordPress Speed Optimization Checklist', 'How to Structure a Service Website for SEO', 'Elementor Design Practices for Better Conversions'],
    faqs: [
      { question: 'Do you build with Elementor?', answer: 'Yes. Elementor can be used so the site remains easy to edit with drag-and-drop controls.' },
      { question: 'Will the website be mobile responsive?', answer: 'Yes. Layouts are planned for desktop, tablet and mobile breakpoints.' },
      { question: 'Can you redesign an existing WordPress site?', answer: 'Yes. Redesigns can improve structure, messaging, usability and conversion paths.' },
      { question: 'Do you include SEO setup?', answer: 'Core on-page SEO structure can be included, while deeper SEO work can be added through the AI SEO service.' },
      { question: 'Do you provide maintenance?', answer: 'Yes. Monthly support can cover updates, content changes, landing pages and ongoing improvements.' }
    ],
    primary: false
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
