'use client';

import React, { useEffect, useState } from 'react';

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

interface AnalyticsPayload {
  configured?: boolean;
  message?: string;
  range?: string;
  error?: string;
  ga4?: {
    overview?: { rows?: Ga4Row[] };
    realtime?: { rows?: Ga4Row[]; rowCount?: number };
    traffic?: { rows?: Ga4Row[] };
  };
  gsc?: {
    overview?: { rows?: GscRow[] };
    queries?: { rows?: GscRow[] };
    pages?: { rows?: GscRow[] };
  };
}

export default function AnalyticsDashboardPage() {
  const [range, setRange] = useState<'7d' | '14d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  async function loadData(selectedRange: '7d' | '14d' | '30d' | '90d') {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/data?range=${selectedRange}`, { cache: 'no-store' });
      const json = await res.json();
      setData(json);
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
  const queryRows = data?.gsc?.queries?.rows || [];
  const pagePerformanceRows = data?.gsc?.pages?.rows || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '1150px' }}>
      {/* Header with Title and Range Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
            Analytics &amp; Search Performance
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Unified live reporting from Google Analytics 4 and Google Search Console.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Range Pills */}
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
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '-18px' }}>
          Last updated: {lastRefreshed}
        </div>
      )}

      {/* Configuration Required Banner */}
      {data && data.configured === false && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '24px',
            color: '#92400e'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Google Service Account Key Setup</h3>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '0.9rem', lineHeight: 1.6 }}>
            To activate real-time API queries for GA4 and Google Search Console on Vercel, add your service account credentials to Vercel Environment Variables:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.88rem', lineHeight: 1.7 }}>
            <li>Go to <strong>Vercel Dashboard &gt; Project Settings &gt; Environment Variables</strong>.</li>
            <li>Add variable key: <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>GOOGLE_SERVICE_ACCOUNT_KEY</code></li>
            <li>Paste your Service Account JSON key content as the value.</li>
            <li>Redeploy or wait for next deployment.</li>
          </ol>
        </div>
      )}

      {/* Realtime Stream Card */}
      {data?.configured && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
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
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
              }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>GA4 Live Stream (Last 30 Min):</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {realtimeRows.length > 0
                ? realtimeRows.map((r) => `${r.dimensionValues?.[0]?.value}: ${r.metricValues?.[0]?.value}`).join('  |  ')
                : 'Listening for visitor activity…'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Property ID: 564789966
          </div>
        </div>
      )}

      {/* Scorecards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px'
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Active Users
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {activeUsers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GA4 Unique Visitors</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Total Sessions
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {sessions}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Visits across {range}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Page Views
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {pageViews}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total content loads</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c2410c', fontWeight: 650 }}>
            Qualified Leads
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c2410c', margin: '6px 0 2px' }}>
            {leads}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>WhatsApp &amp; Form Goals</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', fontWeight: 650 }}>
            Organic Clicks
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', margin: '6px 0 2px' }}>
            {totalClicks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Google Search Console</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 650 }}>
            Search Impressions
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
            {totalImpressions}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avg CTR: {avgCtr}</div>
        </div>
      </div>

      {/* Two Column Section: Traffic Acquisition & Search Console Queries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Panel 1: GA4 Traffic Channels */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Traffic Acquisition Channels
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Where your visitors originate</p>
            </div>
            <span style={{ fontSize: '0.74rem', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', color: '#64748b', fontWeight: 600 }}>
              GA4
            </span>
          </div>

          {trafficRows.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
              No traffic channels recorded yet for this period. Data aggregates after first visitors browse.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trafficRows.map((tr, idx) => {
                const channel = tr.dimensionValues?.[0]?.value || 'Direct';
                const sCount = Number(tr.metricValues?.[0]?.value || 0);
                const uCount = Number(tr.metricValues?.[1]?.value || 0);
                const lCount = Number(tr.metricValues?.[2]?.value || 0);
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 650, fontSize: '0.88rem', color: '#1e293b' }}>{channel}</div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748b' }}>
                      <span><strong>{sCount}</strong> sessions</span>
                      <span><strong>{uCount}</strong> users</span>
                      {lCount > 0 && <span style={{ color: '#c2410c', fontWeight: 700 }}><strong>{lCount}</strong> leads</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel 2: Google Search Console Queries */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Top Google Search Keywords
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Search queries driving organic impressions</p>
            </div>
            <span style={{ fontSize: '0.74rem', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', color: '#2563eb', fontWeight: 600 }}>
              Search Console
            </span>
          </div>

          {queryRows.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
              Google Search Console is verified. Daily search query performance populates after Google processes impressions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {queryRows.map((qr, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.84rem' }}>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{qr.keys?.[0] || '—'}</span>
                  <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                    <span><strong>{qr.clicks || 0}</strong> clicks</span>
                    <span><strong>{qr.impressions || 0}</strong> imp</span>
                    <span>Pos: <strong>{qr.position?.toFixed(1) || '—'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Organic Landing Pages from Search Console */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Top Organic Landing Pages (Google Search)
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>URLs receiving organic visibility from Google</p>
          </div>
        </div>

        {pagePerformanceRows.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
            Sitemap submitted with 0 errors. Landing page metrics will stream here automatically as Google indexes search queries.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pagePerformanceRows.map((pr, idx) => {
              const fullUrl = pr.keys?.[0] || '';
              const pathOnly = fullUrl.replace('https://muyeedsifat.vercel.app', '') || '/';
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.84rem' }}>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{pathOnly}</span>
                  <div style={{ display: 'flex', gap: '14px', color: '#64748b' }}>
                    <span><strong>{pr.clicks || 0}</strong> clicks</span>
                    <span><strong>{pr.impressions || 0}</strong> imp</span>
                    <span>Pos: <strong>{pr.position?.toFixed(1) || '—'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tracking Infrastructure Health Footer */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '0.84rem', fontWeight: 650, color: '#334155' }}>
          Tracking Infrastructure Status:
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 9px', borderRadius: '6px', fontWeight: 650 }}>
            GA4: G-6DXKYVGLVG (Active)
          </span>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 9px', borderRadius: '6px', fontWeight: 650 }}>
            GSC: Site Verified &amp; Sitemap Submitted
          </span>
          <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 9px', borderRadius: '6px', fontWeight: 650 }}>
            GTM: GTM-KX4NGRXH (v4 Live)
          </span>
        </div>
      </div>
    </div>
  );
}
