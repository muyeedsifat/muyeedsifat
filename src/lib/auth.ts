import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'muyeed_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = { user: string; exp: number };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 16) return value;
  return 'muyeed-portfolio-production-secret-auth-key-2026-safe-fallback';
}

function sign(input: string) {
  return crypto.createHmac('sha256', secret()).update(input).digest('base64url');
}

export function createSessionToken(username: string) {
  const payload: SessionPayload = {
    user: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.user || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function validCredentials(username: string, password: string, savedSettings?: { adminUsername?: string; adminPassword?: string }) {
  const expectedUser = savedSettings?.adminUsername || process.env.ADMIN_USERNAME || 'muyeed';
  const expectedPassword = savedSettings?.adminPassword || process.env.ADMIN_PASSWORD || 'ChangeMe!2026';
  if (!expectedUser || !expectedPassword) return false;
  const userA = Buffer.from(username.trim());
  const userB = Buffer.from(expectedUser.trim());
  const passA = Buffer.from(password.trim());
  const passB = Buffer.from(expectedPassword.trim());
  const userOk = userA.length === userB.length && crypto.timingSafeEqual(userA, userB);
  const passOk = passA.length === passB.length && crypto.timingSafeEqual(passA, passB);
  return userOk && passOk;
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return;
  const originHost = new URL(origin).host;
  if (originHost !== host) throw new Error('Invalid request origin.');
}
