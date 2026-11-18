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
      { term: 'Best Bathroom Remodeler in Woodstock', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'Best Bathroom Remodeler in Cartersville', position: '#1 Rank', intent: 'Local Intent' }
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
      { term: 'Best Immigration Solicitors in St Albans', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'Best Asylum Solicitors in St Albans', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'UK Immigration & Asylum Solicitor', position: 'Top 3', intent: 'Commercial' }
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
      { term: 'Best Enclosed Trailer Manufacturers in Douglas GA', position: '#1 Rank', intent: 'Local Intent' },
      { term: 'Custom Enclosed Cargo Trailers', position: 'Top 3', intent: 'Commercial' },
      { term: 'How Much Do Food Trailers Cost', position: 'AEO #1', intent: 'AEO / Informational' }
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
      { term: 'Shell and Tube Heat Exchangers', position: 'Top 5', intent: 'Commercial' },
      { term: 'Industrial Heat Exchanger Supplier', position: 'Top 3', intent: 'Commercial' }
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
      { term: 'Wholesale First Aid Supplies', position: 'Top 3', intent: 'Commercial' },
      { term: 'Buy First Aid Box', position: 'Top 3', intent: 'Transactional' },
      { term: 'Emergency Medical Supplies Singapore', position: 'Top 3', intent: 'Commercial' }
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
      { term: 'Best Spray Tan Gun in Australia', position: 'AI Overview', intent: 'Commercial' },
      { term: 'Best Bridal Tans in Australia', position: '#1 Pack', intent: 'Local Intent' },
      { term: 'Professional Spray Tan Solution', position: 'Top 3', intent: 'Commercial' }
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
      { term: 'Best Home Health Care Service', position: 'Top 3', intent: 'Commercial' },
      { term: 'In-Home Nursing Care Provider', position: 'Top 3', intent: 'Commercial' },
      { term: 'Private Senior Home Care', position: 'Top 3', intent: 'Commercial' }
    ]
  },
  {
    domain: 'visionrentacar.gr',
    name: 'Vision Rent a Car Mykonos',
    industry: 'Tourist Vehicle Rental & Fleet',
    category: 'Local SEO',
    market: 'Ornos, Mykonos, Greece',
    flag: '🇬🇷',
    highlight: 'Captured 878 high-ticket tourist vehicle bookings through Google 3-Pack and Maps search dominance.',
    keywords: [
      { term: 'Car Rental Agency in Ornos', position: '#1 Pack', intent: 'Local Intent' },
      { term: 'Rent a Car Mykonos Greece', position: 'Top 3', intent: 'Commercial' },
      { term: 'Car Rental Ornos Beach', position: '#1 Rank', intent: 'Local Intent' }
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

  const getCategoryClass = (cat: KeywordRankingItem['category']) => {
    switch (cat) {
      case 'Local SEO':
        return 'rankingCatLocal';
      case 'E-Commerce':
        return 'rankingCatEcom';
      case 'B2B SEO':
        return 'rankingCatB2b';
      case 'Legal & Healthcare':
        return 'rankingCatLegal';
      default:
        return 'rankingCatLocal';
    }
  };

  const getPositionClass = (pos: string) => {
    if (pos.includes('#1')) return 'rankingPosGreen';
    if (pos.includes('AI') || pos.includes('AEO')) return 'rankingPosPurple';
    return 'rankingPosOrange';
  };

  return (
    <section className="section" style={{ background: '#fdfefe', borderTop: '1px solid #f0f2f5', borderBottom: '1px solid #f0f2f5' }}>
      <div className="container">
        {/* Section Header */}
        <div className="center" style={{ maxWidth: '820px', margin: '0 auto 36px' }}>
          <span className="eyebrow">Proven Search Results</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', margin: '8px 0 16px' }}>
            Top Google Rankings &amp; Keyword Dominance
          </h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            Real client keywords currently ranking on Page 1, Local 3-Packs, and Google AI Overviews across local services, B2B engineering, and global e-commerce.
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
                  padding: '8px 18px',
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
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search keyword or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '10px',
                border: '1.5px solid #d1d5db',
                fontSize: '0.86rem',
                outline: 'none',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
            </input>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.2"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Symmetric 3x3 Card Grid */}
        <div className="rankingCardGrid">
          {filtered.map((item) => (
            <div key={item.domain} className="rankingCard">
              {/* Card Header: Market + Category */}
              <div className="rankingCardTopMeta">
                <div className="rankingCardMarket" title={item.market}>
                  <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.market}
                  </span>
                </div>
                <span className={`rankingCardCategoryPill ${getCategoryClass(item.category)}`}>
                  {item.category}
                </span>
              </div>

              {/* Title & Domain (Uniform Height) */}
              <div className="rankingCardTitleBox">
                <h3 className="rankingCardTitle">
                  {item.name}
                </h3>
              </div>

              <code className="rankingCardDomainPill">
                <span>{item.domain}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </code>

              {/* Description (Exact 2-Line Clamp) */}
              <p className="rankingCardHighlight" title={item.highlight}>
                {item.highlight}
              </p>

              {/* Target Ranking Keywords (Uniform 3 Rows) */}
              <div className="rankingKeywordsBox">
                <div className="rankingKeywordsHeader">
                  Target Ranking Keywords
                </div>
                {item.keywords.map((kw, idx) => (
                  <div key={idx} className="rankingKeywordRow">
                    <span className="rankingKeywordTerm">
                      &ldquo;{kw.term}&rdquo;
                    </span>
                    <span className={`rankingPositionPill ${getPositionClass(kw.position)}`}>
                      {kw.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div
          style={{
            marginTop: '44px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: '650px' }}>
            <strong style={{ fontSize: '1.08rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Want your target commercial keywords dominating Page 1?
            </strong>
            <span style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              I optimize for standard search rankings, local 3-packs, and conversational Google AI Overviews.
            </span>
          </div>
          <Link
            href="/contact"
            className="btn btnPrimary"
            style={{ padding: '0 26px', minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Request Keyword Audit</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
