import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProjects, saveProject } from '@/lib/store';
import type { Project } from '@/types/content';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
    }

    const title = String(body.title).trim();
    const slug = String(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

    const project: Project = {
      id: body.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      slug,
      category: body.category || 'AI SEO',
      client: body.client || '',
      timeline: body.timeline || '',
      description: body.description || '',
      result: body.result || '',
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
      featuredImage: body.featuredImage || '',
      featuredAlt: body.featuredAlt || title,
      blocks: Array.isArray(body.blocks) ? body.blocks : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      metaTitle: body.metaTitle || `${title} | Case Study`,
      metaDescription: body.metaDescription || body.description || '',
      focusKeyword: body.focusKeyword || '',
      canonicalUrl: body.canonicalUrl || '',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveProject(project);
    return NextResponse.json({ ok: true, project });
  } catch (error) {
    console.error('[Projects API Error]', error);
    return NextResponse.json({ error: 'Failed to save project.' }, { status: 500 });
  }
}
