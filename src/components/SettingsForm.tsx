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

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // Ensure whatsapp is mirrored
    if (data.whatsappNumber) {
      data.whatsapp = data.whatsappNumber;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      setLoading(false);
      setMessage(res.ok ? 'All settings and WhatsApp number updated successfully!' : 'Could not save settings.');
    } catch {
      setLoading(false);
      setMessage('Failed to update settings.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1150px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
          Settings &amp; Integrations
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
          Manage your WhatsApp contact number, database architecture, Gemini AI assistant, and verified social profiles.
        </p>
      </div>

      {/* Supabase & Database Architecture Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Database Architecture &amp; Storage
              </h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Project Reference: <code>lorzornydwloucbjwewd</code> • Hybrid Zero-Downtime Storage Architecture
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btnSecondary"
              disabled={testingDb}
              onClick={testSupabase}
              style={{ padding: '7px 14px', fontSize: '0.82rem', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: testingDb ? 'spin 1s linear infinite' : 'none' }}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{testingDb ? 'Verifying…' : 'Test Live Connection'}</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/lorzornydwloucbjwewd/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnPrimary"
              style={{ padding: '7px 14px', fontSize: '0.82rem', borderRadius: '7px' }}
            >
              Open Supabase SQL ↗
            </a>
          </div>
        </div>

        {/* Status Pill */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: dbStatus?.status === 'connected' ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${dbStatus?.status === 'connected' ? '#bbf7d0' : '#fde68a'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem', color: dbStatus?.status === 'connected' ? '#166534' : '#92400e' }}>
            <span>{dbStatus?.status === 'connected' ? '● Connected to Supabase Cloud' : '○ Standby Local Storage Active (Zero Downtime Standby)'}</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: dbStatus?.status === 'connected' ? '#15803d' : '#b45309' }}>
            {dbStatus?.message || 'Checking database synchronization…'}
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* WhatsApp Direct Messaging */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <WhatsAppIcon size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#166534' }}>
              WhatsApp Direct Communication
            </h3>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            This number controls all WhatsApp CTA buttons across the website (Header, Footer, Contact Page, and AI Chatbot).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="set-whatsapp-num" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                id="set-whatsapp-num"
                name="whatsappNumber"
                defaultValue={String(initial.whatsappNumber || '+8801576624428')}
                placeholder="+8801576624428"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.92rem', fontWeight: 700, border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#0f172a' }}
              />
            </div>

            <div>
              <label htmlFor="set-whatsapp-prompt" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Default Pre-filled Message
              </label>
              <input
                id="set-whatsapp-prompt"
                name="whatsappPrompt"
                defaultValue={String(initial.whatsappPrompt || 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.')}
                placeholder="Pre-filled message text"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* General Identity & Business Profile */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            General Identity &amp; Meta
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            Author name, default schema types, and contact email.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="set-sitename" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Site Name
              </label>
              <input
                id="set-sitename"
                name="siteName"
                defaultValue={String(initial.siteName || 'Muyeed')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-author" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Author / Professional Name
              </label>
              <input
                id="set-author"
                name="authorName"
                defaultValue={String(initial.authorName || 'Muyeed Sifat')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Inquiry Email Address
              </label>
              <input
                id="set-email"
                name="email"
                type="email"
                defaultValue={String(initial.email || 'muyeedsifatt@gmail.com')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-schema" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Default SEO Schema Type
              </label>
              <select
                id="set-schema"
                name="defaultSchema"
                defaultValue={String(initial.defaultSchema || 'BlogPosting')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff' }}
              >
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics, Tracking & Search Console Integrations */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Web Analytics &amp; Tracking Integrations
            </h3>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            Manage Google Search Console verification, Google Tag Manager, Google Analytics 4, and Microsoft Clarity.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* GSC Verification */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="set-gsc" style={{ fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>
                  Google Search Console Verification Tag / Token
                </label>
                <span style={{ fontSize: '0.74rem', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Active in &lt;head&gt;
                </span>
              </div>
              <input
                id="set-gsc"
                name="gscVerification"
                defaultValue={String(initial.gscVerification || '5388e14e0b0d0a6d')}
                placeholder="5388e14e0b0d0a6d or <meta name=&quot;google-site-verification&quot; content=&quot;...&quot; />"
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                Enter your GSC verification token or paste the entire meta tag snippet provided by Google Search Console. The verification file <code>/google5388e14e0b0d0a6d.html</code> is also permanently hosted at root.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* GTM Container ID */}
              <div>
                <label htmlFor="set-gtm" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                  Google Tag Manager (GTM) Container ID
                </label>
                <input
                  id="set-gtm"
                  name="gtmId"
                  defaultValue={String(initial.gtmId || 'GTM-KX4NGRXH')}
                  placeholder="GTM-XXXXXXX"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              {/* GA4 Measurement ID */}
              <div>
                <label htmlFor="set-ga4" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                  Google Analytics 4 (GA4) Measurement ID
                </label>
                <input
                  id="set-ga4"
                  name="ga4Id"
                  defaultValue={String(initial.ga4Id || 'G-6DXKYVGLVG')}
                  placeholder="G-XXXXXXXXXX"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              {/* Microsoft Clarity Project ID */}
              <div>
                <label htmlFor="set-clarity" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                  Microsoft Clarity Project ID
                </label>
                <input
                  id="set-clarity"
                  name="clarityId"
                  defaultValue={String(initial.clarityId || '')}
                  placeholder="e.g. j1k2l3m4n5"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              {/* Meta Pixel ID */}
              <div>
                <label htmlFor="set-meta-pixel" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                  Meta (Facebook) Pixel ID (Optional)
                </label>
                <input
                  id="set-meta-pixel"
                  name="metaPixelId"
                  defaultValue={String(initial.metaPixelId || '')}
                  placeholder="e.g. 123456789012345"
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Chatbot */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Google Gemini AI Chatbot Configuration
            </h3>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            The website chatbot runs a built-in expert responder and uses Google Gemini when your API key is provided.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="set-gemini-key" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Gemini API Key (Optional)
              </label>
              <input
                id="set-gemini-key"
                name="geminiApiKey"
                type="password"
                defaultValue={String(initial.geminiApiKey || '')}
                placeholder="AIzaSy..."
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-psi-key" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Google Cloud API Key (for PageSpeed Insights)
              </label>
              <input
                id="set-psi-key"
                name="pagespeedApiKey"
                type="password"
                defaultValue={String(initial.pagespeedApiKey || '')}
                placeholder="AIzaSy..."
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-gemini-model" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Gemini Model
              </label>
              <select
                id="set-gemini-model"
                name="geminiModel"
                defaultValue={String(initial.geminiModel || 'gemini-1.5-flash')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff' }}
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (Fast &amp; Recommended)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Latest Generation)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Freelance & Social Profiles */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Professional Profiles &amp; External Links
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            Direct links used across the footer, about page, and contact options.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="set-upwork" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                <UpworkIcon size={16} /> Upwork Profile URL
              </label>
              <input
                id="set-upwork"
                name="upwork"
                defaultValue={String(initial.upwork || 'https://www.upwork.com/freelancers/~01ceafed69d95ddfae')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-linkedin" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                <LinkedInIcon size={16} /> LinkedIn Profile URL
              </label>
              <input
                id="set-linkedin"
                name="linkedIn"
                defaultValue={String(initial.linkedIn || 'https://www.linkedin.com/in/muyeedsifat/')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Admin Credentials */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Admin Dashboard Credentials
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
            Manage the username and password used to access <code>/login-dashboard</code>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="set-admin-user" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Admin Username
              </label>
              <input
                id="set-admin-user"
                name="adminUsername"
                defaultValue={String(initial.adminUsername || 'muyeed')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label htmlFor="set-admin-pass" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '6px' }}>
                Admin Password
              </label>
              <input
                id="set-admin-pass"
                name="adminPassword"
                type="password"
                defaultValue={String(initial.adminPassword || 'ChangeMe!2026')}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            className="btn btnPrimary"
            type="submit"
            disabled={loading}
            style={{ minWidth: '200px', height: '44px', fontSize: '0.94rem', borderRadius: '8px' }}
          >
            {loading ? 'Saving Changes…' : 'Save All Settings'}
          </button>
        </div>

        {message && (
          <div style={{ padding: '14px 18px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
