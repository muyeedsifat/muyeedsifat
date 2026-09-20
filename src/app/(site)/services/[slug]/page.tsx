import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { JsonLd } from '@/components/JsonLd';
import { getService, services } from '@/data/services';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { faqSchema, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@type': 'Person', name: siteConfig.fullName, url: absoluteUrl('/') },
    areaServed: 'Worldwide'
  };
  return (
    <>
      <JsonLd data={serviceSchema} /><JsonLd data={faqSchema(service.faqs)} />
      <section className="pageHero"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.name }]} /><span className="eyebrow">{service.eyebrow}</span><h1>{service.title}</h1><p className="lead">{service.description}</p><div className="btnRow"><Link className="btn btnPrimary" href="/contact">{service.cta}</Link><Link className="btn btnSecondary" href="/projects">View Projects</Link></div></div></section>
      <section className="section"><div className="container"><div className="center"><span className="eyebrow">Service Packages</span><h2>Choose the Right Engagement</h2></div><div className="grid3" style={{ marginTop: 34 }}>{service.packages.map((pack) => <article className={`card package ${pack.featured ? 'packageFeatured' : ''}`} key={pack.name}><div className="packageLabel">{pack.label}</div><h3>{pack.name}</h3><p>{pack.description}</p><div className="btnRow"><Link className={`btn ${pack.featured ? 'btnPrimary' : 'btnSecondary'}`} href="/contact">Let&apos;s Talk</Link></div></article>)}</div></div></section>
      <section className="section sectionSoft"><div className="container grid2"><div><span className="eyebrow">Who It Helps</span><h2>Who This Service Is For</h2><p className="lead">Best suited to businesses that need a clear growth objective, practical implementation and stronger measurement.</p></div><div className="whoGrid">{service.audiences.map((audience) => <div className="whoItem" key={audience}>{audience}</div>)}</div></div></section>
      <section className="section"><div className="container whyLayout"><div className="whyMedia"><Image src="/images/why-muyeed.webp" alt={`Muyeed working on ${service.name} strategy`} width={900} height={1125} sizes="(max-width: 980px) 100vw, 42vw" /></div><div><span className="eyebrow">Why Work With Me</span><h2>Strategy Backed by Hands-On Execution</h2><div className="reasonList">{service.reasons.map((reason, index) => <div className="reason" key={reason.title}><span className="reasonNum">{String(index + 1).padStart(2, '0')}</span><div><h3>{reason.title}</h3><p>{reason.description}</p></div></div>)}</div></div></div></section>
      <section className="section sectionSoft"><div className="container"><span className="eyebrow">Relevant Projects</span><h2>{service.name} Project Examples</h2><div className="grid3" style={{ marginTop: 28 }}>{service.projects.map((project, index) => <article className="card" key={project.title}><div className={`projectVisual visual${index % 3}`}><span>{service.name}</span></div><span className="tag">{service.name}</span><h3>{project.title}</h3><p>{project.description}</p><Link className="textLink" href="/projects">View Projects →</Link></article>)}</div></div></section>
      <section className="section"><div className="container"><div className="center"><span className="eyebrow">Relevant Articles</span><h2>Learn More About {service.name}</h2></div><div className="grid3" style={{ marginTop: 30 }}>{service.articles.map((article) => <article className="card" key={article}><span className="tag">{service.name}</span><h3>{article}</h3><p>Practical guidance focused on stronger decisions, cleaner execution and measurable digital marketing performance.</p><Link className="textLink" href="/blog">Read Articles →</Link></article>)}</div></div></section>
      <FAQ title={`${service.name} Questions`} faqs={service.faqs} />
      <CTA title={`Need Help With ${service.name}?`} text="Share your goals, current setup and the result you want to improve." />
    </>
  );
}
