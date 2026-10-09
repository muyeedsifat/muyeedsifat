import { NextResponse } from 'next/server';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { getSession } from '@/lib/auth';
import { getPosts, savePost, getProjects, saveProject, getPages, savePage, getMedia, saveMedia } from '@/lib/store';

export const runtime = 'nodejs';

async function getFilesRecursively(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of list) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await getFilesRecursively(fullPath)));
      } else {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory might not exist
  }
  return results;
}

export async function POST() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const publicDir = path.join(process.cwd(), 'public');
    const allFiles = await getFilesRecursively(publicDir);
    const nonWebpImages = allFiles.filter((f) =>
      /\.(png|jpe?g|bmp|tiff|gif)$/i.test(f)
    );

    const converted: { original: string; webp: string; sizeSavedBytes: number }[] = [];

    for (const filePath of nonWebpImages) {
      const parsed = path.parse(filePath);
      const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

      const origStats = await fs.stat(filePath);
      const inputBuffer = await fs.readFile(filePath);

      const webpBuffer = await sharp(inputBuffer)
        .rotate()
        .webp({ quality: 85, effort: 4 })
        .toBuffer();

      await fs.writeFile(webpPath, webpBuffer);
      const newStats = await fs.stat(webpPath);

      converted.push({
        original: path.relative(publicDir, filePath).replace(/\\/g, '/'),
        webp: path.relative(publicDir, webpPath).replace(/\\/g, '/'),
        sizeSavedBytes: Math.max(0, origStats.size - newStats.size)
      });
    }

    // Now update references in content files if any were converted
    if (converted.length > 0) {
      const posts = await getPosts();
      for (const post of posts) {
        let changed = false;
        let feat = post.featuredImage || '';
        for (const item of converted) {
          if (feat.includes(item.original)) {
            feat = feat.replace(item.original, item.webp);
            changed = true;
          }
        }
        if (changed) {
          await savePost({ ...post, featuredImage: feat });
        }
      }

      const projects = await getProjects();
      for (const proj of projects) {
        let changed = false;
        let feat = proj.featuredImage || '';
        for (const item of converted) {
          if (feat.includes(item.original)) {
            feat = feat.replace(item.original, item.webp);
            changed = true;
          }
        }
        if (changed) {
          await saveProject({ ...proj, featuredImage: feat });
        }
      }

      const mediaItems = await getMedia();
      for (const m of mediaItems) {
        for (const item of converted) {
          if (m.url.includes(item.original)) {
            await saveMedia({
              ...m,
              url: m.url.replace(item.original, item.webp),
              filename: m.filename.replace(/\.[^/.]+$/, '.webp'),
              mime: 'image/webp'
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      scannedCount: allFiles.length,
      convertedCount: converted.length,
      converted
    });
  } catch (error) {
    console.error('[ConvertAll] Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to convert images to WebP.' },
      { status: 500 }
    );
  }
}
