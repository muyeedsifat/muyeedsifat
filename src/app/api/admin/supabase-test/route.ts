import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const configured = isSupabaseConfigured();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      status: 'standby',
      message: 'Supabase credentials not yet supplied in environment. Running safely on local JSON store with zero downtime.'
    });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      configured: true,
      status: 'error',
      message: 'Supabase client could not be initialized. Please check your URL and Key.'
    });
  }

  try {
    // Check tables: posts, projects, pages, chat_logs, media, settings
    const [postsRes, projRes, pagesRes, chatsRes, mediaRes, settingsRes] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('pages').select('id', { count: 'exact', head: true }),
      supabase.from('chat_logs').select('id', { count: 'exact', head: true }),
      supabase.from('media').select('id', { count: 'exact', head: true }),
      supabase.from('settings').select('id', { count: 'exact', head: true })
    ]);

    // Check storage bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const mediaBucket = buckets?.find((b) => b.id === 'media' || b.name === 'media');

    return NextResponse.json({
      configured: true,
      status: 'connected',
      message: 'Supabase PostgreSQL & Storage are active and successfully connected!',
      tables: {
        posts: !postsRes.error ? (postsRes.count ?? 0) : 'missing or unmigrated',
        projects: !projRes.error ? (projRes.count ?? 0) : 'missing or unmigrated',
        pages: !pagesRes.error ? (pagesRes.count ?? 0) : 'missing or unmigrated',
        chat_logs: !chatsRes.error ? (chatsRes.count ?? 0) : 'missing or unmigrated',
        media: !mediaRes.error ? (mediaRes.count ?? 0) : 'missing or unmigrated',
        settings: !settingsRes.error ? (settingsRes.count ?? 0) : 'missing or unmigrated'
      },
      storage: {
        mediaBucketFound: Boolean(mediaBucket),
        public: mediaBucket?.public ?? false
      }
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      status: 'error',
      message: `Connection attempt failed: ${(err as Error).message}`
    });
  }
}
