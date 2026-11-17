import { NextResponse } from 'next/server';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { getSettings, saveSettings } from '@/lib/store';

export const runtime = 'nodejs';

export async function PUT(request: Request) {
  if (!await getSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
    const body = await request.json() as Record<string, unknown>;
    const current = await getSettings();

    const updated = {
      ...current,
      ...body
    };

    // Sanitize string lengths where appropriate
    if (body.siteName !== undefined) updated.siteName = String(body.siteName).trim().slice(0, 100);
    if (body.authorName !== undefined) updated.authorName = String(body.authorName).trim().slice(0, 120);
    if (body.email !== undefined) updated.email = String(body.email).trim().slice(0, 180);
    if (body.gtmId !== undefined) updated.gtmId = String(body.gtmId).trim().slice(0, 50);
    if (body.gscVerification !== undefined) updated.gscVerification = String(body.gscVerification).trim().slice(0, 200);
    if (body.ga4Id !== undefined) updated.ga4Id = String(body.ga4Id).trim().slice(0, 50);
    if (body.clarityId !== undefined) updated.clarityId = String(body.clarityId).trim().slice(0, 50);
    if (body.metaPixelId !== undefined) updated.metaPixelId = String(body.metaPixelId).trim().slice(0, 50);

    await saveSettings(updated);
    return NextResponse.json({ settings: updated });
  } catch {
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 400 });
  }
}