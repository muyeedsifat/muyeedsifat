'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { CustomPage } from '@/types/content';
import { RichTextEditor } from '@/components/RichTextEditor';

export function PagesManager({ initialPages }: { initialPages: CustomPage[] }) {
  const router = useRouter();
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialPages[0]?.slug || 'home');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePage = pages.find((p) => p.slug === selectedSlug) || pages[0];

  function updateField<K extends keyof CustomPage>(field: K, value: CustomPage[K]) {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedSlug ? { ...p, [field]: value } : p))
    );
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', `${activePage?.title || 'Page'} banner`);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      updateField('heroImage', data.item.url);
      setMsg('Hero image uploaded and converted to WebP.');
    } catch (err: unknown) {
      setMsg((err as Error).message || 'Image upload error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        setMsg(`Page /${activePage.slug} updated successfully!`);
        router.refresh();
      } else {
        setMsg('Failed to update page.');
      }
    } catch {
      setMsg('Network error while saving page.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="editorModernLayout">
      <div className="editorMainColumn">
        {/* Page Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(p.slug);
                setMsg('');
              }}
              className={`btn ${selectedSlug === p.slug ? 'btnPrimary' : 'btnSecondary'}`}
              style={{ padding: '0 18px', minHeight: '38px', fontSize: '0.88rem' }}
            >
              /{p.slug}
            </button>
          ))}
        </div>

        {activePage && (
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
            {/* Page Header Information */}
            <div className="adminCard">
              <span className="adminEyebrow">Page Content (/{activePage.slug})</span>
              <div className="field" style={{ marginTop: 12 }}>
                <label>Eyebrow Tagline / Badge</label>
                <input
                  value={activePage.eyebrow || ''}
                  onChange={(e) => updateField('eyebrow', e.target.value)}
                  placeholder="e.g. AI SEO • Google Ads • Meta Ads • WordPress"
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Main Page Title (H1)</label>
                <input
                  required
                  value={activePage.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Data-Driven Digital Marketing"
                  className="editorTitleInput"
                />
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="adminCard">
              <h3 className="sidebarSectionTitle" style={{ marginBottom: 12 }}>
                Page Content &amp; Story (Rich Text &amp; Tables)
              </h3>
              <p className="adminHelpText" style={{ marginBottom: 16 }}>
                Format text with bold, font sizes, colors, headings, bullet lists, hyperlinks, and responsive tables.
              </p>
              <RichTextEditor
                value={activePage.lead || ''}
                onChange={(html) => updateField('lead', html)}
                placeholder="Write page content, value proposition, client services, and structured text..."
                minHeight={280}
              />
            </div>

            {/* SEO Configuration */}
            <div className="adminCard">
              <h3 className="sidebarSectionTitle" style={{ marginBottom: 14 }}>
                SEO Options for /{activePage.slug}
              </h3>
              <div className="adminFormGrid">
                <div className="field">
                  <label>Meta Title</label>
                  <input
                    value={activePage.metaTitle || ''}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="Page Title in Search Results"
                  />
                </div>
                <div className="field fieldFull">
                  <label>Meta Description</label>
                  <textarea
                    rows={2}
                    value={activePage.metaDescription || ''}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="Concise summary for Google results"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btnPrimary"
              disabled={loading}
              style={{ width: '100%', minHeight: '44px', fontSize: '0.96rem' }}
            >
              {loading ? 'Saving Changes…' : `Save & Publish /${activePage.slug}`}
            </button>

            {msg && <div className="adminNotification">{msg}</div>}
          </form>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="editorSidebar">
        {/* Hero Image Card */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Hero Banner Image (WebP)</h3>
          {activePage?.heroImage ? (
            <div style={{ marginBottom: 12 }}>
              <Image
                src={activePage.heroImage}
                alt="Page hero"
                width={300}
                height={160}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 8 }}
              />
              <button
                type="button"
                className="buttonSmall buttonDanger"
                style={{ width: '100%', marginTop: 8 }}
                onClick={() => updateField('heroImage', '')}
              >
                Remove Hero Image
              </button>
            </div>
          ) : (
            <div
              className="inlineUploadZone"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginBottom: 12 }}
            >
              <div style={{ fontSize: '1.4rem' }}>📸</div>
              <strong>{uploadingImage ? 'Converting to WebP…' : 'Upload Hero Image'}</strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Converts automatically to WebP
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleHeroImageUpload}
          />
        </div>

        {/* Live Preview Card */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Live Page Preview</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
            Updates apply immediately and are served with optimized semantic HTML and schema tags.
          </p>
          <a
            href={activePage?.slug === 'home' ? '/' : `/${activePage?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btnSecondary"
            style={{ display: 'block', textAlign: 'center' }}
          >
            Open Live Page ↗
          </a>
        </div>
      </aside>
    </div>
  );
}
