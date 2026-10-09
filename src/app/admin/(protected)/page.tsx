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
    <div className="adminContentStack">
      {/* Top Welcome & Actions Header */}
      <div className="adminPageHeader">
        <div>
          <span className="adminEyebrow">Control Center • Professional CMS</span>
          <h1 className="adminTitle">Dashboard Overview</h1>
          <p className="adminSubtitle">
            Manage your articles, case studies, media assets, AI chat inquiries, and search optimization in one unified hub.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link className="btn btnSecondary" href="/admin/projects/new">
            + New Case Study
          </Link>
          <Link className="btn btnPrimary" href="/admin/posts/new">
            + Write Article
          </Link>
        </div>
      </div>

      {/* Supabase Status Banner */}
      <div className={`statusNoticeCard ${isSupabase ? 'statusConnected' : 'statusStandby'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>{isSupabase ? '⚡' : '💾'}</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.94rem' }}>
              {isSupabase ? 'Supabase PostgreSQL & Storage Connected' : 'Local Storage Engine Active (Standby)'}
            </strong>
            <p style={{ margin: 0, fontSize: '0.84rem', opacity: 0.85 }}>
              {isSupabase
                ? 'Your website is operating with cloud Postgres database and Supabase media storage.'
                : 'Changes are safely stored locally. Connect Supabase project `lorzornydwloucbjwewd` anytime for cloud sync.'}
            </p>
          </div>
        </div>
        <Link href="/admin/settings" className="btn btnSecondary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
          Database Settings →
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpiGrid">
        <div className="kpiCard">
          <div className="kpiIconWrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            📄
          </div>
          <div className="kpiDetails">
            <span className="kpiValue">{posts.length}</span>
            <span className="kpiLabel">Total Blog Articles</span>
            <span className="kpiSub">{publishedPosts} Published Live</span>
          </div>
        </div>

        <div className="kpiCard">
          <div className="kpiIconWrap" style={{ background: '#fdf2f8', color: '#db2777' }}>
            💼
          </div>
          <div className="kpiDetails">
            <span className="kpiValue">{projects.length}</span>
            <span className="kpiLabel">Case Studies / Projects</span>
            <span className="kpiSub">Across AI SEO, PPC &amp; Web</span>
          </div>
        </div>

        <div className="kpiCard">
          <div className="kpiIconWrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            💬
          </div>
          <div className="kpiDetails">
            <span className="kpiValue">{chats.length}</span>
            <span className="kpiLabel">AI Chat Inquiries</span>
            <span className="kpiSub">Recorded with WhatsApp links</span>
          </div>
        </div>

        <div className="kpiCard">
          <div className="kpiIconWrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
            🖼️
          </div>
          <div className="kpiDetails">
            <span className="kpiValue">{media.length}</span>
            <span className="kpiLabel">Media Assets</span>
            <span className="kpiSub">100% WebP Optimized</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div className="launchpadGrid">
        <Link href="/admin/posts/new" className="launchpadCard">
          <div className="launchpadIcon">✍️</div>
          <div>
            <strong>Write New Blog Post</strong>
            <p>Publish search-optimized guides with Rich Text, headings &amp; tables.</p>
          </div>
        </Link>

        <Link href="/admin/projects/new" className="launchpadCard">
          <div className="launchpadIcon">🚀</div>
          <div>
            <strong>Add New Case Study</strong>
            <p>Showcase client growth metrics, before/after results &amp; strategy.</p>
          </div>
        </Link>

        <Link href="/admin/media" className="launchpadCard">
          <div className="launchpadIcon">📸</div>
          <div>
            <strong>Upload Media (WebP)</strong>
            <p>Upload new graphics with automatic WebP conversion and SEO alt tags.</p>
          </div>
        </Link>

        <Link href="/admin/chats" className="launchpadCard">
          <div className="launchpadIcon">🤖</div>
          <div>
            <strong>View AI Chat Logs</strong>
            <p>Review customer questions and follow up directly on WhatsApp.</p>
          </div>
        </Link>
      </div>

      {/* Two-Column Recent Activity Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '22px' }}>
        {/* Recent Case Studies */}
        <div className="adminCard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Case Studies</h2>
            <Link className="textLink" href="/admin/projects" style={{ fontSize: '0.85rem' }}>
              View all →
            </Link>
          </div>

          <table className="adminModernTable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Result</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                  </td>
                  <td>
                    <span className="adminPill">{p.category}</span>
                  </td>
                  <td style={{ fontSize: '0.84rem', color: '#16a34a', fontWeight: 600 }}>
                    {p.result || '—'}
                  </td>
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

        {/* Recent Blog Posts */}
        <div className="adminCard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Blog Articles</h2>
            <Link className="textLink" href="/admin/posts" style={{ fontSize: '0.85rem' }}>
              View all →
            </Link>
          </div>

          <table className="adminModernTable">
            <thead>
              <tr>
                <th>Article</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                  </td>
                  <td>
                    <span
                      className={`statusBadge ${
                        p.status === 'published' ? 'badgePublished' : 'badgeDraft'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
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
      </div>
    </div>
  );
}
