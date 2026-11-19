'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface SitemapLinkItem {
  id: string;
  title: string;
  url: string;
  path: string;
  category: 'primary' | 'pillar' | 'project' | 'location' | 'post' | 'protocol' | 'core' | 'service';
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [copyFormat, setCopyFormat] = useState<'plain' | 'markdown' | 'csv'>('plain');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      all: items.length,
      primary: items.filter((i) => i.category === 'primary' || i.category === 'core').length,
      pillar: items.filter((i) => i.category === 'pillar' || i.category === 'service').length,
      project: items.filter((i) => i.category === 'project').length,
      location: items.filter((i) => i.category === 'location').length,
      post: items.filter((i) => i.category === 'post').length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === 'all' ||
        item.category === activeTab ||
        (activeTab === 'primary' && item.category === 'core') ||
        (activeTab === 'pillar' && item.category === 'service');
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
    const a = document.createElement('a');
    a.href = '/api/sitemap/download';
    a.download = 'muyeedsifat-sitemap-export.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  const handleUpdateSitemap = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/sitemap/update', { method: 'POST' });
      if (res.ok) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncedTime(timeStr);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to update sitemap files:', err);
    } finally {
      setTimeout(() => setIsUpdating(false), 900);
    }
  };

  return (
    <div className="sitemapViewerWrapper">
      {/* Top Action & Protocol Banner */}
      <div className="sitemapActionToolbar">
        <div className="sitemapActionLeft">
          <div className="sitemapActionHeaderRow">
            <span className="sitemapLiveIndicator">
              <span className="sitemapLiveDot"></span> Continuous Real-Time Auto-Update Active
            </span>
            {lastSyncedTime && (
              <span className="sitemapSyncBadge">
                ✓ Synced at {lastSyncedTime}
              </span>
            )}
          </div>
          <h2 className="sitemapActionTitle">Copy, Update &amp; Download Sitemap Assets</h2>
          <p className="sitemapActionDesc">
            These sitemaps automatically update whenever any project, blog post, or service is published. You can also trigger an instant on-demand cache re-sync, copy links, or download the structured ZIP file organized by category folders.
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

          {/* Update / Refresh Button */}
          <button
            type="button"
            className={`sitemapMainBtn sitemapUpdateBtn ${isUpdating ? 'updating' : ''}`}
            onClick={handleUpdateSitemap}
            disabled={isUpdating}
            title="Force immediate cache revalidation across all sitemaps, feeds and JSON exports"
          >
            <svg
              className={`sitemapUpdateIcon ${isUpdating ? 'sitemapSpinner' : ''}`}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            {isUpdating ? 'Updating & Syncing...' : 'Update & Re-Sync'}
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
        <div className="sitemapBentoCell" onClick={() => setActiveTab('primary')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.primary}</div>
          <div className="sitemapBentoLabel">Primary Page</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('pillar')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.pillar}</div>
          <div className="sitemapBentoLabel">Piller Category Page</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('project')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.project}</div>
          <div className="sitemapBentoLabel">Project ({counts.project})</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('location')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.location}</div>
          <div className="sitemapBentoLabel">Location Page</div>
        </div>
        <div className="sitemapBentoCell" onClick={() => setActiveTab('post')} style={{ cursor: 'pointer' }}>
          <div className="sitemapBentoValue">{counts.post}</div>
          <div className="sitemapBentoLabel">Blog Post</div>
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

        {/* Category Tabs & View Mode Toggle */}
        <div className="sitemapTabsAndToggleRow">
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
              className={`sitemapTabBtn ${activeTab === 'primary' ? 'active' : ''}`}
              onClick={() => setActiveTab('primary')}
            >
              Primary Page <span className="sitemapTabCount">{counts.primary}</span>
            </button>
            <button
              type="button"
              className={`sitemapTabBtn ${activeTab === 'pillar' ? 'active' : ''}`}
              onClick={() => setActiveTab('pillar')}
            >
              Piller Category Page <span className="sitemapTabCount">{counts.pillar}</span>
            </button>
            <button
              type="button"
              className={`sitemapTabBtn ${activeTab === 'project' ? 'active' : ''}`}
              onClick={() => setActiveTab('project')}
            >
              Project <span className="sitemapTabCount">{counts.project}</span>
            </button>
            <button
              type="button"
              className={`sitemapTabBtn ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              Location Page <span className="sitemapTabCount">{counts.location}</span>
            </button>
            <button
              type="button"
              className={`sitemapTabBtn ${activeTab === 'post' ? 'active' : ''}`}
              onClick={() => setActiveTab('post')}
            >
              Blog Post <span className="sitemapTabCount">{counts.post}</span>
            </button>
          </div>

          <div className="sitemapViewToggle">
            <button
              type="button"
              className={`sitemapViewBtn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Grid
            </button>
            <button
              type="button"
              className={`sitemapViewBtn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Tabular View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              Table
            </button>
          </div>
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

      {/* Directory Grid View */}
      {viewMode === 'grid' && (
        <>
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
        </>
      )}

      {/* Directory Table View */}
      {viewMode === 'table' && (
        <div className="sitemapTableCard">
          <table className="sitemapDataTable">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>#</th>
                <th>Resource Title &amp; URL</th>
                <th style={{ width: '130px' }}>Category</th>
                <th style={{ width: '85px' }}>Priority</th>
                <th style={{ width: '100px' }}>ChangeFreq</th>
                <th style={{ width: '120px' }}>Last Modified</th>
                <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                  <td>
                    <Link href={item.path} className="sitemapTableTitleLink">
                      {item.title}
                    </Link>
                    <div className="sitemapTableSubUrl">
                      <code>{item.url}</code>
                    </div>
                  </td>
                  <td>
                    <span className={`sitemapCategoryBadge badge-${item.category}`}>
                      {item.categoryLabel}
                    </span>
                  </td>
                  <td>
                    <span className="sitemapPriorityPill">P: {item.priority}</span>
                  </td>
                  <td>
                    <span className="sitemapFreqPill">{item.changefreq}</span>
                  </td>
                  <td>
                    <span className="sitemapCardDate">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'Current'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className={`sitemapCopyCardBtn ${copiedCardId === item.id ? 'copied' : ''}`}
                      onClick={() => handleCopySingle(item)}
                    >
                      {copiedCardId === item.id ? '✓' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
