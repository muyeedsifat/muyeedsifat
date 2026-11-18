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
        <title>XML Sitemap | Muyeed Sifat</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          :root {
            --primary: #f97316;
            --primary-dark: #ea580c;
            --primary-soft: #fff7ed;
            --slate-900: #0f172a;
            --slate-800: #1e293b;
            --slate-700: #334155;
            --slate-600: #475569;
            --slate-500: #64748b;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --slate-50: #f8fafc;
            --white: #ffffff;
            --radius: 12px;
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
            padding: 32px 16px;
            font-size: 14px;
          }

          .container {
            max-width: 1140px;
            margin: 0 auto;
          }

          .header-card {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
          }

          .badge-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-radius: 9999px;
          }

          .badge-primary {
            background: var(--primary-soft);
            color: var(--primary-dark);
            border: 1px solid #fed7aa;
          }

          .badge-neutral {
            background: var(--slate-100);
            color: var(--slate-600);
          }

          .badge-success {
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
          }

          h1 {
            font-size: 26px;
            font-weight: 800;
            color: var(--slate-900);
            letter-spacing: -0.02em;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 14px;
            color: var(--slate-500);
            max-width: 760px;
            margin-bottom: 20px;
          }

          .nav-links {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            padding-top: 16px;
            border-top: 1px solid var(--slate-200);
            align-items: center;
          }

          .nav-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: var(--slate-700);
            text-decoration: none;
            padding: 7px 12px;
            border-radius: 6px;
            background: var(--slate-100);
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.15s ease;
          }

          .nav-link:hover {
            background: var(--slate-200);
            color: var(--slate-900);
          }

          .nav-link-primary {
            background: var(--primary-soft);
            color: var(--primary-dark);
            border-color: #fed7aa;
          }

          .nav-link-primary:hover {
            background: var(--primary);
            color: var(--white);
            border-color: var(--primary);
          }

          .nav-link-accent {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
          }

          .nav-link-accent:hover {
            background: var(--primary);
            border-color: var(--primary);
          }

          /* Controls Bar */
          .controls-bar {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
          }

          .search-wrapper {
            position: relative;
            flex: 1;
            min-width: 240px;
          }

          .search-input {
            width: 100%;
            padding: 9px 14px 9px 36px;
            font-size: 13px;
            border: 1px solid var(--slate-200);
            border-radius: 8px;
            outline: none;
            transition: border-color 0.15s ease;
            background: var(--slate-50);
            color: var(--slate-900);
          }

          .search-input:focus {
            border-color: var(--primary);
            background: var(--white);
          }

          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--slate-400);
            pointer-events: none;
          }

          .stats-text {
            font-size: 13px;
            font-weight: 600;
            color: var(--slate-500);
            white-space: nowrap;
          }

          /* Table Card */
          .table-card {
            background: var(--white);
            border: 1px solid var(--slate-200);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
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

          tbody tr:last-child {
            border-bottom: none;
          }

          tbody tr:hover {
            background-color: #fafbfc;
          }

          td {
            padding: 12px 18px;
            vertical-align: middle;
            font-size: 13px;
          }

          td.col-url {
            word-break: break-all;
          }

          td.col-url a {
            color: var(--slate-900);
            font-weight: 600;
            text-decoration: none;
            transition: color 0.15s ease;
          }

          td.col-url a:hover {
            color: var(--primary);
            text-decoration: underline;
          }

          .priority-pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
          }

          .p-10 {
            background: #ecfdf5;
            color: #059669;
          }

          .p-09 {
            background: #eff6ff;
            color: #2563eb;
          }

          .p-08 {
            background: #f5f3ff;
            color: #7c3aed;
          }

          .p-07 {
            background: var(--slate-100);
            color: var(--slate-600);
          }

          .freq-text {
            color: var(--slate-500);
            font-size: 12px;
            text-transform: capitalize;
          }

          .date-text {
            color: var(--slate-500);
            font-size: 12px;
            white-space: nowrap;
          }

          .footer-note {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: var(--slate-500);
          }

          .footer-note a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
          }

          .footer-note a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .hide-mobile {
              display: none;
            }
            .header-card {
              padding: 20px;
            }
            td, thead th {
              padding: 10px 12px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Banner -->
          <div class="header-card">
            <div class="badge-row">
              <span class="badge badge-primary">Standard XML Sitemap</span>
              <span class="badge badge-success">● Auto-Updating</span>
              <span class="badge badge-neutral">Sitemaps.org 0.9</span>
            </div>
            <h1>XML Sitemap – Muyeed Sifat</h1>
            <p class="subtitle">
              This dynamically generated XML sitemap serves search engine crawlers (Google, Bing, Yandex) and AI search agents with the canonical URL hierarchy, last modification timestamps, and indexing priorities across the entire portfolio website.
            </p>
            <div class="nav-links">
              <a href="/sitemap.html" class="nav-link nav-link-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                View HTML Sitemap
              </a>
              <button type="button" onclick="copyAllXmlUrls()" class="nav-link" id="copyAllXmlBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy All URLs
              </button>
              <a href="/api/sitemap/download" class="nav-link nav-link-accent" download="muyeedsifat-sitemap-export.zip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Sitemap ZIP (Folder Structure)
              </a>
              <a href="/llms.txt" class="nav-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                View LLM Manifest (llms.txt)
              </a>
              <a href="/" class="nav-link">
                Home
              </a>
            </div>
          </div>

          <!-- Controls Bar with Real-time Filter -->
          <div class="controls-bar">
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="sitemapFilter" class="search-input" placeholder="Type to filter URLs by name, slug, or section..." onkeyup="filterSitemap()" />
            </div>
            <div class="stats-text">
              Total Indexed URLs: <strong style="color: var(--slate-900);"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            </div>
          </div>

          <!-- Table -->
          <div class="table-card">
            <table id="sitemapTable">
              <thead>
                <tr>
                  <th style="width: 45px;">#</th>
                  <th>URL (Location)</th>
                  <th style="width: 100px;">Priority</th>
                  <th style="width: 120px;" class="hide-mobile">ChangeFreq</th>
                  <th style="width: 160px;" class="hide-mobile">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:variable name="itemUrl" select="sitemap:loc"/>
                  <xsl:variable name="itemPriority" select="sitemap:priority"/>
                  <tr>
                    <td style="color: var(--slate-500); font-weight: 600;"><xsl:value-of select="position()"/></td>
                    <td class="col-url">
                      <a href="{$itemUrl}" target="_blank" rel="noopener">
                        <xsl:value-of select="$itemUrl"/>
                      </a>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="$itemPriority &gt;= 1.0">
                          <span class="priority-pill p-10">1.0</span>
                        </xsl:when>
                        <xsl:when test="$itemPriority &gt;= 0.9">
                          <span class="priority-pill p-09">0.9</span>
                        </xsl:when>
                        <xsl:when test="$itemPriority &gt;= 0.8">
                          <span class="priority-pill p-08">0.8</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="priority-pill p-07"><xsl:value-of select="$itemPriority"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="hide-mobile">
                      <span class="freq-text"><xsl:value-of select="sitemap:changefreq"/></span>
                    </td>
                    <td class="hide-mobile">
                      <span class="date-text"><xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/></span>
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

        <script type="text/javascript">
          function filterSitemap() {
            var input = document.getElementById("sitemapFilter");
            var filter = input.value.toLowerCase();
            var table = document.getElementById("sitemapTable");
            var tr = table.getElementsByTagName("tr");
            for (var i = 1; i &lt; tr.length; i++) {
              var td = tr[i].getElementsByTagName("td")[1];
              if (td) {
                var txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) &gt; -1) {
                  tr[i].style.display = "";
                } else {
                  tr[i].style.display = "none";
                }
              }
            }
          }

          function copyAllXmlUrls() {
            var table = document.getElementById("sitemapTable");
            var links = table.getElementsByTagName("a");
            var urls = [];
            for (var i = 0; i &lt; links.length; i++) {
              urls.push(links[i].href);
            }
            if (urls.length &gt; 0 &amp;&amp; navigator.clipboard) {
              navigator.clipboard.writeText(urls.join("\n")).then(function() {
                var btn = document.getElementById("copyAllXmlBtn");
                btn.innerText = "✓ Copied " + urls.length + " URLs!";
                btn.style.color = "#059669";
                btn.style.borderColor = "#a7f3d0";
                setTimeout(function() {
                  btn.innerHTML = '&lt;svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"&gt;&lt;rect x="9" y="9" width="13" height="13" rx="2" ry="2"/&gt;&lt;path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/&gt;&lt;/svg&gt; Copy All URLs';
                  btn.style.color = "";
                  btn.style.borderColor = "";
                }, 2500);
              });
            }
          }
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
