import { getPages } from '@/lib/store';
import { PagesManager } from '@/components/PagesManager';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <>
      <div className="adminActions" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Content Management</span>
          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>Pages &amp; Sections</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.92rem' }}>
            Edit hero copy, introductions, and SEO options for key pages without altering code.
          </p>
        </div>
      </div>

      <PagesManager initialPages={pages} />
    </>
  );
}
