import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { getSiteUrl, siteConfig } from '@/lib/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.fullName, jobTitle: siteConfig.role,
    url: getSiteUrl(), image: `${getSiteUrl()}/images/hero-muyeed.webp`, email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.linkedIn, siteConfig.upwork],
    knowsAbout: ['Digital Marketing','AI SEO','Search Engine Optimization','Answer Engine Optimization','Generative Engine Optimization','Google Ads','Meta Ads','WordPress Development']
  };
  return <><JsonLd data={personSchema}/><Header/><main>{children}</main><Footer/></>;
}
