-- ==============================================================================
-- MUYEED NEXT.JS PORTFOLIO & CMS - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- This sets up all tables, indexes, Row Level Security (RLS), and seeds default data.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. POSTS TABLE (Blog Articles)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL DEFAULT 'Muyeed Sifat',
  featured_image TEXT NOT NULL DEFAULT '',
  featured_alt TEXT NOT NULL DEFAULT '',
  categories TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  focus_keyword TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  canonical_url TEXT DEFAULT '',
  schema_type TEXT NOT NULL DEFAULT 'BlogPosting',
  custom_schema TEXT DEFAULT '',
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE (Case Studies & Portfolio Work)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'AI SEO',
  client TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_image TEXT DEFAULT '',
  featured_alt TEXT DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  focus_keyword TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ------------------------------------------------------------------------------
-- 3. PAGES TABLE (Custom & Editable Pages Content)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  eyebrow TEXT DEFAULT '',
  lead TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);

-- ------------------------------------------------------------------------------
-- 4. CHAT_LOGS TABLE (Recorded AI Chatbot Conversations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_reply TEXT NOT NULL,
  source TEXT DEFAULT 'website_chatbot',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON public.chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. MEDIA TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  caption TEXT DEFAULT '',
  width INT DEFAULT 0,
  height INT DEFAULT 0,
  mime TEXT DEFAULT 'image/webp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Posts: Public can read published posts; Service Role has full access
DROP POLICY IF EXISTS "Public read published posts" ON public.posts;
CREATE POLICY "Public read published posts" ON public.posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Full access for service role on posts" ON public.posts;
CREATE POLICY "Full access for service role on posts" ON public.posts
  FOR ALL USING (true) WITH CHECK (true);

-- Projects: Public can read all projects; Service Role has full access
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access for service role on projects" ON public.projects;
CREATE POLICY "Full access for service role on projects" ON public.projects
  FOR ALL USING (true) WITH CHECK (true);

-- Pages: Public can read pages; Service Role has full access
DROP POLICY IF EXISTS "Public read pages" ON public.pages;
CREATE POLICY "Public read pages" ON public.pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access for service role on pages" ON public.pages;
CREATE POLICY "Full access for service role on pages" ON public.pages
  FOR ALL USING (true) WITH CHECK (true);

-- Chat Logs: Public can insert chat records; Service Role has full access
DROP POLICY IF EXISTS "Public insert chat logs" ON public.chat_logs;
CREATE POLICY "Public insert chat logs" ON public.chat_logs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on chat logs" ON public.chat_logs;
CREATE POLICY "Full access for service role on chat logs" ON public.chat_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Settings: Public can read settings; Service Role has full access
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access for service role on settings" ON public.settings;
CREATE POLICY "Full access for service role on settings" ON public.settings
  FOR ALL USING (true) WITH CHECK (true);

-- Media: Public can read media; Service Role has full access
DROP POLICY IF EXISTS "Public read media" ON public.media;
CREATE POLICY "Public read media" ON public.media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access for service role on media" ON public.media;
CREATE POLICY "Full access for service role on media" ON public.media
  FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
-- Creates the public media bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access to media bucket" ON storage.objects;
CREATE POLICY "Public Access to media bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Service role upload to media bucket" ON storage.objects;
CREATE POLICY "Service role upload to media bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- ------------------------------------------------------------------------------
-- SEED INITIAL SETTINGS
-- ------------------------------------------------------------------------------
INSERT INTO public.settings (id, data, updated_at)
VALUES (
  'default',
  '{
    "siteName": "Muyeed",
    "authorName": "Muyeed Sifat",
    "email": "muyeedsifatt@gmail.com",
    "defaultSchema": "BlogPosting",
    "linkedIn": "https://www.linkedin.com/in/muyeedsifat/",
    "upwork": "https://www.upwork.com/freelancers/~01ceafed69d95ddfae",
    "whatsappNumber": "+8801700000000",
    "whatsappPrompt": "Hi Muyeed, I visited your website and would like to discuss a digital marketing project."
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- SEED INITIAL CASE STUDIES / PROJECTS
-- ------------------------------------------------------------------------------
INSERT INTO public.projects (title, slug, category, description, result, metrics)
VALUES
  ('Organic Growth Strategy', 'organic-growth-strategy', 'AI SEO', 'Search strategy, content optimization, internal linking and authority development focused on sustainable organic growth.', '+300% organic traffic growth on a selected SEO project.', '[{"label":"Traffic Increase","value":"+300%"},{"label":"Target SERP Rank","value":"Top 3"}]'::jsonb),
  ('AI Visibility Optimization', 'ai-visibility-optimization', 'AI SEO', 'Content, entity and authority improvements designed for stronger search and answer-engine discoverability.', 'Improved search and AI visibility foundations.', '[{"label":"AI Citation Rate","value":"85%"},{"label":"Entity Coverage","value":"92%"}]'::jsonb),
  ('Search Campaign Restructure', 'search-campaign-restructure', 'Google Ads', 'Intent-led campaign architecture, keyword cleanup and conversion-focused landing-page alignment.', 'Cleaner account structure and stronger demand focus.', '[{"label":"CPA Reduction","value":"-34%"},{"label":"CTR Lift","value":"+4.2%"}]'::jsonb),
  ('Lead Generation PPC', 'lead-generation-ppc', 'Google Ads', 'Paid search strategy organized around commercial queries, conversion actions and budget control.', 'Lead-focused campaign structure.', '[{"label":"Monthly Leads","value":"+120%"},{"label":"Conversion Rate","value":"6.8%"}]'::jsonb),
  ('Retargeting Funnel', 'retargeting-funnel', 'Meta Ads', 'Audience segmentation and retargeting designed to create a clearer path back to conversion.', 'Stronger warm-audience follow-up.', '[{"label":"ROAS","value":"4.2x"},{"label":"Retargeting CVR","value":"+48%"}]'::jsonb),
  ('Creative Testing Campaign', 'creative-testing-campaign', 'Meta Ads', 'Structured testing across creative hooks, formats and offers to improve learning quality.', 'More disciplined creative iteration.', '[{"label":"Winning Creatives","value":"6"},{"label":"Avg. CPA","value":"$18"}]'::jsonb),
  ('Service Business Website', 'service-business-website', 'WordPress', 'Responsive WordPress site structured around services, organic search and lead generation.', 'Cleaner user journey and easier content management.', '[{"label":"PageSpeed Score","value":"96/100"},{"label":"Bounce Rate","value":"-28%"}]'::jsonb),
  ('Portfolio Website', 'portfolio-website', 'WordPress', 'Personal-brand website with reusable layouts, clear positioning and conversion-focused sections.', 'Professional presentation with easier editing.', '[{"label":"Lighthouse Performance","value":"98%"},{"label":"Lead Capture","value":"Active"}]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
