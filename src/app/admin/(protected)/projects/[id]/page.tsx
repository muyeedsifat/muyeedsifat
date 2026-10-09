import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/store';
import { ProjectEditor } from '@/components/ProjectEditor';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <>
      <div className="adminActions" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Case Studies &amp; Portfolio</span>
          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>Edit Case Study</h1>
        </div>
        <Link className="buttonSmall" href="/admin/projects">
          ← Back to Projects
        </Link>
      </div>

      <ProjectEditor initialProject={project} />
    </>
  );
}
