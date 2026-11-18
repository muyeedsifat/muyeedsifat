<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap &amp; Search Engine Directory | Muyeed Sifat</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          :root {
            --orange: #f97316;
            --orange-dark: #ea580c;
            --orange-soft: #fff7ed;
            --slate-900: #0f172a;
            --slate-800: #1e293b;
            --slate-700: #334155;
            --slate-600: #475569;
            --slate-500: #64748b;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --slate-50: #f8fafc;
            --white: #ffffff;
            --radius: 14px;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--slate-50);
            color: var(--slate-700);
            line-height: 1.6;
            padding: 36px 16px 60px;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
          }

          .container {
            max-width: 1140px;
            margin: 0 auto;
          }

          /* Breadcrumbs */
          .breadcrumbs {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--slate-500);
            margin-bottom: 12px;
          }

          .breadcrumbs a {
            color: var(--slate-600);
            text-decoration: none;
            transition: color 0.15s ease;
          }

          .breadcrumbs a:hover {
            color: var(--orange);
          }

          .breadcrumbs-separator {
            color: #cbd5e1;
          }

          /* Page Hero */
          .page-hero {
            margin-bottom: 24px;
          }

          .eyebrow {
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--orange);
            margin-bottom: 8px;
          }

          h1 {
            font-size: 32px;
            font-weight: 850;
            color: var(--slate-900);
            letter-spacing: -0.025em;
            line-height: 1.2;
            margin-bottom: 10px;
          }

          .lead {
            font-size: 15px;
            line-height: 1.65;
            color: var(--slate-600);
            max-width: 820px;
          }

          /* Action Toolbar matching HTML sitemap */
          .action-toolbar {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: 16px;
            padding: 24px 28px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            flex-wrap: wrap;
            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
          }

          .action-left {
            flex: 1;
            min-width: 280px;
          }

          .header-status-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
            flex-wrap: wrap;
          }

          .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 750;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #16a34a;
            background: #f0fdf4;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 1px solid #bbf7d0;
          }

          .live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #22c55e;
            animation: pulse 1.8s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
          }

          .sync-badge {
            font-size: 11px;
            font-weight: 700;
            color: #059669;
            background: #ecfdf5;
            padding: 3px 8px;
            border-radius: 9999px;
          }

          .action-title {
            font-size: 20px;
            font-weight: 800;
            color: var(--slate-900);
            line-height: 1.25;
            margin: 0 0 6px;
            letter-spacing: -0.01em;
          }

          .action-desc {
            font-size: 13px;
            line-height: 1.55;
            color: var(--slate-500);
            margin: 0;
            max-width: 640px;
          }

          .action-buttons {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 16px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 10px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.18s ease;
            text-decoration: none;
            white-space: nowrap;
          }

          .btn-primary {
            background: var(--slate-900);
            color: var(--white);
          }

          .btn-primary:hover {
            background: var(--slate-800);
            transform: translateY(-1px);
          }

          .btn-accent {
            background: var(--orange);
            color: var(--white);
            border-color: var(--orange);
          }

          .btn-accent:hover {
            background: var(--orange-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 14px -2px rgba(249, 115, 22, 0.35);
          }

          .btn-outline {
            background: var(--white);
            border: 1px solid var(--slate-200);
            color: var(--slate-700);
          }

          .btn-outline:hover {
            background: var(--slate-100);
            color: var(--slate-900);
          }

          /* Bento Stat Bar matching HTML sitemap */
          .bento-bar {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 14px;
            margin-bottom: 28px;
          }

          .bento-cell {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            padding: 18px 16px;
            text-align: center;
            transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
            box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.03);
            cursor: pointer;
          }

          .bento-cell:hover {
            transform: translateY(-2px);
            border-color: var(--orange);
            box-shadow: 0 8px 20px -4px rgba(249, 115, 22, 0.12);
          }

          .bento-value {
            font-size: 26px;
            font-weight: 850;
            color: var(--slate-900);
            line-height: 1.1;
            margin-bottom: 4px;
            letter-spacing: -0.02em;
          }

          .bento-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--slate-500);
          }

          /* Controls Bar: Search and Category Tabs */
          .controls-bar {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
          }

          .search-wrapper {
            position: relative;
            width: 100%;
          }

          .search-input {
            width: 100%;
            padding: 11px 40px 11px 42px;
            font-size: 13px;
            border: 1.5px solid var(--slate-200);
            border-radius: 10px;
            outline: none;
            background: var(--slate-50);
            color: var(--slate-900);
            transition: all 0.15s ease;
          }

          .search-input:focus {
            border-color: var(--orange);
            background: var(--white);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
          }

          .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
          }

          .tabs-and-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .category-tabs {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 13px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 8px;
            background: var(--slate-100);
            color: var(--slate-600);
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .tab-btn:hover {
            background: var(--slate-200);
            color: var(--slate-900);
          }

          .tab-btn.active {
            background: var(--slate-900);
            color: var(--white);
          }

          .view-toggle {
            display: flex;
            align-items: center;
            background: var(--slate-100);
            padding: 3px;
            border-radius: 8px;
            border: 1px solid var(--slate-200);
          }

          .view-btn {
            padding: 5px 10px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 6px;
            background: transparent;
            border: none;
            color: var(--slate-600);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
          }

          .view-btn.active {
            background: var(--white);
            color: var(--slate-900);
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          }

          /* Results Summary */
          .results-summary {
            font-size: 13px;
            color: var(--slate-500);
            margin-bottom: 18px;
            padding: 0 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }

          .results-summary strong {
            color: var(--slate-900);
          }

          .feed-links {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .feed-link {
            font-size: 12px;
            font-weight: 650;
            color: var(--slate-600);
            text-decoration: none;
            padding: 3px 8px;
            border-radius: 6px;
            background: var(--white);
            border: 1px solid var(--slate-200);
            transition: all 0.15s ease;
          }

          .feed-link:hover {
            color: var(--slate-900);
            border-color: #cbd5e1;
          }

          /* Card Grid View matching HTML sitemap */
          .card-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 32px;
          }

          .sitemap-card {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            padding: 20px 22px;
            display: flex;
            flex-direction: column;
            transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
            box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.04);
          }

          .sitemap-card:hover {
            transform: translateY(-2px);
            border-color: #cbd5e1;
            box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.08);
          }

          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .cat-badge {
            display: inline-block;
            padding: 3px 9px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-radius: 6px;
          }

          .badge-primary, .badge-core { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
          .badge-pillar, .badge-service { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
          .badge-location { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }
          .badge-project { background: var(--orange-soft); color: var(--orange-dark); border: 1px solid #fed7aa; }
          .badge-post { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
          .badge-protocol { background: var(--slate-50); color: var(--slate-600); border: 1px solid var(--slate-200); }

          .meta-pills {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .priority-pill {
            font-size: 11px;
            font-weight: 750;
            background: var(--slate-100);
            color: var(--slate-700);
            padding: 2px 6px;
            border-radius: 4px;
          }

          .p-10 { background: #ecfdf5; color: #059669; }
          .p-09 { background: #eff6ff; color: #2563eb; }
          .p-08 { background: #f5f3ff; color: #7c3aed; }

          .freq-pill {
            font-size: 11px;
            font-weight: 600;
            color: var(--slate-500);
            text-transform: capitalize;
          }

          .copy-btn {
            background: transparent;
            border: 1px solid var(--slate-200);
            border-radius: 6px;
            padding: 2px 7px;
            font-size: 11px;
            font-weight: 650;
            color: var(--slate-500);
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .copy-btn:hover {
            background: var(--slate-100);
            color: var(--slate-900);
          }

          .card-title {
            font-size: 16px;
            font-weight: 750;
            color: var(--slate-900);
            line-height: 1.35;
            margin: 0 0 6px;
            letter-spacing: -0.01em;
          }

          .card-link {
            color: var(--slate-900);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.15s ease;
          }

          .card-link:hover {
            color: var(--orange);
          }

          .card-path {
            margin-bottom: 12px;
          }

          .card-path code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            color: var(--slate-500);
            background: var(--slate-50);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #f1f5f9;
            word-break: break-all;
          }

          .card-footer {
            margin-top: auto;
            padding-top: 10px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .card-date {
            font-size: 12px;
            color: #94a3b8;
            font-weight: 550;
          }

          .visit-link {
            font-size: 12px;
            font-weight: 650;
            color: var(--orange-dark);
            text-decoration: none;
          }

          .visit-link:hover {
            text-decoration: underline;
            color: var(--orange);
          }

          /* Table View */
          .table-wrapper {
            display: none;
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
            margin-bottom: 32px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          thead th {
            background: var(--slate-100);
            color: var(--slate-600);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 12px 18px;
            border-bottom: 1px solid var(--slate-200);
          }

          tbody tr {
            border-bottom: 1px solid var(--slate-200);
            transition: background-color 0.1s ease;
          }

          tbody tr:last-child { border-bottom: none; }
          tbody tr:hover { background-color: #fafbfc; }

          td {
            padding: 12px 18px;
            vertical-align: middle;
            font-size: 13px;
          }

          td.col-url a {
            color: var(--slate-900);
            font-weight: 600;
            text-decoration: none;
          }

          td.col-url a:hover {
            color: var(--orange);
            text-decoration: underline;
          }

          .footer-note {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: var(--slate-500);
          }

          .footer-note a {
            color: var(--orange);
            text-decoration: none;
            font-weight: 600;
          }

          @media (max-width: 900px) {
            .bento-bar { grid-template-columns: repeat(3, 1fr); }
            .card-grid { grid-template-columns: 1fr; }
          }

          @media (max-width: 600px) {
            .bento-bar { grid-template-columns: repeat(2, 1fr); }
            .action-toolbar { padding: 20px; }
            .action-buttons { width: 100%; flex-direction: column; align-items: stretch; }
            .btn { justify-content: center; width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Breadcrumbs -->
          <div class="breadcrumbs">
            <a href="/">Home</a>
            <span class="breadcrumbs-separator">/</span>
            <span>XML Sitemap</span>
          </div>

          <!-- Page Hero -->
          <div class="page-hero">
            <span class="eyebrow">Real-Time Directory • Auto-Updating XML Feed</span>
            <h1>XML Sitemap &amp; Search Engine Feed</h1>
            <p class="lead">
              An exhaustive, continuously updated index of all primary landing pages, service capabilities, verified client case studies, and strategic growth publications formatted for search engine crawlers and human inspection.
            </p>
          </div>

          <!-- Export and Ingestion Toolbar -->
          <div class="action-toolbar">
            <div class="action-left">
              <div class="header-status-row">
                <span class="live-indicator">
                  <span class="live-dot"></span> Continuous Real-Time Auto-Update Active
                </span>
                <span class="sync-badge" id="liveSyncStatus">
                  ● Synced Live
                </span>
              </div>
              <h2 class="action-title">Copy, Update &amp; Download Sitemap Assets</h2>
              <p class="action-desc">
                This XML sitemap automatically updates whenever any project, blog post, or service is published. You can trigger an instant on-demand cache re-sync, copy links, or download the complete ZIP archive organized into separate category folders.
              </p>
            </div>

            <div class="action-buttons">
              <!-- Copy All URLs Button -->
              <button type="button" class="btn btn-primary" id="copyAllXmlBtn" onclick="copyAllXmlUrls()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy All URLs
              </button>

              <!-- Update and Re-Sync Button -->
              <button type="button" class="btn btn-outline" id="updateXmlBtn" onclick="triggerUpdateSitemap()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Update &amp; Re-Sync
              </button>

              <!-- Download ZIP Button -->
              <a href="/api/sitemap/download" class="btn btn-accent" download="muyeedsifat-sitemap-export.zip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Sitemap ZIP (Folder Structure)
              </a>

              <!-- Link to HTML Sitemap -->
              <a href="/sitemap.html" class="btn btn-outline">
                View HTML Sitemap ↗
              </a>
            </div>
          </div>

          <!-- Symmetric Bento Stat Bar matching HTML sitemap -->
          <div class="bento-bar">
            <div class="bento-cell" onclick="filterByCategory('all')">
              <div class="bento-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              <div class="bento-label">Total Published URLs</div>
            </div>
            <div class="bento-cell" onclick="filterByCategory('primary')">
              <div class="bento-value">7</div>
              <div class="bento-label">Primary Page</div>
            </div>
            <div class="bento-cell" onclick="filterByCategory('pillar')">
              <div class="bento-value">4</div>
              <div class="bento-label">Piller Category Page</div>
            </div>
            <div class="bento-cell" onclick="filterByCategory('project')">
              <div class="bento-value">21</div>
              <div class="bento-label">Project (21)</div>
            </div>
            <div class="bento-cell" onclick="filterByCategory('location')">
              <div class="bento-value">1</div>
              <div class="bento-label">Location Page</div>
            </div>
            <div class="bento-cell" onclick="filterByCategory('post')">
              <div class="bento-value">6</div>
              <div class="bento-label">Blog Post</div>
            </div>
          </div>

          <!-- Controls Bar -->
          <div class="controls-bar">
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="sitemapFilter" class="search-input" placeholder="Search directory by page title, URL slug, or keywords..." onkeyup="filterSitemap()" />
            </div>

            <div class="tabs-and-toggle">
              <div class="category-tabs">
                <button type="button" class="tab-btn active" id="tab-all" onclick="filterByCategory('all')">All Links</button>
                <button type="button" class="tab-btn" id="tab-primary" onclick="filterByCategory('primary')">Primary Page</button>
                <button type="button" class="tab-btn" id="tab-pillar" onclick="filterByCategory('pillar')">Piller Category Page</button>
                <button type="button" class="tab-btn" id="tab-project" onclick="filterByCategory('project')">Project</button>
                <button type="button" class="tab-btn" id="tab-location" onclick="filterByCategory('location')">Location Page</button>
                <button type="button" class="tab-btn" id="tab-post" onclick="filterByCategory('post')">Blog Post</button>
              </div>

              <div class="view-toggle">
                <button type="button" class="view-btn active" id="btn-grid-view" onclick="switchView('grid')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Grid
                </button>
                <button type="button" class="view-btn" id="btn-table-view" onclick="switchView('table')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  Table
                </button>
              </div>
            </div>
          </div>

          <!-- Results Summary -->
          <div class="results-summary">
            <div>
              Showing <strong id="visibleCount"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> of <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> indexed resources
            </div>
            <div class="feed-links">
              <a href="/sitemap.html" class="feed-link">HTML Sitemap ↗</a>
              <a href="/llms.txt" class="feed-link">llms.txt ↗</a>
              <a href="/api/sitemap/download" class="feed-link" style="color: var(--orange); font-weight: 700;">Direct ZIP Download ↓</a>
            </div>
          </div>

          <!-- Card Grid View matching HTML sitemap -->
          <div class="card-grid" id="cardGridView">
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:variable name="itemLoc" select="sitemap:loc"/>
              <xsl:variable name="itemPri" select="sitemap:priority"/>
              <xsl:variable name="itemFreq" select="sitemap:changefreq"/>
              <xsl:variable name="itemMod" select="sitemap:lastmod"/>

              <!-- Compute Category Type -->
              <xsl:variable name="catType">
                <xsl:choose>
                  <xsl:when test="contains($itemLoc, '/services/')">pillar</xsl:when>
                  <xsl:when test="contains($itemLoc, '/projects#')">project</xsl:when>
                  <xsl:when test="contains($itemLoc, '/locations')">location</xsl:when>
                  <xsl:when test="contains($itemLoc, '/blog/')">post</xsl:when>
                  <xsl:when test="contains($itemLoc, '.xml') or contains($itemLoc, '.txt')">protocol</xsl:when>
                  <xsl:otherwise>primary</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="catLabel">
                <xsl:choose>
                  <xsl:when test="contains($itemLoc, '/services/')">Piller Category Page</xsl:when>
                  <xsl:when test="contains($itemLoc, '/projects#')">Project</xsl:when>
                  <xsl:when test="contains($itemLoc, '/locations')">Location Page</xsl:when>
                  <xsl:when test="contains($itemLoc, '/blog/')">Blog Post</xsl:when>
                  <xsl:when test="contains($itemLoc, '.xml') or contains($itemLoc, '.txt')">Machine Protocol</xsl:when>
                  <xsl:otherwise>Primary Page</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <div class="sitemap-card" data-url="{$itemLoc}" data-category="{$catType}">
                <div class="card-header">
                  <span class="cat-badge badge-{$catType}">
                    <xsl:value-of select="$catLabel"/>
                  </span>
                  <div class="meta-pills">
                    <span class="priority-pill">
                      P: <xsl:value-of select="$itemPri"/>
                    </span>
                    <span class="freq-pill">
                      <xsl:value-of select="$itemFreq"/>
                    </span>
                    <button type="button" class="copy-btn" onclick="copyCardUrl('{$itemLoc}', this)">Copy</button>
                  </div>
                </div>

                <h3 class="card-title">
                  <a href="{$itemLoc}" target="_blank" rel="noopener" class="card-link">
                    <xsl:value-of select="$itemLoc"/>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                  </a>
                </h3>

                <div class="card-path">
                  <code><xsl:value-of select="$itemLoc"/></code>
                </div>

                <div class="card-footer">
                  <span class="card-date">
                    Last Modified: <xsl:value-of select="substring($itemMod, 0, 11)"/>
                  </span>
                  <a href="{$itemLoc}" target="_blank" rel="noopener" class="visit-link">
                    Visit URL ↗
                  </a>
                </div>
              </div>
            </xsl:for-each>
          </div>

          <!-- Table View -->
          <div class="table-wrapper" id="tableView">
            <table id="sitemapTable">
              <thead>
                <tr>
                  <th style="width: 45px;">#</th>
                  <th>URL Location</th>
                  <th style="width: 130px;">Category</th>
                  <th style="width: 85px;">Priority</th>
                  <th style="width: 100px;">ChangeFreq</th>
                  <th style="width: 120px;">Last Modified</th>
                  <th style="width: 80px; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:variable name="tLoc" select="sitemap:loc"/>
                  <xsl:variable name="tPri" select="sitemap:priority"/>
                  <xsl:variable name="tFreq" select="sitemap:changefreq"/>
                  <xsl:variable name="tMod" select="sitemap:lastmod"/>

                  <xsl:variable name="tCat">
                    <xsl:choose>
                      <xsl:when test="contains($tLoc, '/services/')">pillar</xsl:when>
                      <xsl:when test="contains($tLoc, '/projects#')">project</xsl:when>
                      <xsl:when test="contains($tLoc, '/locations')">location</xsl:when>
                      <xsl:when test="contains($tLoc, '/blog/')">post</xsl:when>
                      <xsl:when test="contains($tLoc, '.xml') or contains($tLoc, '.txt')">protocol</xsl:when>
                      <xsl:otherwise>primary</xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="tCatLabel">
                    <xsl:choose>
                      <xsl:when test="contains($tLoc, '/services/')">Piller Category Page</xsl:when>
                      <xsl:when test="contains($tLoc, '/projects#')">Project</xsl:when>
                      <xsl:when test="contains($tLoc, '/locations')">Location Page</xsl:when>
                      <xsl:when test="contains($tLoc, '/blog/')">Blog Post</xsl:when>
                      <xsl:when test="contains($tLoc, '.xml') or contains($tLoc, '.txt')">Machine Protocol</xsl:when>
                      <xsl:otherwise>Primary Page</xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <tr data-url="{$tLoc}" data-category="{$tCat}">
                    <td style="color: var(--slate-500); font-weight: 600;"><xsl:value-of select="position()"/></td>
                    <td class="col-url">
                      <a href="{$tLoc}" target="_blank" rel="noopener">
                        <xsl:value-of select="$tLoc"/>
                      </a>
                    </td>
                    <td>
                      <span class="cat-badge badge-{$tCat}">
                        <xsl:value-of select="$tCatLabel"/>
                      </span>
                    </td>
                    <td>
                      <span class="priority-pill">P: <xsl:value-of select="$tPri"/></span>
                    </td>
                    <td>
                      <span class="freq-pill"><xsl:value-of select="$tFreq"/></span>
                    </td>
                    <td>
                      <span class="card-date"><xsl:value-of select="substring($tMod, 0, 11)"/></span>
                    </td>
                    <td style="text-align: right;">
                      <button type="button" class="copy-btn" onclick="copyCardUrl('{$tLoc}', this)">Copy</button>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <!-- Footer Note -->
          <div class="footer-note">
            Generated dynamically by <a href="/">Muyeed Sifat</a> • Built with Next.js • Automatically synchronizes on content publication.
          </div>
        </div>

        <script type="text/javascript" src="/sitemap-actions.js"></script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
