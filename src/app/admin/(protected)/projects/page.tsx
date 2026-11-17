import Link from 'next/link';
import { getProjects } from '@/lib/store';
import { ProjectRowActions } from '@/components/ProjectRowActions';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  const aiSeoCount = projects.filter((p) => (p.category || '').toLowerCase().includes('seo')).length;
  const adsCount = projects.filter((p) => (p.category || '').toLowerCase().includes('ad')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1150px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
            Case Studies &amp; Portfolio
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Manage client outcomes, verified metrics, performance statistics, and interactive case study modals.
          </p>
        </div>
        <Link
          className="btn btnPrimary"
          href="/admin/projects/new"
          style={{ padding: '9px 18px', fontSize: '0.88rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>+ Add New Case Study</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Total Case Studies
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Published in portfolio</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c2410c', fontWeight: 650 }}>
            AI SEO &amp; Organic
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c2410c', margin: '4px 0 2px' }}>
            {aiSeoCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Search authority cases</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', fontWeight: 650 }}>
            Paid Ads (Google &amp; Meta)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', margin: '4px 0 2px' }}>
            {adsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Paid acquisition cases</div>
        </div>
      </div>

      {/* Case Studies Table Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            All Published Case Studies
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {projects.length} entries
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ width: '27%', minWidth: '220px', padding: '14px 18px', verticalAlign: 'middle' }}>Case Study</th>
                <th style={{ width: '14%', minWidth: '120px', padding: '14px 14px', verticalAlign: 'middle' }}>Category</th>
                <th style={{ width: '18%', minWidth: '140px', padding: '14px 14px', verticalAlign: 'middle' }}>Client</th>
                <th style={{ width: '25%', minWidth: '200px', padding: '14px 14px', verticalAlign: 'middle' }}>Verified Key Outcome</th>
                <th style={{ width: '10%', minWidth: '95px', padding: '14px 14px', verticalAlign: 'middle' }}>Updated</th>
                <th style={{ width: '14%', minWidth: '130px', padding: '14px 18px', verticalAlign: 'middle', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.35 }}>{p.title}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', wordBreak: 'break-all' }}>/{p.slug}</div>
                  </td>
                  <td style={{ padding: '16px 14px', verticalAlign: 'top' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 750,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: p.category?.toLowerCase().includes('seo') ? '#c2410c' : p.category?.toLowerCase().includes('meta') ? '#0284c7' : '#2563eb',
                        background: p.category?.toLowerCase().includes('seo') ? '#fff7ed' : p.category?.toLowerCase().includes('meta') ? '#f0f9ff' : '#eff6ff',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px', verticalAlign: 'top', color: '#334155', fontWeight: 600, lineHeight: 1.45 }}>
                    {p.client || '—'}
                  </td>
                  <td style={{ padding: '16px 14px', verticalAlign: 'top', color: '#15803d', fontWeight: 650, lineHeight: 1.45 }}>
                    {p.result || '—'}
                  </td>
                  <td style={{ padding: '16px 14px', verticalAlign: 'top', color: '#64748b', fontSize: '0.82rem', whiteSpace: 'nowrap', lineHeight: 1.45 }}>
                    {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 18px', verticalAlign: 'top', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '30px',
                          padding: '0 12px',
                          fontSize: '0.8rem',
                          fontWeight: 650,
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          textDecoration: 'none',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        Edit
                      </Link>
                      <ProjectRowActions projectId={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No case studies found. Click &quot;Add New Case Study&quot; to create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
