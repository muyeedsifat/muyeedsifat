'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface FourCorePlacement {
  keyword: string;
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inBody: boolean;
  bodyOccurrences: number;
  score: number;
  passed: boolean;
}

interface SeoFactorCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'error' | 'info';
  score: number;
  foundValue: string;
  details: string;
  recommendation?: string;
}

interface AuditedItem {
  id: string;
  title: string;
  slug: string;
  path: string;
  type: 'blog' | 'service' | 'page' | 'project';
  healthScore: number;
  healthGrade: 'A' | 'B' | 'C' | 'D';
  overallStatus: 'healthy' | 'needs_attention' | 'critical';
  focusKeyword: string;
  fourCore: FourCorePlacement;
  metaTitle: {
    value: string;
    length: number;
    status: 'passed' | 'warning' | 'error';
    message: string;
  };
  metaDescription: {
    value: string;
    length: number;
    status: 'passed' | 'warning' | 'error';
    message: string;
  };
  h1: {
    value: string;
    status: 'passed' | 'error';
    message: string;
  };
  schema: {
    types: string[];
    hasCustom: boolean;
    status: 'passed' | 'warning' | 'error';
  };
  canonical: {
    value: string;
    status: 'passed' | 'warning';
  };
  internalLinks: {
    count: number;
    links: string[];
    status: 'passed' | 'warning' | 'error';
  };
  externalLinks: {
    count: number;
    status: 'passed' | 'info';
  };
  openGraph: {
    hasImage: boolean;
    imageUrl?: string;
    hasAlt: boolean;
    status: 'passed' | 'warning' | 'error';
  };
  contentLength: {
    wordCount: number;
    status: 'passed' | 'warning' | 'error';
    recommendation: string;
  };
  faqs: {
    count: number;
    hasSchema: boolean;
    status: 'passed' | 'info';
  };
  indexing: {
    status: 'passed' | 'error';
    robots: string;
    inSitemap: boolean;
  };
  headingStructure: {
    headings: { level: string; text: string }[];
    hierarchyValid: boolean;
    status: 'passed' | 'warning';
  };
  checks: SeoFactorCheck[];
  editUrl: string;
}

interface SeoAuditPayload {
  auditedAt: string;
  summary: {
    totalItems: number;
    avgHealthScore: number;
    healthGrade: 'A' | 'B' | 'C' | 'D';
    healthyCount: number;
    attentionCount: number;
    criticalCount: number;
    fourCoreRate: number;
    fourCoreFullPassCount: number;
    titlePassRate: number;
    descPassRate: number;
    schemaRate: number;
    avgWords: number;
    avgLinks: number;
    actionItemsCount: number;
  };
  actionItems: { id: string; title: string; issue: string; fix: string; editUrl: string }[];
  items: AuditedItem[];
}

