'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { projects as staticProjects } from '@/data/projects';
import type { Project } from '@/types/content';

const filters = ['All', 'AI SEO', 'Google Ads', 'Meta Ads', 'WordPress'] as const;

export function ProjectsFilter({ initialProjects }: { initialProjects?: Project[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>('All');
  const allProjects = initialProjects && initialProjects.length > 0 ? initialProjects : (staticProjects as unknown as Project[]);

  const visible = useMemo(
    () => (active === 'All' ? allProjects : allProjects.filter((project) => project.category === active)),
    [active, allProjects]
  );

  return (
    <>
      <div className="btnRow" role="group" aria-label="Filter projects" style={{ marginBottom: 28 }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`btn ${active === filter ? 'btnPrimary' : 'btnSecondary'}`}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid3">
        {visible.map((project, index) => (
          <ProjectCard key={project.id || project.title} {...project} index={index} />
        ))}
      </div>
    </>
  );
}
