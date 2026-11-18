import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArticleBlocks } from '@/components/ArticleBlocks';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { JsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { getPostBySlug, getPublishedPosts } from '@/lib/store';
import { faqSchema, postMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post ? postMetadata(post) : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Load other published articles for the relevant articles section
  const allPosts = await getPublishedPosts().catch(() => []);
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  let customSchema: unknown = null;
  if (post.customSchema) {
    try {
      customSchema = JSON.parse(post.customSchema);
    } catch {
      customSchema = null;
    }
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': post.schemaType === 'Article' ? 'Article' : 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author || siteConfig.fullName, url: absoluteUrl('/') },
    publisher: { '@type': 'Person', name: siteConfig.fullName, url: absoluteUrl('/') },
    mainEntityOfPage: post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`),
    ...(post.featuredImage ? { image: [absoluteUrl(post.featuredImage)] } : {})
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      {(post.faqs || []).length > 0 && <JsonLd data={faqSchema(post.faqs || [])} />}
      {customSchema && <JsonLd data={customSchema} />}

      <article>
        <header className="articleHero">
          <div className="container articleWrap">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
            <span className="tag">{post.categories?.[0] || 'Digital Marketing'}</span>
            <h1>{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
            <div className="metaRow">
              <span>By {post.author || siteConfig.fullName}</span>
              <span>•</span>
              <time dateTime={post.publishedAt || post.updatedAt}>
                {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            {post.featuredImage && (
              <div className="articleFeatured">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredAlt || post.title}
                  width={1200}
                  height={630}
                  priority
                  sizes="(max-width: 900px) 100vw, 860px"
                  unoptimized
                />
              </div>
            )}
          </div>
        </header>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="container articleWrap">
            {post.content && post.content.length > 200 ? (
              <div
                className="articleContent richHtmlBlock"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <ArticleBlocks blocks={post.blocks || []} />
            )}
          </div>
        </section>
      </article>

      {(post.faqs || []).length > 0 && <FAQ title={`${post.title} FAQs`} faqs={post.faqs || []} />}

      {/* Relevant Articles & Strategic Playbooks */}
      {relatedPosts.length > 0 && (
        <section className="section sectionSoft">
          <div className="container">
            <div className="center">
              <span className="eyebrow">Relevant Articles &amp; Strategic Playbooks</span>
              <h2>Related Marketing Insights &amp; Guides</h2>
              <p className="lead" style={{ maxWidth: 680, margin: '8px auto 0' }}>
                Explore complementary technical playbooks, optimization blueprints, and search intelligence articles.
              </p>
            </div>
            <div className="grid3" style={{ marginTop: 32 }}>
              {relatedPosts.map((rel) => (
                <article
                  className="card blogCard"
                  key={rel.slug}
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
                  {rel.featuredImage && (
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
                        src={rel.featuredImage}
                        alt={rel.featuredAlt || rel.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <span className="tag" style={{ margin: 0 }}>
                      {rel.categories?.[0] || 'Digital Marketing'}
                    </span>
                    {rel.publishedAt && (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                        {new Date(rel.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.12rem', lineHeight: 1.35, marginBottom: '10px', fontWeight: 750, color: '#0f172a' }}>
                    <Link href={`/blog/${rel.slug}`} className="hoverUnderline" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {rel.title}
                    </Link>
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '16px', flexGrow: 1 }}>
                    {rel.excerpt || rel.metaDescription}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <Link
                      className="textLink"
                      href={`/blog/${rel.slug}`}
                      style={{ fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Read Guide</span>
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
                Explore All Strategy Articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
