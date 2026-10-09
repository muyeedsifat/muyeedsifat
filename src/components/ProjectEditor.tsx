'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/content';

export function ProjectEditor({ initialProject }: { initialProject?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [project, setProject] = useState<Partial<Project>>(
    initialProject || {
      title: '',
      slug: '',
      category: 'AI SEO',
      client: '',
      timeline: '',
      description: '',
      result: '',
      metrics: [
        { label: 'Primary Result', value: '+150%' },
        { label: 'Timeline', value: '3 Months' }
      ],
      featuredImage: '',
      featuredAlt: '',
      metaTitle: '',
      metaDescription: '',
      focusKeyword: ''
    }
  );

  function updateField<K extends keyof Project>(field: K, value: Project[K]) {
    setProject((prev) => ({ ...prev, [field]: value }));
  }

  function handleMetricChange(index: number, key: 'label' | 'value', val: string) {
    const nextMetrics = [...(project.metrics || [])];
    nextMetrics[index] = { ...nextMetrics[index], [key]: val };
    setProject((prev) => ({ ...prev, metrics: nextMetrics }));
  }

  function addMetric() {
    setProject((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: 'New Metric', value: '+100%' }]
    }));
  }

  function removeMetric(index: number) {
    setProject((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== index)
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.item?.url) {
        setProject((prev) => ({
          ...prev,
          featuredImage: data.item.url,
          featuredAlt: prev.title || data.item.alt || 'Case study visual'
        }));
        setStatusMsg('Image uploaded and optimized successfully!');
      } else {
        alert(data.error || 'Image upload failed.');
      }
    } catch {
      alert('Upload error. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project.title?.trim()) {
      alert('Please provide a project title.');
      return;
    }

    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });

      if (res.ok) {
        setStatusMsg('Case study saved successfully!');
        router.push('/admin/projects');
        router.refresh();
      } else {
        const body = await res.json();
        alert(body.error || 'Failed to save project.');
      }
    } catch {
      alert('Network error while saving project.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="editorLayout">
      {/* Main Content Form */}
      <div className="editorPanel">
        <div className="adminCard">
          <div className="field">
            <label htmlFor="proj-title">Project / Case Study Title</label>
            <input
              id="proj-title"
              required
              value={project.title || ''}
              onChange={(e) => {
                const val = e.target.value;
                updateField('title', val);
                if (!initialProject) {
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  updateField('slug', autoSlug);
                  updateField('metaTitle', `${val} | Case Study`);
                }
              }}
              placeholder="e.g. Organic Growth Strategy for B2B SaaS"
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="proj-slug">URL Slug</label>
            <input
              id="proj-slug"
              required
              value={project.slug || ''}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="e.g. organic-growth-strategy"
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="proj-desc">Executive Summary / Description</label>
            <textarea
              id="proj-desc"
              rows={4}
              value={project.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Explain the background, challenge, and methodology in simple terms..."
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="proj-result">Key Result Highlight</label>
            <input
              id="proj-result"
              value={project.result || ''}
              onChange={(e) => updateField('result', e.target.value)}
              placeholder="e.g. +300% organic traffic growth and 4.2x ROAS"
            />
          </div>
        </div>

        {/* Measurable Performance Metrics */}
        <div className="adminCard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Measurable Metrics</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#777' }}>
                Key performance indicators displayed as badges on the website.
              </p>
            </div>
            <button type="button" onClick={addMetric} className="buttonSmall">
              + Add Metric
            </button>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {(project.metrics || []).map((metric, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  value={metric.label}
                  onChange={(e) => handleMetricChange(i, 'label', e.target.value)}
                  placeholder="Metric Label (e.g. Traffic Growth)"
                  style={{ flex: 1, padding: 8, border: '1px solid var(--line)', borderRadius: 8 }}
                />
                <input
                  value={metric.value}
                  onChange={(e) => handleMetricChange(i, 'value', e.target.value)}
                  placeholder="Value (e.g. +300%)"
                  style={{ width: 130, padding: 8, border: '1px solid var(--line)', borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => removeMetric(i)}
                  className="buttonSmall buttonDanger"
                  aria-label="Remove metric"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Visual & Screenshots */}
        <div className="adminCard">
          <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem' }}>Project Visual / Cover Image</h3>
          <p style={{ fontSize: '0.85rem', color: '#777', margin: '0 0 14px' }}>
            Upload an image or paste a URL. The system automatically sizes and optimizes it.
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              style={{ fontSize: '0.88rem' }}
            />
            {uploadingImage && <span style={{ fontSize: '0.85rem', color: 'var(--orange)' }}>Uploading &amp; converting to WebP…</span>}
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="proj-img-url">Or Image URL</label>
            <input
              id="proj-img-url"
              value={project.featuredImage || ''}
              onChange={(e) => updateField('featuredImage', e.target.value)}
              placeholder="e.g. /images/blog/aeo-vs-geo-vs-seo.svg"
            />
          </div>

          {project.featuredImage && (
            <div style={{ marginTop: 14, maxWidth: 360, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <img src={project.featuredImage} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Controls: Classification & SEO */}
      <aside className="editorAside">
        <div className="adminCard">
          <button className="btn btnPrimary" type="submit" disabled={loading} style={{ width: '100%', marginBottom: 10 }}>
            {loading ? 'Saving Project…' : 'Save & Publish Case Study'}
          </button>
          {statusMsg && <div className="notice" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>{statusMsg}</div>}
        </div>

        <div className="adminCard">
          <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777' }}>
            Classification
          </h4>

          <div className="field">
            <label htmlFor="proj-category">Core Category</label>
            <select
              id="proj-category"
              value={project.category || 'AI SEO'}
              onChange={(e) => updateField('category', e.target.value)}
            >
              <option value="AI SEO">AI SEO</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="WordPress">WordPress</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="proj-client">Client / Industry (Optional)</label>
            <input
              id="proj-client"
              value={project.client || ''}
              onChange={(e) => updateField('client', e.target.value)}
              placeholder="e.g. B2B SaaS Platform"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="proj-timeline">Timeline / Duration</label>
            <input
              id="proj-timeline"
              value={project.timeline || ''}
              onChange={(e) => updateField('timeline', e.target.value)}
              placeholder="e.g. 3 Months"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="adminCard">
          <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777' }}>
            SEO &amp; Discoverability
          </h4>

          <div className="field">
            <label htmlFor="proj-meta-title">Meta Title</label>
            <input
              id="proj-meta-title"
              value={project.metaTitle || ''}
              onChange={(e) => updateField('metaTitle', e.target.value)}
              placeholder="Title shown on search engines"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="proj-meta-desc">Meta Description</label>
            <textarea
              id="proj-meta-desc"
              rows={3}
              value={project.metaDescription || ''}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              placeholder="Summary shown on search engines"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="proj-focus-kw">Focus Keyword</label>
            <input
              id="proj-focus-kw"
              value={project.focusKeyword || ''}
              onChange={(e) => updateField('focusKeyword', e.target.value)}
              placeholder="e.g. AI SEO case study"
            />
          </div>
        </div>
      </aside>
    </form>
  );
}
