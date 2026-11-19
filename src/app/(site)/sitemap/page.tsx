import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { SitemapViewer } from '@/components/SitemapViewer';
import { pageMetadata } from '@/lib/seo';
import { getSitemapData } from '@/lib/sitemap-data';

export const metadata: Metadata = pageMetadata({
  title: 'Website Sitemap & Navigation Directory | Muyeed Sifat',
  description:
    'Comprehensive real-time directory and HTML sitemap of Muyeed Sifat portfolio. Browse all primary landing pages, service pillars, verified client case studies, and strategic growth publications.',
  path: '/sitemap.html',
});

export const dynamic = 'force-dynamic';

const faqs = [
  {
    question: 'How often is this sitemap updated?',
    answer:
      'This sitemap is dynamically generated and synchronizes automatically in real time whenever new case studies, service offerings, or strategic articles are published.',
  },
  {
    question: 'Where can I find the machine-readable XML sitemap for search crawlers?',
    answer:
      'The XML sitemap is available at /sitemap.xml. It complies with the Sitemaps.org 0.9 protocol for search crawlers while providing a responsive visual directory for browser inspection without legacy XSLT dependencies.',
  },
  {
    question: 'Is there an LLM or AI-readable version of this site?',
    answer:
      'Yes. An llms.txt file is provided at /llms.txt following the open standard for Large Language Models and conversational search engines, alongside an extended context feed at /llms-full.txt.',
  },
  {
    question: 'How are priority and change frequencies determined?',
    answer:
      'Core conversion corridors (Home, Services, Case Studies) carry 0.9–1.0 priorities with weekly check intervals, while individual published articles and informational pages carry 0.7–0.8 priorities with monthly review cycles.',
  },
];

export default async function SitemapPage() {
  const { items } = await getSitemapData();

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]} />
          <span className="eyebrow">Real-Time Directory • Auto-Updating</span>
          <h1>Website Sitemap &amp; Link Directory</h1>
          <p className="lead">
            An exhaustive, continuously updated index of all primary landing pages, service capabilities, verified client case studies, and strategic growth publications across the website.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '16px' }}>
        <div className="container">
          <SitemapViewer items={items} />
        </div>
      </section>

      <FAQ title="Sitemap &amp; Indexation Questions" faqs={faqs} />
      <CTA
        title="Ready to Scale Your Search &amp; Paid Acquisition?"
        text="Review the case studies and strategic playbooks above, then reach out to map a structured growth roadmap tailored to your market."
      />
    </>
  );
}
