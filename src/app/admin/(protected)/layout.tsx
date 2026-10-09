import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminLogout } from '@/components/AdminLogout';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login-dashboard');

  return (
    <div className="adminShell">
      <header className="adminTop">
        <div className="container">
          <div className="brand">
            <span className="brandMark">M</span>
            <span className="brandDivider">|</span>
            <span>Muyeed CMS &amp; Backend</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              href="/"
              target="_blank"
              style={{ fontSize: '0.86rem', color: '#ccc', textDecoration: 'none' }}
            >
              View Website ↗
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>

      <div className="container adminLayout">
        <aside className="adminSidebar">
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', padding: '6px 12px', fontWeight: 800 }}>
            Management
          </div>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/posts">Blog Posts</Link>
          <Link href="/admin/posts/new">+ New Post</Link>
          <Link href="/admin/projects">Case Studies</Link>
          <Link href="/admin/projects/new">+ New Case Study</Link>
          <Link href="/admin/pages">Pages Content</Link>

          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', padding: '12px 12px 6px', fontWeight: 800 }}>
            Engagements
          </div>
          <Link href="/admin/chats">AI Chat Records</Link>
          <Link href="/admin/media">Media Library</Link>
          <Link href="/admin/taxonomy">Taxonomy</Link>
          <Link href="/admin/settings">Settings</Link>
        </aside>

        <section className="adminMain">{children}</section>
      </div>
    </div>
  );
}