export default function SeoAuditDashboardPage() {
  const [data, setData] = useState<SeoAuditPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inspectingItem, setInspectingItem] = useState<AuditedItem | null>(null);

  // Filters & Dropdowns
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIssue, setFilterIssue] = useState<string>('all');
  const [selectedUrl, setSelectedUrl] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  async function fetchAudit() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo-audit', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Keep state resilient
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAudit();
  }, []);

  // Filtered Items computation
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((item) => {
      // 1. Content Type Filter
      if (filterType !== 'all' && item.type !== filterType) return false;

      // 2. Health Status Filter
      if (filterStatus !== 'all' && item.overallStatus !== filterStatus) return false;

      // 3. Quick URL Selector Filter
      if (selectedUrl !== 'all' && item.path !== selectedUrl) return false;

      // 4. Specific SEO Issue Filter
      if (filterIssue === 'issue_keyword' && item.fourCore.score === 4) return false;
      if (filterIssue === 'issue_title' && item.metaTitle.status === 'passed') return false;
      if (filterIssue === 'issue_desc' && item.metaDescription.status === 'passed') return false;
      if (filterIssue === 'issue_links' && item.internalLinks.status === 'passed') return false;
      if (filterIssue === 'issue_words' && item.contentLength.status === 'passed') return false;
      if (filterIssue === 'issue_og' && item.openGraph.status === 'passed') return false;
      if (filterIssue === 'issue_headings' && item.headingStructure.status === 'passed') return false;

      // 5. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesPath = item.path.toLowerCase().includes(q);
        const matchesKeyword = item.focusKeyword.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPath && !matchesKeyword) return false;
      }

      return true;
    });
  }, [data, filterType, filterStatus, filterIssue, selectedUrl, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--orange-dark, #c2410c)',
                background: 'var(--orange-soft, #fff7ed)',
                padding: '3px 8px',
                borderRadius: '5px'
              }}
            >
              On-Page Diagnostic Engine
            </span>
            {data?.auditedAt && (
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Audited: {new Date(data.auditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '6px 0 4px', color: '#0f172a' }}>
            SEO &amp; Content Architecture Audit
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Comprehensive analysis of 13 on-page ranking factors: 4-core focus keyword placement, meta tags, schema markup, heading hierarchy, content depth, and internal links.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            href="/admin/analytics"
            className="btn btnSecondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Analytics Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={fetchAudit}
            disabled={loading}
            className="btn btnPrimary"
            style={{ padding: '8px 16px', fontSize: '0.84rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span>{loading ? 'Scanning Site…' : 'Re-run Live Audit'}</span>
          </button>
        </div>
      </div>

      {/* OVERALL DATA SECTION: EXECUTIVE SCORECARD */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
          {/* Main Health Score */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>
                Overall SEO Health
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: data.summary.avgHealthScore >= 85 ? '#dcfce7' : '#fef3c7',
                  color: data.summary.avgHealthScore >= 85 ? '#166534' : '#92400e'
                }}
              >
                Grade {data.summary.healthGrade}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 2px' }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 850, color: data.summary.avgHealthScore >= 85 ? '#16a34a' : '#d97706' }}>
                {data.summary.avgHealthScore}%
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {data.summary.totalItems} pages &amp; posts scanned
            </div>
          </div>

          {/* 4-Core Keyword Placement Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange-dark, #c2410c)', fontWeight: 700 }}>
              4-Core Focus Placement
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
              {data.summary.fourCoreRate}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {data.summary.fourCoreFullPassCount} of {data.summary.totalItems} have keyword in Title, Desc, H1 &amp; Body
            </div>
          </div>

          {/* Meta Tags Readiness */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', fontWeight: 700 }}>
              Meta Tags Optimization
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
              {data.summary.titlePassRate}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Titles: {data.summary.titlePassRate}% • Descriptions: {data.summary.descPassRate}%
            </div>
          </div>

          {/* Schema & Open Graph */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#16a34a', fontWeight: 700 }}>
              Schema &amp; Social Cards
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
              {data.summary.schemaRate}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Structured JSON-LD schema coverage
            </div>
          </div>

          {/* Content Depth & Internal Links */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c3aed', fontWeight: 700 }}>
              Content &amp; Internal Links
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
              {data.summary.avgWords} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>words avg</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {data.summary.avgLinks} internal links per URL avg
            </div>
          </div>
        </div>
      )}

      {/* ACTIONABLE REMEDIATION RECOMMENDATIONS */}
      {data && data.actionItems && data.actionItems.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#9a3412' }}>
              Priority Remediation Actions ({data.summary.actionItemsCount} items to address)
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {data.actionItems.slice(0, 4).map((item) => (
              <div key={item.id} style={{ background: '#fffaf5', border: '1px solid #ffedd5', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#c2410c', marginBottom: '4px' }}>{item.issue}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.fix}</div>
                <Link
                  href={item.editUrl}
                  style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.76rem', fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}
                >
                  Edit and Fix Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & DROPDOWN CONTROLS TOOLBAR */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Granular Audit Breakdown
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Use the dropdown controls below to inspect specific factors, filter issues, or jump straight to any page.
            </p>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 650, color: '#64748b' }}>
            Showing {filteredItems.length} of {data?.items.length || 0} items
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
          {/* Dropdown 1: Content Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '4px' }}>
              Content Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', border: '1px solid #cbd5e1', borderRadius: '7px', background: '#f8fafc', color: '#0f172a' }}
            >
              <option value="all">All Content Types</option>
              <option value="blog">Blog Articles</option>
              <option value="service">Service Offerings</option>
              <option value="page">Core Pages</option>
              <option value="project">Case Studies</option>
            </select>
          </div>

          {/* Dropdown 2: Health Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '4px' }}>
              Health Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', border: '1px solid #cbd5e1', borderRadius: '7px', background: '#f8fafc', color: '#0f172a' }}
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Fully Healthy (85%+)</option>
              <option value="needs_attention">Needs Attention (70-84%)</option>
              <option value="critical">Critical Attention (&lt;70%)</option>
            </select>
          </div>

          {/* Dropdown 3: Specific SEO Factor / Issue */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '4px' }}>
              SEO Factor Filter
            </label>
            <select
              value={filterIssue}
              onChange={(e) => setFilterIssue(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', border: '1px solid #cbd5e1', borderRadius: '7px', background: '#f8fafc', color: '#0f172a' }}
            >
              <option value="all">All Factors (Pass &amp; Fail)</option>
              <option value="issue_keyword">Missing 4-Core Keyword Placement</option>
              <option value="issue_title">Suboptimal Meta Title Length</option>
              <option value="issue_desc">Suboptimal Meta Description</option>
              <option value="issue_links">Insufficient Internal Links (&lt;3)</option>
              <option value="issue_words">Thin Content (&lt; Target Words)</option>
              <option value="issue_og">Missing OG Social Image / Alt</option>
              <option value="issue_headings">Heading Hierarchy Issues</option>
            </select>
          </div>

          {/* Dropdown 4: Quick URL Jump */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '4px' }}>
              Select Specific URL
            </label>
            <select
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', border: '1px solid #cbd5e1', borderRadius: '7px', background: '#f8fafc', color: '#0f172a' }}
            >
              <option value="all">All URLs ({data?.items.length || 0})</option>
              {data?.items.map((i) => (
                <option key={i.id} value={i.path}>
                  {i.path} — {i.title.slice(0, 32)}
                </option>
              ))}
            </select>
          </div>

          {/* Search by Text */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '4px' }}>
              Search Keywords
            </label>
            <input
              type="text"
              placeholder="Search title, path or keyword…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '0.84rem', border: '1px solid #cbd5e1', borderRadius: '7px', background: '#ffffff', color: '#0f172a' }}
            />
          </div>
        </div>
      </div>

      {/* AUDIT ITEMS TABLE */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 18px' }}>Page / Article</th>
                <th style={{ padding: '12px 14px' }}>Health Score</th>
                <th style={{ padding: '12px 14px' }}>4-Core Placement</th>
                <th style={{ padding: '12px 14px' }}>Meta Title</th>
                <th style={{ padding: '12px 14px' }}>Meta Desc</th>
                <th style={{ padding: '12px 14px' }}>Schema</th>
                <th style={{ padding: '12px 14px' }}>Depth &amp; Links</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Page Title & Path */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: item.type === 'blog' ? '#eff6ff' : item.type === 'service' ? '#fff7ed' : item.type === 'project' ? '#f0fdf4' : '#f8fafc',
                          color: item.type === 'blog' ? '#1d4ed8' : item.type === 'service' ? '#c2410c' : item.type === 'project' ? '#166534' : '#475569'
                        }}
                      >
                        {item.type}
                      </span>
                      <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{item.title}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <code style={{ fontSize: '0.76rem', color: '#64748b' }}>{item.path}</code>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• Keyword: &quot;{item.focusKeyword}&quot;</span>
                    </div>
                  </td>

                  {/* Health Score Pill */}
                  <td style={{ padding: '14px 14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        background: item.healthScore >= 90 ? '#dcfce7' : item.healthScore >= 80 ? '#fef3c7' : '#fee2e2',
                        color: item.healthScore >= 90 ? '#15803d' : item.healthScore >= 80 ? '#b45309' : '#b91c1c'
                      }}
                    >
                      <span>{item.healthScore}%</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({item.healthGrade})</span>
                    </span>
                  </td>

                  {/* 4-Core Placement */}
                  <td style={{ padding: '14px 14px' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '5px',
                        background: item.fourCore.score === 4 ? '#dcfce7' : '#ffedd5',
                        color: item.fourCore.score === 4 ? '#166534' : '#c2410c'
                      }}
                    >
                      {item.fourCore.score}/4 Core Places
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      {item.fourCore.inTitle ? 'Title' : '<s>Title</s>'} • {item.fourCore.inDescription ? 'Desc' : '<s>Desc</s>'} • {item.fourCore.inH1 ? 'H1' : '<s>H1</s>'} • {item.fourCore.inBody ? 'Body' : '<s>Body</s>'}
                    </div>
                  </td>

                  {/* Meta Title */}
                  <td style={{ padding: '14px 14px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 650,
                        color: item.metaTitle.status === 'passed' ? '#166534' : '#c2410c'
                      }}
                    >
                      {item.metaTitle.length} chars
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {item.metaTitle.status === 'passed' ? 'Optimal length' : 'Needs tuning'}
                    </div>
                  </td>

                  {/* Meta Description */}
                  <td style={{ padding: '14px 14px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 650,
                        color: item.metaDescription.status === 'passed' ? '#166534' : '#c2410c'
                      }}
                    >
                      {item.metaDescription.length} chars
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {item.metaDescription.status === 'passed' ? 'Optimal length' : 'Needs tuning'}
                    </div>
                  </td>

                  {/* Schema */}
                  <td style={{ padding: '14px 14px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                      {item.schema.types.slice(0, 2).join(', ')}
                    </span>
                    {item.schema.types.length > 2 && (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}> +{item.schema.types.length - 2}</span>
                    )}
                  </td>

                  {/* Depth & Links */}
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#0f172a' }}>
                      {item.contentLength.wordCount} words
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {item.internalLinks.count} internal link(s)
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setInspectingItem(item)}
                        style={{
                          padding: '5px 11px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          borderRadius: '6px',
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Inspect Audit
                      </button>
                      <Link
                        href={item.editUrl}
                        style={{
                          padding: '5px 10px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#475569',
                          textDecoration: 'none'
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No audit records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL AUDIT DIAGNOSTIC MODAL */}
      {inspectingItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setInspectingItem(null)}
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
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '30px 28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              color: '#0f172a'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectingItem(null)}
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

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 750,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  background: inspectingItem.type === 'blog' ? '#eff6ff' : '#fff7ed',
                  color: inspectingItem.type === 'blog' ? '#1d4ed8' : '#c2410c'
                }}
              >
                {inspectingItem.type} Audit Report
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{inspectingItem.path}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                  {inspectingItem.title}
                </h2>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Target Keyword: <strong style={{ color: '#0f172a' }}>{inspectingItem.focusKeyword}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: inspectingItem.healthScore >= 85 ? '#dcfce7' : '#fef3c7',
                    color: inspectingItem.healthScore >= 85 ? '#166534' : '#92400e',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.4rem', fontWeight: 850 }}>{inspectingItem.healthScore}%</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Grade {inspectingItem.healthGrade}</div>
                </div>
              </div>
            </div>

            {/* 4-Core Keyword Placement Spotlight */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '10px' }}>
                Focus Keyword in 4 Core Places Placement
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                <div style={{ background: inspectingItem.fourCore.inTitle ? '#f0fdf4' : '#fef2f2', border: `1px solid ${inspectingItem.fourCore.inTitle ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>1. Meta Title</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: inspectingItem.fourCore.inTitle ? '#166534' : '#991b1b', marginTop: '3px' }}>
                    {inspectingItem.fourCore.inTitle ? 'Found' : 'Missing'}
                  </div>
                </div>

                <div style={{ background: inspectingItem.fourCore.inDescription ? '#f0fdf4' : '#fef2f2', border: `1px solid ${inspectingItem.fourCore.inDescription ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>2. Meta Description</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: inspectingItem.fourCore.inDescription ? '#166534' : '#991b1b', marginTop: '3px' }}>
                    {inspectingItem.fourCore.inDescription ? 'Found' : 'Missing'}
                  </div>
                </div>

                <div style={{ background: inspectingItem.fourCore.inH1 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${inspectingItem.fourCore.inH1 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>3. H1 Headline</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: inspectingItem.fourCore.inH1 ? '#166534' : '#991b1b', marginTop: '3px' }}>
                    {inspectingItem.fourCore.inH1 ? 'Found' : 'Missing'}
                  </div>
                </div>

                <div style={{ background: inspectingItem.fourCore.inBody ? '#f0fdf4' : '#fef2f2', border: `1px solid ${inspectingItem.fourCore.inBody ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>4. Body Content</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: inspectingItem.fourCore.inBody ? '#166534' : '#991b1b', marginTop: '3px' }}>
                    {inspectingItem.fourCore.inBody ? `Found (${inspectingItem.fourCore.bodyOccurrences}x)` : 'Missing'}
                  </div>
                </div>
              </div>
            </div>

            {/* 13 Diagnostic Checkpoints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                Complete 13-Point Factor Diagnostic
              </div>

              {inspectingItem.checks.map((chk) => (
                <div
                  key={chk.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    background: chk.status === 'error' ? '#fff5f5' : chk.status === 'warning' ? '#fffbeb' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: chk.status === 'passed' ? '#dcfce7' : chk.status === 'warning' ? '#fef3c7' : chk.status === 'error' ? '#fee2e2' : '#f1f5f9',
                          color: chk.status === 'passed' ? '#15803d' : chk.status === 'warning' ? '#b45309' : chk.status === 'error' ? '#b91c1c' : '#64748b'
                        }}
                      >
                        {chk.status === 'passed' ? '✓' : chk.status === 'warning' ? '!' : chk.status === 'error' ? '×' : 'i'}
                      </span>
                      <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{chk.name}</strong>
                    </div>

                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{chk.foundValue}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569', marginLeft: '26px' }}>
                    {chk.details}
                  </div>

                  {chk.recommendation && (
                    <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 650, marginLeft: '26px', marginTop: '2px' }}>
                      Recommendation: {chk.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <Link
                href={inspectingItem.editUrl}
                className="btn btnPrimary"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                onClick={() => setInspectingItem(null)}
              >
                Edit Page in Admin
              </Link>
              <button
                type="button"
                className="btn btnSecondary"
                onClick={() => setInspectingItem(null)}
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
