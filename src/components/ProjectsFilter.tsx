'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';

const filters = ['All', 'AI SEO', 'Google Ads', 'Meta Ads', 'WordPress'] as const;

export function ProjectsFilter() {
  const [active, setActive] = useState<(typeof filters)[number]>('All');
  const visible = useMemo(() => active === 'All' ? projects : projects.filter((project) => project.category === active), [active]);
  return (
    <>
      <div className="btnRow" role="group" aria-label="Filter projects" style={{ marginBottom: 28 }}>
        {filters.map((filter) => <button key={filter} onClick={() => setActive(filter)} className={`btn ${active === filter ? 'btnPrimary' : 'btnSecondary'}`} type="button">{filter}</button>)}
      </div>
      <div className="grid3">{visible.map((project, index) => <ProjectCard key={project.title} {...project} index={index} />)}</div>
    </>
  );
}
