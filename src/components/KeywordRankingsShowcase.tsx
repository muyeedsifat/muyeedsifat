'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface KeywordRankingItem {
  domain: string;
  name: string;
  industry: string;
  category: 'Local SEO' | 'E-Commerce' | 'B2B SEO' | 'Legal & Healthcare';
  market: string;
  flag: string;
  keywords: {
    term: string;
    position: string;
    intent: 'Commercial' | 'Local Intent' | 'AEO / Informational' | 'Transactional';
  }[];
  highlight: string;
  url?: string;
}

export const rankingData: KeywordRankingItem[] = [
  {
    domain: 'elitebathsolutions.biz',
    name: 'Elite Bath Solutions',
    industry: 'Home Remodeling & Contracting',
    category: 'Local SEO',
    market: 'Woodstock & Cartersville, GA, USA',
    flag: '🇺🇸',
    highlight: 'Dominating high-ticket local bathroom remodeling search queries in competitive Georgia markets.',
    keywords: [
      { term: 'Best Bathroom Remodeler', position: 'Top 3', intent: 'Commercial' },
      { term: 'best bathroom remodeler in woodstock', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'Best Bathroom Remodeler in cartersville', position: '#1 Rank', intent: 'Local Intent' }
    ]
  },
  {
    domain: 'sonylaw.com',
    name: 'Sony Law Solicitors',
    industry: 'Legal Services & Immigration Law',
    category: 'Legal & Healthcare',
    market: 'St Albans, Hertfordshire, UK',
    flag: '🇬🇧',
    highlight: 'Capturing qualified client retainers for immigration and asylum cases in Hertfordshire.',
    keywords: [
      { term: 'best immigration solicitors in St Albans', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'best asylum solicitors in St Albans', position: '#1 Rank', intent: 'Local Intent' }
    ]
  },
  {
    domain: 'huntcustomcargo.com',
    name: "Hunt's Custom Cargo",
    industry: 'Manufacturing & Enclosed Trailers',
    category: 'Local SEO',
    market: 'Douglas, GA & Nationwide USA',
    flag: '🇺🇸',
    highlight: '1,200+ Top 10 rankings on Google, ranking #1 above competitor discussions with AI Overview citations.',
    keywords: [
      { term: 'Best Enclosed Trailer Manufacturers in Douglas, Georgia', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'Custom Enclosed Cargo Trailers', position: 'Top 3', intent: 'Commercial' },
      { term: 'Trailer Manufacturing Douglas GA', position: '#1 Rank', intent: 'Local Intent' }
    ]
  },
  {
    domain: 'admeth.com',
    name: 'Admeth Industrial Engineering',
    industry: 'B2B Heavy Engineering & Equipment',
    category: 'B2B SEO',
    market: 'Singapore & Southeast Asia',
    flag: '🇸🇬',
    highlight: 'High-value enterprise B2B engineering keywords connecting industrial buyers with precision equipment.',
    keywords: [
      { term: 'Heat Exchanger Singapore', position: 'Top 3', intent: 'Commercial' },
      { term: 'Shell and Tube Heat Exchangers', position: 'Top 5', intent: 'Commercial' }
    ]
  },
  {
    domain: 'alcare.sg',
    name: 'Alcare Supplies',
    industry: 'Medical & First Aid Wholesale',
    category: 'E-Commerce',
    market: 'Singapore Nationwide',
    flag: '🇸🇬',
    highlight: 'Wholesale B2B and retail medical supply search dominance capturing direct corporate orders.',
    keywords: [
      { term: 'Wholesale first aid supplies', position: 'Top 3', intent: 'Commercial' },
      { term: 'Buy first aid box', position: 'Top 3', intent: 'Transactional' }
    ]
  },
  {
    domain: 'ubizfloral.com',
    name: 'Ubiz Floral & Decor',
    industry: 'Event, Wedding & Floral Decor',
    category: 'E-Commerce',
    market: 'United States & Global E-Commerce',
    flag: '🇺🇸',
    highlight: 'Capturing both transactional wedding decor purchases and conversational AEO sizing queries.',
    keywords: [
      { term: 'Wedding Candelabras Centerpieces', position: 'Top 3', intent: 'Transactional' },
      { term: 'What Candelabra Size Works Best for Wedding Tables', position: 'AEO #1', intent: 'AEO / Informational' },
      { term: 'Best Artificial Plants and Grass', position: 'Top 5', intent: 'Commercial' }
    ]
  },
  {
    domain: 'blackmagictan.com.au',
    name: 'Black Magic Tan Australia',
    industry: 'Beauty & Salon Equipment',
    category: 'E-Commerce',
    market: 'Australia Nationwide',
    flag: '🇦🇺',
    highlight: 'Earned featured product citation inside Google AI Overviews and #1 Local Pack positioning.',
    keywords: [
      { term: 'best spray tan gun in australia', position: 'AI Overview', intent: 'Commercial' },
      { term: 'Best Bridal Tans in Australia', position: '#1 Pack', intent: 'Local Intent' }
    ]
  },
  {
    domain: 'premierhomehealth.com',
    name: 'Premier Home Health Care',
    industry: 'Home Healthcare & Patient Support',
    category: 'Legal & Healthcare',
    market: 'Local Healthcare Service Area',
    flag: '🏥',
    highlight: 'High-trust healthcare queries delivering patient inquiries and family caregiver contacts.',
    keywords: [
      { term: 'Best Home health care service', position: 'Top 3', intent: 'Commercial' }
    ]
  }
];

