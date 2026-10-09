'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';

const primaryServices = [
  ['AI SEO', '/services/ai-seo'],
  ['Google Ads', '/services/google-ads'],
  ['Meta Ads', '/services/meta-ads']
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close dropdown whenever page route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  const handleItemClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  return (
    <header className="topbar">
      <div className="container nav">
        <Logo />
        <nav className="desktopNav" aria-label="Primary navigation">
          <div
            className={`navDropdown ${isOpen ? 'isOpen' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/services"
              className="navDropdownTrigger"
              onClick={handleItemClick}
            >
              <span>Services</span>
              <svg
                className="navArrow"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Link>
            <div className="dropdownMenu">
              {primaryServices.map(([label, href]) => (
                <Link key={href} href={href} onClick={handleItemClick}>
                  {label}
                </Link>
              ))}
              <div className="dropdownSep" />
              <span className="dropdownNote">Supporting skill</span>
              <Link
                href="/services/wordpress-development"
                onClick={handleItemClick}
              >
                WordPress Development
              </Link>
            </div>
          </div>
          <Link href="/projects">Projects</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://wa.me/8801700000000?text=Hi%20Muyeed,%20I%20would%20like%20to%20discuss%20a%20digital%20marketing%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsappHeaderBtn desktopCta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 15px',
              height: '46px',
              borderRadius: '12px',
              background: '#25D366',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              transition: 'transform 0.2s, background 0.2s'
            }}
            title="Chat directly on WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3"/></svg>
            <span>WhatsApp</span>
          </a>
          <Link href="/contact" className="btn btnPrimary desktopCta">
            Let&apos;s Talk
          </Link>
        </div>
        <details className="mobileNav">
          <summary aria-label="Open navigation">☰</summary>
          <div className="mobilePanel">
            <Link href="/services">Services Overview</Link>
            {primaryServices.map(([label, href]) => (
              <Link key={href} href={href} style={{ paddingLeft: 20 }}>
                ↳ {label}
              </Link>
            ))}
            <Link
              href="/services/wordpress-development"
              style={{ paddingLeft: 20 }}
            >
              ↳ WordPress Development
            </Link>
            <Link href="/projects">Projects</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <a
              href="https://wa.me/8801700000000?text=Hi%20Muyeed,%20I%20would%20like%20to%20discuss%20a%20digital%20marketing%20project."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                color: '#25D366',
                fontWeight: 700
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3"/></svg>
              <span>WhatsApp Chat</span>
            </a>
            <Link
              href="/contact"
              className="btn btnPrimary"
              style={{ marginTop: 8 }}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
