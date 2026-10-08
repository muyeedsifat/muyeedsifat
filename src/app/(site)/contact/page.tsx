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
      <section className="section">
        <div className="container contactGrid">
          <aside className="contactPanel">
            <span className="eyebrow">Let&apos;s Work Together</span>
            <h2>Start With the Goal</h2>
            <p>Whether you need more organic visibility, better paid acquisition or a stronger landing page, start by sharing the business objective.</p>
            <div className="contactLinks">
              <a className="contactLinkItem" href={`mailto:${siteConfig.email}`}>
                <span className="contactIconBox" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <div className="contactLinkInfo">
                  <span className="contactLinkLabel">Email Directly</span>
                  <span className="contactLinkVal">{siteConfig.email}</span>
                </div>
                <span className="contactLinkArrow" aria-hidden="true">→</span>
              </a>
              <a className="contactLinkItem" href={siteConfig.linkedIn} target="_blank" rel="noopener noreferrer">
                <span className="contactIconBox" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </span>
                <div className="contactLinkInfo">
                  <span className="contactLinkLabel">LinkedIn Profile</span>
                  <span className="contactLinkVal">Connect on LinkedIn</span>
                </div>
                <span className="contactLinkArrow" aria-hidden="true">→</span>
              </a>
              <a className="contactLinkItem" href={siteConfig.upwork} target="_blank" rel="noopener noreferrer">
                <span className="contactIconBox" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.195c0 1.9-.999 2.909-2.708 2.909-1.71 0-2.71-1.009-2.71-2.909V3.492H0v7.195c0 3.321 2.032 5.564 5.12 5.564 3.088 0 5.12-2.243 5.12-5.564v-1.312c.54 1.489 1.396 3.242 2.476 4.717l-1.928 9.1h2.774l1.378-6.52c1.077.674 2.316 1.074 3.621 1.074 3.023 0 5.48-2.457 5.48-5.48 0-3.023-2.457-5.48-5.48-5.48z"/></svg>
                </span>
                <div className="contactLinkInfo">
                  <span className="contactLinkLabel">Upwork Profile</span>
                  <span className="contactLinkVal">Hire on Upwork</span>
                </div>
                <span className="contactLinkArrow" aria-hidden="true">→</span>
              </a>
            </div>
          </aside>
          <div className="formCard"><ContactForm /></div>
        </div>
      </section>
      <CTA title="Prefer to Start on Upwork?" text="You can also contact me directly through my Upwork profile or LinkedIn." />
    </>
  );
}
