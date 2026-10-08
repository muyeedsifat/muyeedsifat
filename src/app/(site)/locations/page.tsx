import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Service Locations | Muyeed - AI SEO, Google Ads & Meta Ads Globally',
  description: 'Digital marketing services tailored for ambitious businesses in the USA, UK, Canada, Australia, and Europe. AI SEO, Google Ads, Meta Ads and conversion-focused web strategy.',
  path: '/locations'
});

const regions = [
  {
    code: 'USA',
    flag: '🇺🇸',
    name: 'United States',
    headline: 'High-Intent Search & AI Overviews for Competitive Markets',
    summary: 'Tailored for the world’s most competitive digital landscape. Built around commercial search intent, zero-fluff PPC campaign restructures, and emerging AI Overviews discoverability.',
    markets: 'New York, California, Texas, Florida, Chicago & Nationwide',
    services: [
      'AI SEO & GEO (Google AI Overviews & Perplexity citations)',
      'Google Ads Search Restructures & Intent Harvesting',
      'Meta Ads Creative Testing for Direct-to-Consumer & B2B',
      'High-converting landing page alignment'
    ],
    highlight: 'Deep alignment with US buyer intent, American English copywriting, and EST/PST scheduling.'
  },
  {
    code: 'UK',
    flag: '🇬🇧',
    name: 'United Kingdom',
    headline: 'High-ROI Paid Acquisition & Authority SEO',
    summary: 'Eliminating wasted ad spend in saturated UK sectors. Designed to maximize Quality Score on Google Search, build sustainable organic authority, and optimize conversion paths.',
    markets: 'London, Manchester, Birmingham, Edinburgh, Bristol & Nationwide',
    services: [
      'Search Intent Google Ads & Negative Keyword Governance',
      'Technical SEO, Entity Optimization & Schema Architecture',
      'Meta Ad Testing for UK eCommerce & Service Brands',
      'GDPR-compliant tracking and conversion attribution'
    ],
    highlight: 'Optimized for UK market dynamics, British English nuance, and GMT timezone sync.'
  },
  {
    code: 'CA',
    flag: '🇨🇦',
    name: 'Canada',
    headline: 'Multi-Province Organic Growth & PPC Expansion',
    summary: 'Strategic digital marketing addressing cross-province buyer behavior and cross-border North American expansion. Scaled for qualified lead generation and sustainable margin growth.',
    markets: 'Toronto, Vancouver, Montreal, Calgary, Ottawa & Nationwide',
    services: [
      'B2B & Retail Google Ads Campaign Scaling',
      'Local & Regional SEO for Canadian Metros',
      'Meta Ads Dynamic Product & Lead Generation Campaigns',
      'WordPress Speed & Conversion Rate Optimization'
    ],
    highlight: 'Seamless North American operational alignment and bilingual regional sensitivity.'
  },
  {
    code: 'AU',
    flag: '🇦🇺',
    name: 'Australia',
    headline: 'High-Converting Search & Social Funnels',
    summary: 'Targeting commercial search terms and social demand during Australian daylight hours. Engineered to convert competitive clicks into measurable inbound pipeline and revenue.',
    markets: 'Sydney, Melbourne, Brisbane, Perth, Adelaide & Nationwide',
    services: [
      'Direct-to-Consumer Meta Ads Scaling & Creative Testing',
      'Commercial Intent Google Search & Shopping Campaigns',
      'AI Search Visibility & Long-tail Authority SEO',
      'Fast-loading WordPress Landing Pages'
    ],
    highlight: 'Reliable asynchronous reporting, dedicated live-sync windows, and proven AU campaign success.'
  },
  {
    code: 'EU',
    flag: '🇪🇺',
    name: 'Europe',
    headline: 'Cross-Border Expansion & Multilingual Entity SEO',
    summary: 'Multi-regional search and paid advertising built for brands operating across European nations. Built on technical rigor, entity authority, and privacy-first measurement.',
    markets: 'Germany, Netherlands, Nordic Region, France, Ireland & Pan-EU',
    services: [
      'International & Multi-Regional SEO Architecture',
      'Pan-European Google Ads with Strict Geo-Targeting',
      'Conversion Rate Optimization for Multi-Currency Sites',
      'Privacy-First Analytics & Conversion Tracking'
    ],
    highlight: 'Expertise in multi-regional entity SEO, cross-border digital growth, and EU standards.'
  }
];

const collaborationPillars = [
  {
    number: '01',
    title: 'Timezone Flexibility & Async Clarity',
    text: 'Whether you are in New York, London, Toronto, Sydney, or Berlin, you receive proactive weekly Loom video walkthroughs, shared dashboards, and scheduled live video syncs during your working day.'
  },
  {
    number: '02',
    title: 'Western Market & Buyer Nuance',
    text: 'Fluent English communication and deep familiarity with commercial terminology, pricing psychology, and consumer trust triggers in the US, UK, Canada, Australia, and European markets.'
  },
  {
    number: '03',
    title: 'Direct Senior Specialist Execution',
    text: 'You work directly with me. No junior account coordinators, no telephone games, and no generic agency templates. Strategy and execution are managed cohesively.'
  },
  {
    number: '04',
    title: 'Commercial Intent & Profit Focus',
    text: 'Every optimization is tied to revenue, qualified leads, and verifiable CPA/ROAS metrics rather than vanity traffic or hollow vanity impressions.'
  }
];

