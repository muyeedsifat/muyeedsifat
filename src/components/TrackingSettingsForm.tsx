'use client';

import React, { useState, FormEvent } from 'react';

export function TrackingSettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    gtmId: String(initial?.gtmId || 'GTM-KX4NGRXH'),
    gscVerification: String(initial?.gscVerification || '5388e14e0b0d0a6d'),
    ga4Id: String(initial?.ga4Id || 'G-6DXKYVGLVG'),
    clarityId: String(initial?.clarityId || 'zfapy6czo5'),
    metaPixelId: String(initial?.metaPixelId || '')
  });

  const effectiveClarityId = formData.clarityId || 'zfapy6czo5';

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function openClarityPopup(subpath: string) {
    const url = `https://clarity.microsoft.com/projects/view/${effectiveClarityId}/${subpath}`;
    window.open(url, 'clarity_window', 'width=1320,height=860,menubar=no,toolbar=no,location=yes,status=yes');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Tracking configuration saved successfully.'
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({
          type: 'error',
          message: data.error || 'Failed to update tracking settings.'
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1050px' }}>
      {/* Active Integrations Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
        {/* Clarity Status */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              MS Clarity
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#166534', background: '#dcfce7', padding: '2px 7px', borderRadius: '4px' }}>
              Connected
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 750, color: '#0f172a' }}>{effectiveClarityId}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>Session recordings &amp; heatmaps</div>
        </div>

        {/* GTM Status */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Google Tag Manager
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#166534', background: '#dcfce7', padding: '2px 7px', borderRadius: '4px' }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 750, color: '#0f172a' }}>{formData.gtmId || 'GTM-KX4NGRXH'}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>Container script in &lt;head&gt;</div>
        </div>

        {/* GA4 Status */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Google Analytics 4
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#166534', background: '#dcfce7', padding: '2px 7px', borderRadius: '4px' }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 750, color: '#0f172a' }}>{formData.ga4Id || 'G-6DXKYVGLVG'}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>Direct gtag.js tracking</div>
        </div>

        {/* GSC Status */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Search Console
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#166534', background: '#dcfce7', padding: '2px 7px', borderRadius: '4px' }}>
              Verified
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 750, color: '#0f172a' }}>{formData.gscVerification || '5388e14e0b0d0a6d'}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>Meta tag &amp; HTML file live</div>
        </div>
      </div>

      {/* MICROSOFT CLARITY LIVE DATA & RECORDINGS HUB */}
      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 750, color: '#0f172a' }}>
                Microsoft Clarity Live Recordings &amp; Heatmaps
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Project: <strong>Muyeed</strong> (ID: <code>{effectiveClarityId}</code>) • Connected via GTM &amp; Native Script
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => openClarityPopup('recordings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: 700,
                borderRadius: '7px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>Launch Recordings Player</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
            Visitor telemetry (scroll depth, cursor paths, clicks, and rage clicks) is actively streaming from <code>https://muyeedsifat.vercel.app</code> to your Microsoft Clarity project. Use the quick-access console below to launch live session replays, click heatmaps, and behavior metrics in a dedicated window.
          </p>

          {/* 4 Clarity Deep Link Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '22px' }}>
            {/* Recordings Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>Session Replays</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                  Watch step-by-step visitor journeys with cursor tracking, scrolling behavior, and mobile touches.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openClarityPopup('recordings')}
                style={{
                  marginTop: '16px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 650,
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#2563eb',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>View Recordings</span>
                <span style={{ fontSize: '0.8rem' }}>&rarr;</span>
              </button>
            </div>

            {/* Heatmaps Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>Click &amp; Scroll Heatmaps</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                  Inspect aggregated click density and scroll drop-off percentages on your homepage and blog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openClarityPopup('heatmaps')}
                style={{
                  marginTop: '16px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 650,
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#ea580c',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Open Heatmaps</span>
                <span style={{ fontSize: '0.8rem' }}>&rarr;</span>
              </button>
            </div>

            {/* Dashboard Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>Behavior Metrics</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                  Review dead clicks, rage clicks, JavaScript errors, operating systems, and device breakdowns.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openClarityPopup('dashboard')}
                style={{
                  marginTop: '16px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 650,
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#16a34a',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Open Dashboard</span>
                <span style={{ fontSize: '0.8rem' }}>&rarr;</span>
              </button>
            </div>

            {/* Settings Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>Clarity Settings</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                  Configure IP blocking (to ignore your own visits), sensitive text masking, and team members.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openClarityPopup('settings')}
                style={{
                  marginTop: '16px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 650,
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Project Settings</span>
                <span style={{ fontSize: '0.8rem' }}>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Telemetry Status Information Banner */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>
                Microsoft Clarity is fully integrated and active on your website
              </div>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px', lineHeight: 1.45 }}>
                Clarity batches telemetry data and publishes recordings every 15 to 30 minutes. As soon as visitors browse <code>https://muyeedsifat.vercel.app</code>, their sessions and heatmap overlays populate automatically.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRACKING CREDENTIALS CONFIGURATION FORM */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
          Tracking Credentials &amp; Measurement Tags
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#64748b' }}>
          Update your marketing tags below at any time. Changes are immediately updated across the site.
        </p>

        {status && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: 650,
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Microsoft Clarity */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="clarityId" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Microsoft Clarity Project ID
                </label>
                <span style={{ fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 650 }}>
                  Active in Tag Manager &amp; Layout
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Used for session recording, rage click analysis, and scroll heatmaps.
              </p>
              <input
                id="clarityId"
                type="text"
                placeholder="zfapy6czo5"
                value={formData.clarityId}
                onChange={(e) => handleChange('clarityId', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', background: '#ffffff' }}
              />
            </div>

            {/* Google Tag Manager */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="gtmId" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Google Tag Manager (GTM) Container ID
                </label>
                <span style={{ fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 650 }}>
                  Active in &lt;head&gt;
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Container ID to inject GTM script and noscript fallback across all pages.
              </p>
              <input
                id="gtmId"
                type="text"
                placeholder="GTM-XXXXXXX"
                value={formData.gtmId}
                onChange={(e) => handleChange('gtmId', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', background: '#ffffff' }}
              />
            </div>

            {/* Google Search Console */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="gscVerification" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Google Search Console (GSC) Verification Token
                </label>
                <span style={{ fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 650 }}>
                  Active in &lt;head&gt;
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Verification token for the site verification meta tag (or paste full &lt;meta&gt; tag).
              </p>
              <input
                id="gscVerification"
                type="text"
                placeholder="5388e14e0b0d0a6d"
                value={formData.gscVerification}
                onChange={(e) => handleChange('gscVerification', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', background: '#ffffff' }}
              />
            </div>

            {/* Google Analytics 4 */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="ga4Id" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Google Analytics 4 (GA4) Measurement ID
                </label>
                <span style={{ fontSize: '0.72rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 650 }}>
                  Active
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Direct Measurement ID (gtag.js) for traffic analytics and event tracking.
              </p>
              <input
                id="ga4Id"
                type="text"
                placeholder="G-6DXKYVGLVG"
                value={formData.ga4Id}
                onChange={(e) => handleChange('ga4Id', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', background: '#ffffff' }}
              />
            </div>

            {/* Meta Pixel */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="metaPixelId" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Meta (Facebook) Pixel ID (Optional)
                </label>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b' }}>
                Pixel ID / Dataset ID for paid social acquisition and conversion tracking.
              </p>
              <input
                id="metaPixelId"
                type="text"
                placeholder="e.g. 123456789012345"
                value={formData.metaPixelId}
                onChange={(e) => handleChange('metaPixelId', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', background: '#ffffff' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btnPrimary"
              style={{ minWidth: '220px', height: '42px', fontSize: '0.9rem', borderRadius: '8px', fontWeight: 700 }}
            >
              {loading ? 'Saving Changes...' : 'Save Tracking Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
