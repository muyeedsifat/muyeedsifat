'use client';

import { FormEvent, useState } from 'react';
import { WhatsAppIcon, UpworkIcon, LinkedInIcon } from '@/components/Icons';

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    setLoading(false);
    setMessage(res.ok ? 'Settings updated successfully!' : 'Could not save settings.');
  }

  return (
    <div className="adminCard">
      <span className="eyebrow">CMS &amp; Platform Configuration</span>
      <h1 style={{ fontSize: '2rem', margin: '4px 0 20px' }}>Site &amp; Integration Settings</h1>

      <form onSubmit={submit} className="formGrid" style={{ gap: '20px' }}>
        {/* Core Profile */}
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
          <select id="set-schema" name="defaultSchema" defaultValue={String(initial.defaultSchema || 'BlogPosting')}>
            <option value="BlogPosting">BlogPosting</option>
            <option value="Article">Article</option>
          </select>
        </div>

        {/* WhatsApp Communication */}
        <div className="field fieldFull" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.15rem', margin: '0 0 4px', color: '#128C7E' }}>
            <WhatsAppIcon size={20} /> WhatsApp Direct Communication
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>
            Clients can message you directly on WhatsApp through website buttons and inside the AI Chatbot.
          </p>
        </div>

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
          <label htmlFor="set-whatsapp-prompt">Default Pre-filled WhatsApp Message</label>
          <input
            id="set-whatsapp-prompt"
            name="whatsappPrompt"
            defaultValue={String(initial.whatsappPrompt || 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.')}
            placeholder="Pre-filled message text"
          />
        </div>

        {/* Gemini AI Chatbot */}
        <div className="field fieldFull" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px', color: 'var(--orange-dark)' }}>
            🤖 Google Gemini AI Chatbot
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>
            The website chatbot runs a built-in expert responder and can connect to your personal Gemini API key for dynamic reasoning.
          </p>
        </div>

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
          <select id="set-gemini-model" name="geminiModel" defaultValue={String(initial.geminiModel || 'gemini-1.5-flash')}>
            <option value="gemini-1.5-flash">gemini-1.5-flash (Fast &amp; Recommended)</option>
            <option value="gemini-2.0-flash">gemini-2.0-flash (Latest Generation)</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
          </select>
        </div>

        {/* Professional Profiles */}
        <div className="field fieldFull" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px' }}>Professional Profiles</h3>
        </div>

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

        {/* Admin Credentials */}
        <div className="field fieldFull" style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px' }}>Login Dashboard Credentials</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>
            Customize your login details for <a href="/login-dashboard" target="_blank" style={{ color: 'var(--orange-dark)' }}>/login-dashboard</a>.
          </p>
        </div>

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

        <div className="field fieldFull" style={{ marginTop: 10 }}>
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save All Settings'}
          </button>
          {message && <p className="statusMessage" style={{ color: '#027a48', fontWeight: 600 }}>{message}</p>}
        </div>
      </form>
    </div>
  );
}
