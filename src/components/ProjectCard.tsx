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
  metrics?: { label: string; value: string }[];
  featuredImage?: string;
  featuredAlt?: string;
  tags?: string[] | readonly string[];
  index?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

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
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {featuredImage ? (
          <div
            className="projectVisual"
            style={{
              position: 'relative',
              padding: 0,
              overflow: 'hidden',
              background: '#141414'
            }}
          >
            <Image
              src={featuredImage}
              alt={featuredAlt || title}
              width={600}
              height={340}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              unoptimized
            />
            <span
              className="tag"
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                margin: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {category}
            </span>
          </div>
        ) : (
          <div className={`projectVisual visual${index % 3}`} aria-hidden="true">
            <span>{category}</span>
          </div>
        )}

        {!featuredImage && <span className="tag">{category}</span>}

        {client && (
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', fontWeight: 700, marginBottom: 4 }}>
            {client}
          </span>
        )}

        <h3 style={{ margin: '4px 0 10px', fontSize: '1.25rem' }}>{title}</h3>

        {/<[a-z][\s\S]*>/i.test(description) ? (
          <div
            style={{ fontSize: '0.92rem', color: 'var(--muted)', flexGrow: 1, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p style={{ fontSize: '0.92rem', color: 'var(--muted)', flexGrow: 1 }}>{description}</p>
        )}

        {metrics && metrics.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 6px' }}>
            {metrics.map((m, i) => (
              <span
                key={i}
                style={{
                  background: 'var(--orange-soft)',
                  color: 'var(--orange-dark)',
                  fontSize: '0.78rem',
                  fontWeight: 750,
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                {m.label}: <strong>{m.value}</strong>
              </span>
            ))}
          </div>
        )}

        {result && <p className="projectResult">{result}</p>}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            paddingTop: '10px',
            borderTop: '1px solid var(--line, rgba(255,255,255,0.08))',
            fontSize: '0.84rem',
            fontWeight: 650,
            color: 'var(--orange-dark)'
          }}
        >
          <span>View Full Case Study</span>
          <span aria-hidden="true">↗</span>
        </div>
      </article>

      {/* Modal Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflowY: 'auto'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--surface, #18181b)',
              border: '1px solid var(--border, rgba(255,255,255,0.15))',
              borderRadius: '20px',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              color: 'var(--foreground, #ededed)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              ✕
            </button>

            {/* Category & Timeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className="tag" style={{ margin: 0 }}>{category}</span>
              {client && (
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>
                  Client: {client}
                </span>
              )}
              {timeline && (
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', color: '#aaa' }}>
                  ⏳ {timeline}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 id="modal-title" style={{ fontSize: '1.75rem', fontWeight: 800, margin: '8px 0 16px', lineHeight: 1.3 }}>
              {title}
            </h2>

            {/* Metrics Highlight Grid */}
            {metrics && metrics.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  margin: '20px 0'
                }}
              >
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--orange-dark)' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginTop: '4px' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strategy / Overview */}
            <div style={{ margin: '20px 0' }}>
              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '8px' }}>
                Strategy &amp; Overview
              </h4>
              {/<[a-z][\s\S]*>/i.test(description) ? (
                <div
                  style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--muted)' }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--muted)' }}>
                  {description}
                </p>
              )}
            </div>

            {/* Verified Outcome */}
            {result && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '20px 0'
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4ade80', marginBottom: '4px' }}>
                  ✓ Verified Results
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f0fdf4' }}>
                  {result}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div style={{ margin: '18px 0' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        color: '#bbb'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--line, rgba(255,255,255,0.1))'
              }}
            >
              <Link
                href="/contact"
                className="btn btnPrimary"
                onClick={() => setIsOpen(false)}
                style={{ flex: 1, minWidth: '180px', textAlign: 'center' }}
              >
                Discuss a Similar Project →
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