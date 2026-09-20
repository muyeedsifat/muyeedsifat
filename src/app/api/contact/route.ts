import { NextResponse } from 'next/server';
import { saveInquiry } from '@/lib/store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    if (body.company_url) return NextResponse.json({ ok: true });
    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().slice(0, 180);
    const website = String(body.website || '').trim().slice(0, 300);
    const service = String(body.service || '').trim().slice(0, 120);
    const message = String(body.message || '').trim().slice(0, 5000);
    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid name, email and message.' }, { status: 400 });
    }
    await saveInquiry({ name, email, website, service, message, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not process the inquiry.' }, { status: 500 });
  }
}
