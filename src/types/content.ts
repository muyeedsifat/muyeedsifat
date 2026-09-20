export type ContentBlock =
  | { id: string; type: 'paragraph' | 'h2' | 'h3' | 'quote'; text: string }
  | { id: string; type: 'list'; items: string[] }
  | { id: string; type: 'button'; text: string; url: string }
  | { id: string; type: 'image'; url: string; alt: string; caption?: string };

export type PostStatus = 'draft' | 'published';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  author: string;
  featuredImage: string;
  featuredAlt: string;
  categories: string[];
  tags: string[];
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  schemaType: 'BlogPosting' | 'Article' | 'FAQPage' | 'HowTo';
  customSchema?: string;
  faqs: { question: string; answer: string }[];
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  mime: string;
  createdAt: string;
};
