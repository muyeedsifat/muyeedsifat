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
              <a className="contactLinkItem" href="https://wa.me/8801700000000?text=Hi%20Muyeed,%20I%20would%20like%20to%20discuss%20a%20digital%20marketing%20project." target="_blank" rel="noopener noreferrer">
                <span className="contactIconBox" aria-hidden="true" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3"/></svg>
                </span>
                <div className="contactLinkInfo">
                  <span className="contactLinkLabel">WhatsApp Chat</span>
                  <span className="contactLinkVal">Message on WhatsApp</span>
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
