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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [copyFormat, setCopyFormat] = useState<'plain' | 'markdown' | 'csv'>('plain');
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleCopyLinks = async () => {
    const targetItems = filteredItems.length > 0 ? filteredItems : items;
    let textToCopy = '';

    if (copyFormat === 'plain') {
      textToCopy = targetItems.map((i) => i.url).join('\n');
    } else if (copyFormat === 'markdown') {
      textToCopy = targetItems.map((i) => `- [${i.title}](${i.url}) (${i.categoryLabel})`).join('\n');
    } else if (copyFormat === 'csv') {
      const header = 'Title,URL,Path,Category,Priority,ChangeFreq\n';
      const rows = targetItems
        .map(
          (i) =>
            `"${i.title.replace(/"/g, '""')}","${i.url}","${i.path}","${i.categoryLabel}","${i.priority}","${i.changefreq}"`
        )
        .join('\n');
      textToCopy = header + rows;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus(`Copied ${targetItems.length} Links!`);
        setTimeout(() => setCopyStatus(null), 2500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleCopySingle = async (item: SitemapLinkItem) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(item.url);
        setCopiedCardId(item.id);
        setTimeout(() => setCopiedCardId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy single link:', err);
    }
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    // Programmatic trigger of /api/sitemap/download
    const a = document.createElement('a');
    a.href = '/api/sitemap/download';
    a.download = 'muyeedsifat-sitemap-export.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="sitemapViewerWrapper">
      {/* Top Action & Protocol Banner */}
      <div className="sitemapActionToolbar">
        <div className="sitemapActionLeft">
          <div className="sitemapActionEyebrow">EXPORT &amp; INGESTION TOOLS</div>
          <h2 className="sitemapActionTitle">Copy &amp; Download Sitemap Assets</h2>
          <p className="sitemapActionDesc">
            Download the complete website structure packaged into organized folders (Category Pages, Sub-Categories, 21 Case Studies, Blog Posts, and Protocols), or copy all URLs for SEO auditing.
          </p>
        </div>

        <div className="sitemapActionButtons">
          {/* Format selector */}
          <div className="sitemapFormatSelector">
            <label htmlFor="copyFormatSelect" className="sitemapFormatLabel">
              Format:
            </label>
            <select
              id="copyFormatSelect"
              className="sitemapSelectInput"
              value={copyFormat}
              onChange={(e) => setCopyFormat(e.target.value as 'plain' | 'markdown' | 'csv')}
            >
              <option value="plain">Plain URLs (TXT)</option>
              <option value="markdown">Markdown List</option>
              <option value="csv">Structured CSV</option>
            </select>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            className={`sitemapMainBtn sitemapCopyBtn ${copyStatus ? 'success' : ''}`}
            onClick={handleCopyLinks}
          >
            {copyStatus ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {copyStatus}
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {searchQuery || activeTab !== 'all'
                  ? `Copy Filtered Links (${filteredItems.length})`
                  : `Copy All Links (${items.length})`}
              </>
            )}
          </button>

          {/* Download ZIP Button */}
          <button
            type="button"
            className="sitemapMainBtn sitemapDownloadBtn"
            onClick={handleDownloadZip}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <svg
                  className="sitemapSpinner"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                Packaging Folders...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Sitemap ZIP (Folder Structure)
              </>
            )}
          </button>
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
          <div className="sitemapBentoLabel">Category Pages</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('service')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.service}</div>
          <div className="sitemapBentoLabel">Sub-Category Pillars</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('project')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.project}</div>
          <div className="sitemapBentoLabel">Case Studies (21)</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('post')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.post}</div>
          <div className="sitemapBentoLabel">Blog Articles</div>
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
            Category Pages <span className="sitemapTabCount">{counts.core}</span>
          </button>
          <button
            type="button"
            className={`sitemapTabBtn ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            Sub-Categories <span className="sitemapTabCount">{counts.service}</span>
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
            Blog Posts <span className="sitemapTabCount">{counts.post}</span>
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

      {/* Results Count & Quick Actions Summary */}
      <div className="sitemapResultsSummary">
        <div>
          Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> indexed resources
          {searchQuery && (
            <span>
              {' '}matching &quot;<strong>{searchQuery}</strong>&quot;
            </span>
          )}
        </div>

        <div className="sitemapFeedQuickLinks">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="sitemapSmallFeedLink">
            View sitemap.xml ↗
          </a>
          <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="sitemapSmallFeedLink">
            View llms.txt ↗
          </a>
          <a href="/api/sitemap/download" className="sitemapSmallFeedLink sitemapSmallFeedLinkDownload">
            Direct ZIP Download ↓
          </a>
        </div>
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
                  <button
                    type="button"
                    className={`sitemapCopyCardBtn ${copiedCardId === item.id ? 'copied' : ''}`}
                    onClick={() => handleCopySingle(item)}
                    title="Copy URL to clipboard"
                    aria-label={`Copy URL for ${item.title}`}
                  >
                    {copiedCardId === item.id ? (
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Copied</span>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
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
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sitemapOpenLink"
                  >
                    Visit Page ↗
                  </a>
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
