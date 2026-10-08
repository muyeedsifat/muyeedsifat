'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type SearchablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
  publishedAt?: string;
  updatedAt: string;
  featuredImage?: string;
};

export function BlogSearch({ posts, initialQuery = '' }: { posts: SearchablePost[]; initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed.length >= 1
    ? posts.filter((post) => {
        const inTitle = post.title.toLowerCase().includes(trimmed);
        const inExcerpt = post.excerpt.toLowerCase().includes(trimmed);
        const inCategory = post.categories.some((c) => c.toLowerCase().includes(trimmed));
        return inTitle || inExcerpt || inCategory;
      })
    : [];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsOpen(false);
    if (trimmed) {
      router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/blog');
    }
  }

  function handleClear() {
    setQuery('');
    setIsOpen(false);
    router.push('/blog');
  }

  return (
    <div className="searchWrapper" ref={containerRef}>
      <label htmlFor="blogSearchInput" className="eyebrow">Search Articles</label>
      <form onSubmit={handleSubmit} className="searchForm">
        <div className="searchInputBox">
          <svg className="searchIcon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="blogSearchInput"
            type="text"
            className="searchBox"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 1) setIsOpen(true);
            }}
            placeholder="Type at least 1 letter to search..."
            autoComplete="off"
          />
          {query && (
            <button type="button" className="searchClearBtn" onClick={handleClear} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && trimmed.length >= 1 && (
        <div className="searchDropdown" role="listbox" aria-label="Search suggestions">
          <div className="searchDropdownHeader">
            <span>Matches for &ldquo;{query}&rdquo; ({matches.length})</span>
            <span className="searchDropdownHint">Press Esc to close</span>
          </div>

          {matches.length > 0 ? (
            <div className="searchDropdownList">
              {matches.slice(0, 6).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="searchDropdownItem"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="searchDropdownItemMain">
                    <span className="searchDropdownCat">{post.categories[0] || 'Article'}</span>
                    <strong className="searchDropdownTitle">{post.title}</strong>
                    <p className="searchDropdownSnippet">{post.excerpt}</p>
                  </div>
                  <span className="searchDropdownArrow" aria-hidden="true">→</span>
                </Link>
              ))}
              <div className="searchDropdownFooter">
                <button type="button" className="searchDropdownViewAll" onClick={handleSubmit}>
                  View full results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </div>
          ) : (
            <div className="searchDropdownEmpty">
              <p>No articles found matching &ldquo;{query}&rdquo;.</p>
              <span>Try checking for typos or searching by topic like &ldquo;AI&rdquo;, &ldquo;Google&rdquo;, &ldquo;Meta&rdquo;, or &ldquo;WordPress&rdquo;.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
