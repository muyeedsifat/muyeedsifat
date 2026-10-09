import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArticleBlocks } from '@/components/ArticleBlocks';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { JsonLd } from '@/components/JsonLd';
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
  let customSchema: unknown = null;
  if (post.customSchema) {
    try { customSchema = JSON.parse(post.customSchema); } catch { customSchema = null; }
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
      <JsonLd data={articleSchema} />{(post.faqs || []).length > 0 && <JsonLd data={faqSchema(post.faqs || [])} />}{customSchema && <JsonLd data={customSchema} />}
      <article><header className="articleHero"><div className="container articleWrap"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} /><span className="tag">{post.categories?.[0] || 'Digital Marketing'}</span><h1>{post.title}</h1><p className="lead">{post.excerpt}</p><div className="metaRow"><span>By {post.author}</span><span>•</span><time dateTime={post.publishedAt || post.updatedAt}>{new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time></div>{post.featuredImage && <div className="articleFeatured"><Image src={post.featuredImage} alt={post.featuredAlt || post.title} width={1200} height={630} priority sizes="(max-width: 900px) 100vw, 860px" unoptimized /></div>}</div></header><section className="section" style={{ paddingTop: 20 }}><div className="container articleWrap"><ArticleBlocks blocks={post.blocks} /></div></section></article>
      {(post.faqs || []).length > 0 && <FAQ title={`${post.title} FAQs`} faqs={post.faqs || []} />}
      <CTA />
    </>
  );
}
