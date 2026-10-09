'use client';

import React, { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/types/content';

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage('');
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', file.name.replace(/\.[^/.]+$/, ''));

      try {
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: fd
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setMedia((prev) => [data.item, ...prev]);
          successCount++;
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    setUploading(false);
    setMessage(
      successCount > 0
        ? `Successfully uploaded and converted ${successCount} image(s) to WebP.`
        : 'Upload failed. Check file types and try again.'
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function saveItem(item: MediaItem) {
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        setMessage(`Saved metadata for "${item.filename}".`);
      } else {
        setMessage('Could not save metadata.');
      }
    } catch {
      setMessage('Network error while saving.');
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to remove this media item?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setMessage('Media item removed.');
      }
    } catch {
      setMessage('Failed to delete item.');
    }
  }

  async function handleConvertAll() {
    setConverting(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/media/convert-all', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Scanned ${data.scannedCount} files. Converted ${data.convertedCount} image(s) to WebP format!`
        );
      } else {
        setMessage(data.error || 'Conversion failed.');
      }
    } catch {
      setMessage('Failed to trigger batch conversion.');
    } finally {
      setConverting(false);
    }
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filtered = media.filter(
    (m) =>
      (m.filename || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.alt || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adminContentStack">
      {/* Top Header & Actions */}
      <div className="adminPageHeader">
        <div>
          <span className="adminEyebrow">Assets Management</span>
          <h1 className="adminTitle">Media Library</h1>
          <p className="adminSubtitle">
            All images are automatically optimized and converted to modern <strong>WebP</strong> format for fast load times and Core Web Vitals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btnSecondary"
            disabled={converting}
            onClick={handleConvertAll}
            title="Scan public folder and convert any non-WebP image to WebP"
          >
            {converting ? 'Scanning & Converting…' : '⚡ Convert All to WebP'}
          </button>
          <button
            type="button"
            className="btn btnPrimary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Converting WebP…' : '+ Upload Images'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {message && <div className="adminNotification">{message}</div>}

      {/* Drag & Drop Upload Zone */}
      <div
        className="mediaDropzone"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('mediaDropzoneActive');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('mediaDropzoneActive');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('mediaDropzoneActive');
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzoneIcon">📸</div>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>
          Click to upload or drag &amp; drop images here
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
          Supports PNG, JPG, JPEG, WEBP, GIF, SVG, BMP. Every image is automatically converted to <strong>optimized .webp</strong>.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="adminFilterBar">
        <input
          type="text"
          className="adminSearchInput"
          placeholder="Search media by filename, alt text or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
          {filtered.length} of {media.length} items
        </div>
      </div>

      {/* Media Cards Grid */}
      {filtered.length === 0 ? (
        <div className="adminEmptyState">
          <p>No media files found matching your search.</p>
        </div>
      ) : (
        <div className="mediaModernGrid">
          {filtered.map((item) => (
            <div key={item.id} className="mediaModernCard">
              <div className="mediaThumbWrap">
                <Image
                  src={item.url}
                  alt={item.alt || item.filename}
                  width={380}
                  height={260}
                  style={{ objectFit: 'cover', width: '100%', height: '180px' }}
                  unoptimized={item.url.endsWith('.svg')}
                />
                <span className="mediaFormatBadge">WEBP</span>
              </div>

              <div className="mediaCardBody">
                <div className="mediaFilename" title={item.filename}>
                  {item.filename}
                </div>
                <div className="mediaMetaDetails">
                  {item.width && item.height ? `${item.width} × ${item.height}px • ` : ''}
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                </div>

                <div className="mediaFieldGroup">
                  <label>Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => {
                      const updated = { ...item, alt: e.target.value };
                      setMedia((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
                    }}
                    placeholder="Describe image..."
                  />
                </div>

                <div className="mediaCardActions">
                  <button
                    type="button"
                    className="buttonSmall"
                    onClick={() => copyUrl(item)}
                  >
                    {copiedId === item.id ? '✓ Copied URL' : '🔗 Copy URL'}
                  </button>
                  <button
                    type="button"
                    className="buttonSmall"
                    onClick={() => saveItem(item)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="buttonSmall buttonDanger"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
