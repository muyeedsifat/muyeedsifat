'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ProjectCard({
  category,
  title,
  description,
  result,
  client,
  timeline,
  metrics,
  featuredImage,
  featuredAlt,
  tags,
  index = 0
}: {
  category: string;
  title: string;
  description: string;
  result?: string;
  client?: string;
  timeline?: string;
  metrics?: readonly { label?: string; value?: string }[] | { label?: string; value?: string }[];
  featuredImage?: string;
  featuredAlt?: string;
  tags?: readonly string[] | string[];
  index?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [isOpen]);

  // Clean plain text summary (strips any raw HTML and trims cleanly to avoid text clutter)
  const plainText = description.replace(/<[^>]+>/g, '').trim();
  const summary = plainText.length > 130 ? plainText.slice(0, 127) + '...' : plainText;

  return (
    <>
      <article
        className="card projectCard"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--line, #e5e7eb)',
          background: '#ffffff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          outline: 'none',
          height: '100%'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.borderColor = 'var(--orange, #f97316)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = 'var(--line, #e5e7eb)';
        }}
      >
        {/* Top Meta: Category + Client */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--orange-dark, #c2410c)',
              background: 'var(--orange-soft, #fff7ed)',
              padding: '4px 9px',
              borderRadius: '6px'
            }}
          >
            {category}
          </span>
          {client && (
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>
              {client}
            </span>
          )}
        </div>

        {/* Clean, Prominent Title */}
        <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', lineHeight: 1.35, fontWeight: 700, color: 'var(--ink, #111827)' }}>
          {title}
        </h3>

        {/* Minimal Short Excerpt */}
        <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, flexGrow: 1 }}>
          {summary}
        </p>

        {/* Clean Footer Link with SVG arrow (no emoji, no bulky metric pills) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem',
            fontWeight: 650,
            color: 'var(--orange-dark, #c2410c)',
            paddingTop: '12px',
            borderTop: '1px solid #f3f4f6'
          }}
        >
          <span>View case study</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </article>

      {/* Clean, Modern Details Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              color: '#0f172a'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 750,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--orange-dark, #c2410c)',
                  background: 'var(--orange-soft, #fff7ed)',
                  padding: '4px 8px',
                  borderRadius: '5px'
                }}
              >
                {category}
              </span>
              {client && (
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Client: {client}
                </span>
              )}
              {timeline && (
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  • {timeline}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 id="project-modal-title" style={{ fontSize: '1.6rem', fontWeight: 750, margin: '6px 0 16px', lineHeight: 1.3, color: '#0f172a' }}>
              {title}
            </h2>

            {/* Key Metrics Grid */}
            {metrics && metrics.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px',
                  margin: '20px 0'
                }}
              >
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--orange-dark, #c2410c)' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strategy / Overview */}
            <div style={{ margin: '20px 0' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 8px', fontWeight: 700 }}>
                Project Overview
              </h4>
              {/<[a-z][\s\S]*>/i.test(description) ? (
                <div
                  style={{ fontSize: '0.94rem', lineHeight: 1.7, color: '#334155' }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p style={{ fontSize: '0.94rem', lineHeight: 1.7, color: '#334155', margin: 0 }}>
                  {description}
                </p>
              )}
            </div>

            {/* Verified Outcome */}
            {result && (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  margin: '18px 0'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a', marginBottom: '4px' }}>
                  Key Outcome
                </div>
                <div style={{ fontSize: '0.92rem', color: '#14532d', fontWeight: 600 }}>
                  {result}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '18px 0 24px' }}>
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.72rem',
                      background: '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: '#475569',
                      fontWeight: 500
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <Link
                href="/contact"
                className="btn btnPrimary"
                onClick={() => setIsOpen(false)}
                style={{ flex: 1, minWidth: '180px', textAlign: 'center' }}
              >
                Discuss a similar project →
              </Link>
              <button
                type="button"
                className="btn btnSecondary"
                onClick={() => setIsOpen(false)}
                style={{ padding: '0 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}