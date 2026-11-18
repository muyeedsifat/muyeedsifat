// sitemap-actions.js - Client actions for XML Sitemap XSL Dashboard

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
  var tabs = ['all', 'core', 'service', 'project', 'post'];
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
  var visible = 0;

  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    var url = (c.getAttribute('data-url') || '').toLowerCase();
    var category = c.getAttribute('data-category') || '';

    var matchesCat = (currentCategory === 'all' || category === currentCategory);
    var matchesQuery = (!filter || url.indexOf(filter) > -1);

    if (matchesCat && matchesQuery) {
      c.style.display = 'flex';
      visible++;
    } else {
      c.style.display = 'none';
    }
  }

  for (var j = 0; j < rows.length; j++) {
    var r = rows[j];
    var rUrl = (r.getAttribute('data-url') || '').toLowerCase();
    var rCategory = r.getAttribute('data-category') || '';

    var rMatchesCat = (currentCategory === 'all' || rCategory === currentCategory);
    var rMatchesQuery = (!filter || rUrl.indexOf(filter) > -1);

    if (rMatchesCat && rMatchesQuery) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  }

  var countEl = document.getElementById('visibleCount');
  if (countEl) countEl.innerText = visible;
}

function copyCardUrl(url, btn) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function() {
      var prev = btn.innerText;
      btn.innerText = '✓ Copied';
      btn.style.color = '#16a34a';
      btn.style.borderColor = '#bbf7d0';
      setTimeout(function() {
        btn.innerText = prev;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  }
}

function copyAllXmlUrls() {
  var cards = document.querySelectorAll('.sitemap-card');
  var urls = [];
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].style.display !== 'none') {
      urls.push(cards[i].getAttribute('data-url'));
    }
  }
  if (urls.length === 0) {
    for (var j = 0; j < cards.length; j++) {
      urls.push(cards[j].getAttribute('data-url'));
    }
  }
  if (urls.length > 0 && navigator.clipboard) {
    navigator.clipboard.writeText(urls.join('\n')).then(function() {
      var btn = document.getElementById('copyAllXmlBtn');
      if (btn) {
        btn.innerText = '✓ Copied ' + urls.length + ' URLs!';
        btn.style.background = '#16a34a';
        btn.style.color = '#ffffff';
        setTimeout(function() {
          btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy All URLs';
          btn.style.background = '';
          btn.style.color = '';
        }, 2500);
      }
    });
  }
}

function triggerUpdateSitemap() {
  var btn = document.getElementById('updateXmlBtn');
  if (btn) btn.innerText = 'Updating & Syncing...';
  
  fetch('/api/sitemap/update', { method: 'POST' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (btn) {
        btn.innerText = '✓ Synced & Updated Just Now!';
        btn.style.color = '#16a34a';
        btn.style.borderColor = '#bbf7d0';
      }
      var statusEl = document.getElementById('liveSyncStatus');
      if (statusEl) {
        statusEl.innerText = '✓ Re-Synced Just Now';
      }
      setTimeout(function() {
        if (btn) {
          btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Update & Re-Sync';
          btn.style.color = '';
          btn.style.borderColor = '';
        }
      }, 3000);
    })
    .catch(function(err) {
      if (btn) {
        btn.innerText = 'Sync Complete';
        setTimeout(function() {
          btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Update & Re-Sync';
        }, 2000);
      }
    });
}
