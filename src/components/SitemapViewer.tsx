'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface SitemapLinkItem {
  id: string;
  title: string;
  url: string;
  path: string;
  category: 'core' | 'service' | 'project' | 'post' | 'protocol';
  categoryLabel: string;
  description: string;
  priority: string;
  changefreq: string;
  updatedAt?: string;
  badge?: string;
}

interface SitemapViewerProps {
  items: SitemapLinkItem[];
}

export function SitemapViewer({ items }: SitemapViewerProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const counts = useMemo(() => {
    return {
      all: items.length,
      core: items.filter((i) => i.category === 'core').length,
      service: items.filter((i) => i.category === 'service').length,
      project: items.filter((i) => i.category === 'project').length,
      post: items.filter((i) => i.category === 'post').length,
      protocol: items.filter((i) => i.category === 'protocol').length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="sitemapViewerWrapper">
      {/* Top Protocol Action Banner */}
      <div className="sitemapProtocolBanner">
        <div className="sitemapProtocolText">
          <strong>Machine &amp; AI Directives:</strong> Looking for machine-readable feeds?
        </div>
        <div className="sitemapProtocolButtons">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="sitemapProtocolBtn sitemapProtocolBtnPrimary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            XML Sitemap (sitemap.xml)
          </a>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="sitemapProtocolBtn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
            LLM Manifest (llms.txt)
          </a>
          <a
            href="/llms-full.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="sitemapProtocolBtn"
          >
            Extended LLM (llms-full.txt)
          </a>
        </div>
      </div>

      {/* Symmetric Bento Stat Bar */}
      <div className="sitemapBentoBar">
        <div className="sitemapBentoCell" onClick={() => setActiveTab('all')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.all}</div>
          <div className="sitemapBentoLabel">Total Published URLs</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('core')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.core}</div>
          <div className="sitemapBentoLabel">Core Landing Pages</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('service')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.service}</div>
          <div className="sitemapBentoLabel">Service Pillars</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('project')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.project}</div>
          <div className="sitemapBentoLabel">Client Case Studies</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('post')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.post}</div>
          <div className="sitemapBentoLabel">Strategic Articles</div>
        </div>
      </div>

      {/* Filter and Tab Navigation Bar */}
      <div className="sitemapControlsBar">
        {/* Search Input */}
        <div className="sitemapSearchBox">
          <svg
            className="sitemapSearchIcon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sitemapSearchInput"
            placeholder="Search directory by page title, URL slug, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="sitemapSearchClear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="sitemapCategoryTabs">
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Links <span className="sitemapTabCount">{counts.all}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'core' ? 'active' : ''}`}
            onClick={() => setActiveTab('core')}
          >
            Core Pages <span className="sitemapTabCount">{counts.core}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            Services <span className="sitemapTabCount">{counts.service}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'project' ? 'active' : ''}`}
            onClick={() => setActiveTab('project')}
          >
            Case Studies <span className="sitemapTabCount">{counts.project}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'post' ? 'active' : ''}`}
            onClick={() => setActiveTab('post')}
          >
            Articles <span className="sitemapTabCount">{counts.post}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'protocol' ? 'active' : ''}`}
            onClick={() => setActiveTab('protocol')}
          >
            Protocols <span className="sitemapTabCount">{counts.protocol}</span>
          </button>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="sitemapResultsSummary">
        Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> indexed resources
        {searchQuery && (
          <span>
            {' '}matching &quot;<strong>{searchQuery}</strong>&quot;
          </span>
        )}
      </div>

      {/* Directory Grid */}
      {filteredItems.length > 0 ? (
        <div className="sitemapCardGrid">
          {filteredItems.map((item) => (
            <div key={item.id} className="sitemapCard">
              <div className="sitemapCardHeader">
                <span className={`sitemapCategoryBadge badge-${item.category}`}>
                  {item.categoryLabel}
                </span>
                <div className="sitemapMetaPills">
                  <span className="sitemapPriorityPill" title={`Priority: ${item.priority}`}>
                    P: {item.priority}
                  </span>
                  <span className="sitemapFreqPill" title={`Change frequency: ${item.changefreq}`}>
                    {item.changefreq}
                  </span>
                </div>
              </div>

              <h3 className="sitemapCardTitle">
                <Link href={item.path} className="sitemapCardLink">
                  {item.title}
                  <svg
                    className="sitemapArrowIcon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </Link>
              </h3>

              <div className="sitemapCardPath">
                <code>{item.path}</code>
              </div>

              <p className="sitemapCardDesc">{item.description}</p>

              {item.updatedAt && (
                <div className="sitemapCardFooter">
                  <span className="sitemapCardDate">
                    Updated: {new Date(item.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="sitemapEmptyState">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="sitemapEmptyTitle">No matching pages found</div>
          <p className="sitemapEmptyText">
            No indexed link matched &quot;{searchQuery}&quot;. Try adjusting your search query or reset the filter.
          </p>
          <button
            type="button"
            className="sitemapResetBtn"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
