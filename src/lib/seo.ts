import type { Metadata } from 'next';
import type { Post } from '@/types/content';
import { absoluteUrl, siteConfig } from '@/lib/site';

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image || '/images/hero-muyeed.webp');
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: siteConfig.name,
      images: [{ url: image, alt: input.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image]
    }
  };
}

export function postMetadata(post: Post): Metadata {
  const canonical = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);
  const title = post.metaTitle || `${post.title} | Muyeed`;
  const description = post.metaDescription || post.excerpt;
  const image = post.featuredImage ? absoluteUrl(post.featuredImage) : absoluteUrl('/images/hero-muyeed.webp');
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    authors: [{ name: post.author || siteConfig.fullName }],
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || siteConfig.fullName],
      images: [{ url: image, alt: post.featuredAlt || post.title }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] }
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };
}
