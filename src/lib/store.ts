import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { MediaItem, Post } from '@/types/content';

const dataDir = path.resolve(process.env.CMS_DATA_DIR || path.join(process.cwd(), 'data'));

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const fullPath = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
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

export async function getPosts(): Promise<Post[]> {
  const posts = await readJson<Post[]>('posts.json', []);
  return posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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
  const posts = await getPosts();
  const index = posts.findIndex((item) => item.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.unshift(post);
  await writeJson('posts.json', posts);
  return post;
}

export async function deletePost(id: string) {
  const posts = (await getPosts()).filter((post) => post.id !== id);
  await writeJson('posts.json', posts);
}

export async function getMedia(): Promise<MediaItem[]> {
  const media = await readJson<MediaItem[]>('media.json', []);
  return media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveMedia(item: MediaItem) {
  const media = await getMedia();
  const index = media.findIndex((entry) => entry.id === item.id);
  if (index >= 0) media[index] = item;
  else media.unshift(item);
  await writeJson('media.json', media);
  return item;
}

export async function getTaxonomy() {
  const categories = await readJson<string[]>('categories.json', ['AI SEO', 'Google Ads', 'Meta Ads', 'WordPress', 'Digital Marketing']);
  const tags = await readJson<string[]>('tags.json', ['SEO', 'AEO', 'GEO', 'PPC', 'Google Ads', 'Meta Ads', 'WordPress']);
  return { categories, tags };
}

export async function saveTaxonomy(categories: string[], tags: string[]) {
  await Promise.all([writeJson('categories.json', categories), writeJson('tags.json', tags)]);
  return { categories, tags };
}

export async function getSettings() {
  return readJson('settings.json', {
    siteName: 'Muyeed',
    authorName: 'Muyeed Sifat',
    email: 'muyeedsifatt@gmail.com',
    defaultSchema: 'BlogPosting'
  });
}

export async function saveSettings(settings: Record<string, unknown>) {
  await writeJson('settings.json', settings);
  return settings;
}

export async function saveInquiry(inquiry: Record<string, string>) {
  const inquiries = await readJson<Record<string, string>[]>('inquiries.json', []);
  inquiries.unshift(inquiry);
  await writeJson('inquiries.json', inquiries.slice(0, 1000));
}
