'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Project } from '@/types/content';
import { RichTextEditor } from '@/components/RichTextEditor';

function slugifyClient(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function ProjectEditor({ initialProject }: { initialProject?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        { label: 'Organic Traffic Lift', value: '+300%' },
        { label: 'SERP Top 3 Positions', value: '45+ Terms' }
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
    setStatusMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', project.title || file.name);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      updateField('featuredImage', data.item.url);
      if (!project.featuredAlt) {
        updateField('featuredAlt', data.item.alt || project.title || '');
      }
      setStatusMsg('Image uploaded and converted directly to WebP.');
    } catch (err: unknown) {
      setStatusMsg((err as Error).message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      const isEdit = Boolean(project.id);
      const url = isEdit ? `/api/admin/projects/${project.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      setStatusMsg('Case study saved successfully.');
      router.push('/admin/projects');
      router.refresh();
    } catch (err: unknown) {
      setStatusMsg((err as Error).message || 'Error occurred while saving');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="editorModernLayout">
      <div className="editorMainColumn">
        {/* Title & Basic Meta */}
        <div className="adminCard">
          <span className="adminEyebrow">Case Study / Portfolio Project</span>
          <input
            type="text"
            required
            placeholder="Case Study Title (e.g. Organic Growth Strategy for SaaS)"
            value={project.title || ''}
            onChange={(e) => {
              const val = e.target.value;
              setProject((prev) => ({
                ...prev,
                title: val,
                slug: prev.slug || slugifyClient(val)
              }));
            }}
            className="editorTitleInput"
          />

          <div className="adminFormGrid" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Service Category</label>
              <select
                value={project.category || 'AI SEO'}
                onChange={(e) => updateField('category', e.target.value)}
                className="adminSelect"
              >
                <option value="AI SEO">AI SEO &amp; AEO / GEO</option>
                <option value="Google Ads">Google Ads (Search, PMax, PPC)</option>
                <option value="Meta Ads">Meta Ads (Facebook &amp; Instagram)</option>
                <option value="WordPress">WordPress Development</option>
                <option value="Digital Marketing">Comprehensive Growth</option>
              </select>
            </div>

            <div className="field">
              <label>Client / Brand Name</label>
              <input
                type="text"
                placeholder="e.g. B2B Enterprise Client"
                value={project.client || ''}
                onChange={(e) => updateField('client', e.target.value)}
              />
            </div>

            <div className="field fieldFull">
              <label>Headline Result / Impact Badge</label>
              <input
                type="text"
                placeholder="e.g. +300% Organic Growth & $1.2M Pipeline Generated"
                value={project.result || ''}
                onChange={(e) => updateField('result', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Detailed Case Study Content with Rich Text Editor */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle" style={{ marginBottom: 12 }}>
            Case Study Story &amp; Strategy (Rich Text &amp; Tables)
          </h3>
          <p className="adminHelpText" style={{ marginBottom: 16 }}>
            Use the formatting toolbar to format headings, bold highlights, add comparison tables, bullet points, client quotes, and custom links.
          </p>
          <RichTextEditor
            value={project.description || ''}
            onChange={(html) => updateField('description', html)}
            placeholder="Detail the client challenge, campaign architecture, keyword clustering, execution strategy, and final results..."
            minHeight={320}
          />
        </div>

        {/* Performance Metrics Builder */}
        <div className="adminCard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 className="sidebarSectionTitle" style={{ margin: 0 }}>Key Results &amp; Metrics</h3>
              <p className="adminHelpText" style={{ margin: '4px 0 0' }}>Highlight impressive quantifiable proof points.</p>
            </div>
            <button type="button" onClick={addMetric} className="buttonSmall">
              + Add Metric
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {(project.metrics || []).map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <input
                  type="text"
                  placeholder="Metric Label (e.g. Traffic Lift)"
                  value={m.label}
                  onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                  style={{ background: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Metric Value (e.g. +300%)"
                  value={m.value}
                  onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                  style={{ background: '#fff' }}
                />
                <button
                  type="button"
                  onClick={() => removeMetric(idx)}
                  className="buttonSmall buttonDanger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="editorSidebar">
        {/* Save / Publish */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Save Case Study</h3>
          <div className="adminActions" style={{ marginTop: 14 }}>
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="btn btnSecondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btnPrimary"
              style={{ flex: 1 }}
            >
              {loading ? 'Saving…' : 'Save Project'}
            </button>
          </div>
          {statusMsg && <p className="adminNotification" style={{ marginTop: 12 }}>{statusMsg}</p>}
        </div>

        {/* Featured Image with Direct Drag/Drop WebP Upload */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Featured Case Study Image (WebP)</h3>
          {project.featuredImage ? (
            <div style={{ marginBottom: 12 }}>
              <Image
                src={project.featuredImage}
                alt={project.featuredAlt || 'Project preview'}
                width={300}
                height={180}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 8 }}
              />
              <button
                type="button"
                className="buttonSmall buttonDanger"
                style={{ width: '100%', marginTop: 8 }}
                onClick={() => updateField('featuredImage', '')}
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div
              className="inlineUploadZone"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginBottom: 12 }}
            >
              <div style={{ fontSize: '1.4rem' }}>📷</div>
              <strong>{uploadingImage ? 'Converting to WebP…' : 'Upload Image (Auto-WebP)'}</strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Converts PNG/JPG directly to optimized WebP
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          <div className="field">
            <label>Image URL</label>
            <input
              type="text"
              placeholder="/images/... or https://..."
              value={project.featuredImage || ''}
              onChange={(e) => updateField('featuredImage', e.target.value)}
            />
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label>Alt Text</label>
            <input
              type="text"
              placeholder="Descriptive alt text"
              value={project.featuredAlt || ''}
              onChange={(e) => updateField('featuredAlt', e.target.value)}
            />
          </div>
        </div>

        {/* Permanent URL Slug */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">URL Slug</h3>
          <div className="field">
            <input
              type="text"
              placeholder="case-study-slug"
              value={project.slug || ''}
              onChange={(e) => updateField('slug', slugifyClient(e.target.value))}
            />
          </div>
          <p className="adminHelpText">/projects/{project.slug || 'case-study-slug'}</p>
        </div>

        {/* SEO Meta */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle">Search Engine Optimization</h3>
          <div className="field">
            <label>Focus Keyword</label>
            <input
              type="text"
              placeholder="e.g. SEO Case Study"
              value={project.focusKeyword || ''}
              onChange={(e) => updateField('focusKeyword', e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Meta Title</label>
            <input
              type="text"
              placeholder="Custom Google title..."
              value={project.metaTitle || ''}
              onChange={(e) => updateField('metaTitle', e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Meta Description</label>
            <textarea
              placeholder="Brief description for search snippet..."
              value={project.metaDescription || ''}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>
      </aside>
    </form>
  );
}
