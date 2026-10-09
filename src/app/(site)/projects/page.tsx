import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { ProjectsFilter } from '@/components/ProjectsFilter';
import { pageMetadata } from '@/lib/seo';
import { getProjects } from '@/lib/store';

export const metadata: Metadata = pageMetadata({
  title: 'Digital Marketing Projects | Muyeed',
  description: 'Explore digital marketing projects across AI SEO, Google Ads, Meta Ads and WordPress, including organic growth, paid search and paid social work.',
  path: '/projects'
});

export const dynamic = 'force-dynamic';

const faqs = [
  { question: 'Do project pages include performance metrics?', answer: 'Where confidentiality and verified data allow it, case studies can include traffic, visibility, lead or conversion improvements.' },
  { question: 'Can I request a similar project?', answer: 'Yes. Use the contact page and reference the project or service closest to what you need.' },
  { question: 'Do you work with existing campaigns or websites?', answer: 'Yes. Projects can begin with audits, restructuring, optimization or complete rebuilds depending on the current situation.' },
  { question: 'Can a project combine multiple services?', answer: 'Yes. For example, a Google Ads project can include WordPress landing-page improvements where the click experience needs work.' },
  { question: 'Do you provide ongoing support after a project?', answer: 'Yes. Monthly support can follow a one-time project when continuous optimization is useful.' }
];

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
          <span className="eyebrow">Portfolio &amp; Case Studies</span>
          <h1>Digital Marketing Projects and Results</h1>
          <p className="lead">
            Explore verified work across AI SEO, Google Ads, Meta Ads and WordPress support, with the focus kept on measurable business outcomes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProjectsFilter initialProjects={projects} />
        </div>
      </section>

      <FAQ title="Project Questions" faqs={faqs} />
      <CTA title="Have a Similar Project in Mind?" text="Share your goals and current setup. I’ll help map the most practical next step." />
    </>
  );
}
