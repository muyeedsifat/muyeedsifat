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
  const [filterType, setFilterType] = useState<'all' | 'core' | 'service'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const activePage = pages.find((p) => p.slug === selectedSlug) || pages[0];

  function updateField<K extends keyof CustomPage>(field: K, value: CustomPage[K]) {
    setPages((prev) =>
      prev.map((p) => (p.slug === selectedSlug ? { ...p, [field]: value } : p))
    );
  }

  function handleSelectPage(slug: string) {
    setSelectedSlug(slug);
    setMsg('');
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        setMsg(`Page /${activePage.slug === 'home' ? '' : activePage.slug} updated and published successfully!`);
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

  const filteredPages = pages.filter((p) => {
    const isService = p.slug.startsWith('services/');
    if (filterType === 'core' && isService) return false;
    if (filterType === 'service' && !isService) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.metaTitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1200px' }}>
      {/* ARCHITECTURE DEFINITION GUIDE: PAGES VS POSTS */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--orange)',
            marginBottom: '6px',
            display: 'inline-block'
          }}
        >
          CMS Architecture Guide
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
          Understanding the Difference: Pages vs. Posts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px 18px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }} />
              <strong style={{ fontSize: '0.98rem', color: '#ffffff' }}>Pages (Core &amp; Service Pages)</strong>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
              Evergreen, foundational website structure (e.g. Home, About, Services Overview, Contact, Locations, AI SEO, Google Ads). Pages do not have publication dates, categories, or author tags, and live as permanent destinations in main navigation.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px 18px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <strong style={{ fontSize: '0.98rem', color: '#ffffff' }}>Posts (Blog Articles &amp; Guides)</strong>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
              Timely, educational articles targeting specific commercial and informational search queries. Posts have publication dates, categories (AI SEO, Google Ads, Meta Ads, WordPress), author bylines, and feed topical authority to your core service pages.
            </p>
          </div>
        </div>
      </div>

      {/* EXISTING PAGES DIRECTORY TABLE */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>
              All Existing Website Pages ({pages.length})
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Select any page below to edit its headline copy, hero section, and search engine metadata.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {(['all', 'core', 'service'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: filterType === t ? 700 : 500,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: filterType === t ? '#ffffff' : 'transparent',
                    color: filterType === t ? '#0f172a' : '#64748b',
                    boxShadow: filterType === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {t === 'all' ? 'All (11)' : t === 'core' ? 'Core Pages (7)' : 'Services (4)'}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Filter pages by name or URL…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                minWidth: '220px'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 20px', width: '35%' }}>Page Title &amp; URL</th>
                <th style={{ padding: '12px 14px', width: '15%' }}>Page Type</th>
                <th style={{ padding: '12px 14px', width: '18%' }}>Meta Title</th>
                <th style={{ padding: '12px 14px', width: '18%' }}>Meta Description</th>
                <th style={{ padding: '12px 20px', width: '14%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((p) => {
                const isSelected = selectedSlug === p.slug;
                const isService = p.slug.startsWith('services/');
                const urlPath = p.slug === 'home' ? '/' : `/${p.slug}`;
                const titleLen = (p.metaTitle || p.title || '').length;
                const descLen = (p.metaDescription || '').length;

                return (
                  <tr
                    key={p.slug}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isSelected ? '#fff7ed' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{p.title}</strong>
                        {isSelected && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'var(--orange)', color: '#ffffff' }}>
                            ACTIVE IN EDITOR
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: '3px' }}>
                        <code style={{ fontSize: '0.76rem', color: '#64748b' }}>{urlPath}</code>
                      </div>
                    </td>

                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '5px',
                          background: isService ? '#f0fdf4' : '#eff6ff',
                          color: isService ? '#166534' : '#1d4ed8',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isService ? 'Service Offering' : 'Core Static Page'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: titleLen >= 40 && titleLen <= 65 ? '#166534' : '#c2410c' }}>
                        {titleLen} chars
                      </div>
                      <div style={{ fontSize: '0.71rem', color: '#64748b', marginTop: '2px' }}>
                        {titleLen >= 40 && titleLen <= 65 ? 'Optimal length' : 'Configured'}
                      </div>
                    </td>

                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: descLen >= 120 && descLen <= 165 ? '#166534' : '#c2410c' }}>
                        {descLen} chars
                      </div>
                      <div style={{ fontSize: '0.71rem', color: '#64748b', marginTop: '2px' }}>
                        {descLen >= 120 && descLen <= 165 ? 'Optimal length' : 'Configured'}
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectPage(p.slug)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: '30px',
                            padding: '0 12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            background: isSelected ? 'var(--orange)' : '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {isSelected ? 'Editing Now' : 'Edit Page'}
                        </button>
                        <a
                          href={urlPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '30px',
                            padding: '0 9px',
                            fontSize: '0.8rem',
                            color: '#64748b',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            textDecoration: 'none'
                          }}
                          title="Open live page in new tab"
                        >
                          ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE EDITOR SECTION */}
      <div ref={editorRef} style={{ scrollMarginTop: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--orange)' }}>
              Live Page Editor
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0', color: '#0f172a' }}>
              Editing: {activePage.title} ({activePage.slug === 'home' ? '/' : `/${activePage.slug}`})
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Switch Page:</span>
            <select
              value={selectedSlug}
              onChange={(e) => handleSelectPage(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.84rem',
                fontWeight: 650,
                border: '1.5px solid var(--orange)',
                borderRadius: '8px',
                background: '#fff',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              {pages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title} ({p.slug === 'home' ? '/' : `/${p.slug}`})
                </option>
              ))}
            </select>
          </div>
        </div>

        {activePage && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', alignItems: 'start' }}>
            {/* Main Edit Form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Page Header Information */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Page Header &amp; Hero Copy
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                      Lead Introduction Copy
                    </label>
                    <textarea
                      rows={3}
                      value={activePage.lead || ''}
                      onChange={(e) => updateField('lead', e.target.value)}
                      placeholder="Primary introduction text appearing under the H1 headline..."
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* Rich Content Editor */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Page Story &amp; Extended Content
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
                  Format rich text, paragraphs, lists, and headings for this page.
                </p>
                <RichTextEditor
                  value={activePage.lead || ''}
                  onChange={(html) => updateField('lead', html)}
                  placeholder="Write page content, value proposition, client services, and structured text..."
                  minHeight={240}
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
                    https://muyeedsifat.vercel.app{activePage.slug === 'home' ? '' : `/${activePage.slug}`}
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
                      <span style={{ fontSize: '0.75rem', color: liveMetaTitle.length > 60 ? '#c2410c' : '#166534', fontWeight: 600 }}>
                        {liveMetaTitle.length}/60 chars (Optimal: 40-60)
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
                      <span style={{ fontSize: '0.75rem', color: liveMetaDesc.length > 160 ? '#c2410c' : '#166534', fontWeight: 600 }}>
                        {liveMetaDesc.length}/160 chars (Optimal: 120-160)
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
                {loading ? 'Saving Changes…' : `Save & Publish /${activePage.slug === 'home' ? '' : activePage.slug}`}
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
    </div>
  );
}
