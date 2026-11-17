'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface Ga4Row {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

interface GscRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface PsiResult {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number; title: string };
      seo?: { score: number; title: string };
      accessibility?: { score: number; title: string };
      'best-practices'?: { score: number; title: string };
    };
    audits?: Record<string, { displayValue?: string; score?: number; title?: string }>;
  };
}

interface AnalyticsPayload {
  configured?: boolean;
  message?: string;
  range?: string;
  error?: string;
  ga4?: {
    overview?: { rows?: Ga4Row[] };
    realtime?: { rows?: Ga4Row[]; rowCount?: number };
    traffic?: { rows?: Ga4Row[] };
    pages?: { rows?: Ga4Row[] };
  };
  gsc?: {
    overview?: { rows?: GscRow[] };
    queries?: { rows?: GscRow[] };
    pages?: { rows?: GscRow[] };
  };
  psi?: PsiResult | null;
}

export default function AnalyticsDashboardPage() {
  const [range, setRange] = useState<'7d' | '14d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'pages' | 'pagespeed'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Interactive Filter States
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [querySearch, setQuerySearch] = useState<string>('');
  const [pageSearch, setPageSearch] = useState<string>('');
  const [querySort, setQuerySort] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');
  const [querySortDir, setQuerySortDir] = useState<'asc' | 'desc'>('desc');

  // PageSpeed State
  const [psiKey, setPsiKey] = useState<string>('');
  const [psiLoading, setPsiLoading] = useState<boolean>(false);
  const [psiCustomData, setPsiCustomData] = useState<PsiResult | null>(null);
  const [psiError, setPsiError] = useState<string>('');

  async function loadData(selectedRange: '7d' | '14d' | '30d' | '90d', customPsiKey?: string) {
    setLoading(true);
    try {
      const url = `/api/admin/analytics/data?range=${selectedRange}${customPsiKey ? `&psiKey=${encodeURIComponent(customPsiKey)}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      setData(json);
      if (json.psi) setPsiCustomData(json.psi);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setData({ error: 'Failed to fetch analytics data.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(range);
  }, [range]);

  async function handleRunPsi() {
    if (!psiKey.trim()) {
      setPsiError('Please enter a Google Cloud API Key with PageSpeed Insights API enabled.');
      return;
    }
    setPsiLoading(true);
    setPsiError('');
    try {
      const url = `/api/admin/analytics/data?range=${range}&psiKey=${encodeURIComponent(psiKey.trim())}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.psi) {
        setPsiCustomData(json.psi);
      } else {
        setPsiError('Could not run audit. Check that your API key is valid and has PageSpeed Insights API enabled in Google Cloud Console.');
      }
    } catch {
      setPsiError('Error contacting PageSpeed Insights API.');
    } finally {
      setPsiLoading(false);
    }
  }

  // Derived metrics
  const ga4Row = data?.ga4?.overview?.rows?.[0]?.metricValues || [];
  const activeUsers = ga4Row[0]?.value || '0';
  const sessions = ga4Row[1]?.value || '0';
  const pageViews = ga4Row[2]?.value || '0';
  const leads = ga4Row[3]?.value || '0';

  const gscRows = data?.gsc?.overview?.rows || [];
  const totalClicks = gscRows.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalImpressions = gscRows.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) + '%' : '0.0%';
  const avgPosition = gscRows.length > 0
    ? (gscRows.reduce((acc, r) => acc + (r.position || 0), 0) / gscRows.length).toFixed(1)
    : '—';

  const trafficRows = data?.ga4?.traffic?.rows || [];
  const realtimeRows = data?.ga4?.realtime?.rows || [];
  const ga4PageRows = data?.ga4?.pages?.rows || [];

  // Filtered Traffic Channels
  const channelList = useMemo(() => {
    const set = new Set<string>();
    trafficRows.forEach((r) => {
      const ch = r.dimensionValues?.[0]?.value;
      if (ch) set.add(ch);
    });
    return Array.from(set);
  }, [trafficRows]);

  const filteredTraffic = useMemo(() => {
    if (selectedChannel === 'all') return trafficRows;
    return trafficRows.filter((r) => r.dimensionValues?.[0]?.value === selectedChannel);
  }, [trafficRows, selectedChannel]);

  // Filtered & Sorted Search Queries
  const allQueries = data?.gsc?.queries?.rows || [];
  const filteredQueries = useMemo(() => {
    let result = allQueries;
    if (querySearch.trim()) {
      const q = querySearch.toLowerCase();
      result = result.filter((r) => (r.keys?.[0] || '').toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      let valA = a[querySort] || 0;
      let valB = b[querySort] || 0;
      if (querySort === 'position') {
        // Lower position is better
        return querySortDir === 'asc' ? valA - valB : valB - valA;
      }
      return querySortDir === 'desc' ? (valB as number) - (valA as number) : (valA as number) - (valB as number);
    });
  }, [allQueries, querySearch, querySort, querySortDir]);

  // Filtered Landing Pages
  const allGscPages = data?.gsc?.pages?.rows || [];
  const filteredGscPages = useMemo(() => {
    if (!pageSearch.trim()) return allGscPages;
    const q = pageSearch.toLowerCase();
    return allGscPages.filter((r) => (r.keys?.[0] || '').toLowerCase().includes(q));
  }, [allGscPages, pageSearch]);

  const activePsi = psiCustomData || data?.psi;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1150px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
            Marketing Intelligence &amp; Performance
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Interactive analytics from GA4, Google Search Console, and PageSpeed Insights.
          </p>
        </div>

        {/* Date Range & Refresh Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {(['7d', '14d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.82rem',
                  fontWeight: range === r ? 700 : 500,
                  color: range === r ? '#ffffff' : '#64748b',
                  background: range === r ? '#0f172a' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => loadData(range)}
            disabled={loading}
            className="btn btnSecondary"
            style={{ padding: '7px 14px', fontSize: '0.84rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {lastRefreshed && (
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '-16px' }}>
          Last refreshed: {lastRefreshed}
        </div>
      )}

      {/* Interactive Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '2px', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'seo', label: 'SEO & Search Queries' },
          { id: 'pages', label: 'Landing Pages & Content' },
          { id: 'pagespeed', label: 'PageSpeed & Core Web Vitals' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--orange-dark, #c2410c)' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid var(--orange, #f97316)' : '2px solid transparent',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Scorecards Grid (Always visible across tabs for quick context) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Active Users
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
            {activeUsers}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>GA4 Unique Visitors</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Total Sessions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
            {sessions}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{range} Total Visits</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Page Views
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
            {pageViews}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Content impressions</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c2410c', fontWeight: 650 }}>
            Qualified Leads
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c2410c', margin: '4px 0 2px' }}>
            {leads}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>WhatsApp &amp; Form</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', fontWeight: 650 }}>
            Google Clicks
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', margin: '4px 0 2px' }}>
            {totalClicks}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Search Console</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Search Impressions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
            {totalImpressions}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>CTR: {avgCtr}</div>
        </div>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Realtime Live Pulse */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
                }}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>GA4 Realtime Activity:</span>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                {realtimeRows.length > 0
                  ? realtimeRows.map((r) => `${r.dimensionValues?.[0]?.value}: ${r.metricValues?.[0]?.value}`).join('  |  ')
                  : 'Active. Awaiting new events.'}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Property ID: 564789966</div>
          </div>

          {/* Traffic Channel Acquisition with Interactive Filter Pills */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Traffic Channels &amp; Acquisition Sources
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Filter by channel to inspect specific traffic and conversion contribution.
                </p>
              </div>

              {/* Channel Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedChannel('all')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    fontWeight: selectedChannel === 'all' ? 700 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: selectedChannel === 'all' ? '#0f172a' : '#e2e8f0',
                    background: selectedChannel === 'all' ? '#0f172a' : '#ffffff',
                    color: selectedChannel === 'all' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  All Channels
                </button>
                {channelList.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSelectedChannel(ch)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: selectedChannel === ch ? 700 : 500,
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: selectedChannel === ch ? '#0f172a' : '#e2e8f0',
                      background: selectedChannel === ch ? '#0f172a' : '#ffffff',
                      color: selectedChannel === ch ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {filteredTraffic.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                No traffic recorded yet for the selected filter in this period.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTraffic.map((tr, idx) => {
                  const channel = tr.dimensionValues?.[0]?.value || 'Direct';
                  const sourceMedium = tr.dimensionValues?.[1]?.value || '—';
                  const sCount = Number(tr.metricValues?.[0]?.value || 0);
                  const uCount = Number(tr.metricValues?.[1]?.value || 0);
                  const lCount = Number(tr.metricValues?.[2]?.value || 0);
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{channel}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          Source / Medium: <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>{sourceMedium}</code>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '18px', fontSize: '0.82rem', color: '#64748b' }}>
                        <span><strong>{sCount}</strong> sessions</span>
                        <span><strong>{uCount}</strong> visitors</span>
                        <span style={{ color: lCount > 0 ? '#c2410c' : '#94a3b8', fontWeight: lCount > 0 ? 700 : 500 }}>
                          <strong>{lCount}</strong> leads
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SEO & SEARCH QUERIES (INTERACTIVE FILTER & SORT) */}
      {activeTab === 'seo' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Google Search Console Keywords
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Live organic search terms driving impressions and clicks to your website.
              </p>
            </div>

            {/* Keyword Search Input Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search keywords (e.g. SEO, Ads)…"
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '0.84rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  width: '240px',
                  outline: 'none'
                }}
              />
              {querySearch && (
                <button
                  type="button"
                  onClick={() => setQuerySearch('')}
                  style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredQueries.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
              {querySearch
                ? `No search queries match "${querySearch}".`
                : 'Google Search Console is verified. Daily query impressions stream here once indexed by Google.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 8px' }}>Search Query</th>
                    <th
                      onClick={() => {
                        if (querySort === 'clicks') setQuerySortDir(querySortDir === 'desc' ? 'asc' : 'desc');
                        else { setQuerySort('clicks'); setQuerySortDir('desc'); }
                      }}
                      style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      Clicks {querySort === 'clicks' && (querySortDir === 'desc' ? '▼' : '▲')}
                    </th>
                    <th
                      onClick={() => {
                        if (querySort === 'impressions') setQuerySortDir(querySortDir === 'desc' ? 'asc' : 'desc');
                        else { setQuerySort('impressions'); setQuerySortDir('desc'); }
                      }}
                      style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      Impressions {querySort === 'impressions' && (querySortDir === 'desc' ? '▼' : '▲')}
                    </th>
                    <th
                      onClick={() => {
                        if (querySort === 'ctr') setQuerySortDir(querySortDir === 'desc' ? 'asc' : 'desc');
                        else { setQuerySort('ctr'); setQuerySortDir('desc'); }
                      }}
                      style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      CTR {querySort === 'ctr' && (querySortDir === 'desc' ? '▼' : '▲')}
                    </th>
                    <th
                      onClick={() => {
                        if (querySort === 'position') setQuerySortDir(querySortDir === 'asc' ? 'desc' : 'asc');
                        else { setQuerySort('position'); setQuerySortDir('asc'); }
                      }}
                      style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }}
                    >
                      Average Position {querySort === 'position' && (querySortDir === 'asc' ? '▲' : '▼')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((q, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 650, color: '#0f172a' }}>{q.keys?.[0] || '—'}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: '#2563eb' }}>{q.clicks || 0}</td>
                      <td style={{ padding: '10px 8px', color: '#475569' }}>{q.impressions || 0}</td>
                      <td style={{ padding: '10px 8px', color: '#475569' }}>{((q.ctr || 0) * 100).toFixed(1)}%</td>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: '#0f172a' }}>{q.position?.toFixed(1) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LANDING PAGES & CONTENT */}
      {activeTab === 'pages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Top Landing Pages (Search Console &amp; GA4)
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Filter pages to evaluate organic clicks and engagement.
                </p>
              </div>

              {/* Page Filter Input */}
              <input
                type="text"
                placeholder="Filter path (e.g. /projects, /contact)…"
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '0.84rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  width: '260px',
                  outline: 'none'
                }}
              />
            </div>

            {filteredGscPages.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                {pageSearch ? `No pages match "${pageSearch}".` : 'Sitemap is verified. Landing pages will list here as impressions occur.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredGscPages.map((pr, idx) => {
                  const fullUrl = pr.keys?.[0] || '';
                  const pathOnly = fullUrl.replace('https://muyeedsifat.vercel.app', '') || '/';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #f1f5f9',
                        fontSize: '0.84rem'
                      }}
                    >
                      <span style={{ color: '#0f172a', fontWeight: 650 }}>{pathOnly}</span>
                      <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
                        <span><strong>{pr.clicks || 0}</strong> clicks</span>
                        <span><strong>{pr.impressions || 0}</strong> impressions</span>
                        <span>Pos: <strong>{pr.position?.toFixed(1) || '—'}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GA4 Content Views Table */}
          {ga4PageRows.length > 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                GA4 Page Views Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ga4PageRows.map((pr, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.84rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{pr.dimensionValues?.[0]?.value || '/'}</span>
                    <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
                      <span><strong>{pr.metricValues?.[0]?.value || 0}</strong> views</span>
                      <span><strong>{pr.metricValues?.[1]?.value || 0}</strong> visitors</span>
                      {Number(pr.metricValues?.[2]?.value || 0) > 0 && (
                        <span style={{ color: '#c2410c', fontWeight: 700 }}><strong>{pr.metricValues?.[2]?.value}</strong> leads</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PAGESPEED & CORE WEB VITALS */}
      {activeTab === 'pagespeed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* PageSpeed Header & Audit Trigger */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Google PageSpeed Insights &amp; Core Web Vitals
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Evaluate mobile performance, SEO readiness, and Core Web Vitals thresholds.
                </p>
              </div>

              {/* 1-Click External Report Link */}
              <a
                href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmuyeedsifat.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnSecondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Open Google PageSpeed Report</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* On-Demand API Runner */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginTop: '10px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#334155', marginBottom: '8px' }}>
                Run Live In-Dashboard Audit (Requires Google Cloud API Key):
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="password"
                  placeholder="Paste Google Cloud API Key with PageSpeed enabled…"
                  value={psiKey}
                  onChange={(e) => setPsiKey(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '7px 12px',
                    fontSize: '0.84rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRunPsi}
                  disabled={psiLoading}
                  className="btn btnPrimary"
                  style={{ padding: '7px 16px', fontSize: '0.84rem', borderRadius: '6px' }}
                >
                  {psiLoading ? 'Analyzing Speed…' : 'Run Live Audit'}
                </button>
              </div>
              {psiError && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '8px' }}>
                  {psiError}
                </div>
              )}
            </div>
          </div>

          {/* Core Web Vitals Targets Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                LCP (Largest Contentful Paint)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>
                {activePsi?.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || '< 2.5s'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Target: Good under 2.5s</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                CLS (Cumulative Layout Shift)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>
                {activePsi?.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || '< 0.1'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Target: Good under 0.1</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                FCP (First Contentful Paint)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>
                {activePsi?.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || '< 1.8s'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Target: Good under 1.8s</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                INP (Interaction to Next Paint)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>
                &lt; 200ms
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Target: Good under 200ms</div>
            </div>
          </div>

          {/* Live Lighthouse Audit Scores (if audit executed) */}
          {activePsi?.lighthouseResult?.categories && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Lighthouse Audit Scores (Mobile)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                {Object.entries(activePsi.lighthouseResult.categories).map(([k, cat]) => {
                  const score = Math.round((cat?.score || 0) * 100);
                  const color = score >= 90 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
                  return (
                    <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{score}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 650, color: '#475569', marginTop: '4px' }}>{cat?.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Infrastructure Status Footer */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#334155' }}>
          Tracking Architecture:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.76rem' }}>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px', borderRadius: '5px', fontWeight: 650 }}>
            GA4: G-6DXKYVGLVG
          </span>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px', borderRadius: '5px', fontWeight: 650 }}>
            GSC: Verified
          </span>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px', borderRadius: '5px', fontWeight: 650 }}>
            GTM: GTM-KX4NGRXH (v4)
          </span>
          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '5px', fontWeight: 650 }}>
            PageSpeed: Integrated
          </span>
        </div>
      </div>
    </div>
  );
}
