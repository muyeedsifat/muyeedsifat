import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProjectById, deleteProject, saveProject } from '@/lib/store';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
