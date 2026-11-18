import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    // Purge and revalidate all sitemap and feed cache paths
    revalidatePath('/sitemap');
    revalidatePath('/sitemap.html');
    revalidatePath('/sitemap.xml');
    revalidatePath('/llms.txt');
    revalidatePath('/llms-full.txt');
    revalidatePath('/api/sitemap/download');
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/blog');
    revalidatePath('/services');

    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Sitemap files, feeds, and cache have been successfully refreshed and revalidated.',
      timestamp,
      revalidatedPaths: [
        '/sitemap',
        '/sitemap.html',
        '/sitemap.xml',
        '/llms.txt',
        '/llms-full.txt',
        '/api/sitemap/download',
      ],
    });
  } catch (err) {
    console.error('Error during sitemap revalidation:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate sitemap cache' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
