import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { MediaItem, Post, Project, CustomPage, ChatSession, SiteSettings } from '@/types/content';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';

const dataDir = path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const fullPath = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    const sanitized = raw.replace(/^\uFEFF/, '');
    return JSON.parse(sanitized) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`[Store] Error reading ${file}:`, error);
    }
    await writeJson(file, fallback);
    return fallback;
  }
}

let writeQueue = Promise.resolve();
function writeJson<T>(file: string, value: T) {
  const task = async () => {
    await ensureDir();
    const fullPath = path.join(dataDir, file);
    const tempPath = `${fullPath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(tempPath, fullPath);
  };
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

// -----------------------------------------------------------------------------
// POSTS (Blog Articles)
// -----------------------------------------------------------------------------
export async function getPosts(): Promise<Post[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false });
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt || '',
          status: row.status,
          author: row.author || 'Muyeed Sifat',
          featuredImage: row.featured_image || '',
          featuredAlt: row.featured_alt || '',
          categories: row.categories || [],
          tags: row.tags || [],
          focusKeyword: row.focus_keyword || '',
          metaTitle: row.meta_title || '',
          metaDescription: row.meta_description || '',
          canonicalUrl: row.canonical_url || '',
          schemaType: row.schema_type || 'BlogPosting',
          customSchema: row.custom_schema || '',
          faqs: Array.isArray(row.faqs) ? row.faqs : [],
          blocks: Array.isArray(row.blocks) ? row.blocks : [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          publishedAt: row.published_at || row.created_at
        }));
      }
      console.warn('[Supabase] Failed to fetch posts, falling back to local JSON:', error?.message);
    }
  }

  const raw = await readJson<unknown>('posts.json', []);
  const posts: Post[] = Array.isArray(raw)
    ? (raw as Post[])
    : Array.isArray((raw as { value?: unknown })?.value)
      ? ((raw as { value: Post[] }).value)
      : [];
  return posts.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
}

export async function getPublishedPosts(): Promise<Post[]> {
  return (await getPosts()).filter((post) => post.status === 'published');
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug && post.status === 'published');
}

export async function getPostById(id: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.id === id);
}

export async function savePost(post: Post) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        status: post.status,
        author: post.author,
        featured_image: post.featuredImage,
        featured_alt: post.featuredAlt,
        categories: post.categories,
        tags: post.tags,
        focus_keyword: post.focusKeyword,
        meta_title: post.metaTitle,
        meta_description: post.metaDescription,
        canonical_url: post.canonicalUrl,
        schema_type: post.schemaType,
        custom_schema: post.customSchema,
        faqs: post.faqs,
        blocks: post.blocks,
        updated_at: new Date().toISOString(),
        published_at: post.publishedAt || (post.status === 'published' ? new Date().toISOString() : null)
      };
      const { error } = await supabase.from('posts').upsert(payload);
      if (!error) return post;
      console.warn('[Supabase] Failed to upsert post:', error.message);
    }
  }

  const posts = await getPosts();
  const index = posts.findIndex((item) => item.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.unshift(post);
  await writeJson('posts.json', posts);
  return post;
}

export async function deletePost(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('posts').delete().eq('id', id);
    }
  }
  const posts = (await getPosts()).filter((post) => post.id !== id);
  await writeJson('posts.json', posts);
}

// -----------------------------------------------------------------------------
// PROJECTS (Case Studies & Portfolio)
// -----------------------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          category: row.category,
          client: row.client || '',
          timeline: row.timeline || '',
          description: row.description || '',
          result: row.result || '',
          metrics: Array.isArray(row.metrics) ? row.metrics : [],
          featuredImage: row.featured_image || '',
          featuredAlt: row.featured_alt || '',
          blocks: Array.isArray(row.blocks) ? row.blocks : [],
          tags: row.tags || [],
          metaTitle: row.meta_title || '',
          metaDescription: row.meta_description || '',
          focusKeyword: row.focus_keyword || '',
          canonicalUrl: row.canonical_url || '',
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
      console.warn('[Supabase] Failed to fetch projects, falling back to local JSON:', error?.message);
    }
  }

  const raw = await readJson<unknown>('projects.json', []);
  const projects: Project[] = Array.isArray(raw)
    ? (raw as Project[])
    : Array.isArray((raw as { value?: unknown })?.value)
      ? ((raw as { value: Project[] }).value)
      : [];
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.id === id);
}

export async function saveProject(project: Project) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        id: project.id,
        title: project.title,
        slug: project.slug,
        category: project.category,
        client: project.client,
        timeline: project.timeline,
        description: project.description,
        result: project.result,
        metrics: project.metrics || [],
        featured_image: project.featuredImage || '',
        featured_alt: project.featuredAlt || '',
        blocks: project.blocks || [],
        tags: project.tags || [],
        meta_title: project.metaTitle || '',
        meta_description: project.metaDescription || '',
        focus_keyword: project.focusKeyword || '',
        canonical_url: project.canonicalUrl || '',
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('projects').upsert(payload);
      if (!error) return project;
      console.warn('[Supabase] Failed to upsert project:', error.message);
    }
  }

  const projects = await getProjects();
  const index = projects.findIndex((item) => item.id === project.id);
  if (index >= 0) projects[index] = project;
  else projects.unshift(project);
  await writeJson('projects.json', projects);
  return project;
}

export async function deleteProject(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
  }
  const projects = (await getProjects()).filter((p) => p.id !== id);
  await writeJson('projects.json', projects);
}

// -----------------------------------------------------------------------------
// PAGES (Custom & Editable Pages)
// -----------------------------------------------------------------------------
export async function getPages(): Promise<CustomPage[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('pages').select('*');
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          eyebrow: row.eyebrow || '',
          lead: row.lead || '',
          heroImage: row.hero_image || '',
          blocks: Array.isArray(row.blocks) ? row.blocks : [],
          metaTitle: row.meta_title || '',
          metaDescription: row.meta_description || '',
          updatedAt: row.updated_at
        }));
      }
    }
  }

  const raw = await readJson<unknown>('pages.json', []);
  return Array.isArray(raw) ? (raw as CustomPage[]) : [];
}

export async function getPageBySlug(slug: string): Promise<CustomPage | undefined> {
  return (await getPages()).find((p) => p.slug === slug);
}

export async function savePage(page: CustomPage) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        id: page.id,
        slug: page.slug,
        title: page.title,
        eyebrow: page.eyebrow,
        lead: page.lead,
        hero_image: page.heroImage,
        blocks: page.blocks || [],
        meta_title: page.metaTitle,
        meta_description: page.metaDescription,
        updated_at: new Date().toISOString()
      };
      await supabase.from('pages').upsert(payload);
    }
  }

  const pages = await getPages();
  const index = pages.findIndex((p) => p.id === page.id || p.slug === page.slug);
  if (index >= 0) pages[index] = page;
  else pages.push(page);
  await writeJson('pages.json', pages);
  return page;
}

// -----------------------------------------------------------------------------
// CHATBOT LOGS (Recorded Conversations)
// -----------------------------------------------------------------------------
export async function getChatLogs(): Promise<ChatSession[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          sessionId: row.session_id,
          userMessage: row.user_message,
          botReply: row.bot_reply,
          source: row.source || 'website_chatbot',
          timestamp: row.created_at
        }));
      }
    }
  }

  const raw = await readJson<unknown>('chats.json', []);
  return Array.isArray(raw) ? (raw as ChatSession[]) : [];
}

export async function saveChatLog(log: Omit<ChatSession, 'id'>) {
  const newLog: ChatSession = {
    ...log,
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('chat_logs').insert({
        session_id: newLog.sessionId,
        user_message: newLog.userMessage,
        bot_reply: newLog.botReply,
        source: newLog.source || 'website_chatbot'
      });
    }
  }

  const chats = await getChatLogs();
  chats.unshift(newLog);
  await writeJson('chats.json', chats.slice(0, 500));
  return newLog;
}

export async function clearChatLogs() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('chat_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
  }
  await writeJson('chats.json', []);
}

// -----------------------------------------------------------------------------
// MEDIA
// -----------------------------------------------------------------------------
export async function getMedia(): Promise<MediaItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          filename: row.filename,
          url: row.url,
          alt: row.alt || '',
          title: row.title || '',
          caption: row.caption || '',
          width: row.width || 0,
          height: row.height || 0,
          mime: row.mime || 'image/webp',
          createdAt: row.created_at
        }));
      }
    }
  }

  const raw = await readJson<unknown>('media.json', []);
  const media: MediaItem[] = Array.isArray(raw)
    ? (raw as MediaItem[])
    : Array.isArray((raw as { value?: unknown })?.value)
      ? ((raw as { value: MediaItem[] }).value)
      : [];
  return media.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function saveMedia(item: MediaItem) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('media').upsert({
        id: item.id,
        filename: item.filename,
        url: item.url,
        alt: item.alt,
        title: item.title,
        caption: item.caption,
        width: item.width,
        height: item.height,
        mime: item.mime
      });
    }
  }

  const media = await getMedia();
  const index = media.findIndex((entry) => entry.id === item.id);
  if (index >= 0) media[index] = item;
  else media.unshift(item);
  await writeJson('media.json', media);
  return item;
}

// -----------------------------------------------------------------------------
// TAXONOMY & SETTINGS
// -----------------------------------------------------------------------------
export async function getTaxonomy() {
  const categories = await readJson<string[]>('categories.json', ['AI SEO', 'Google Ads', 'Meta Ads', 'WordPress', 'Digital Marketing']);
  const tags = await readJson<string[]>('tags.json', ['SEO', 'AEO', 'GEO', 'PPC', 'Google Ads', 'Meta Ads', 'WordPress']);
  return { categories, tags };
}

export async function saveTaxonomy(categories: string[], tags: string[]) {
  await Promise.all([writeJson('categories.json', categories), writeJson('tags.json', tags)]);
  return { categories, tags };
}

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('settings').select('data').eq('id', 'default').single();
      if (!error && data?.data) {
        return data.data as SiteSettings;
      }
    }
  }

  return readJson<SiteSettings>('settings.json', {
    siteName: 'Muyeed',
    authorName: 'Muyeed Sifat',
    email: 'muyeedsifatt@gmail.com',
    defaultSchema: 'BlogPosting',
    linkedIn: 'https://www.linkedin.com/in/muyeedsifat/',
    upwork: 'https://www.upwork.com/freelancers/~01ceafed69d95ddfae',
    whatsappNumber: '+8801700000000',
    whatsappPrompt: 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.'
  });
}

export async function saveSettings(settings: Record<string, unknown>) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('settings').upsert({
        id: 'default',
        data: settings,
        updated_at: new Date().toISOString()
      });
    }
  }
  await writeJson('settings.json', settings);
  return settings;
}

export async function saveInquiry(inquiry: Record<string, string>) {
  const inquiries = await readJson<Record<string, string>[]>('inquiries.json', []);
  inquiries.unshift(inquiry);
  await writeJson('inquiries.json', inquiries.slice(0, 1000));
}