const categoryTabs = ['All', 'Local SEO', 'E-Commerce', 'B2B SEO', 'Legal & Healthcare'] as const;

export function KeywordRankingsShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof categoryTabs)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return rankingData.filter((item) => {
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q) ||
        item.industry.toLowerCase().includes(q) ||
        item.market.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.term.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <section className="section" style={{ background: '#fdfefe', borderTop: '1px solid #f0f2f5', borderBottom: '1px solid #f0f2f5' }}>
      <div className="container">
        {/* Header */}
        <div className="center" style={{ maxWidth: '820px', margin: '0 auto 36px' }}>
          <span className="eyebrow">Proven Search Results</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', margin: '8px 0 16px' }}>
            Top Google Rankings &amp; Keyword Dominance
          </h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            Real client keywords currently ranking on Page 1, Local Map Packs, and Google AI Overviews across local services, B2B engineering, and global e-commerce.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '32px'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 650,
                  cursor: 'pointer',
                  border: activeTab === tab ? '1.5px solid var(--orange, #f97316)' : '1px solid #e2e8f0',
                  background: activeTab === tab ? 'var(--orange-soft, #fff7ed)' : '#ffffff',
                  color: activeTab === tab ? 'var(--orange-dark, #c2410c)' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Search keyword or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 34px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '0.86rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.2"
              style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Grid of Keyword Ranking Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '22px'
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.domain}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'var(--orange, #f97316)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{item.market}</span>
                  </div>
                  <h3 style={{ fontSize: '1.22rem', fontWeight: 750, margin: '4px 0 2px', color: '#0f172a' }}>
                    {item.name}
                  </h3>
                  <code style={{ fontSize: '0.8rem', color: 'var(--orange-dark, #c2410c)', background: '#fff7ed', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
                    {item.domain}
                  </code>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    color: '#475569'
                  }}
                >
                  {item.category}
                </span>
              </div>

              {/* Highlight summary */}
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px', flexGrow: 1 }}>
                {item.highlight}
              </p>

              {/* Keyword Pills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
                  Target Ranking Keywords
                </div>
                {item.keywords.map((kw, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      border: '1px solid #edf2f7',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e293b' }}>
                      &ldquo;{kw.term}&rdquo;
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        background: kw.position.includes('#1') ? '#dcfce7' : kw.position.includes('AI') ? '#ede9fe' : '#ffedd5',
                        color: kw.position.includes('#1') ? '#15803d' : kw.position.includes('AI') ? '#6b21a8' : '#c2410c'
                      }}
                    >
                      {kw.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div
          style={{
            marginTop: '44px',
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block' }}>
              Want your target commercial keywords dominating Page 1?
            </strong>
            <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
              I optimize for standard search, local map packs, and conversational AI Overviews.
            </span>
          </div>
          <Link href="/contact" className="btn btnPrimary" style={{ padding: '0 24px' }}>
            Request Keyword Audit →
          </Link>
        </div>
      </div>
    </section>
  );
}
