'use client';

import React, { FormEvent, useState, useEffect } from 'react';
import { WhatsAppIcon, UpworkIcon, LinkedInIcon } from '@/components/Icons';

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingDb, setTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    status: string;
    message: string;
    tables?: Record<string, unknown>;
  } | null>(null);

  useEffect(() => {
    // Check Supabase status on load
    fetch('/api/admin/supabase-test')
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch(() => null);
  }, []);

  async function testSupabase() {
    setTestingDb(true);
    try {
      const res = await fetch('/api/admin/supabase-test');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({
        configured: false,
        status: 'error',
        message: 'Network error verifying Supabase connection.'
      });
    } finally {
      setTestingDb(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      setLoading(false);
      setMessage(res.ok ? 'Settings updated successfully!' : 'Could not save settings.');
    } catch {
      setLoading(false);
      setMessage('Failed to update settings.');
    }
  }

  return (
    <div className="adminContentStack">
      <div className="adminPageHeader">
        <div>
          <span className="adminEyebrow">CMS &amp; Platform Configuration</span>
          <h1 className="adminTitle">Settings &amp; Integrations</h1>
          <p className="adminSubtitle">
            Configure Supabase Database, Vercel deployments, Gemini AI personality, WhatsApp messaging, and profile links.
          </p>
        </div>
      </div>

      {/* Supabase & Vercel Connection Hub */}
      <div className="adminCard" style={{ borderColor: 'rgba(255,107,0,0.3)', background: 'linear-gradient(180deg, #ffffff 0%, #fffbf8 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.4rem' }}>⚡</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
                Supabase &amp; Vercel Database Connection
              </h2>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              Project Reference: <code>lorzornydwloucbjwewd</code> • URL: <code>https://lorzornydwloucbjwewd.supabase.co</code>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btnSecondary"
              disabled={testingDb}
              onClick={testSupabase}
            >
              {testingDb ? 'Verifying…' : '🔄 Test Live Connection'}
            </button>
            <a
              href="https://supabase.com/dashboard/project/lorzornydwloucbjwewd/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnPrimary"
            >
              Open Supabase SQL ↗
            </a>
          </div>
        </div>

        {/* Live Status Pill */}
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: dbStatus?.status === 'connected' ? '#f0fdf4' : '#fff7ed', border: `1px solid ${dbStatus?.status === 'connected' ? '#bbf7d0' : '#fed7aa'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.92rem', color: dbStatus?.status === 'connected' ? '#166534' : '#9a3412' }}>
            <span>{dbStatus?.status === 'connected' ? '● Connected' : '○ Local Storage Active (Zero Downtime Standby)'}</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: dbStatus?.status === 'connected' ? '#15803d' : '#b45309' }}>
            {dbStatus?.message || 'Checking connection status...'}
          </p>
        </div>

        {/* Setup Steps Accordion / Details */}
        <div style={{ marginTop: 18, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
          <details style={{ cursor: 'pointer', fontSize: '0.88rem' }}>
            <summary style={{ fontWeight: 700, color: '#ff6b00' }}>
              📋 How to connect Supabase in 2 minutes (Copy-Paste Steps)
            </summary>
            <div style={{ padding: '12px 0 0', color: '#475569', lineHeight: 1.6 }}>
              <ol style={{ paddingLeft: 20, margin: 0 }}>
                <li>
                  Open your <strong>Supabase SQL Editor</strong>: <a href="https://supabase.com/dashboard/project/lorzornydwloucbjwewd/sql" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b00', textDecoration: 'underline' }}>Click here to open SQL Editor</a>.
                </li>
                <li>
                  Paste the contents of <code>supabase/schema.sql</code> and click <strong>RUN</strong>. This creates all tables (posts, projects, pages, chat_logs, media, settings) and the public <code>media</code> storage bucket.
                </li>
                <li>
                  In your Supabase project, go to <strong>Project Settings &gt; API</strong> and copy:
                  <ul style={{ marginTop: 4 }}>
                    <li><strong>Project URL</strong>: <code>https://lorzornydwloucbjwewd.supabase.co</code></li>
                    <li><strong>anon public key</strong></li>
                    <li><strong>service_role secret key</strong></li>
                  </ul>
                </li>
                <li>
                  In your <strong>Vercel Project Settings &gt; Environment Variables</strong>, add:
                  <ul style={{ marginTop: 4 }}>
                    <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                    <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                    <li><code>SUPABASE_SERVICE_ROLE_KEY</code></li>
                  </ul>
                </li>
              </ol>
            </div>
          </details>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={submit} className="adminFormStack">
        <div className="adminCard">
          <h3 className="sidebarSectionTitle" style={{ marginBottom: 14 }}>General Identity &amp; Meta</h3>
          <div className="adminFormGrid">
            <div className="field">
              <label htmlFor="set-sitename">Site Name</label>
              <input id="set-sitename" name="siteName" defaultValue={String(initial.siteName || 'Muyeed')} />
            </div>

            <div className="field">
              <label htmlFor="set-author">Author / Professional Name</label>
              <input id="set-author" name="authorName" defaultValue={String(initial.authorName || 'Muyeed Sifat')} />
            </div>

            <div className="field">
              <label htmlFor="set-email">Inquiry Email</label>
              <input id="set-email" name="email" type="email" defaultValue={String(initial.email || 'muyeedsifatt@gmail.com')} />
            </div>

            <div className="field">
              <label htmlFor="set-schema">Default SEO Schema</label>
              <select id="set-schema" name="defaultSchema" defaultValue={String(initial.defaultSchema || 'BlogPosting')} className="adminSelect">
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
              </select>
            </div>
          </div>
        </div>

        {/* WhatsApp Direct Messaging */}
        <div className="adminCard">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.15rem', margin: '0 0 4px', color: '#128C7E' }}>
            <WhatsAppIcon size={20} /> WhatsApp Direct Communication
          </h3>
          <p className="adminHelpText" style={{ margin: '4px 0 16px' }}>
            Clients can message you directly on WhatsApp through website buttons and inside the AI Chatbot.
          </p>

          <div className="adminFormGrid">
            <div className="field">
              <label htmlFor="set-whatsapp-num">WhatsApp Phone Number (with Country Code)</label>
              <input
                id="set-whatsapp-num"
                name="whatsappNumber"
                defaultValue={String(initial.whatsappNumber || '+8801700000000')}
                placeholder="+8801700000000"
              />
            </div>

            <div className="field">
              <label htmlFor="set-whatsapp-prompt">Default Pre-filled Message</label>
              <input
                id="set-whatsapp-prompt"
                name="whatsappPrompt"
                defaultValue={String(initial.whatsappPrompt || 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.')}
                placeholder="Pre-filled message text"
              />
            </div>
          </div>
        </div>

        {/* Gemini AI Chatbot */}
        <div className="adminCard">
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', color: '#ff6b00' }}>
            🤖 Google Gemini AI Chatbot Configuration
          </h3>
          <p className="adminHelpText" style={{ margin: '4px 0 16px' }}>
            The website chatbot runs a built-in expert responder and uses Google Gemini when your API key is provided.
          </p>

          <div className="adminFormGrid">
            <div className="field">
              <label htmlFor="set-gemini-key">Gemini API Key (Optional)</label>
              <input
                id="set-gemini-key"
                name="geminiApiKey"
                type="password"
                defaultValue={String(initial.geminiApiKey || '')}
                placeholder="AIzaSy..."
              />
            </div>

            <div className="field">
              <label htmlFor="set-gemini-model">Gemini Model</label>
              <select id="set-gemini-model" name="geminiModel" defaultValue={String(initial.geminiModel || 'gemini-1.5-flash')} className="adminSelect">
                <option value="gemini-1.5-flash">gemini-1.5-flash (Fast &amp; Recommended)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Latest Generation)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Profiles */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle" style={{ marginBottom: 14 }}>Professional Freelance &amp; Social Profiles</h3>
          <div className="adminFormGrid">
            <div className="field">
              <label htmlFor="set-upwork" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UpworkIcon size={16} /> Upwork Profile URL
              </label>
              <input
                id="set-upwork"
                name="upwork"
                defaultValue={String(initial.upwork || 'https://www.upwork.com/freelancers/~01ceafed69d95ddfae')}
              />
            </div>

            <div className="field">
              <label htmlFor="set-linkedin" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LinkedInIcon size={16} /> LinkedIn Profile URL
              </label>
              <input
                id="set-linkedin"
                name="linkedIn"
                defaultValue={String(initial.linkedIn || 'https://www.linkedin.com/in/muyeedsifat/')}
              />
            </div>
          </div>
        </div>

        {/* Admin Dashboard Credentials */}
        <div className="adminCard">
          <h3 className="sidebarSectionTitle" style={{ marginBottom: 4 }}>Login Dashboard Credentials</h3>
          <p className="adminHelpText" style={{ margin: '4px 0 16px' }}>
            Manage the username and password used to access <code>/login-dashboard</code>.
          </p>

          <div className="adminFormGrid">
            <div className="field">
              <label htmlFor="set-admin-user">Admin Username</label>
              <input
                id="set-admin-user"
                name="adminUsername"
                defaultValue={String(initial.adminUsername || 'muyeed')}
              />
            </div>

            <div className="field">
              <label htmlFor="set-admin-pass">Admin Password</label>
              <input
                id="set-admin-pass"
                name="adminPassword"
                type="password"
                defaultValue={String(initial.adminPassword || 'ChangeMe!2026')}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btnPrimary" type="submit" disabled={loading} style={{ minWidth: 180 }}>
            {loading ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>

        {message && <div className="adminNotification">{message}</div>}
      </form>
    </div>
  );
}
