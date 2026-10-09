import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getChatLogs, clearChatLogs } from '@/lib/store';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const chats = await getChatLogs();
  return NextResponse.json({ chats });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  await clearChatLogs();
  return NextResponse.json({ ok: true });
}
