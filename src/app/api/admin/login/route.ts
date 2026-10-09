import { NextResponse } from 'next/server';
import { assertSameOrigin, createSessionToken, SESSION_COOKIE, validCredentials } from '@/lib/auth';
import { getSettings } from '@/lib/store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { username, password } = await request.json();
    const settings = (await getSettings()) as { adminUsername?: string; adminPassword?: string };
    if (!validCredentials(String(username || ''), String(password || ''), settings)) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(String(username)), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 400 });
  }
}
