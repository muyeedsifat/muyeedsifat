import Link from 'next/link';
import { getMedia, getPosts, getProjects, getChatLogs } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [posts, projects, chats, media] = await Promise.all([
    getPosts().catch(() => []),
    getProjects().catch(() => []),
    getChatLogs().catch(() => []),
    getMedia().catch(() => [])
  ]);

  const publishedPosts = posts.filter((p) => p.status === 'published').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px' }}>
      {/* Clean Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>Dashboard</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Manage blog posts, case studies, pages, and marketing tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            className="btn btnSecondary"
            href="/admin/projects/new"
            style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '8px' }}
          >
            + New Case Study
          </Link>
          <Link
            className="btn btnPrimary"
            href="/admin/posts/new"
            style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '8px' }}
          >
            + Write Article
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid - Clean & Minimal without emojis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 650, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Articles
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 750, color: '#0f172a', margin: '6px 0 2px' }}>
            {posts.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500 }}>
            {publishedPosts} published live
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 650, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Case Studies
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 750, color: '#0f172a', margin: '6px 0 2px' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Portfolio entries
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 650, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inquiries &amp; Chats
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 750, color: '#0f172a', margin: '6px 0 2px' }}>
            {chats.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Conversations recorded
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 650, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Media Files
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 750, color: '#0f172a', margin: '6px 0 2px' }}>
            {media.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Images uploaded
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Case Studies & Recent Posts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Case Studies */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Recent Case Studies</h2>
            <Link href="/admin/projects" style={{ fontSize: '0.82rem', color: 'var(--orange-dark, #c2410c)', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.slice(0, 5).map((proj) => (
              <div
                key={proj.id || proj.title}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#1e293b' }}>{proj.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{proj.category} {proj.client ? `• ${proj.client}` : ''}</div>
                </div>
                <Link
                  href={`/admin/projects/${proj.id}`}
                  style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Recent Articles</h2>
            <Link href="/admin/posts" style={{ fontSize: '0.82rem', color: 'var(--orange-dark, #c2410c)', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#1e293b' }}>{post.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Status: {post.status}</div>
                </div>
                <Link
                  href={`/admin/posts/${post.id}`}
                  style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}