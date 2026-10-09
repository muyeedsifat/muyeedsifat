'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = 260
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [htmlSource, setHtmlSource] = useState(value || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const isUpdatingRef = useRef(false);

  // Sync external value to visual editor
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlSource(value || '');
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    isUpdatingRef.current = true;
    setHtmlSource(content);
    onChange(content);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  }, [onChange]);

  // Execute standard formatting commands
  function exec(command: string, arg: string | undefined = undefined) {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  }

  // Handle format block (headings, paragraphs, blockquote)
  function handleFormatBlock(tag: string) {
    if (!tag) return;
    if (tag === 'p') {
      exec('formatBlock', '<p>');
    } else if (tag === 'blockquote') {
      exec('formatBlock', '<blockquote>');
    } else if (tag === 'pre') {
      exec('formatBlock', '<pre>');
    } else {
      exec('formatBlock', `<${tag}>`);
    }
  }

  // Handle font size
  function handleFontSize(size: string) {
    if (editorRef.current) editorRef.current.focus();
    // We wrap selected text in span with font-size
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        handleInput();
      }
    }
  }

  // Handle color change
  function handleTextColor(color: string) {
    exec('foreColor', color);
    setShowColorPicker(false);
  }

  // Handle highlight change
  function handleHighlightColor(color: string) {
    exec('hiliteColor', color);
    setShowHighlightPicker(false);
  }

  // Link Insertion
  function openLinkModal() {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  }

  function insertLink() {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }
    if (editorRef.current) editorRef.current.focus();
    const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('/') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('tel:')
      ? linkUrl.trim()
      : `https://${linkUrl.trim()}`;

    if (linkText.trim()) {
      const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const linkHtml = `<a href="${url}"${targetAttr} style="color: #ff6b00; text-decoration: underline; font-weight: 500;">${linkText.trim()}</a>`;
      exec('insertHTML', linkHtml);
    } else {
      exec('createLink', url);
    }
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  }

  // Table Insertion
  function insertTable() {
    const rows = Math.max(1, Math.min(20, tableRows));
    const cols = Math.max(1, Math.min(10, tableCols));

    let html = '<div class="tableResponsive" style="overflow-x:auto;margin:16px 0;"><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;font-size:0.92rem;text-align:left;">';
    // Header
    html += '<thead style="background:#f8fafc;border-bottom:2px solid #cbd5e1;"><tr>';
    for (let c = 0; c < cols; c++) {
      html += `<th style="padding:10px 14px;border:1px solid #e2e8f0;font-weight:700;color:#1e293b;">Header ${c + 1}</th>`;
    }
    html += '</tr></thead><tbody>';
    // Rows
    for (let r = 0; r < rows; r++) {
      const bg = r % 2 === 0 ? '#ffffff' : '#f8fafc';
      html += `<tr style="background:${bg};border-bottom:1px solid #e2e8f0;">`;
      for (let c = 0; c < cols; c++) {
        html += `<td style="padding:10px 14px;border:1px solid #e2e8f0;">Data ${r + 1},${c + 1}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div><p><br></p>';

    if (editorRef.current) editorRef.current.focus();
    exec('insertHTML', html);
    setShowTableModal(false);
  }

  // Table helpers
  function modifyTable(action: 'addRow' | 'addCol' | 'deleteRow' | 'deleteCol' | 'deleteTable') {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    let node: Node | null = selection.anchorNode;
    let tableCell: HTMLTableCellElement | null = null;
    let tableRow: HTMLTableRowElement | null = null;
    let table: HTMLTableElement | null = null;

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'TD' || node.nodeName === 'TH') tableCell = node as HTMLTableCellElement;
      if (node.nodeName === 'TR') tableRow = node as HTMLTableRowElement;
      if (node.nodeName === 'TABLE') {
        table = node as HTMLTableElement;
        break;
      }
      node = node.parentNode;
    }

    if (!table) {
      alert('Please click inside a table cell first to edit rows or columns.');
      return;
    }

    if (action === 'deleteTable') {
      const container = table.closest('.tableResponsive') || table;
      container.remove();
      handleInput();
      return;
    }

    if (action === 'addRow') {
      const cols = table.rows[0]?.cells.length || 1;
      const newRow = table.insertRow(tableRow ? tableRow.rowIndex + 1 : -1);
      newRow.style.borderBottom = '1px solid #e2e8f0';
      newRow.style.background = '#ffffff';
      for (let i = 0; i < cols; i++) {
        const cell = newRow.insertCell(i);
        cell.style.padding = '10px 14px';
        cell.style.border = '1px solid #e2e8f0';
        cell.innerHTML = 'New cell';
      }
      handleInput();
      return;
    }

    if (action === 'deleteRow' && tableRow) {
      if (table.rows.length <= 1) {
        table.remove();
      } else {
        table.deleteRow(tableRow.rowIndex);
      }
      handleInput();
      return;
    }

    if (action === 'addCol') {
      const colIndex = tableCell ? tableCell.cellIndex + 1 : -1;
      for (let i = 0; i < table.rows.length; i++) {
        const r = table.rows[i];
        const isHeader = r.parentElement?.tagName === 'THEAD' || i === 0;
        const cell = r.insertCell(colIndex);
        cell.style.padding = '10px 14px';
        cell.style.border = '1px solid #e2e8f0';
        if (isHeader) {
          cell.style.fontWeight = '700';
          cell.style.color = '#1e293b';
          cell.innerHTML = 'Header';
        } else {
          cell.innerHTML = 'Cell';
        }
      }
      handleInput();
      return;
    }

    if (action === 'deleteCol' && tableCell) {
      const colIndex = tableCell.cellIndex;
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells.length > colIndex) {
          table.rows[i].deleteCell(colIndex);
        }
      }
      handleInput();
      return;
    }
  }

  // Direct Image Upload (Auto-converts to WebP)
  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('alt', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const imgUrl = data.item.url;
      const altText = data.item.alt || '';
      const imgHtml = `<figure style="margin:20px 0;text-align:center;"><img src="${imgUrl}" alt="${altText}" style="max-width:100%;height:auto;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);display:inline-block;" /><figcaption style="font-size:0.85rem;color:#64748b;margin-top:6px;">${altText}</figcaption></figure><p><br></p>`;

      if (editorRef.current) editorRef.current.focus();
      exec('insertHTML', imgHtml);
    } catch (err: unknown) {
      alert((err as Error).message || 'Image upload error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // Switch between Visual & HTML view
  function toggleMode(targetMode: 'visual' | 'html') {
    if (targetMode === mode) return;
    if (targetMode === 'html') {
      if (editorRef.current) {
        setHtmlSource(editorRef.current.innerHTML);
      }
      setMode('html');
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlSource;
      }
      onChange(htmlSource);
      setMode('visual');
    }
  }

  function handleHtmlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newHtml = e.target.value;
    setHtmlSource(newHtml);
    onChange(newHtml);
  }

  const paletteColors = [
    { name: 'Dark Slate', hex: '#0f172a' },
    { name: 'Brand Orange', hex: '#ff6b00' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Sapphire', hex: '#2563eb' },
    { name: 'Crimson', hex: '#dc2626' },
    { name: 'Purple', hex: '#9333ea' },
    { name: 'Muted Slate', hex: '#64748b' }
  ];

  const highlightColors = [
    { name: 'None', hex: 'transparent' },
    { name: 'Soft Yellow', hex: '#fef08a' },
    { name: 'Soft Orange', hex: '#fed7aa' },
    { name: 'Soft Green', hex: '#a7f3d0' },
    { name: 'Soft Blue', hex: '#bfdbfe' },
    { name: 'Soft Rose', hex: '#fbcfe8' }
  ];

  return (
    <div className="richEditorWrapper">
      {/* Top Toolbar */}
      <div className="richToolbar">
        {/* Headings */}
        <div className="toolbarGroup">
          <select
            className="toolbarSelect"
            aria-label="Format Block"
            onChange={(e) => {
              handleFormatBlock(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
          >
            <option value="" disabled>Style</option>
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
            <option value="blockquote">Quote Block</option>
            <option value="pre">Code Block</option>
          </select>

          {/* Font Sizes */}
          <select
            className="toolbarSelect"
            aria-label="Font Size"
            onChange={(e) => {
              handleFontSize(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
          >
            <option value="" disabled>Size</option>
            <option value="0.82rem">Small (13px)</option>
            <option value="1rem">Normal (16px)</option>
            <option value="1.15rem">Medium (18px)</option>
            <option value="1.4rem">Large (22px)</option>
            <option value="1.75rem">Extra Large (28px)</option>
          </select>
        </div>

        {/* Inline styles */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Bold (Ctrl+B)"
            onClick={() => exec('bold')}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Italic (Ctrl+I)"
            onClick={() => exec('italic')}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Underline (Ctrl+U)"
            onClick={() => exec('underline')}
          >
            <u>U</u>
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Strikethrough"
            onClick={() => exec('strikeThrough')}
          >
            <s>S</s>
          </button>
        </div>

        {/* Text Color & Highlight */}
        <div className="toolbarGroup" style={{ position: 'relative' }}>
          <button
            type="button"
            className="toolbarBtn"
            title="Text Color"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHighlightPicker(false);
            }}
          >
            <span style={{ borderBottom: '3px solid #ff6b00', paddingBottom: '1px', fontWeight: 700 }}>A</span>
          </button>
          {showColorPicker && (
            <div className="pickerDropdown">
              <div className="pickerTitle">Text Color</div>
              <div className="colorPalette">
                {paletteColors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="colorSwatch"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    onClick={() => handleTextColor(c.hex)}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="toolbarBtn"
            title="Highlight Color"
            onClick={() => {
              setShowHighlightPicker(!showHighlightPicker);
              setShowColorPicker(false);
            }}
          >
            <span style={{ backgroundColor: '#fef08a', padding: '0 4px', borderRadius: '3px', fontWeight: 700 }}>H</span>
          </button>
          {showHighlightPicker && (
            <div className="pickerDropdown">
              <div className="pickerTitle">Highlight</div>
              <div className="colorPalette">
                {highlightColors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className="colorSwatch"
                    style={{ backgroundColor: c.hex === 'transparent' ? '#ffffff' : c.hex, border: '1px solid #cbd5e1' }}
                    title={c.name}
                    onClick={() => handleHighlightColor(c.hex)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alignment */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Align Left"
            onClick={() => exec('justifyLeft')}
          >
            ←
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Align Center"
            onClick={() => exec('justifyCenter')}
          >
            ↔
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Align Right"
            onClick={() => exec('justifyRight')}
          >
            →
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Justify"
            onClick={() => exec('justifyFull')}
          >
            ≡
          </button>
        </div>

        {/* Lists */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Bullet List"
            onClick={() => exec('insertUnorderedList')}
          >
            • List
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Numbered List"
            onClick={() => exec('insertOrderedList')}
          >
            1. List
          </button>
        </div>

        {/* Hyperlink & Unlink */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Insert Hyperlink"
            onClick={openLinkModal}
          >
            🔗 Link
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Remove Link"
            onClick={() => exec('unlink')}
          >
            Unlink
          </button>
        </div>

        {/* Tables */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Insert Table"
            onClick={() => setShowTableModal(true)}
          >
            ▦ Table
          </button>
          <select
            className="toolbarSelect"
            aria-label="Table Actions"
            onChange={(e) => {
              modifyTable(e.target.value as 'addRow' | 'addCol' | 'deleteRow' | 'deleteCol' | 'deleteTable');
              e.target.value = '';
            }}
            defaultValue=""
          >
            <option value="" disabled>Table Tools</option>
            <option value="addRow">+ Add Row Below</option>
            <option value="addCol">+ Add Column Right</option>
            <option value="deleteRow">- Delete Current Row</option>
            <option value="deleteCol">- Delete Current Col</option>
            <option value="deleteTable">✕ Delete Table</option>
          </select>
        </div>

        {/* Direct Image Upload (Auto-WebP) */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn uploadBtn"
            title="Upload image and auto-convert to WebP"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingImage ? 'Converting WebP…' : '📷 + Upload Image (WebP)'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageFile}
          />
        </div>

        {/* Divider & Clear */}
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarBtn"
            title="Insert Horizontal Divider"
            onClick={() => exec('insertHorizontalRule')}
          >
            ―
          </button>
          <button
            type="button"
            className="toolbarBtn"
            title="Clear Formatting"
            onClick={() => exec('removeFormat')}
          >
            🧹
          </button>
        </div>

        {/* View Switcher (Visual vs HTML Source) */}
        <div className="toolbarGroup" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            className={`modeBtn ${mode === 'visual' ? 'active' : ''}`}
            onClick={() => toggleMode('visual')}
          >
            Visual
          </button>
          <button
            type="button"
            className={`modeBtn ${mode === 'html' ? 'active' : ''}`}
            onClick={() => toggleMode('html')}
          >
            &lt;/&gt; HTML
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="richEditorBody">
        {mode === 'visual' ? (
          <div
            ref={editorRef}
            className="richContentEditable"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight: `${minHeight}px` }}
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            className="richHtmlTextarea"
            value={htmlSource}
            onChange={handleHtmlChange}
            style={{ minHeight: `${minHeight}px` }}
            placeholder="Edit raw HTML code..."
          />
        )}
      </div>

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="richModalOverlay" onClick={() => setShowLinkModal(false)}>
          <div className="richModal" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ margin: '0 0 14px', fontSize: '1.1rem', fontWeight: 700 }}>Insert Hyperlink</h4>
            <div className="field" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>URL Address</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or /contact"
                autoFocus
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
              />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Anchor Text (Optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Get in touch"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', marginBottom: 16, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
              />
              Open link in new tab (`target="_blank"`)
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btnSecondary"
                style={{ padding: '7px 14px' }}
                onClick={() => setShowLinkModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btnPrimary"
                style={{ padding: '7px 16px' }}
                onClick={insertLink}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="richModalOverlay" onClick={() => setShowTableModal(false)}>
          <div className="richModal" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ margin: '0 0 14px', fontSize: '1.1rem', fontWeight: 700 }}>Insert Responsive Table</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div className="field">
                <label style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Number of Rows</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
                />
              </div>
              <div className="field">
                <label style={{ fontSize: '0.84rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Number of Columns</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>
              Tables are built with mobile-responsive horizontal scrolling, zebra striping, and header cells.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btnSecondary"
                style={{ padding: '7px 14px' }}
                onClick={() => setShowTableModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btnPrimary"
                style={{ padding: '7px 16px' }}
                onClick={insertTable}
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
