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
          <div className="navDropdown">
            <Link href="/services" className="navDropdownTrigger">
              <span>Services</span>
              <svg className="navArrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Link>
            <div className="dropdownMenu">
              {primaryServices.map(([label, href]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
              <div className="dropdownSep" />
              <span className="dropdownNote">Supporting skill</span>
              <Link href="/services/wordpress-development">WordPress Development</Link>
            </div>
          </div>
          <Link href="/projects">Projects</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <Link href="/contact" className="btn btnPrimary desktopCta">Let&apos;s Talk</Link>
        <details className="mobileNav">
          <summary aria-label="Open navigation">☰</summary>
          <div className="mobilePanel">
            <Link href="/services">Services Overview</Link>
            {primaryServices.map(([label, href]) => (
              <Link key={href} href={href} style={{ paddingLeft: 20 }}>↳ {label}</Link>
            ))}
            <Link href="/services/wordpress-development" style={{ paddingLeft: 20 }}>↳ WordPress Development</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact" className="btn btnPrimary" style={{ marginTop: 8 }}>Let&apos;s Talk</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
