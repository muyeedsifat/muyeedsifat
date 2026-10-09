'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChatSession } from '@/types/content';
import { WhatsAppIcon } from '@/components/Icons';

export function ChatLogsViewer({ initialChats }: { initialChats: ChatSession[] }) {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [search, setSearch] = useState('');
  const [clearing, setClearing] = useState(false);

  const filtered = chats.filter(
    (c) =>
      c.userMessage.toLowerCase().includes(search.toLowerCase()) ||
      c.botReply.toLowerCase().includes(search.toLowerCase()) ||
      c.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  async function handleClearAll() {
    if (!confirm('Are you sure you want to clear all recorded chatbot conversation logs?')) return;
    setClearing(true);

    try {
      const res = await fetch('/api/admin/chats', { method: 'DELETE' });
      if (res.ok) {
        setChats([]);
        router.refresh();
      } else {
        alert('Failed to clear logs.');
      }
    } catch {
      alert('Network error while clearing logs.');
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="adminContentStack">
      <div className="adminPageHeader">
        <div>
          <span className="adminEyebrow">Visitor Inquiries &amp; Interactions</span>
          <h1 className="adminTitle">AI Chatbot Records</h1>
          <p className="adminSubtitle">
            Every conversation held through the website AI Chatbot is captured here. You can review visitor questions, assess lead intent, and follow up directly.
          </p>
        </div>
        {chats.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={clearing}
            className="btn btnSecondary"
            style={{ color: '#b91c1c', borderColor: '#fecaca' }}
          >
            {clearing ? 'Clearing…' : 'Clear Chat History'}
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="adminFilterBar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions, replies, or session IDs…"
          className="adminSearchInput"
        />
        <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
          {filtered.length} of {chats.length} recorded inquiries
        </div>
      </div>

      <div className="adminCard">
        <table className="adminModernTable">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>Date &amp; Time</th>
              <th style={{ width: '110px' }}>Session</th>
              <th style={{ width: '38%' }}>Visitor Question</th>
              <th>AI Assistant Answer</th>
              <th style={{ textAlign: 'right', width: '130px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => {
              const cleanUserMsg = encodeURIComponent(
                `Hi! Regarding your question on my website: "${log.userMessage}"`
              );
              return (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className="adminPill" style={{ fontFamily: 'monospace' }}>
                      {log.sessionId.slice(-6)}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                      {log.userMessage}
                    </strong>
                  </td>
                  <td style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                    {log.botReply}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={`https://wa.me/8801700000000?text=${cleanUserMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="buttonSmall"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#15803d',
                        borderColor: '#bbf7d0',
                        background: '#f0fdf4'
                      }}
                      title="Follow up with this question on WhatsApp"
                    >
                      <WhatsAppIcon size={14} /> WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  {search
                    ? 'No matching chat messages found.'
                    : 'No conversations recorded yet. When visitors message the website AI chatbot, conversations will stream here in real time.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
