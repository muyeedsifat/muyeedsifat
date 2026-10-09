import Link from 'next/link';
import { getProjects } from '@/lib/store';
import { ProjectRowActions } from '@/components/ProjectRowActions';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <div className="adminActions" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Case Studies &amp; Portfolio</span>
          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>Projects Management</h1>
        </div>
        <Link className="btn btnPrimary" href="/admin/projects/new">
          + Add New Case Study
        </Link>
      </div>

      <div className="adminCard">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Client</th>
              <th>Result Highlight</th>
              <th>Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#777' }}>/{p.slug}</div>
                </td>
                <td>
                  <span className="tag" style={{ margin: 0 }}>{p.category}</span>
                </td>
                <td>{p.client || '—'}</td>
                <td style={{ color: 'var(--ink)', fontWeight: 650 }}>{p.result || '—'}</td>
                <td style={{ fontSize: '0.84rem', color: '#888' }}>
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <Link className="buttonSmall" href={`/admin/projects/${p.id}`}>
                      Edit
                    </Link>
                    <ProjectRowActions projectId={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#777' }}>
                  No case studies found. Click &quot;Add New Case Study&quot; to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
