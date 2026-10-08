import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTA } from '@/components/CTA';
import { FAQ } from '@/components/FAQ';
import { BlogSearch } from '@/components/BlogSearch';
import { CategorySelect } from '@/components/CategorySelect';
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
  const rawQuery = (params.q || '').trim();
  const query = rawQuery.toLowerCase();
  const activeCategory = (params.category || '').trim();
  const currentPage = Math.max(1, Number(params.page || 1) || 1);
  const perPage = 4; // Enables clear pagination across top and bottom

  const allPosts = await getPublishedPosts();

  // Extract all unique categories
  const categoriesSet = new Set<string>();
  allPosts.forEach((p) => {
    (p.categories || []).forEach((c) => {
      if (c) categoriesSet.add(c);
    });
  });
  const allCategories = Array.from(categoriesSet);

  const filtered = allPosts.filter((post) => {
    const postCategories = post.categories || [];
    const postTags = post.tags || [];
    const matchesQuery = !query || `${post.title || ''} ${post.excerpt || ''} ${postTags.join(' ')}`.toLowerCase().includes(query);
    const matchesCategory = !activeCategory || postCategories.includes(activeCategory);
    return matchesQuery && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(currentPage, totalPages);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);
  const popular = allPosts.slice(0, 4);

  // Helper to build pagination query URL
  function buildPageUrl(targetPage: number, cat = activeCategory, q = rawQuery) {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (cat) sp.set('category', cat);
    if (targetPage > 1) sp.set('page', String(targetPage));
    const str = sp.toString();
    return str ? `/blog?${str}` : '/blog';
  }

  const renderPagination = (position: 'top' | 'bottom') => {
    if (totalPages <= 1) return null;
    return (
      <div className={`pagination ${position === 'top' ? 'paginationTop' : 'paginationBottom'}`} aria-label={`Blog pagination (${position})`}>
        {page > 1 ? (
          <Link href={buildPageUrl(page - 1)} className="paginationArrow" aria-label="Previous page">
            ← Prev
          </Link>
        ) : (
          <span className="paginationArrow disabled" aria-disabled="true">← Prev</span>
        )}

        <div className="paginationNumbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span className="active" key={n} aria-current="page">{n}</span>
            ) : (
              <Link key={n} href={buildPageUrl(n)}>{n}</Link>
            )
          )}
        </div>

        {page < totalPages ? (
          <Link href={buildPageUrl(page + 1)} className="paginationArrow" aria-label="Next page">
            Next →
          </Link>
        ) : (
          <span className="paginationArrow disabled" aria-disabled="true">Next →</span>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
          <span className="eyebrow">Insights &amp; Strategy</span>
          <h1>Digital Marketing Insights for Better Decisions</h1>
          <p className="lead">Practical articles about AI SEO, paid advertising, WordPress and the systems that connect visibility to measurable conversion.</p>
        </div>
      </section>

      <section className="section">
        <div className="container blogLayout">
          {/* Sidebar with interactive Live Search */}
          <aside className="sidebar">
            <BlogSearch
              posts={allPosts.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                categories: p.categories,
                publishedAt: p.publishedAt,
                updatedAt: p.updatedAt,
                featuredImage: p.featuredImage
              }))}
              initialQuery={rawQuery}
            />

            <div className="popularList">
              <h3>Popular Articles</h3>
              {popular.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                  {post.title}
                </Link>
              ))}
            </div>
          </aside>

          {/* Main Blog Content Area */}
          <div className="blogMainContent">
            {/* Category Filter Dropdown */}
            <CategorySelect
              categories={allCategories.map((cat) => ({
                name: cat,
                count: allPosts.filter((p) => (p.categories || []).includes(cat)).length
              }))}
              activeCategory={activeCategory}
              totalCount={allPosts.length}
              searchQuery={rawQuery}
            />

            {/* Results Status & Top Pagination */}
            <div className="blogListHeader">
              <div className="blogResultsCount">
                {rawQuery || activeCategory ? (
                  <span>
                    Found <strong>{filtered.length}</strong> {filtered.length === 1 ? 'article' : 'articles'}
                    {activeCategory && <> in <em>{activeCategory}</em></>}
                    {rawQuery && <> matching &ldquo;{rawQuery}&rdquo;</>}
                    {' '}
                    <Link href="/blog" className="filterResetLink">(Clear filters)</Link>
                  </span>
                ) : (
                  <span>Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({filtered.length} total)</span>
                )}
              </div>
              {renderPagination('top')}
            </div>

            {/* Visible Blog Articles */}
            <div className="blogList">
              {visible.map((post) => (
                <article className="card blogCard" key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="blogThumbLink" aria-label={`Read ${post.title}`}>
                    <div className="blogThumb">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.featuredAlt || post.title}
                          width={1200}
                          height={630}
                          className="blogThumbImg"
                          sizes="(max-width: 680px) 100vw, (max-width: 980px) 260px, 320px"
                          priority={page === 1}
                          unoptimized
                        />
                      ) : (
                        <div className="blogThumbPlaceholder">
                          <span>{post.categories[0] || 'Article'}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="blogCardBody">
                    <div className="blogCardMetaTop">
                      <span className="tag">{post.categories[0] || 'Digital Marketing'}</span>
                      <time dateTime={post.publishedAt || post.updatedAt} className="blogDate">
                        {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                    <h2 className="blogCardTitle">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="blogCardExcerpt">{post.excerpt}</p>
                    <div className="metaRow">
                      <span>Muyeed Sifat</span>
                      <span>•</span>
                      <Link className="textLink" href={`/blog/${post.slug}`}>
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {visible.length === 0 && (
              <div className="card blogEmptyCard">
                <h2>No articles found</h2>
                <p>No posts match your current search or category filters.</p>
                <Link href="/blog" className="btn btnPrimary" style={{ marginTop: 14 }}>
                  Browse All Articles
                </Link>
              </div>
            )}

            {/* Bottom Pagination */}
            {renderPagination('bottom')}
          </div>
        </div>
      </section>

      <FAQ
        title="Digital Marketing Blog Questions"
        faqs={[
          { question: 'What topics do you cover?', answer: 'The blog covers AI SEO, AEO, GEO, Google Ads, Meta Ads, WordPress and conversion-focused digital marketing.' },
          { question: 'Do you cover AI search and GEO?', answer: 'Yes. AI search visibility, AEO and GEO are covered alongside traditional SEO foundations.' },
          { question: 'Do you publish PPC guides?', answer: 'Yes. Google Ads and Meta Ads content focuses on campaign structure, targeting, testing, measurement and landing-page alignment.' },
          { question: 'Are the WordPress articles for developers?', answer: 'Most WordPress content is written from a marketing and website-performance perspective rather than deep custom development.' },
          { question: 'Can I suggest an article topic?', answer: 'Yes. Use the contact page to suggest a question or topic related to digital marketing or WordPress.' }
        ]}
      />
      <CTA title="Need Help Beyond the Articles?" text="Turn the strategy into implementation across AI SEO, Google Ads, Meta Ads or WordPress support." />
    </>
  );
}
