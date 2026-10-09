import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPages, savePage } from '@/lib/store';
import type { CustomPage } from '@/types/content';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const pages = await getPages();
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.slug) {
      return NextResponse.json({ error: 'Page slug is required.' }, { status: 400 });
    }

    const page: CustomPage = {
      id: body.id || `page-${body.slug}`,
      slug: String(body.slug).trim(),
      title: body.title || '',
      eyebrow: body.eyebrow || '',
      lead: body.lead || '',
      heroImage: body.heroImage || '',
      blocks: Array.isArray(body.blocks) ? body.blocks : [],
      metaTitle: body.metaTitle || '',
      metaDescription: body.metaDescription || '',
      updatedAt: new Date().toISOString()
    };

    await savePage(page);
    return NextResponse.json({ ok: true, page });
  } catch (error) {
    console.error('[Pages API Error]', error);
    return NextResponse.json({ error: 'Failed to save page.' }, { status: 500 });
  }
}