const locationFaqs = [
  {
    question: 'How do you manage timezone differences for meetings and updates?',
    answer: 'I regularly coordinate with clients across EST, PST, GMT, CET, and AEST. We establish regular overlap hours for kickoff calls and sprint check-ins, supported by detailed asynchronous video walkthroughs and real-time messaging on Slack or Email.'
  },
  {
    question: 'Can I hire you through Upwork or directly with contracts?',
    answer: 'Yes. You can work with me directly via standard invoices and milestone contracts, or through my verified Upwork profile if your organization prefers escrow protection and platform billing.'
  },
  {
    question: 'How do you adapt ad copy and SEO for local regional language differences?',
    answer: 'I adjust keyword research and copywriting to match native spelling and colloquial terminology (e.g., American vs. British/Commonwealth English), local search trends, and cultural buying behavior.'
  },
  {
    question: 'Can you work alongside our existing marketing team or developers?',
    answer: 'Yes. I regularly collaborate with in-house CMOs, copywriters, and developers, providing prioritized action plans, strategic oversight, or full hands-on campaign and technical management.'
  },
  {
    question: 'What is the onboarding process for an international project?',
    answer: 'We begin with a discovery review and asset audit, set clear KPI benchmarks, establish communication channels, and typically begin campaign restructured execution within 3 to 5 business days.'
  }
];

export default function LocationsPage() {
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Locations' }]} />
          <span className="eyebrow">Global Reach • Regional Precision</span>
          <h1>Digital Marketing Services by Location</h1>
          <p className="lead">
            Partner with an experienced digital marketer delivering AI SEO, Google Ads, Meta Ads, and conversion-focused web strategy across the USA, UK, Canada, Australia, and Europe.
          </p>
          <div className="btnRow">
            <Link className="btn btnPrimary" href="/contact">
              Discuss Your Market
            </Link>
            <Link className="btn btnSecondary" href="/projects">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Global Presence Strip */}
      <section className="trust">
        <div className="container trustGrid">
          <div className="trustItem">🇺🇸 United States</div>
          <div className="trustItem">🇬🇧 United Kingdom</div>
          <div className="trustItem">🇨🇦 Canada</div>
          <div className="trustItem">🇦🇺 Australia</div>
          <div className="trustItem">🇪🇺 Europe</div>
        </div>
      </section>

      {/* Regional Deep Dive Section */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Service Regions</span>
            <h2>Tailored Strategies for High-Value Markets</h2>
            <p className="lead">
              Every market has unique competition density, buyer psychology, and search behavior. Here is how I approach each region.
            </p>
          </div>

          <div className="locationsGrid" style={{ marginTop: 42 }}>
            {regions.map((region) => (
              <article key={region.code} className="card locationCard">
                <div className="locationCardHeader">
                  <span className="locationFlag" aria-hidden="true">{region.flag}</span>
                  <div>
                    <span className="tag">{region.code}</span>
                    <h3 className="locationName">{region.name}</h3>
                  </div>
                </div>

                <h4 className="locationHeadline">{region.headline}</h4>
                <p className="locationSummary">{region.summary}</p>

                <div className="locationDetailBox">
                  <strong>Key Focus Areas:</strong>
                  <ul className="locationList">
                    {region.services.map((srv, idx) => (
                      <li key={idx}>{srv}</li>
                    ))}
                  </ul>
                </div>

                <div className="locationFooter">
                  <div className="locationMarkets">
                    <span className="locationMarketsLabel">Key Metro Markets:</span>
                    <p>{region.markets}</p>
                  </div>
                  <Link href={`/contact?region=${encodeURIComponent(region.name)}`} className="textLink">
                    Inquire for {region.name} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Global Remote Works Section */}
      <section className="section sectionSoft">
        <div className="container">
          <div className="whyLayout">
            <div>
              <span className="eyebrow">Seamless Remote Partnership</span>
              <h2>Why Global Brands Work With Me Remotely</h2>
              <p className="lead">
                Modern growth does not require an overpriced local agency. You get faster turnaround, senior-level attention, and commercial accountability.
              </p>
              <div className="reasonList">
                {collaborationPillars.map((pillar) => (
                  <div key={pillar.number} className="reason">
                    <span className="reasonNum">{pillar.number}</span>
                    <div>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card locationHighlightsCard">
              <span className="eyebrow">International Standards</span>
              <h3>Core Capabilities for Global Brands</h3>
              <ul className="locationChecklist">
                <li>
                  <strong>AI Overviews &amp; Answer Engines:</strong> Preparing content for Perplexity, Google SGE, and ChatGPT search.
                </li>
                <li>
                  <strong>Intent-Harvesting Google Ads:</strong> Eliminating unqualified clicks and reducing waste in high-CPC Western keywords.
                </li>
                <li>
                  <strong>Meta Ads Scale &amp; Creative Angles:</strong> Systematically testing ad angles, hooks, and audience segments.
                </li>
                <li>
                  <strong>Full Technical WordPress Support:</strong> Fixing landing page load times, core web vitals, and conversion funnels.
                </li>
                <li>
                  <strong>Flexible Commercial Terms:</strong> Milestone-based projects, monthly growth retainers, or Upwork contracts.
                </li>
              </ul>
              <div style={{ marginTop: 24 }}>
                <Link href="/contact" className="btn btnPrimary" style={{ width: '100%' }}>
                  Start a Conversation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ title="International Client FAQs" faqs={locationFaqs} />

      {/* CTA */}
      <CTA
        title="Ready to Scale in Your Region?"
        text="Whether you are based in North America, the UK, Australia or Europe, let’s discuss how to drive measurable growth."
      />
    </>
  );
}
