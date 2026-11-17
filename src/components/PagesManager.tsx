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
      setMsg('Hero image uploaded and converted to WebP successfully.');
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
        setMsg(`Page /${activePage.slug} updated and published successfully!`);
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

  const liveMetaTitle = activePage?.metaTitle || activePage?.title || 'Page Title';
  const liveMetaDesc = activePage?.metaDescription || 'Add a meta description to control how this page appears in Google search engine result snippets.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1150px' }}>
      {/* Page Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#f8fafc', padding: '6px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        {pages.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              setSelectedSlug(p.slug);
              setMsg('');
            }}
            style={{
              padding: '7px 16px',
              fontSize: '0.84rem',
              fontWeight: selectedSlug === p.slug ? 700 : 500,
              borderRadius: '7px',
              border: 'none',
              background: selectedSlug === p.slug ? '#0f172a' : 'transparent',
              color: selectedSlug === p.slug ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            /{p.slug}
          </button>
        ))}
      </div>

      {activePage && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Main Edit Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Page Header Information */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Page Header &amp; Hero Copy (/{activePage.slug})
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
                Configure the primary headline and eyebrow badge that appears at the top of this page.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Eyebrow Tagline / Badge
                  </label>
                  <input
                    value={activePage.eyebrow || ''}
                    onChange={(e) => updateField('eyebrow', e.target.value)}
                    placeholder="e.g. AI SEO • Google Ads • Meta Ads • WordPress"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                    Main Page Title (H1)
                  </label>
                  <input
                    required
                    value={activePage.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Data-Driven Digital Marketing"
                    style={{ width: '100%', padding: '10px 12px', fontSize: '1.1rem', fontWeight: 700, border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>

            {/* Rich Content Editor */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Page Content &amp; Story (Rich Text &amp; Formatting)
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
                Format text with bold, font sizes, headings, bullet lists, hyperlinks, and tables.
              </p>
              <RichTextEditor
                value={activePage.lead || ''}
                onChange={(html) => updateField('lead', html)}
                placeholder="Write page content, value proposition, client services, and structured text..."
                minHeight={280}
              />
            </div>

            {/* SEO Options & Live Google Preview */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Search Engine Optimization (SEO)
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
                Optimize the meta title and description for search engines and social sharing.
              </p>

              {/* Google SERP Snippet Preview */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                  Google Search Snippet Preview
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '2px' }}>
                  https://muyeedsifat.vercel.app/{activePage.slug === 'home' ? '' : activePage.slug}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 650, color: '#1a0dab', lineHeight: 1.3, marginBottom: '4px' }}>
                  {liveMetaTitle}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#4d5156', lineHeight: 1.5 }}>
                  {liveMetaDesc}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>Meta Title</label>
                    <span style={{ fontSize: '0.75rem', color: liveMetaTitle.length > 60 ? '#c2410c' : '#94a3b8' }}>
                      {liveMetaTitle.length}/60 chars
                    </span>
                  </div>
                  <input
                    value={activePage.metaTitle || ''}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="Page Title in Search Results"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>Meta Description</label>
                    <span style={{ fontSize: '0.75rem', color: liveMetaDesc.length > 160 ? '#c2410c' : '#94a3b8' }}>
                      {liveMetaDesc.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={activePage.metaDescription || ''}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="Concise summary for Google results (140-160 characters)"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btnPrimary"
              disabled={loading}
              style={{ width: '100%', height: '44px', fontSize: '0.94rem', borderRadius: '8px' }}
            >
              {loading ? 'Saving Changes…' : `Save & Publish /${activePage.slug}`}
            </button>

            {msg && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.88rem', fontWeight: 600 }}>
                {msg}
              </div>
            )}
          </form>

          {/* Right Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hero Image Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                Hero Banner Image
              </h4>
              {activePage?.heroImage ? (
                <div>
                  <Image
                    src={activePage.heroImage}
                    alt="Page hero"
                    width={300}
                    height={160}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <button
                    type="button"
                    onClick={() => updateField('heroImage', '')}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '6px',
                      fontSize: '0.8rem',
                      color: '#dc2626',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 650
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '24px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }}>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploadingImage ? 'Converting to WebP…' : 'Upload Hero Image'}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Auto-converts to optimized WebP
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

            {/* Live Page Preview Action */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                Live Page View
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
                Changes update production immediately upon saving.
              </p>
              <a
                href={activePage?.slug === 'home' ? '/' : `/${activePage?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnSecondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', fontSize: '0.84rem' }}
              >
                <span>View Live Page</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
