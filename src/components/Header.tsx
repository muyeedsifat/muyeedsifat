import Link from 'next/link';
import { Logo } from '@/components/Logo';

const primaryServices = [
  ['AI SEO', '/services/ai-seo'],
  ['Google Ads', '/services/google-ads'],
  ['Meta Ads', '/services/meta-ads']
] as const;

export function Header() {
  return (
    <header className="topbar">
      <div className="container nav">
        <Logo />
        <nav className="desktopNav" aria-label="Primary navigation">
          <details className="navDropdown">
            <summary>Services</summary>
            <div className="dropdownMenu">
              <Link href="/services">All Services</Link>
              {primaryServices.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
              <div className="dropdownSep" />
              <span className="dropdownNote">Supporting skill</span>
              <Link href="/services/wordpress-development">WordPress Development</Link>
            </div>
          </details>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <Link href="/contact" className="btn btnPrimary desktopCta">Let&apos;s Talk</Link>
        <details className="mobileNav">
          <summary aria-label="Open navigation">☰</summary>
          <div className="mobilePanel">
            <Link href="/services">Services</Link>
            {primaryServices.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/services/wordpress-development">WordPress Development</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact" className="btn btnPrimary">Let&apos;s Talk</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
