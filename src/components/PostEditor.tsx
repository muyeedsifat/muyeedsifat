'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ContentBlock, MediaItem, Post } from '@/types/content';
import { RichTextEditor } from '@/components/RichTextEditor';

function uid() {
  return crypto.randomUUID();
}

function slugifyClient(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function blankBlock(type: ContentBlock['type']): ContentBlock {
  if (type === 'list') return { id: uid(), type: 'list', items: ['First key point', 'Second key point'] };
  if (type === 'button') return { id: uid(), type: 'button', text: 'Schedule a Consultation', url: '/contact' };
  if (type === 'image') return { id: uid(), type: 'image', url: '', alt: '', caption: '' };
  return { id: uid(), type, text: '' } as ContentBlock;
}

export function PostEditor({
  initialPost,
  media,
  categories,
  tags
}: {
  initialPost: Post;
  media: MediaItem[];
  categories: string[];
  tags: string[];
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initialPost);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [titlePx, setTitlePx] = useState(0);
  const [descPx, setDescPx] = useState(0);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const featuredInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '600 20px Arial';
    setTitlePx(Math.round(ctx.measureText(post.metaTitle || post.title).width));
    ctx.font = '400 14px Arial';
    setDescPx(Math.round(ctx.measureText(post.metaDescription).width));
  }, [post.metaTitle, post.metaDescription, post.title]);

  const keyword = (post.focusKeyword || '').toLowerCase();
  const seoChecks = useMemo(
    () =>
      [
        ['Keyword in title', !keyword || post.title.toLowerCase().includes(keyword)],
        ['Keyword in URL slug', !keyword || post.slug.includes(slugifyClient(keyword))],
        ['Keyword in meta title', !keyword || (post.metaTitle || post.title).toLowerCase().includes(keyword)],
        ['Keyword in meta description', !keyword || post.metaDescription.toLowerCase().includes(keyword)],
        ['Featured image alt set', !post.featuredImage || Boolean(post.featuredAlt.trim())]
      ] as const,
    [keyword, post]
  );

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
  }

  function updateBlock(index: number, next: ContentBlock) {
    setPost((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b, i) => (i === index ? next : b))
    }));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    setPost((prev) => {
      const blocks = [...prev.blocks];
      const target = index + dir;
      if (target < 0 || target >= blocks.length) return prev;
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...prev, blocks };
    });
  }

  async function handleFeaturedUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', post.title || file.name);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setPost((prev) => ({
        ...prev,
        featuredImage: data.item.url,
        featuredAlt: prev.featuredAlt || data.item.alt || prev.title
      }));
      setMessage('Featured image uploaded and converted to WebP.');
    } catch (err) {
      setMessage((err as Error).message || 'Image upload error');
    } finally {
      setUploadingFeatured(false);
      if (featuredInputRef.current) featuredInputRef.current.value = '';
    }
  }

  async function handleBlockImageUpload(index: number, file: File) {
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const current = post.blocks[index];
      if (current && current.type === 'image') {
        updateBlock(index, {
          ...current,
          url: data.item.url,
          alt: current.alt || data.item.alt
        });
      }
    } catch (err) {
      alert((err as Error).message || 'Upload error');
    }
  }

  async function save(status: Post['status']) {
    setSaving(true);
    setMessage('');
    const payload = {
      ...post,
      status,
      publishedAt: status === 'published' ? post.publishedAt || new Date().toISOString() : post.publishedAt
    };

    try {
      const res = await fetch(post.id ? `/api/admin/posts/${post.id}` : '/api/admin/posts', {
        method: post.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      setSaving(false);

      if (res.ok) {
        setPost(body.post);
        setMessage('Article successfully saved & published.');
        if (!initialPost.id && body.post?.id) {
          router.replace(`/admin/posts/${body.post.id}`);
        }
        router.refresh();
      } else {
        setMessage(body.error || 'Save failed.');
      }
    } catch {
      setSaving(false);
      setMessage('Network error during save.');
    }
  }

  return (
    <div className="editorModernLayout">
      <div className="editorMainColumn">
        {/* Post Title Card */}
        <div className="adminCard">
          <span className="adminEyebrow">Post &amp; Article Content</span>
          <input
            aria-label="Post title"
            value={post.title}
            onChange={(e) => {
              const val = e.target.value;
              setPost((p) => ({
                ...p,
                title: val,
                slug: p.slug || slugifyClient(val)
              }));
            }}
            placeholder="Enter Post Title..."
            className="editorTitleInput"
          />
          <textarea
            value={post.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            placeholder="Short post summary / excerpt for blog feed & meta preview..."
            className="editorExcerptInput"
          />
        </div>

        {/* Dynamic Content Blocks & Rich Text */}
        <div className="blocksContainer">
          {post.blocks.map((block, index) => (
            <div className="editorModernBlock" key={block.id}>
              <div className="blockHeader">
                <span className="blockBadge">{block.type.toUpperCase()}</span>
                <div className="adminActions">
                  <button type="button" className="buttonSmall" onClick={() => moveBlock(index, -1)}>
                    ↑ Up
                  </button>
                  <button type="button" className="buttonSmall" onClick={() => moveBlock(index, 1)}>
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    className="buttonSmall buttonDanger"
                    onClick={() => setPost((p) => ({ ...p, blocks: p.blocks.filter((_, i) => i !== index) }))}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              {/* Rich Text Editor for paragraph / content */}
              {(['paragraph', 'h2', 'h3', 'quote'] as const).includes(block.type as never) && 'text' in block && (
                <RichTextEditor
                  value={block.text}
                  onChange={(html) => updateBlock(index, { ...block, text: html } as ContentBlock)}
                  placeholder={`Write ${block.type} content...`}
                />
              )}

              {/* List Block */}
              {block.type === 'list' && (
                <div>
                  <textarea
                    value={block.items.join('\n')}
                    onChange={(e) => updateBlock(index, { ...block, items: e.target.value.split('\n') })}
                    style={{ width: '100%', minHeight: '120px', padding: '12px' }}
                    placeholder="Enter items (one item per line)..."
                  />
                  <p className="adminHelpText">One bullet item per line</p>
                </div>
              )}

              {/* Button CTA Block */}
              {block.type === 'button' && (
                <div className="adminFormGrid">
                  <div className="field">
                    <label>Button Label</label>
                    <input
                      value={block.text}
                      onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Destination URL</label>
                    <input
                      value={block.url}
                      onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Image Block with Direct Upload + Media Select */}
              {block.type === 'image' && (
                <div className="blockImageConfig">
                  {block.url ? (
                    <div style={{ position: 'relative', textAlign: 'center', marginBottom: 12 }}>
                      <Image
                        src={block.url}
                        alt={block.alt || 'Post image'}
                        width={600}
                        height={350}
                        style={{ maxHeight: '240px', objectFit: 'contain', borderRadius: 8, background: '#f8fafc' }}
                      />
                      <button
                        type="button"
                        className="buttonSmall buttonDanger"
                        style={{ display: 'block', margin: '8px auto 0' }}
                        onClick={() => updateBlock(index, { ...block, url: '' })}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div
                      className="inlineUploadZone"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const f = (e.target as HTMLInputElement).files?.[0];
                          if (f) handleBlockImageUpload(index, f);
                        };
                        input.click();
                      }}
                    >
                      <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>📸</div>
                      <strong>Click to Upload Image (Auto-WebP)</strong>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                        Or choose from library below
                      </p>
                    </div>
                  )}

                  <div className="adminFormGrid" style={{ marginTop: 12 }}>
                    <div className="field">
                      <label>Or Select From Media Library</label>
                      <select
                        value={block.url}
                        onChange={(e) => {
                          const m = media.find((x) => x.url === e.target.value);
                          updateBlock(index, {
                            ...block,
                            url: e.target.value,
                            alt: block.alt || m?.alt || ''
                          });
                        }}
                      >
                        <option value="">Choose media from library</option>
                        {media.map((m) => (
                          <option key={m.id} value={m.url}>
                            {m.title || m.filename}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Image Alt Text (SEO)</label>
                      <input
                        value={block.alt}
                        onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                        placeholder="Descriptive alt text"
                      />
                    </div>
                    <div className="field fieldFull">
                      <label>Caption (Optional)</label>
                      <input
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                        placeholder="Visible caption"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Blocks Toolbar */}
        <div className="adminCard addBlockCard">
          <strong style={{ fontSize: '0.94rem' }}>Add Content Block</strong>
          <div className="addBlockButtons">
            {(['paragraph', 'h2', 'h3', 'list', 'quote', 'image', 'button'] as ContentBlock['type'][]).map(
              (type) => (
                <button
                  key={type}
                  className="addBlockBtn"
                  type="button"
                  onClick={() => update('blocks', [...post.blocks, blankBlock(type)])}
                >
                  + {type.toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Settings Sidebar */}
      <aside className="editorSidebar">
        {/* Publish Action Card */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Publish Status</h3>
          <div className="field">
            <select
              value={post.status}
              onChange={(e) => update('status', e.target.value as Post['status'])}
              className="adminSelect"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Live)</option>
            </select>
          </div>
          <div className="adminActions" style={{ marginTop: 14 }}>
            <button
              className="btn btnSecondary"
              type="button"
              disabled={saving}
              onClick={() => save('draft')}
              style={{ flex: 1 }}
            >
              Save Draft
            </button>
            <button
              className="btn btnPrimary"
              type="button"
              disabled={saving}
              onClick={() => save('published')}
              style={{ flex: 1 }}
            >
              {post.status === 'published' ? 'Update Live' : 'Publish'}
            </button>
          </div>
          {message && <p className="adminNotification" style={{ marginTop: 12 }}>{message}</p>}
        </div>

        {/* Featured Image with Direct Upload */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Featured Image (WebP)</h3>
          {post.featuredImage ? (
            <div style={{ marginBottom: 12 }}>
              <Image
                src={post.featuredImage}
                alt={post.featuredAlt || 'Featured preview'}
                width={300}
                height={180}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 8 }}
              />
              <button
                type="button"
                className="buttonSmall buttonDanger"
                style={{ width: '100%', marginTop: 8 }}
                onClick={() => setPost((p) => ({ ...p, featuredImage: '', featuredAlt: '' }))}
              >
                Remove Featured Image
              </button>
            </div>
          ) : (
            <div
              className="inlineUploadZone"
              onClick={() => featuredInputRef.current?.click()}
              style={{ marginBottom: 12 }}
            >
              <div style={{ fontSize: '1.4rem' }}>📷</div>
              <strong>{uploadingFeatured ? 'Converting to WebP…' : 'Upload Featured Image'}</strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Auto-converts PNG/JPG to WebP
              </p>
            </div>
          )}
          <input
            ref={featuredInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFeaturedUpload}
          />

          <div className="field">
            <label>Or Pick from Library</label>
            <select
              value={post.featuredImage}
              onChange={(e) => {
                const m = media.find((x) => x.url === e.target.value);
                setPost((p) => ({
                  ...p,
                  featuredImage: e.target.value,
                  featuredAlt: m?.alt || p.featuredAlt
                }));
              }}
            >
              <option value="">No image selected</option>
              {media.map((m) => (
                <option key={m.id} value={m.url}>
                  {m.title || m.filename}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label>Featured Image Alt Text</label>
            <input
              value={post.featuredAlt}
              onChange={(e) => update('featuredAlt', e.target.value)}
              placeholder="Important for SEO"
            />
          </div>
        </div>

        {/* URL Slug */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Permanent Link</h3>
          <div className="field">
            <input
              value={post.slug}
              onChange={(e) => update('slug', slugifyClient(e.target.value))}
              placeholder="post-slug"
            />
          </div>
          <p className="adminHelpText">/blog/{post.slug || 'post-slug'}</p>
        </div>

        {/* Categories & Tags */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Categories</h3>
          <div className="checkboxList">
            {categories.map((c) => (
              <label className="checkboxPill" key={c}>
                <input
                  type="checkbox"
                  checked={post.categories.includes(c)}
                  onChange={(e) =>
                    update(
                      'categories',
                      e.target.checked ? [...post.categories, c] : post.categories.filter((x) => x !== c)
                    )
                  }
                />
                {c}
              </label>
            ))}
          </div>

          <h3 className="sidebarSectionTitle" style={{ marginTop: 16 }}>
            Tags
          </h3>
          <div className="checkboxList">
            {tags.map((t) => (
              <label className="checkboxPill" key={t}>
                <input
                  type="checkbox"
                  checked={post.tags.includes(t)}
                  onChange={(e) =>
                    update('tags', e.target.checked ? [...post.tags, t] : post.tags.filter((x) => x !== t))
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* SEO Score Meter */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">SEO Optimization</h3>
          <div className="field">
            <label>Focus Keyword</label>
            <input
              value={post.focusKeyword}
              onChange={(e) => update('focusKeyword', e.target.value)}
              placeholder="e.g. AI SEO Strategy"
            />
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Meta Title</label>
            <input
              value={post.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              placeholder="Search engine title..."
            />
            <span className="adminHelpText">
              {(post.metaTitle || post.title).length} chars • ~{titlePx}px
            </span>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Meta Description</label>
            <textarea
              value={post.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              placeholder="Summary in Google results..."
              style={{ minHeight: '80px' }}
            />
            <span className="adminHelpText">
              {post.metaDescription.length} chars • ~{descPx}px
            </span>
          </div>

          <div className="seoMeterList" style={{ marginTop: 14 }}>
            {seoChecks.map(([label, ok]) => (
              <div key={label} className={ok ? 'meterItemGood' : 'meterItemWarn'}>
                {ok ? '✓' : '•'} {label}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">FAQ Schema (Rich Snippets)</h3>
          {post.faqs.map((faq, index) => (
            <div key={index} className="faqEditorCard">
              <input
                value={faq.question}
                onChange={(e) =>
                  update(
                    'faqs',
                    post.faqs.map((f, i) => (i === index ? { ...f, question: e.target.value } : f))
                  )
                }
                placeholder="Question"
                style={{ marginBottom: 6 }}
              />
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  update(
                    'faqs',
                    post.faqs.map((f, i) => (i === index ? { ...f, answer: e.target.value } : f))
                  )
                }
                placeholder="Answer"
                style={{ minHeight: 60 }}
              />
              <button
                type="button"
                className="buttonSmall buttonDanger"
                style={{ marginTop: 6 }}
                onClick={() => update('faqs', post.faqs.filter((_, i) => i !== index))}
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            type="button"
            className="buttonSmall"
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => update('faqs', [...post.faqs, { question: '', answer: '' }])}
          >
            + Add FAQ Item
          </button>
        </div>
      </aside>
    </div>
  );
}
