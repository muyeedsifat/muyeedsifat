import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { JsonLd } from '@/components/JsonLd';
import { ProjectCard } from '@/components/ProjectCard';
import { getService, services } from '@/data/services';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { faqSchema, pageMetadata } from '@/lib/seo';
import { getProjects, getPublishedPosts } from '@/lib/store';
import type { Project, Post } from '@/types/content';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Load all verified projects and published articles
  const allProjects: Project[] = await getProjects().catch(() => []);
  const allPosts: Post[] = await getPublishedPosts().catch(() => []);

  // Filter relevant verified projects for this service pillar
  let relevantProjects: Project[] = [];
  if (service.slug === 'ai-seo') {
    const targetSlugs = [
      'hunt-custom-cargo-seo-aeo-geo',
      'black-magic-tan-australia-aeo',
      'ubizfloral-wedding-candelabras-aeo-seo',
    ];
    relevantProjects = allProjects.filter((p) => targetSlugs.includes(p.slug));
  } else if (service.slug === 'google-ads') {
    const targetSlugs = [
      'google-ads-search-campaign-restructure',
      'elite-bath-solutions-bathroom-remodeling-seo',
      'admeth-singapore-industrial-heat-exchangers-seo',
    ];
    relevantProjects = allProjects.filter((p) => targetSlugs.includes(p.slug));
  } else if (service.slug === 'meta-ads') {
    const targetSlugs = [
      'meta-ads-creative-testing-funnel',
      'tennis-equipment-ecommerce-seo',
      'black-magic-tan-australia-aeo',
    ];
    relevantProjects = allProjects.filter((p) => targetSlugs.includes(p.slug));
  } else if (service.slug === 'wordpress-development') {
    const targetSlugs = [
      'wordpress-speed-conversion-rebuild',
      'hunt-custom-cargo-seo-aeo-geo',
      'ubizfloral-wedding-candelabras-aeo-seo',
    ];
    relevantProjects = allProjects.filter((p) => targetSlugs.includes(p.slug));
  }
  if (relevantProjects.length === 0) {
    relevantProjects = allProjects.slice(0, 3);
  }

  // Filter relevant published articles for this service pillar
  let relevantPosts: Post[] = [];
  if (service.slug === 'ai-seo') {
    const postSlugs = [
      'how-generative-ai-changes-search-results',
      'aeo-vs-geo-vs-seo',
      'high-intent-keyword-research-ppc',
    ];
    relevantPosts = allPosts.filter((p) => postSlugs.includes(p.slug));
  } else if (service.slug === 'google-ads') {
    const postSlugs = [
      'how-to-structure-google-ads-campaigns',
      'high-intent-keyword-research-ppc',
      'aeo-vs-geo-vs-seo',
    ];
    relevantPosts = allPosts.filter((p) => postSlugs.includes(p.slug));
  } else if (service.slug === 'meta-ads') {
    const postSlugs = [
      'meta-ads-audience-testing-framework',
      'how-to-structure-google-ads-campaigns',
      'how-generative-ai-changes-search-results',
    ];
    relevantPosts = allPosts.filter((p) => postSlugs.includes(p.slug));
  } else if (service.slug === 'wordpress-development') {
    const postSlugs = [
      'wordpress-speed-optimization-checklist',
      'how-generative-ai-changes-search-results',
      'aeo-vs-geo-vs-seo',
    ];
    relevantPosts = allPosts.filter((p) => postSlugs.includes(p.slug));
  }
  if (relevantPosts.length === 0) {
    relevantPosts = allPosts.slice(0, 3);
  }

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
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema(service.faqs)} />

      {/* Hero Section */}
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.name },
            ]}
          />
          <span className="eyebrow">{service.eyebrow}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.description}</p>
          <div className="btnRow">
            <Link className="btn btnPrimary" href="/contact">
              {service.cta}
            </Link>
            <Link className="btn btnSecondary" href="/projects">
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Service Packages</span>
            <h2>Choose the Right Engagement</h2>
          </div>
          <div className="grid3" style={{ marginTop: 34 }}>
            {service.packages.map((pack) => (
              <article
                className={`card package ${pack.featured ? 'packageFeatured' : ''}`}
                key={pack.name}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="packageLabel">{pack.label}</div>
                <h3>{pack.name}</h3>
                <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '14px' }}>
                  {pack.description}
                </p>
                {pack.features && pack.features.length > 0 && (
                  <ul className="packageFeatures">
                    {pack.features.map((feat) => (
                      <li key={feat} className="packageFeatureItem">
                        <span className="packageCheckBadge" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="btnRow" style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <Link
                    className={`btn ${pack.featured ? 'btnPrimary' : 'btnSecondary'}`}
                    style={{ width: '100%', textAlign: 'center' }}
                    href="/contact"
                  >
                    Let&apos;s Talk
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who It Helps Section */}
      <section className="section sectionSoft">
        <div className="container grid2">
          <div>
            <span className="eyebrow">Who It Helps</span>
            <h2>Who This Service Is For</h2>
            <p className="lead">
              Best suited to businesses that need a clear growth objective, practical implementation, and stronger measurement.
            </p>
          </div>
          <div className="whoGrid">
            {service.audiences.map((audience) => (
              <div className="whoItem" key={audience}>
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="section">
        <div className="container whyLayout">
          <div className="whyMedia">
            <Image
              src="/images/why-muyeed.webp"
              alt={`Muyeed working on ${service.name} strategy`}
              width={900}
              height={1125}
              sizes="(max-width: 980px) 100vw, 42vw"
            />
          </div>
          <div>
            <span className="eyebrow">Why Work With Me</span>
            <h2>Strategy Backed by Hands-On Execution</h2>
            <div className="reasonList">
              {service.reasons.map((reason, index) => (
                <div className="reason" key={reason.title}>
                  <span className="reasonNum">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELEVANT PROJECTS & CASE STUDIES (Fully Integrated with Proofs & Modals) */}
      <section className="section sectionSoft">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Relevant Projects &amp; Case Studies</span>
            <h2>{service.name} Verified Case Studies</h2>
            <p className="lead" style={{ maxWidth: 720, margin: '8px auto 0' }}>
              Real commercial results, search console proof screenshots, and structured execution frameworks delivered for clients. Click any case study to explore full ~600-word reports and sequential before/after proof galleries.
            </p>
          </div>

          <div className="grid3" style={{ marginTop: 32 }}>
            {relevantProjects.map((project, index) => (
              <ProjectCard
                key={project.id || project.slug}
                category={project.category}
                title={project.title}
                description={project.description}
                result={project.result}
                client={project.client}
                timeline={project.timeline}
                metrics={project.metrics}
                featuredImage={project.featuredImage}
                featuredAlt={project.featuredAlt}
                screenshots={project.screenshots}
                tags={project.tags}
                index={index}
              />
            ))}
          </div>

          <div className="center" style={{ marginTop: 36 }}>
            <Link className="btn btnSecondary" href="/projects">
              View All 21 Client Case Studies →
            </Link>
          </div>
        </div>
      </section>

      {/* RELEVANT ARTICLES (Fully Integrated with Real Published Posts & Media) */}
      <section className="section">
        <div className="container">
          <div className="center">
            <span className="eyebrow">Relevant Articles &amp; Strategic Playbooks</span>
            <h2>Learn More About {service.name}</h2>
            <p className="lead" style={{ maxWidth: 700, margin: '8px auto 0' }}>
              Actionable implementation guides, technical frameworks, and strategic insights for digital marketers and business operators.
            </p>
          </div>

          <div className="grid3" style={{ marginTop: 32 }}>
            {relevantPosts.map((post) => (
              <article
                className="card blogCard"
                key={post.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '22px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
                }}
              >
                {post.featuredImage && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      backgroundColor: '#f1f5f9',
                    }}
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredAlt || post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                  <span className="tag" style={{ margin: 0 }}>
                    {post.categories?.[0] || service.name}
                  </span>
                  {post.publishedAt && (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.12rem', lineHeight: 1.35, marginBottom: '10px', fontWeight: 750, color: '#0f172a' }}>
                  <Link href={`/blog/${post.slug}`} className="hoverUnderline" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '16px', flexGrow: 1 }}>
                  {post.excerpt || post.metaDescription}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <Link
                    className="textLink"
                    href={`/blog/${post.slug}`}
                    style={{ fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Read Article</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="center" style={{ marginTop: 36 }}>
            <Link className="btn btnSecondary" href="/blog">
              Browse All Marketing Insights →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ title={`${service.name} Questions`} faqs={service.faqs} />

      {/* CTA Section */}
      <CTA
        title={`Need Help With ${service.name}?`}
        text="Share your goals, current setup, and the specific result you want to achieve."
      />
    </>
  );
}
