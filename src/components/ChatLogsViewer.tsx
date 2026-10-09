'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChatSession } from '@/types/content';

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
    <>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions, replies, or session IDs…"
          style={{ width: 'min(360px, 100%)', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 10, outline: 'none' }}
        />

        {chats.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={clearing}
            className="buttonSmall buttonDanger"
          >
            {clearing ? 'Clearing…' : 'Clear All Chat Logs'}
          </button>
        )}
      </div>

      <div className="adminCard">
        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>Date &amp; Time</th>
              <th style={{ width: '130px' }}>Session</th>
              <th style={{ width: '35%' }}>Visitor Message</th>
              <th>AI Bot Response</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.82rem', color: '#777', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', background: '#f0f0f0', padding: '3px 6px', borderRadius: 6, fontFamily: 'monospace' }}>
                    {log.sessionId.slice(-8)}
                  </span>
                </td>
                <td>
                  <strong style={{ color: 'var(--ink)' }}>{log.userMessage}</strong>
                </td>
                <td style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.5 }}>
                  {log.botReply}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: '#777' }}>
                  {search ? 'No matching chat messages found.' : 'No chat conversations recorded yet. When visitors talk to the website AI chatbot, conversations will be saved here in real-time.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
