import { NextResponse } from 'next/server';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { saveMedia } from '@/lib/store';
import { slugify, titleFromFilename } from '@/lib/slug';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';
import type { MediaItem } from '@/types/content';

export const runtime = 'nodejs';
const MAX_UPLOAD_SIZE = 16 * 1024 * 1024; // 16 MB

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
    const form = await request.formData();
    const file = form.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please select an image file.' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: 'Image must be under 16 MB.' }, { status: 400 });
    }

    const originalTitle = titleFromFilename(file.name);
    const requestedAlt = String(form.get('alt') || '').trim();
    const baseSlug = slugify(originalTitle) || 'image';
    const filename = `${baseSlug}-${Date.now()}.webp`;

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // Auto-convert to optimized WebP
    let webpBuffer: Buffer;
    let width = 1200;
    let height = 800;

    if (file.type === 'image/svg+xml') {
      // SVGs can remain vector or converted
      webpBuffer = inputBuffer;
    } else {
      const pipeline = sharp(inputBuffer)
        .rotate()
        .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 });

      const metadata = await pipeline.metadata().catch(() => ({ width: 1200, height: 800 }));
      width = metadata.width || 1200;
      height = metadata.height || 800;
      webpBuffer = await pipeline.toBuffer();
    }

    let publicUrl = `/uploads/${filename}`;

    // 1. Try Supabase Storage first if enabled
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filename, webpBuffer, {
              contentType: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
              upsert: true
            });

          if (!uploadError) {
            const { data: pubData } = supabase.storage.from('media').getPublicUrl(filename);
            if (pubData?.publicUrl) {
              publicUrl = pubData.publicUrl;
            }
          } else {
            console.warn('[Upload] Supabase storage upload notice:', uploadError.message);
          }
        } catch (storageErr) {
          console.warn('[Upload] Supabase storage error, falling back to local file:', storageErr);
        }
      }
    }

    // 2. Also save to local public/uploads for offline/local resilience
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(path.join(uploadsDir, filename), webpBuffer);
      if (!publicUrl.startsWith('http')) {
        publicUrl = `/uploads/${filename}`;
      }
    } catch (fsErr) {
      // On read-only Vercel serverless, public/uploads write might fail if not Supabase
      if (!publicUrl.startsWith('http')) {
        console.warn('[Upload] Local filesystem write error on serverless:', fsErr);
      }
    }

    const item: MediaItem = {
      id: crypto.randomUUID(),
      filename,
      url: publicUrl,
      alt: requestedAlt || originalTitle,
      title: originalTitle,
      caption: '',
      width,
      height,
      mime: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
      createdAt: new Date().toISOString()
    };

    await saveMedia(item);

    return NextResponse.json({ item });
  } catch (error) {
    console.error('[Upload] Error processing image:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Could not process image.' },
      { status: 500 }
    );
  }
}
