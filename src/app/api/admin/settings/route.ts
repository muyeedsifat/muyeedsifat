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
    const body = (await request.json()) as Record<string, unknown>;
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
    if (body.gscVerification !== undefined) {
      const rawGsc = String(body.gscVerification).trim().slice(0, 250);
      const match = rawGsc.match(/content=["']([^"']+)["']/i);
      updated.gscVerification = match ? match[1].trim() : rawGsc.replace(/^["']|["']$/g, '');
    }
    if (body.ga4Id !== undefined) updated.ga4Id = String(body.ga4Id).trim().slice(0, 50);
    if (body.clarityId !== undefined) {
      const rawClarity = String(body.clarityId).trim();
      const scriptMatch = rawClarity.match(/["']clarity["'],\s*["']script["'],\s*["']([a-zA-Z0-9]+)["']/i);
      const urlMatch = rawClarity.match(/clarity\.ms\/tag\/([a-zA-Z0-9]+)/i);
      if (scriptMatch && scriptMatch[1]) {
        updated.clarityId = scriptMatch[1].trim();
      } else if (urlMatch && urlMatch[1]) {
        updated.clarityId = urlMatch[1].trim();
      } else {
        updated.clarityId = rawClarity.replace(/^["']|["']$/g, '').slice(0, 50);
      }
    }
    if (body.metaPixelId !== undefined) updated.metaPixelId = String(body.metaPixelId).trim().slice(0, 50);

    // WhatsApp and Contact Fields
    if (body.whatsappNumber !== undefined) {
      const cleanNum = String(body.whatsappNumber).trim().slice(0, 30);
      updated.whatsappNumber = cleanNum;
      updated.whatsapp = cleanNum;
    }
    if (body.whatsapp !== undefined && !updated.whatsappNumber) {
      updated.whatsappNumber = String(body.whatsapp).trim().slice(0, 30);
    }
    if (body.whatsappPrompt !== undefined) {
      updated.whatsappPrompt = String(body.whatsappPrompt).trim().slice(0, 300);
    }

    // Profiles and AI
    if (body.upwork !== undefined) updated.upwork = String(body.upwork).trim().slice(0, 250);
    if (body.linkedIn !== undefined) updated.linkedIn = String(body.linkedIn).trim().slice(0, 250);
    if (body.gbpUrl !== undefined) updated.gbpUrl = String(body.gbpUrl).trim().slice(0, 250);
    if (body.twitter !== undefined) updated.twitter = String(body.twitter).trim().slice(0, 250);
    if (body.discord !== undefined) updated.discord = String(body.discord).trim().slice(0, 250);
    if (body.geminiApiKey !== undefined) updated.geminiApiKey = String(body.geminiApiKey).trim().slice(0, 150);
    if (body.pagespeedApiKey !== undefined) updated.pagespeedApiKey = String(body.pagespeedApiKey).trim().slice(0, 150);
    if (body.geminiModel !== undefined) updated.geminiModel = String(body.geminiModel).trim().slice(0, 60);

    // Admin Credentials
    if (body.adminUsername !== undefined) updated.adminUsername = String(body.adminUsername).trim().slice(0, 80);
    if (body.adminPassword !== undefined) updated.adminPassword = String(body.adminPassword).trim().slice(0, 120);

    await saveSettings(updated);
    return NextResponse.json({ settings: updated });
  } catch {
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 400 });
  }
}
