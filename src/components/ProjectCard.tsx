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
          <h3 style={{ margin: '0 0 14px', fontSize: '1.18rem', lineHeight: 1.35, fontWeight: 750, color: 'var(--ink, #111827)' }}>
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

      {/* Case Study Details Modal - Modern, Clean & Symmetric */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="projectModalOverlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="projectModalContainer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="modalCloseBtn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Meta row: Category + Client + Timeline */}
            <div className="modalMetaRow">
              <span className="modalCategoryPill">
                {category}
              </span>
              {client && (
                <span className="modalClientText">
                  Client: {client}
                </span>
              )}
              {timeline && (
                <span className="modalTimelineText">
                  • {timeline}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 id="project-modal-title" className="modalTitleText">
              {title}
            </h2>

            {/* Key Metrics: Symmetric Bento Stat Bar */}
            {metrics && metrics.length > 0 && (
              <div className="modalBentoBar">
                {metrics.map((m, i) => (
                  <div key={i} className="modalBentoCell">
                    <div className="modalMetricValue">
                      {m.value}
                    </div>
                    <div className="modalMetricLabel">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Verified Proof Screenshots Gallery */}
            {allScreenshots.length > 0 && (
              <div className="modalProofSection">
                <div className="modalProofHeader">
                  <h4 className="modalProofHeading">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #f97316)" strokeWidth="2.5">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Verified Performance &amp; Proof Screenshots
                  </h4>
                  <span className="modalProofHint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Click image to enlarge
                  </span>
                </div>

                <div className="modalProofGrid">
                  {allScreenshots.map((item, idx) => (
                    <div
                      key={idx}
                      className="modalProofCard"
                      onClick={() => setSelectedImage(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedImage(item);
                      }}
                    >
                      <div className="modalProofThumbBox">
                        <Image
                          src={item.url}
                          alt={item.caption}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          style={{ objectFit: 'contain' }}
                        />
                        <div className="modalProofZoomBadge">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                          Expand
                        </div>
                      </div>
                      <div className="modalProofCaption">
                        {item.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Overview & Strategy */}
            <div className="modalStrategySection">
              <h4 className="modalStrategyHeading">
                Project Overview &amp; Strategy
              </h4>
              {/<[a-z][\s\S]*>/i.test(description) ? (
                <div
                  className="modalStrategyText"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="modalStrategyText">
                  {description}
                </p>
              )}
            </div>

            {/* Verified Key Result */}
            {result && (
              <div className="modalResultBox">
                <div className="modalResultIcon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div className="modalResultLabel">
                    Key Measurable Result
                  </div>
                  <div className="modalResultValue">
                    {result}
                  </div>
                </div>
              </div>
            )}

            {/* Category & Topic Tags */}
            {tags && tags.length > 0 && (
              <div className="modalTagPillList">
                {tags.map((tag, i) => (
                  <span key={i} className="modalTagPill">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Symmetric Footer Actions */}
            <div className="modalFooterActions">
              <Link
                href="/contact"
                className="modalPrimaryBtn"
                onClick={() => setIsOpen(false)}
              >
                <span>Discuss a similar project</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <button
                type="button"
                className="modalSecondaryBtn"
                onClick={() => setIsOpen(false)}
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
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(10px)',
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
              maxWidth: '94vw',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close zoom preview"
              style={{
                position: 'absolute',
                top: '-46px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'; }}
            >
              <span>✕ Close Preview</span>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
            <p style={{ color: '#e2e8f0', marginTop: '16px', fontSize: '0.92rem', textAlign: 'center', fontWeight: 550, maxWidth: '820px', lineHeight: 1.5 }}>
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
