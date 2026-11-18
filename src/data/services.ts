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
  packages: { label: string; name: string; description: string; featured?: boolean; features: string[] }[];
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
      {
        label: 'One-Time',
        name: 'AI SEO Audit',
        description: 'Technical SEO, content, internal linking, authority and AI visibility analysis with prioritized actions.',
        features: [
          'Full technical & indexation audit',
          'AEO & GEO answer readiness review',
          'Entity & topical coverage gaps',
          'Prioritized action roadmap'
        ]
      },
      {
        label: 'Ongoing',
        name: 'Monthly AI SEO',
        description: 'Ongoing SEO, AEO, GEO, content optimization, technical improvements and authority growth.',
        featured: true,
        features: [
          'Continuous SEO, AEO & GEO execution',
          'Topical authority & content tuning',
          'Internal linking & schema updates',
          'Monthly ranking & organic reporting'
        ]
      },
      {
        label: 'Flexible',
        name: 'Custom AI SEO',
        description: 'A tailored engagement built around your site, priorities, growth targets and available resources.',
        features: [
          'Tailored cross-channel strategy',
          'Custom technical sprint deliverables',
          'Competitive entity positioning',
          'Dedicated growth milestone tracking'
        ]
      }
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
      { title: "Hunt's Custom Cargo – AI SEO, AEO & GEO Growth", description: 'Scaled commercial trailer manufacturer from regional obscurity to 12.6K organic clicks, 400K impressions, and #1 AI Overview citations.' },
      { title: 'Black Magic Tan Australia – AEO & AI Overviews Placement', description: 'Earned featured product citation inside Google AI Overviews and secured #1 Local Pack positioning across Australian metro areas.' },
      { title: 'Ubiz Floral & Decor – Wedding Decor E-Commerce & AEO', description: 'Captured top transactional rankings for wedding candelabras and high-volume conversational AEO sizing queries.' }
    ],
    articles: ['Generative AI Search: How AI Changes Search Results', 'AEO vs GEO vs SEO: Complete Optimization Framework', 'High Intent PPC Keywords: Commercial Search Research'],
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
    metaTitle: 'Google Ads Management Services & Paid Search | Muyeed',
    metaDescription:
      'Google Ads management for qualified search traffic, stronger conversion tracking, campaign optimization and better control over paid search performance.',
    packages: [
      {
        label: 'One-Time',
        name: 'Campaign Setup',
        description: 'Keyword research, account structure, campaign build, conversion setup and launch preparation.',
        features: [
          'Commercial intent keyword research',
          'Targeted ad group architecture',
          'Server-side & GA4 conversion tracking',
          'Compelling responsive search ads'
        ]
      },
      {
        label: 'Ongoing',
        name: 'Monthly Management',
        description: 'Search-term analysis, bidding review, testing, optimization, budget control and reporting.',
        featured: true,
        features: [
          'Daily search query & negative control',
          'Smart bidding & budget optimization',
          'Continuous copy & asset A/B testing',
          'Transparent conversion & ROI reports'
        ]
      },
      {
        label: 'Flexible',
        name: 'Google Ads Audit',
        description: 'A focused review of structure, search terms, tracking, ads, bidding and landing-page alignment.',
        features: [
          'Wasted ad spend analysis',
          'Search term & query intent audit',
          'Conversion tag troubleshooting',
          'Clear restructuring roadmap'
        ]
      }
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
      { title: 'Search Campaign Restructure & Intent Alignment', description: 'Rebuilt account structure around commercial intent themes, reducing cost-per-acquisition by 34% while lifting qualified leads by 62%.' },
      { title: 'Elite Bath Solutions – Local Intent Conversion Strategy', description: 'Captured high-ticket local bathroom remodeling search volume with tightly aligned ad assets and landing-page message matching.' },
      { title: 'Admeth Industrial – Singapore B2B Search Dominance', description: 'Engineered high-intent B2B search campaigns connecting enterprise engineering buyers with precision industrial heat exchanger units.' }
    ],
    articles: ['Google Ads Campaign Structure for Maximum Conversions', 'High Intent PPC Keywords: Commercial Search Research', 'AEO vs GEO vs SEO: Complete Optimization Framework'],
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
      {
        label: 'One-Time',
        name: 'Campaign Setup',
        description: 'Audience planning, campaign structure, tracking checks, ad setup and launch preparation.',
        features: [
          'Audience & custom persona mapping',
          'Meta Pixel & CAPI tracking check',
          'Creative testing framework setup',
          'High-converting campaign launch'
        ]
      },
      {
        label: 'Ongoing',
        name: 'Monthly Management',
        description: 'Creative testing, audience refinement, retargeting, budget optimization and reporting.',
        featured: true,
        features: [
          'Continuous creative hook testing',
          'Warm audience & retargeting funnels',
          'Budget scaling & ROAS monitoring',
          'Detailed weekly performance insights'
        ]
      },
      {
        label: 'Flexible',
        name: 'Meta Ads Audit',
        description: 'A focused review of audiences, creatives, campaign structure, tracking and funnel alignment.',
        features: [
          'Audience overlap & fatigue audit',
          'Ad creative & hook performance check',
          'Conversion funnel bottleneck diagnosis',
          'Practical scale recommendations'
        ]
      }
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
      { title: 'Meta Ads Creative Testing & Retargeting Funnel', description: 'Engineered modular hook and format testing across Facebook & Instagram, generating 3.8x blended ROAS and reducing customer acquisition cost by 45%.' },
      { title: 'Tennis Equipment Dominance – E-Commerce Scaling', description: 'Scaled direct-to-consumer sports gear revenue through multi-stage retargeting, dynamic catalog ads, and top-of-funnel video creative sprints.' },
      { title: 'Black Magic Tan Australia – DTC Social Acquisition', description: 'Integrated Meta video hooks with search retargeting to maximize branded sales volume across competitive Australian beauty markets.' }
    ],
    articles: ['Meta Ads Audience Testing Framework for Predictable Scale', 'Google Ads Campaign Structure for Maximum Conversions', 'Generative AI Search: How AI Changes Search Results'],
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
      {
        label: 'One-Time',
        name: 'Website Build',
        description: 'Responsive WordPress website with core pages, SEO-ready structure and conversion-focused layouts.',
        features: [
          'Responsive desktop & mobile layouts',
          'Built-in technical SEO foundations',
          'Core Web Vitals & speed optimized',
          'Conversion-focused page structure'
        ]
      },
      {
        label: 'Ongoing',
        name: 'Monthly Support',
        description: 'Content updates, landing pages, layout changes, maintenance and performance improvements.',
        featured: true,
        features: [
          'High-converting landing page creation',
          'Regular security & plugin updates',
          'Speed & performance monitoring',
          'Continuous UX & conversion tweaks'
        ]
      },
      {
        label: 'Flexible',
        name: 'Landing Page Project',
        description: 'Focused WordPress landing pages built to support paid campaigns or organic search goals.',
        features: [
          'Ad-matched landing page layout',
          'Fast loading & mobile optimized',
          'Form & analytics tracking integration',
          'A/B testing ready architecture'
        ]
      }
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
      { title: 'WordPress High-Conversion Landing Page & Speed Optimization', description: 'Engineered sub-800ms load times, 99 mobile Core Web Vitals score, and lifted direct conversion rates by 42% on marketing pages.' },
      { title: "Hunt's Custom Cargo – Custom Web Architecture", description: 'Architected Elementor-backed catalog and product spec layouts with structured schema to support rapid direct quote submissions.' },
      { title: 'Ubiz Floral & Decor – Fast-Loading E-Commerce Architecture', description: 'Rebuilt heavy product gallery templates, eliminating Cumulative Layout Shift and boosting organic search interaction rates.' }
    ],
    articles: ['WordPress Speed Optimization Checklist for Peak Performance', 'Generative AI Search: How AI Changes Search Results', 'AEO vs GEO vs SEO: Complete Optimization Framework'],
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
