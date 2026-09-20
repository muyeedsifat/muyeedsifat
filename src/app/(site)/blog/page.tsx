import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { getPublishedPosts } from '@/lib/store';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Digital Marketing Blog | Muyeed',
  description: 'Practical digital marketing articles covering AI SEO, AEO, GEO, Google Ads, Meta Ads, WordPress and conversion-focused website strategy.',
  path: '/blog'
});

export const dynamic = 'force-dynamic';

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const params = await searchParams;
  const query = (params.q || '').trim().toLowerCase();
  const category = (params.category || '').trim();
  const currentPage = Math.max(1, Number(params.page || 1) || 1);
  const perPage = 6;
  const allPosts = await getPublishedPosts();
  const filtered = allPosts.filter((post) => {
    const matchesQuery = !query || `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase().includes(query);
    const matchesCategory = !category || post.categories.includes(category);
    return matchesQuery && matchesCategory;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(currentPage, totalPages);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const popular = allPosts.slice(0, 4);
  return (
    <>
      <section className="pageHero"><div className="container"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} /><span className="eyebrow">Insights</span><h1>Digital Marketing Insights for Better Decisions</h1><p className="lead">Practical articles about AI SEO, paid advertising, WordPress and the systems that connect visibility to conversion.</p></div></section>
      <section className="section"><div className="container blogLayout"><aside className="sidebar"><form action="/blog" method="get"><label htmlFor="q" className="eyebrow">Search Articles</label><input className="searchBox" id="q" name="q" defaultValue={params.q} placeholder="Search articles" /></form><div className="popularList"><h3>Popular Articles</h3>{popular.map((post) => <Link href={`/blog/${post.slug}`} key={post.id}>{post.title}</Link>)}</div></aside><div><div className="blogList">{visible.map((post) => <article className="card blogCard" key={post.id}><div className="blogThumb">{post.categories[0] || 'Digital Marketing'}</div><div><span className="tag">{post.categories[0] || 'Digital Marketing'}</span><h2 style={{ fontSize: '1.55rem' }}><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><div className="metaRow"><span>{new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span><span>•</span><span>Muyeed Sifat</span></div><Link className="textLink" href={`/blog/${post.slug}`}>Read Article →</Link></div></article>)}</div>{visible.length === 0 && <div className="card"><h2>No articles found</h2><p>Try a broader search term.</p></div>}<div className="pagination">{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => n === page ? <span className="active" key={n}>{n}</span> : <Link key={n} href={`/blog?${new URLSearchParams({ ...(params.q ? { q: params.q } : {}), ...(category ? { category } : {}), page: String(n) }).toString()}`}>{n}</Link>)}</div></div></div></section>
      <FAQ title="Digital Marketing Blog Questions" faqs={[{question:'What topics do you cover?',answer:'The blog covers AI SEO, AEO, GEO, Google Ads, Meta Ads, WordPress and conversion-focused digital marketing.'},{question:'Do you cover AI search and GEO?',answer:'Yes. AI search visibility, AEO and GEO are covered alongside traditional SEO foundations.'},{question:'Do you publish PPC guides?',answer:'Yes. Google Ads and Meta Ads content focuses on campaign structure, targeting, testing, measurement and landing-page alignment.'},{question:'Are the WordPress articles for developers?',answer:'Most WordPress content is written from a marketing and website-performance perspective rather than deep custom development.'},{question:'Can I suggest an article topic?',answer:'Yes. Use the contact page to suggest a question or topic related to digital marketing or WordPress.'}]} />
      <CTA title="Need Help Beyond the Articles?" text="Turn the strategy into implementation across AI SEO, Google Ads, Meta Ads or WordPress support." />
    </>
  );
}
