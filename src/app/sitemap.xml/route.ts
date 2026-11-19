import { getSitemapData } from '@/lib/sitemap-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { items: uniqueItems, counts } = await getSitemapData();

  const countAll = counts.all;
  const countPrimary = counts.primary;
  const countPillar = counts.pillar;
  const countProject = counts.project;
  const countLocation = counts.location;
  const countPost = counts.post;

  // Content negotiation: Check if client is a browser requesting HTML
  const urlObj = new URL(request.url);
  const forceXml = urlObj.searchParams.get('format') === 'xml' || urlObj.searchParams.get('xml') === '1';
  const accept = (request.headers.get('accept') || '').toLowerCase();
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  const isBot = [
    'googlebot',
    'google-sitemaps',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandex',
    'sogou',
    'exabot',
    'facebot',
    'facebookexternalhit',
    'ia_archiver',
    'screaming frog',
    'semrushbot',
    'ahrefsbot',
    'dotbot',
    'petalbot',
    'mj12bot',
    'curl',
    'wget',
    'python',
    'httpie',
    'postman',
    'axios',
    'node-fetch',
    'undici',
    'bot',
    'crawler',
    'spider',
  ].some((k) => userAgent.includes(k));

  const wantsHtml = !forceXml && !isBot && accept.includes('text/html');

  // If a browser is viewing /sitemap.xml, return native modern HTML5 (Zero XSLT dependency)
  if (wantsHtml) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>XML Sitemap &amp; Search Engine Directory | Muyeed Sifat</title>
  <meta name="description" content="Official XML Sitemap directory for Muyeed Sifat portfolio. Synchronized with Sitemaps.org protocols." />
  <meta name="robots" content="noindex, follow" />
  <link rel="icon" href="/favicon.ico" />
  <style>
    :root {
      --orange: #ff6b00;
      --orange-hover: #e05e00;
      --orange-soft: #fff7ed;
      --orange-border: #fed7aa;
      --dark: #0f172a;
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
      padding: 36px 16px 64px;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
    }

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
      color: var(--dark);
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

    .toolbar-info h2 {
      font-size: 18px;
      font-weight: 750;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .toolbar-info p {
      font-size: 13px;
      color: var(--slate-500);
    }

    .btn-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      font-size: 13px;
      font-weight: 650;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      outline: none;
    }

    .btn-primary {
      background: var(--orange);
      color: var(--white);
      box-shadow: 0 2px 8px rgba(255, 107, 0, 0.25);
    }

    .btn-primary:hover {
      background: var(--orange-hover);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--white);
      border-color: var(--slate-200);
      color: var(--slate-700);
    }

    .btn-secondary:hover {
      background: var(--slate-100);
      color: var(--dark);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 550px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .stat-card {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius);
      padding: 18px 14px;
      text-align: center;
      box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px -2px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }

    .stat-num {
      font-size: 28px;
      font-weight: 850;
      color: var(--dark);
      line-height: 1;
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--slate-500);
    }

    .search-box {
      margin-bottom: 16px;
    }

    .search-input {
      width: 100%;
      padding: 13px 20px;
      font-size: 14px;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      background: var(--white);
      color: var(--dark);
      outline: none;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      transition: all 0.15s ease;
    }

    .search-input:focus {
      border-color: var(--orange);
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
    }

    .tabs-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .tabs-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      border: 1px solid transparent;
      background: #edeef3;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      background: #e2e4eb;
    }

    .tab-btn.active {
      background: var(--dark);
      color: var(--white);
    }

    .view-toggles {
      display: flex;
      gap: 4px;
      background: #edeef3;
      padding: 3px;
      border-radius: 8px;
    }

    .view-btn {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 650;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .view-btn.active {
      background: var(--white);
      color: var(--dark);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-container {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
      margin-bottom: 24px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    thead th {
      background: #f8fafc;
      padding: 14px 18px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--slate-500);
      border-bottom: 1px solid var(--slate-200);
    }

    tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.1s ease;
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    tbody tr:hover {
      background: #fcfdfe;
    }

    td {
      padding: 14px 18px;
      vertical-align: middle;
      font-size: 13px;
    }

    .col-idx {
      width: 44px;
      color: #94a3b8;
      font-weight: 700;
      font-size: 12px;
      text-align: center;
    }

    .col-status {
      width: 80px;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 750;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }

    .url-cell {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .item-title {
      font-weight: 700;
      color: var(--dark);
      font-size: 14px;
    }

    .url-link {
      color: var(--orange);
      text-decoration: none;
      font-size: 12.5px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      word-break: break-all;
      transition: color 0.15s ease;
    }

    .url-link:hover {
      color: var(--orange-hover);
      text-decoration: underline;
    }

    .item-desc {
      font-size: 12px;
      color: var(--slate-500);
      line-height: 1.4;
      margin-top: 1px;
    }

    .col-cat {
      width: 170px;
    }

    .cat-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 750;
      white-space: nowrap;
    }

    .cat-primary { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .cat-pillar { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
    .cat-project { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .cat-location { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
    .cat-post { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }

    .col-priority {
      width: 80px;
      font-weight: 750;
      color: var(--dark);
      text-align: center;
    }

    .priority-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 5px;
      background: #f1f5f9;
      font-size: 12px;
    }

    .col-changefreq {
      width: 95px;
      color: var(--slate-600);
      font-size: 12px;
      text-align: center;
      text-transform: capitalize;
    }

    .col-date {
      width: 110px;
      color: #94a3b8;
      font-size: 12px;
      text-align: right;
      white-space: nowrap;
    }

    /* Grid view */
    .card-grid {
      display: none;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .sitemap-card {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease;
    }

    .sitemap-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px -2px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }

    .card-title {
      font-size: 15px;
      font-weight: 750;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .card-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: var(--orange);
      text-decoration: none;
      word-break: break-all;
      margin-bottom: 10px;
      display: inline-block;
    }

    .card-url:hover {
      text-decoration: underline;
    }

    .card-desc {
      font-size: 12.5px;
      color: var(--slate-600);
      line-height: 1.5;
      margin-bottom: 14px;
      flex-grow: 1;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
      font-size: 11px;
      color: #94a3b8;
    }

    .card-copy-btn {
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 650;
      border-radius: 5px;
      background: #f1f5f9;
      border: 1px solid var(--slate-200);
      color: var(--slate-600);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .card-copy-btn:hover {
      background: var(--dark);
      color: var(--white);
    }

    /* Footer note */
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
      max-width: 650px;
      margin: 0 auto;
    }

    .footer-note a {
      color: var(--slate-600);
      text-decoration: underline;
    }

    .footer-note a:hover {
      color: var(--orange);
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--dark);
      color: var(--white);
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 650;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="breadcrumbs">
      <a href="/">Home</a>
      <span class="breadcrumbs-separator">/</span>
      <span>Sitemap.xml (Search Engine Directory)</span>
    </div>

    <div class="page-hero">
      <span class="eyebrow">Sitemaps.org Protocol • Auto-Updating XML Feed</span>
      <h1>XML Sitemap &amp; Search Engine Directory</h1>
      <p class="lead">
        This XML sitemap is dynamically generated and synchronized with Muyeed Sifat's digital marketing portfolio. It organizes all primary landing pages, service categories, client case studies, and strategic publications according to Sitemaps.org protocols.
      </p>
    </div>

    <div class="action-toolbar">
      <div class="toolbar-info">
        <h2>Sitemap Actions &amp; Feeds</h2>
        <p>Instant sync, multi-format link extraction, and crawler protocols.</p>
      </div>
      <div class="btn-group">
        <button id="btnCopyAll" class="btn btn-secondary" onclick="copyAllLinks()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          Copy All Links
        </button>
        <button id="btnDownloadZip" class="btn btn-secondary" onclick="downloadSitemapZip()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download ZIP
        </button>
        <button id="btnUpdateSitemaps" class="btn btn-primary" onclick="triggerSitemapUpdate()">
          <svg id="updateSpinIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          <span id="updateBtnText">Update Sitemaps</span>
        </button>
        <a href="/sitemap.xml?format=xml" class="btn btn-secondary" title="View pure Sitemaps.org XML">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Raw XML
        </a>
        <a href="/sitemap.html" class="btn btn-secondary" title="View HTML Sitemap Directory">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          HTML Directory
        </a>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-num">${countAll}</div>
        <div class="stat-label">Total Published URLs</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${countPrimary}</div>
        <div class="stat-label">Primary Pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${countPillar}</div>
        <div class="stat-label">Piller Category Pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${countProject}</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${countLocation}</div>
        <div class="stat-label">Location Pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${countPost}</div>
        <div class="stat-label">Blog Posts</div>
      </div>
    </div>

    <div class="search-box">
      <input
        type="text"
        id="sitemapFilter"
        class="search-input"
        placeholder="Search directory by page title, URL slug, or keywords..."
        oninput="filterSitemap()"
      />
    </div>

    <div class="tabs-bar">
      <div class="tabs-group">
        <button id="tab-all" class="tab-btn active" onclick="filterByCategory('all')">All Links (${countAll})</button>
        <button id="tab-primary" class="tab-btn" onclick="filterByCategory('primary')">Primary Page (${countPrimary})</button>
        <button id="tab-pillar" class="tab-btn" onclick="filterByCategory('pillar')">Piller Category Page (${countPillar})</button>
        <button id="tab-project" class="tab-btn" onclick="filterByCategory('project')">Project (${countProject})</button>
        <button id="tab-location" class="tab-btn" onclick="filterByCategory('location')">Location Page (${countLocation})</button>
        <button id="tab-post" class="tab-btn" onclick="filterByCategory('post')">Blog Post (${countPost})</button>
      </div>
      <div class="view-toggles">
        <button id="btn-table-view" class="view-btn active" onclick="switchView('table')">Table</button>
        <button id="btn-grid-view" class="view-btn" onclick="switchView('grid')">Cards</button>
      </div>
    </div>

    <!-- Table View -->
    <div id="tableView" class="table-container">
      <table id="sitemapTable">
        <thead>
          <tr>
            <th class="col-idx">#</th>
            <th class="col-status">Status</th>
            <th>Page Title &amp; URL</th>
            <th class="col-cat">Category</th>
            <th class="col-priority">Priority</th>
            <th class="col-changefreq">Changefreq</th>
            <th class="col-date">Last Modified</th>
          </tr>
        </thead>
        <tbody>
${uniqueItems
  .map(
    (item, index) => `          <tr class="sitemap-row" data-category="${item.category}" data-search="${item.title.toLowerCase()} ${item.url.toLowerCase()} ${item.description.toLowerCase()}">
            <td class="col-idx">${index + 1}</td>
            <td class="col-status"><span class="status-badge">200 OK</span></td>
            <td>
              <div class="url-cell">
                <span class="item-title">${item.title}</span>
                <a href="${item.url}" class="url-link" target="_blank" rel="noopener noreferrer">${item.url}</a>
                <span class="item-desc">${item.description}</span>
              </div>
            </td>
            <td class="col-cat"><span class="cat-badge cat-${item.category}">${item.categoryLabel}</span></td>
            <td class="col-priority"><span class="priority-badge">${item.priority}</span></td>
            <td class="col-changefreq">${item.changefreq}</td>
            <td class="col-date">${item.formattedDate}</td>
          </tr>`
  )
  .join('\n')}
        </tbody>
      </table>
    </div>

    <!-- Grid View -->
    <div id="cardGridView" class="card-grid">
${uniqueItems
  .map(
    (item) => `      <div class="sitemap-card" data-category="${item.category}" data-search="${item.title.toLowerCase()} ${item.url.toLowerCase()} ${item.description.toLowerCase()}">
        <div class="card-top">
          <span class="cat-badge cat-${item.category}">${item.categoryLabel}</span>
          <span class="status-badge">200 OK</span>
        </div>
        <h3 class="card-title">${item.title}</h3>
        <a href="${item.url}" class="card-url" target="_blank" rel="noopener noreferrer">${item.url}</a>
        <p class="card-desc">${item.description}</p>
        <div class="card-meta">
          <span>Priority: <strong>${item.priority}</strong></span>
          <span>${item.formattedDate}</span>
          <button class="card-copy-btn" onclick="copySingleLink('${item.url}')">Copy</button>
        </div>
      </div>`
  )
  .join('\n')}
    </div>

    <div class="footer-note">
      <p>
        This XML sitemap is dynamically generated and complies with Sitemaps.org 0.9 standards. Automated search engine crawlers (Googlebot, Bingbot) receive raw machine-readable XML without XSLT processing. Large language models and conversational search engines can access <a href="/llms.txt">/llms.txt</a> and <a href="/llms-full.txt">/llms-full.txt</a>.
      </p>
    </div>
  </div>

  <div id="toast" class="toast">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toastMsg">Action completed successfully</span>
  </div>

  <script>
    var currentCategory = 'all';

    function switchView(mode) {
      var grid = document.getElementById('cardGridView');
      var table = document.getElementById('tableView');
      var btnGrid = document.getElementById('btn-grid-view');
      var btnTable = document.getElementById('btn-table-view');

      if (!grid || !table) return;

      if (mode === 'grid') {
        grid.style.display = 'grid';
        table.style.display = 'none';
        if (btnGrid) btnGrid.className = 'view-btn active';
        if (btnTable) btnTable.className = 'view-btn';
      } else {
        grid.style.display = 'none';
        table.style.display = 'block';
        if (btnGrid) btnGrid.className = 'view-btn';
        if (btnTable) btnTable.className = 'view-btn active';
      }
    }

    function filterByCategory(cat) {
      currentCategory = cat;
      var tabs = ['all', 'primary', 'pillar', 'project', 'location', 'post'];
      for (var i = 0; i < tabs.length; i++) {
        var el = document.getElementById('tab-' + tabs[i]);
        if (el) {
          if (tabs[i] === cat) {
            el.className = 'tab-btn active';
          } else {
            el.className = 'tab-btn';
          }
        }
      }
      applyFilters();
    }

    function filterSitemap() {
      applyFilters();
    }

    function applyFilters() {
      var input = document.getElementById('sitemapFilter');
      var filter = input ? input.value.toLowerCase().trim() : '';
      var cards = document.querySelectorAll('.sitemap-card');
      var rows = document.querySelectorAll('#sitemapTable tbody tr');

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cat = row.getAttribute('data-category');
        var search = row.getAttribute('data-search') || '';
        var matchCat = (currentCategory === 'all' || cat === currentCategory);
        var matchSearch = (!filter || search.indexOf(filter) !== -1);

        if (matchCat && matchSearch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }

      for (var j = 0; j < cards.length; j++) {
        var card = cards[j];
        var cCat = card.getAttribute('data-category');
        var cSearch = card.getAttribute('data-search') || '';
        var cMatchCat = (currentCategory === 'all' || cCat === currentCategory);
        var cMatchSearch = (!filter || cSearch.indexOf(filter) !== -1);

        if (cMatchCat && cMatchSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      }
    }

    function showToast(msg) {
      var toast = document.getElementById('toast');
      var toastMsg = document.getElementById('toastMsg');
      if (!toast || !toastMsg) return;
      toastMsg.innerText = msg;
      toast.className = 'toast show';
      setTimeout(function() {
        toast.className = 'toast';
      }, 3000);
    }

    function copySingleLink(url) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          showToast('Copied: ' + url);
        }).catch(function() {
          showToast('Failed to copy link');
        });
      }
    }

    function copyAllLinks() {
      var links = [];
      var rows = document.querySelectorAll('#sitemapTable tbody tr');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== 'none') {
          var a = rows[i].querySelector('.url-link');
          if (a && a.href) links.push(a.href);
        }
      }
      if (links.length === 0) {
        showToast('No links to copy');
        return;
      }
      var text = links.join('\\n');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          showToast('Copied ' + links.length + ' URLs to clipboard!');
        }).catch(function() {
          showToast('Failed to copy links');
        });
      }
    }

    function downloadSitemapZip() {
      showToast('Preparing ZIP download...');
      window.location.href = '/api/sitemap/download';
    }

    function triggerSitemapUpdate() {
      var btn = document.getElementById('btnUpdateSitemaps');
      var icon = document.getElementById('updateSpinIcon');
      var text = document.getElementById('updateBtnText');

      if (btn) btn.disabled = true;
      if (text) text.innerText = 'Updating...';
      if (icon) {
        icon.style.animation = 'spin 1s linear infinite';
      }

      fetch('/api/sitemap/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (btn) btn.disabled = false;
        if (text) text.innerText = 'Update Sitemaps';
        if (icon) icon.style.animation = '';
        showToast('Sitemaps & Cache Updated Successfully!');
        setTimeout(function() {
          window.location.reload();
        }, 1200);
      })
      .catch(function(err) {
        if (btn) btn.disabled = false;
        if (text) text.innerText = 'Update Sitemaps';
        if (icon) icon.style.animation = '';
        showToast('Failed to refresh sitemap cache');
      });
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, follow',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  // Pure Sitemaps.org XML for Search Engine Crawlers & Machine APIs (Googlebot, Bingbot, curl, etc.)
  // Clean valid XML without deprecated XSL stylesheet processing instruction
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueItems
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
