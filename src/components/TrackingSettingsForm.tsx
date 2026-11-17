'use client';

import React, { useState, FormEvent } from 'react';

export function TrackingSettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    gtmId: String(initial?.gtmId || ''),
    gscVerification: String(initial?.gscVerification || ''),
    ga4Id: String(initial?.ga4Id || ''),
    clarityId: String(initial?.clarityId || ''),
    metaPixelId: String(initial?.metaPixelId || '')
  });

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          message: 'Tracking & Analytics tags saved successfully! They are now live on your website.'
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus({
          type: 'error',
          message: data.error || 'Failed to update tracking settings. Please try again.'
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '820px' }}>
      {status && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '0.92rem',
            fontWeight: 600,
            background: status.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: status.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          {status.message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Google Tag Manager */}
        <div className="adminCard" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🏷️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Google Tag Manager (GTM)</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Injects the official GTM script in the &lt;head&gt; and noscript container in the &lt;body&gt;.
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="gtmId" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              GTM Container ID
            </label>
            <input
              id="gtmId"
              type="text"
              placeholder="e.g. GTM-N8XXXXX"
              value={formData.gtmId}
              onChange={(e) => handleChange('gtmId', e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Google Search Console */}
        <div className="adminCard" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🔍</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Google Search Console (GSC)</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Site ownership verification meta tag (&lt;meta name=&quot;google-site-verification&quot; /&gt;).
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="gscVerification" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              HTML Tag Verification Token
            </label>
            <input
              id="gscVerification"
              type="text"
              placeholder="e.g. ABC123xyz_google_verification_code"
              value={formData.gscVerification}
              onChange={(e) => handleChange('gscVerification', e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Google Analytics 4 */}
        <div className="adminCard" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📊</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Google Analytics 4 (GA4)</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Direct gtag.js tracking (if you prefer direct measurement instead of via GTM).
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="ga4Id" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              Measurement ID
            </label>
            <input
              id="ga4Id"
              type="text"
              placeholder="e.g. G-XXXXXXXXXX"
              value={formData.ga4Id}
              onChange={(e) => handleChange('ga4Id', e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Microsoft Clarity */}
        <div className="adminCard" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🔥</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Microsoft Clarity</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Free user session recordings, scroll maps, and click heatmaps.
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="clarityId" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              Clarity Project ID
            </label>
            <input
              id="clarityId"
              type="text"
              placeholder="e.g. 9zn8xq..."
              value={formData.clarityId}
              onChange={(e) => handleChange('clarityId', e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="adminCard" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Meta (Facebook) Pixel</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Official Meta Ads tracking tag for custom audiences and retargeting.
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="metaPixelId" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
              Meta Pixel ID / Dataset ID
            </label>
            <input
              id="metaPixelId"
              type="text"
              placeholder="e.g. 123456789012345"
              value={formData.metaPixelId}
              onChange={(e) => handleChange('metaPixelId', e.target.value)}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '28px', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={loading}
          className="btn btnPrimary"
          style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}
        >
          {loading ? 'Saving Changes…' : 'Save Tracking Tags →'}
        </button>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          Changes apply immediately to your live website.
        </span>
      </div>
    </form>
  );
}