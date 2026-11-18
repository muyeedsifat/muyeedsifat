import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { siteConfig } from '@/lib/site';
import { LinkedInIcon, UpworkIcon, WhatsAppIcon, GoogleIcon } from '@/components/Icons';

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerGrid">
          <div>
            <Logo />
            <p className="footerIntro">
              Digital marketing focused on AI SEO, Google Ads and Meta Ads, with WordPress development available when the website needs to support growth.
            </p>
            <div className="footerSocialIcons" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
              <a
                href={siteConfig.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="LinkedIn Profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#222222',
                  color: '#cccccc',
                  margin: 0,
                  padding: 0,
                  textDecoration: 'none'
                }}
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href={siteConfig.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="Upwork Profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#222222',
                  color: '#cccccc',
                  margin: 0,
                  padding: 0,
                  textDecoration: 'none'
                }}
              >
                <UpworkIcon size={18} />
              </a>
              <a
                href="https://wa.me/8801576624428"
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="Direct WhatsApp Message"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#222222',
                  color: '#cccccc',
                  margin: 0,
                  padding: 0,
                  textDecoration: 'none'
                }}
              >
                <WhatsAppIcon size={18} />
              </a>
              <a
                href={siteConfig.gbpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="Google Business Profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#222222',
                  color: '#cccccc',
                  margin: 0,
                  padding: 0,
                  textDecoration: 'none'
                }}
              >
                <GoogleIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3>Digital Marketing</h3>
            <Link href="/services/ai-seo">AI SEO</Link>
            <Link href="/services/google-ads">Google Ads</Link>
            <Link href="/services/meta-ads">Meta Ads</Link>
          </div>

          <div>
            <h3>Explore</h3>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </div>

          <div>
            <h3>Connect</h3>
            <a href={siteConfig.linkedIn} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LinkedInIcon size={16} /> LinkedIn
            </a>
            <a href={siteConfig.upwork} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UpworkIcon size={16} /> Upwork
            </a>
            <a href="https://wa.me/8801576624428" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
            <a href={siteConfig.gbpUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoogleIcon size={16} /> Google Profile
            </a>
            <a href={`mailto:${siteConfig.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Email
            </a>
          </div>
        </div>

        <div className="footerBottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>© 2026 Muyeed Sifat. All rights reserved.</span>
          <Link href="/login-dashboard" style={{ fontSize: '0.82rem', color: '#777', textDecoration: 'none' }}>
            Dashboard Login ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}
