'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  screenshots,
  tags,
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
  screenshots?: readonly { url: string; caption: string }[] | { url: string; caption: string }[];
  tags?: readonly string[] | string[];
  index?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string } | null>(null);

  useEffect(() => {
    if (isOpen || selectedImage) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (selectedImage) setSelectedImage(null);
          else setIsOpen(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [isOpen, selectedImage]);

  const handleOpenCaseStudy = () => {
    setIsOpen(true);
    if (typeof window !== 'undefined') {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'view_case_study',
        projectName: title,
        projectCategory: category
      });
    }
  };

  const allScreenshots = React.useMemo(() => {
    if (screenshots && screenshots.length > 0) return screenshots;
    if (featuredImage && !featuredImage.endsWith('.svg')) {
      return [{ url: featuredImage, caption: featuredAlt || `${title} Verified Performance Proof` }];
    }
    return [];
  }, [screenshots, featuredImage, featuredAlt, title]);

  return (
    <>
      <article
        className="card projectCard"
        onClick={handleOpenCaseStudy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenCaseStudy();
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          padding: '0',
          borderRadius: '16px',
          border: '1px solid var(--line, #e5e7eb)',
          background: '#ffffff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          outline: 'none',
          height: '100%',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.borderColor = 'var(--orange, #f97316)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = 'var(--line, #e5e7eb)';
        }}
      >
        {/* Card Thumbnail / Proof Image */}
        {featuredImage && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '185px',
              backgroundColor: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            <Image
              src={featuredImage}
              alt={featuredAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
            {allScreenshots.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 650,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                {allScreenshots.length} {allScreenshots.length === 1 ? 'Proof' : 'Proofs'}
              </span>
            )}
          </div>
        )}

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
          <h3 style={{ margin: '0 0 14px', fontSize: '1.18rem', lineHeight: 1.35, fontWeight: 700, color: 'var(--ink, #111827)' }}>
            {title}
          </h3>

          {/* Concise Bullet Points */}
          <div style={{ margin: '0 0 18px', flexGrow: 1 }}>
            <ul
              style={{
                margin: 0,
                paddingLeft: '18px',
                color: '#475569',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {metrics && metrics.length > 0 ? (
                metrics.slice(0, 3).map((m, i) => (
                  <li key={i}>
                    <strong style={{ color: '#0f172a' }}>{m.value}</strong> {m.label}
                  </li>
                ))
              ) : result ? (
                <li>{result}</li>
              ) : (
                <li>Click to read strategic outcomes and campaign metrics</li>
              )}
            </ul>
          </div>

          {/* Clean Footer Link with SVG arrow */}
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
            <span>View case study &amp; proof</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </article>

      {/* Case Study Details Modal */}
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
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              maxWidth: '760px',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
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
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 750,
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
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  Client: {client}
                </span>
              )}
              {timeline && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  • {timeline}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 id="project-modal-title" style={{ fontSize: '1.65rem', fontWeight: 800, margin: '8px 0 16px', lineHeight: 1.3, color: '#0f172a' }}>
              {title}
            </h2>

            {/* Key Metrics Grid */}
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
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.35rem', fontWeight: 850, color: 'var(--orange-dark, #c2410c)' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b', marginTop: '4px', fontWeight: 650 }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Verified Proof Screenshots Gallery */}
            {allScreenshots.length > 0 && (
              <div style={{ margin: '28px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', margin: 0, fontWeight: 750, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Verified Performance &amp; Proof Screenshots
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Click image to enlarge</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: allScreenshots.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '14px'
                  }}
                >
                  {allScreenshots.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(item)}
                      role="button"
                      tabIndex={0}
                      style={{
                        cursor: 'zoom-in',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f8fafc',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.015)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      <div style={{ position: 'relative', width: '100%', height: '170px', background: '#0f172a' }}>
                        <Image
                          src={item.url}
                          alt={item.caption}
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, fontWeight: 550, background: '#ffffff' }}>
                        {item.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy / Overview */}
            <div style={{ margin: '20px 0' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 8px', fontWeight: 700 }}>
                Project Overview &amp; Strategy
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
                  borderRadius: '12px',
                  padding: '16px 18px',
                  margin: '18px 0'
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a', marginBottom: '4px' }}>
                  Key Measurable Result
                </div>
                <div style={{ fontSize: '0.94rem', color: '#14532d', fontWeight: 650, lineHeight: 1.5 }}>
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
                      padding: '4px 9px',
                      borderRadius: '5px',
                      color: '#475569',
                      fontWeight: 550
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
                gap: '12px',
                flexWrap: 'wrap',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <Link
                href="/contact"
                className="btn btnPrimary"
                onClick={() => setIsOpen(false)}
                style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '12px 20px' }}
              >
                Discuss a similar project →
              </Link>
              <button
                type="button"
                className="btn btnSecondary"
                onClick={() => setIsOpen(false)}
                style={{ padding: '0 24px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom View for Proof Screenshots */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close zoom"
              style={{
                position: 'absolute',
                top: '-46px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>✕ Close Preview</span>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '78vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            />
            <p style={{ color: '#e2e8f0', marginTop: '14px', fontSize: '0.92rem', textAlign: 'center', fontWeight: 500, maxWidth: '800px' }}>
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
