'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allScreenshots = React.useMemo(() => {
    if (screenshots && screenshots.length > 0) return screenshots;
    if (featuredImage && !featuredImage.endsWith('.svg')) {
      return [{ url: featuredImage, caption: featuredAlt || `${title} Verified Performance Proof` }];
    }
    return [];
  }, [screenshots, featuredImage, featuredAlt, title]);

  const totalSlides = allScreenshots.length;

  const handlePrevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrevLightbox = useCallback(() => {
    if (totalSlides <= 1) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + totalSlides) % totalSlides));
  }, [totalSlides]);

  const handleNextLightbox = useCallback(() => {
    if (totalSlides <= 1) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % totalSlides));
  }, [totalSlides]);

  // Keyboard navigation for carousel & lightbox
  useEffect(() => {
    if (isOpen || lightboxIndex !== null) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (lightboxIndex !== null) {
            setLightboxIndex(null);
          } else {
            setIsOpen(false);
          }
        } else if (e.key === 'ArrowLeft') {
          if (lightboxIndex !== null) {
            handlePrevLightbox();
          } else {
            handlePrevSlide();
          }
        } else if (e.key === 'ArrowRight') {
          if (lightboxIndex !== null) {
            handleNextLightbox();
          } else {
            handleNextSlide();
          }
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [isOpen, lightboxIndex, handlePrevSlide, handleNextSlide, handlePrevLightbox, handleNextLightbox]);

  const handleOpenCaseStudy = () => {
    setActiveSlide(0);
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

  const currentScreenshot = allScreenshots[activeSlide] || allScreenshots[0];
  const lightboxScreenshot = lightboxIndex !== null ? allScreenshots[lightboxIndex] : null;

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
        {/* Card Thumbnail / Featured Proof */}
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
                <li>Click to view sequential case study and verified proof gallery</li>
              )}
            </ul>
          </div>

          {/* Footer Link with Proof Count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.84rem',
              fontWeight: 650,
              color: 'var(--orange-dark, #c2410c)',
              paddingTop: '12px',
              borderTop: '1px solid #f3f4f6'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View case study &amp; proof</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            {totalSlides > 0 && (
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                {totalSlides} {totalSlides === 1 ? 'Proof' : 'Proofs'} →
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Case Study Details Modal with Interactive Carousel */}
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
              aria-label="Close modal"
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

            {/* Interactive Proof Screenshots Slider / Carousel */}
            {allScreenshots.length > 0 && (
              <div className="modalProofSection">
                <div className="modalProofHeader">
                  <h4 className="modalProofHeading">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #f97316)" strokeWidth="2.5">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    Verified Performance &amp; Proof Gallery
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="modalProofHint">
                      <kbd style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 5px', fontSize: '0.7rem' }}>←</kbd>
                      <kbd style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 5px', fontSize: '0.7rem' }}>→</kbd>
                      Browse proofs
                    </span>
                  </div>
                </div>

                {/* Main Interactive Slide Viewer with Before / After Controls */}
                <div className="modalCarouselViewer">
                  {/* Sequence Counter Pill */}
                  <div className="carouselCounterPill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Proof {activeSlide + 1} of {totalSlides}</span>
                  </div>

                  {/* Previous Button (Before) */}
                  {totalSlides > 1 && (
                    <button
                      type="button"
                      aria-label="Previous proof image"
                      className="carouselNavBtn carouselNavPrev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevSlide();
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                  )}

                  {/* Main Slide Image */}
                  <div
                    className="carouselSlideBox"
                    onClick={() => setLightboxIndex(activeSlide)}
                    title="Click to view full size"
                  >
                    <Image
                      src={currentScreenshot.url}
                      alt={currentScreenshot.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 860px"
                      priority={activeSlide === 0}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>

                  {/* Next Button (After) */}
                  {totalSlides > 1 && (
                    <button
                      type="button"
                      aria-label="Next proof image"
                      className="carouselNavBtn carouselNavNext"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextSlide();
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}

                  {/* Expand Lightbox Button */}
                  <button
                    type="button"
                    className="carouselExpandBtn"
                    onClick={() => setLightboxIndex(activeSlide)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span>Full Screen</span>
                  </button>
                </div>

                {/* Formatted Caption Bar */}
                <div className="carouselCaptionBar">
                  <span>{currentScreenshot.caption}</span>
                  {totalSlides > 1 && (
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: '#475569'
                        }}
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        style={{
                          background: 'var(--orange-soft, #fff7ed)',
                          border: '1px solid var(--orange, #f97316)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: 'var(--orange-dark, #c2410c)'
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Thumbnail Filmstrip for direct jumping */}
                {totalSlides > 1 && (
                  <div className="carouselFilmstrip">
                    {allScreenshots.map((item, idx) => (
                      <div
                        key={idx}
                        className={`carouselThumbItem ${activeSlide === idx ? 'active' : ''}`}
                        onClick={() => setActiveSlide(idx)}
                        title={`Jump to Proof ${idx + 1}`}
                      >
                        <span className="carouselThumbNumber">{idx + 1}</span>
                        <Image
                          src={item.url}
                          alt={item.caption}
                          fill
                          sizes="96px"
                          style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Fullscreen Lightbox with Before/After (Previous/Next) Navigation */}
      {lightboxScreenshot && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="lightboxOverlay"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar: Counter + Close */}
          <div className="lightboxTopBar" onClick={(e) => e.stopPropagation()}>
            <div className="lightboxCounter">
              Proof {lightboxIndex + 1} of {totalSlides}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 650, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{title}</span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close preview"
              className="lightboxCloseBtn"
            >
              <span>✕ Close Preview (Esc)</span>
            </button>
          </div>

          {/* Main Display Area with Before & After Arrows */}
          <div className="lightboxMainArea" onClick={(e) => e.stopPropagation()}>
            {/* Previous Arrow */}
            {totalSlides > 1 && (
              <button
                type="button"
                aria-label="Previous image (ArrowLeft)"
                className="lightboxNavBtn lightboxNavPrev"
                onClick={handlePrevLightbox}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Central High-Res Image */}
            <div className="lightboxImgBox">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxScreenshot.url}
                alt={lightboxScreenshot.caption}
                style={{
                  maxWidth: '88vw',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              />
            </div>

            {/* Next Arrow */}
            {totalSlides > 1 && (
              <button
                type="button"
                aria-label="Next image (ArrowRight)"
                className="lightboxNavBtn lightboxNavNext"
                onClick={handleNextLightbox}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Bar: Caption + Filmstrip */}
          <div className="lightboxBottomBar" onClick={(e) => e.stopPropagation()}>
            <p className="lightboxCaptionText">
              {lightboxScreenshot.caption}
            </p>

            {totalSlides > 1 && (
              <div className="lightboxFilmstrip">
                {allScreenshots.map((item, idx) => (
                  <div
                    key={idx}
                    className={`lightboxThumb ${lightboxIndex === idx ? 'active' : ''}`}
                    onClick={() => setLightboxIndex(idx)}
                    title={`Go to proof ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
