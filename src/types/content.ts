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

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: 'AI SEO' | 'Google Ads' | 'Meta Ads' | 'WordPress' | string;
  client?: string;
  timeline?: string;
  description: string;
  result: string;
  metrics?: { label: string; value: string }[];
  featuredImage?: string;
  featuredAlt?: string;
  blocks?: ContentBlock[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomPage = {
  id: string;
  slug: string;
  title: string;
  eyebrow?: string;
  lead?: string;
  heroImage?: string;
  blocks?: ContentBlock[];
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export type ChatSession = {
  id: string;
  sessionId: string;
  userMessage: string;
  botReply: string;
  timestamp: string;
  source?: string;
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

export type SiteSettings = {
  siteName: string;
  authorName: string;
  email: string;
  defaultSchema: string;
  whatsappNumber?: string;
  whatsappPrompt?: string;
  geminiApiKey?: string;
  linkedIn?: string;
  upwork?: string;
  adminUsername?: string;
  adminPassword?: string;
  [key: string]: unknown;
};
