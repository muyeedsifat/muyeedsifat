import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { ContactForm } from '@/components/ContactForm';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Muyeed | Digital Marketing Projects',
  description: 'Contact Muyeed Sifat about AI SEO, Google Ads, Meta Ads or WordPress support for a digital marketing project.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <>
      <section className="pageHero"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} /><span className="eyebrow">Contact</span><h1>Let&apos;s Talk About Your Growth Goal</h1><p className="lead">Share the channel, problem or result you want to improve. I’ll use that context to understand the right next step.</p></div></section>
      <section className="section"><div className="container contactGrid"><aside className="contactPanel"><span className="eyebrow">Let&apos;s Work Together</span><h2>Start With the Goal</h2><p>Whether you need more organic visibility, better paid acquisition or a stronger landing page, start by sharing the business objective.</p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><a href={siteConfig.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a><a href={siteConfig.upwork} target="_blank" rel="noopener noreferrer">Upwork Profile</a></aside><div className="formCard"><ContactForm /></div></div></section>
      <CTA title="Prefer to Start on Upwork?" text="You can also contact me directly through my Upwork profile or LinkedIn." />
    </>
  );
}
