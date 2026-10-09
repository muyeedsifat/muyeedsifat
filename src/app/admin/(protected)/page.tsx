import Link from 'next/link';
import { getMedia, getPosts, getProjects, getChatLogs } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [posts, projects, chats, media] = await Promise.all([
    getPosts().catch(() => []),
    getProjects().catch(() => []),
    getChatLogs().catch(() => []),
    getMedia().catch(() => [])
  ]);

  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const isSupabase = isSupabaseConfigured();

  return (
    <>
      <div className="adminActions" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Muyeed Sifat • CMS &amp; Backend</span>
          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>Dashboard Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="btn btnSecondary" href="/admin/projects/new">
            + New Case Study
          </Link>
          <Link className="btn btnPrimary" href="/admin/posts/new">
            + New Blog Post
          </Link>
        </div>
      </div>

      {/* Supabase Status Banner */}
      <div
        className="notice"
        style={{
          marginBottom: 20,
          background: isSupabase ? '#edfcf2' : '#fff8e7',
          borderColor: isSupabase ? '#abefc6' : '#ffe2a8',
          color: isSupabase ? '#067647' : '#7a4b00',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div>
          <strong>Backend Database: </strong>
          {isSupabase ? (
            <span>Connected to Supabase PostgreSQL (Project: <code>lorzornydwloucbjwewd</code>)</span>
          ) : (
            <span>Running on local persistent JSON store (Ready to sync to Supabase project <code>lorzornydwloucbjwewd</code>)</span>
          )}
        </div>
        <Link href="/admin/settings" style={{ fontSize: '0.85rem', fontWeight: 700, textDecoration: 'underline' }}>
          Database Settings →
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="adminGrid">
        <div className="adminCard adminStat">
          <strong>{posts.length}</strong>
          <span>Total Blog Posts ({publishedPosts} Live)</span>
        </div>
        <div className="adminCard adminStat">
          <strong>{projects.length}</strong>
          <span>Case Studies &amp; Projects</span>
        </div>
        <div className="adminCard adminStat">
          <strong>{chats.length}</strong>
          <span>Recorded AI Chat Inquiries</span>
        </div>
        <div className="adminCard adminStat">
          <strong>{media.length}</strong>
          <span>Media Library Items</span>
        </div>
      </div>

      {/* Recent Case Studies */}
      <div className="adminCard" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Recent Case Studies &amp; Projects</h2>
          <Link className="textLink" href="/admin/projects">
            Manage All Projects →
          </Link>
        </div>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Key Result</th>
              <th>Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 5).map((p) => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td><span className="tag" style={{ margin: 0 }}>{p.category}</span></td>
                <td>{p.result || '—'}</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link className="buttonSmall" href={`/admin/projects/${p.id}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Posts */}
      <div className="adminCard" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Recent Blog Articles</h2>
          <Link className="textLink" href="/admin/posts">
            Manage All Posts →
          </Link>
        </div>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.slice(0, 5).map((p) => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td>
                  <span style={{ color: p.status === 'published' ? '#027a48' : '#b54708', fontWeight: 650 }}>
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link className="buttonSmall" href={`/admin/posts/${p.id}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
