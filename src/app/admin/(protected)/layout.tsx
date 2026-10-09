import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminLogout } from '@/components/AdminLogout';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login-dashboard');

  return (
    <div className="adminModernShell">
      {/* Top Global Navigation */}
      <header className="adminModernTop">
        <div className="adminTopContainer">
          <div className="adminBrand">
            <span className="adminBrandMark">M</span>
            <div className="adminBrandText">
              <strong>Muyeed CMS</strong>
              <span className="adminBrandBadge">Enterprise Pro</span>
            </div>
          </div>

          <div className="adminTopRight">
            <div className="adminDbPill">
              <span className="dbDot" />
              <span>Database Active</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="adminViewSiteLink"
            >
              <span>View Website</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            <div className="adminUserSection">
              <span className="adminAvatar">MS</span>
              <AdminLogout />
            </div>
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="adminLayoutWrap">
        {/* Modern Sidebar */}
        <aside className="adminModernSidebar">
          <nav className="adminNavSection">
            <div className="navSectionHeader">Content Studio</div>
            <Link href="/admin" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link href="/admin/posts" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Blog Articles</span>
            </Link>

            <Link href="/admin/posts/new" className="adminNavSubLink">
              <span>+ Write Article</span>
            </Link>

            <Link href="/admin/projects" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Case Studies</span>
            </Link>

            <Link href="/admin/projects/new" className="adminNavSubLink">
              <span>+ New Case Study</span>
            </Link>

            <Link href="/admin/pages" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Pages &amp; Content</span>
            </Link>
          </nav>

          <nav className="adminNavSection">
            <div className="navSectionHeader">Assets &amp; Engagement</div>
            <Link href="/admin/media" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>Media Library</span>
              <span className="navPillBadge">WebP</span>
            </Link>

            <Link href="/admin/chats" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>AI Chat Logs</span>
              <span className="navPillBadge liveBadge">AI</span>
            </Link>

            <Link href="/admin/taxonomy" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Taxonomy</span>
            </Link>
          </nav>

          <nav className="adminNavSection">
            <div className="navSectionHeader">System &amp; Database</div>
            <Link href="/admin/settings" className="adminNavLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Settings &amp; Supabase</span>
            </Link>
          </nav>
        </aside>

        {/* Dynamic Page Content */}
        <main className="adminModernMain">{children}</main>
      </div>
    </div>
  );
}
