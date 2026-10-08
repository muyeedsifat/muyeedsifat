import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerGrid">
          <div>
            <Logo />
            <p className="footerIntro">Digital marketing focused on AI SEO, Google Ads and Meta Ads, with WordPress development available when the website needs to support growth.</p>
          </div>
          <div><h3>Digital Marketing</h3><Link href="/services/ai-seo">AI SEO</Link><Link href="/services/google-ads">Google Ads</Link><Link href="/services/meta-ads">Meta Ads</Link></div>
          <div><h3>Explore</h3><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/locations">Locations</Link><Link href="/about">About</Link><Link href="/blog">Blog</Link></div>
          <div><h3>Connect</h3><a href={siteConfig.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={siteConfig.upwork} target="_blank" rel="noopener noreferrer">Upwork</a><a href={`mailto:${siteConfig.email}`}>Email</a></div>
        </div>
        <div className="footerBottom">© 2026 Muyeed Sifat. All rights reserved.</div>
      </div>
    </footer>
  );
}
