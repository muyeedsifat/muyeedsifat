'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomPage } from '@/types/content';

export function PagesManager({ initialPages }: { initialPages: CustomPage[] }) {
  const router = useRouter();
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialPages[0]?.slug || 'home');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const activePage = pages.find((p) => p.slug === selectedSlug) || pages[0];

  function updateField<K extends keyof CustomPage>(field: K, value: CustomPage[K]) {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedSlug ? { ...p, [field]: value } : p))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!activePage) return;
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePage)
      });

      if (res.ok) {
        setMsg('Page updated successfully!');
        router.refresh();
      } else {
        alert('Failed to update page.');
      }
    } catch {
      alert('Network error while saving page.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="editorLayout">
      <div className="editorPanel">
        {/* Page Selector Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(p.slug);
                setMsg('');
              }}
              className={`btn ${selectedSlug === p.slug ? 'btnPrimary' : 'btnSecondary'}`}
              style={{ padding: '0 16px', minHeight: 40, fontSize: '0.88rem' }}
            >
              /{p.slug}
            </button>
          ))}
        </div>

        {activePage && (
          <form onSubmit={handleSave} className="adminCard" style={{ display: 'grid', gap: 16 }}>
            <div className="field">
              <label htmlFor="page-eyebrow">Eyebrow Tagline</label>
              <input
                id="page-eyebrow"
                value={activePage.eyebrow || ''}
                onChange={(e) => updateField('eyebrow', e.target.value)}
                placeholder="e.g. AI SEO • Google Ads • Meta Ads"
              />
            </div>

            <div className="field">
              <label htmlFor="page-title">Main Hero Title (H1)</label>
              <input
                id="page-title"
                required
                value={activePage.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Data-Driven Digital Marketing"
              />
            </div>

            <div className="field">
              <label htmlFor="page-lead">Hero Lead Paragraph</label>
              <textarea
                id="page-lead"
                rows={3}
                value={activePage.lead || ''}
                onChange={(e) => updateField('lead', e.target.value)}
                placeholder="Lead description displayed under the main heading..."
              />
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', textTransform: 'uppercase', color: '#777' }}>
                SEO Options for /{activePage.slug}
              </h4>

              <div className="field">
                <label htmlFor="page-meta-title">Page Meta Title</label>
                <input
                  id="page-meta-title"
                  value={activePage.metaTitle || ''}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                  placeholder="Meta title for Google results"
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="page-meta-desc">Page Meta Description</label>
                <textarea
                  id="page-meta-desc"
                  rows={2}
                  value={activePage.metaDescription || ''}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="Meta description for search engine previews"
                />
              </div>
            </div>

            <button type="submit" className="btn btnPrimary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Saving Page…' : `Update /${activePage.slug} Page`}
            </button>

            {msg && <div className="notice">{msg}</div>}
          </form>
        )}
      </div>

      <aside className="editorAside">
        <div className="adminCard">
          <h4>Design &amp; Automation</h4>
          <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
            Changes made here are automatically formatted into the design system with semantic typography, responsive layout containers, and search metadata.
          </p>
          <a
            href={activePage?.slug === 'home' ? '/' : `/${activePage?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="textLink"
          >
            Preview Live Page ↗
          </a>
        </div>
      </aside>
    </div>
  );
}
