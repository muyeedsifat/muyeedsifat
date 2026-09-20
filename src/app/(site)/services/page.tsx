import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { ServiceCard } from '@/components/ServiceCard';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Digital Marketing Services | Muyeed',
  description: 'Digital marketing services covering AI SEO, Google Ads and Meta Ads, with WordPress development available as a supporting skill when websites or landing pages need improvement.',
  path: '/services'
});

const faqs = [
  { question: 'What digital marketing services do you provide?', answer: 'My core services are AI SEO, Google Ads and Meta Ads. WordPress development is available as a supporting skill when the website or landing page needs improvement.' },
  { question: 'Can I hire you for one service only?', answer: 'Yes. Each service can be delivered independently or combined where the channels support the same business goal.' },
  { question: 'Do you offer ongoing monthly support?', answer: 'Yes. Monthly engagements are available for AI SEO, Google Ads and Meta Ads, with reporting and ongoing optimization.' },
  { question: 'Can SEO and PPC work together?', answer: 'Yes. Paid campaigns can capture immediate demand while SEO builds longer-term visibility and supporting content.' },
  { question: 'Can you improve the landing page too?', answer: 'Yes. WordPress support can be included when the website itself is limiting campaign or conversion performance.' }
];

export default function ServicesPage() {
  return (
    <>
      <section className="pageHero"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} /><span className="eyebrow">Digital Marketing Services</span><h1>Marketing Services Built for Growth</h1><p className="lead">Choose focused support across AI SEO, Google Ads and Meta Ads, with WordPress development available when your site or landing pages need to support the strategy.</p><div className="btnRow"><Link className="btn btnPrimary" href="/contact">Let&apos;s Talk</Link><Link className="btn btnSecondary" href="/projects">View Projects</Link></div></div></section>
      <section className="section"><div className="container"><div className="grid3"><ServiceCard icon="AI" title="AI SEO" description="SEO, AEO and GEO for stronger visibility across search engines and AI answer experiences." href="/services/ai-seo" /><ServiceCard icon="G" title="Google Ads" description="High-intent paid search focused on qualified traffic, measurement and conversion performance." href="/services/google-ads" /><ServiceCard icon="M" title="Meta Ads" description="Facebook and Instagram campaigns focused on audiences, creative testing and conversions." href="/services/meta-ads" /></div><div className="supportSkill"><div><span className="tag">Supporting Skill</span><h3>WordPress Development for Marketing Needs</h3><p>WordPress development supports the main digital marketing work when a new landing page, faster website or better conversion path is needed.</p></div><Link className="btn btnSecondary" href="/services/wordpress-development">View WordPress</Link></div></div></section>
      <section className="section sectionSoft"><div className="container center"><span className="eyebrow">Ways to Work Together</span><h2>Flexible Engagements</h2><div className="grid3" style={{ marginTop: 32 }}><article className="card package"><div className="packageLabel">One-Time</div><h3>Focused Project</h3><p>Best for audits, campaign setup, landing pages or defined optimization work with a clear scope.</p></article><article className="card package packageFeatured"><div className="packageLabel">Ongoing</div><h3>Monthly Growth</h3><p>Best for continuous strategy, implementation, testing, optimization and reporting.</p></article><article className="card package"><div className="packageLabel">Flexible</div><h3>Custom Plan</h3><p>Combine the services you need for a one-time project, 3-month sprint or longer engagement.</p></article></div></div></section>
      <section className="section"><div className="container grid2"><div><span className="eyebrow">Why Work With Me</span><h2>One Digital Marketing View</h2><p className="lead">I can connect organic visibility, paid acquisition and landing-page performance instead of treating them as separate problems.</p></div><div className="grid2"><article className="card"><h3>Search + AI Visibility</h3><p>Traditional SEO is combined with AEO and GEO where the strategy benefits from broader answer-engine visibility.</p></article><article className="card"><h3>Paid Acquisition</h3><p>Google Ads and Meta Ads are structured around audience intent, measurement and conversion goals.</p></article><article className="card"><h3>Hands-On Execution</h3><p>Strategy can move directly into implementation, testing and optimization.</p></article><article className="card"><h3>Website Support</h3><p>WordPress is used when the site or landing page becomes a conversion bottleneck.</p></article></div></div></section>
      <section className="section sectionSoft"><div className="container"><span className="eyebrow">Project Preview</span><h2>Work Across Core Channels</h2><div className="grid3" style={{marginTop:28}}><article className="card"><span className="tag">AI SEO</span><h3>Organic Growth Strategy</h3><p>Search, content and authority improvements focused on sustainable organic visibility.</p><Link className="textLink" href="/projects">View Projects →</Link></article><article className="card"><span className="tag">Google Ads</span><h3>Search Campaign Restructure</h3><p>Campaign architecture organized around intent, search terms and conversion measurement.</p><Link className="textLink" href="/projects">View Projects →</Link></article><article className="card"><span className="tag">Meta Ads</span><h3>Creative Testing Campaign</h3><p>Audience and creative testing structured to produce clearer performance learning.</p><Link className="textLink" href="/projects">View Projects →</Link></article></div></div></section>
      <FAQ title="Digital Marketing Service Questions" faqs={faqs} />
      <CTA title="Need a Clearer Marketing Plan?" text="Tell me what you want to improve and I’ll help identify which channel or combination makes the most sense." />
    </>
  );
}
