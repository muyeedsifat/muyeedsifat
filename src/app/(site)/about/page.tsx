import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { ServiceCard } from '@/components/ServiceCard';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About Muyeed Sifat | Digital Marketer',
  description: 'Learn about Muyeed Sifat, a digital marketer working across AI SEO, Google Ads and Meta Ads, with WordPress development as a supporting skill.',
  path: '/about',
  image: '/images/about-muyeed.webp'
});

const faqs = [
  { question: 'What areas do you specialize in?', answer: 'My primary digital marketing services are AI SEO, Google Ads and Meta Ads. I also use WordPress development as a supporting skill.' },
  { question: 'Can you handle strategy and implementation?', answer: 'Yes. Engagements can include audits, planning, hands-on implementation, optimization and reporting.' },
  { question: 'Do you work remotely?', answer: 'Yes. The work can be handled remotely with clear deliverables, communication and reporting.' },
  { question: 'Can I hire you for a short project?', answer: 'Yes. One-time projects are available alongside ongoing monthly engagements.' },
  { question: 'How do you approach digital marketing?', answer: 'I start with the business goal, then choose the channel, measurement and execution plan that best supports that outcome.' }
];

export default function AboutPage() {
  return (
    <>
      <section className="pageHero"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} /><span className="eyebrow">About Me</span><h1>Digital Marketing With a Practical Growth Focus</h1><p className="lead">I work across AI SEO, paid search and paid social to help businesses improve visibility, acquisition and conversion.</p></div></section>
      <section className="section"><div className="container whyLayout"><div className="whyMedia"><Image src="/images/about-muyeed.webp" alt="Muyeed Sifat working at a desk" width={900} height={1125} sizes="(max-width: 980px) 100vw, 42vw" /></div><div><span className="eyebrow">Muyeed Sifat</span><h2>Search and Paid Media Under One Strategy</h2><p>I am a digital marketer with hands-on experience across SEO, AEO, GEO, content strategy, Google Ads and Meta Ads. My work focuses on connecting visibility and acquisition to business outcomes instead of treating each channel as an isolated task.</p><p>WordPress development is a supporting skill I use when a website, landing page or content structure needs to better support the marketing strategy.</p><div className="btnRow"><Link className="btn btnPrimary" href="/contact">Let&apos;s Talk</Link><a className="btn btnSecondary" href="https://www.upwork.com/freelancers/~01ceafed69d95ddfae" target="_blank" rel="noopener noreferrer">View Upwork</a></div></div></div></section>
      <section className="section sectionSoft"><div className="container"><div className="center"><span className="eyebrow">Services</span><h2>How I Can Help</h2></div><div className="grid3" style={{ marginTop: 32 }}><ServiceCard icon="AI" title="AI SEO" description="SEO, AEO and GEO for organic and AI search visibility." href="/services/ai-seo" /><ServiceCard icon="G" title="Google Ads" description="Paid search built around high-intent demand and measurable conversions." href="/services/google-ads" /><ServiceCard icon="M" title="Meta Ads" description="Paid social focused on targeting, creative testing and conversion goals." href="/services/meta-ads" /></div></div></section>
      <FAQ title="About Working Together" faqs={faqs} />
      <CTA />
    </>
  );
}
