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
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
      {status && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: status.type === 'success' ? '#15803d' : '#b91c1c',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}
        >
          {status.message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Google Tag Manager */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="gtmId" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Google Tag Manager (GTM)
            </label>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Container ID to inject GTM script and noscript fallback across all pages.
            </p>
          </div>
          <input
            id="gtmId"
            type="text"
            placeholder="GTM-XXXXXXX"
            value={formData.gtmId}
            onChange={(e) => handleChange('gtmId', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Google Search Console */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="gscVerification" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Google Search Console (GSC)
            </label>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              HTML verification token for site verification meta tag.
            </p>
          </div>
          <input
            id="gscVerification"
            type="text"
            placeholder="Verification token string"
            value={formData.gscVerification}
            onChange={(e) => handleChange('gscVerification', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Google Analytics 4 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="ga4Id" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Google Analytics 4 (GA4)
            </label>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Direct Measurement ID (gtag.js). Leave blank if managing GA4 via GTM.
            </p>
          </div>
          <input
            id="ga4Id"
            type="text"
            placeholder="G-XXXXXXXXXX"
            value={formData.ga4Id}
            onChange={(e) => handleChange('ga4Id', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Microsoft Clarity */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="clarityId" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Microsoft Clarity
            </label>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Project ID for session recording and heatmap tracking.
            </p>
          </div>
          <input
            id="clarityId"
            type="text"
            placeholder="Clarity project ID"
            value={formData.clarityId}
            onChange={(e) => handleChange('clarityId', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Meta Pixel */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="metaPixelId" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Meta Pixel (Facebook)
            </label>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Pixel ID / Dataset ID for paid social conversion tracking.
            </p>
          </div>
          <input
            id="metaPixelId"
            type="text"
            placeholder="e.g. 123456789012345"
            value={formData.metaPixelId}
            onChange={(e) => handleChange('metaPixelId', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={loading}
          className="btn btnPrimary"
          style={{ padding: '10px 24px', fontSize: '0.92rem', borderRadius: '8px' }}
        >
          {loading ? 'Saving...' : 'Save Tracking Settings'}
        </button>
      </div>
    </form>
  );
}