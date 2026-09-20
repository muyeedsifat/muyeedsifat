'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true); setStatus('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    setSending(false);
    if (response.ok) { setStatus('Thanks. Your inquiry has been received.'); form.reset(); }
    else setStatus(result.error || 'Could not send your inquiry. Please email me directly.');
  }

  return (
    <form onSubmit={submit} className="formGrid">
      <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required autoComplete="name" /></div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      <div className="field"><label htmlFor="website">Website</label><input id="website" name="website" type="url" placeholder="https://" /></div>
      <div className="field"><label htmlFor="service">Service</label><select id="service" name="service"><option>AI SEO</option><option>Google Ads</option><option>Meta Ads</option><option>WordPress Development</option><option>Custom Digital Marketing</option></select></div>
      <div className="field fieldFull" style={{ display: 'none' }} aria-hidden="true"><label htmlFor="company_url">Company URL</label><input id="company_url" name="company_url" tabIndex={-1} autoComplete="off" /></div>
      <div className="field fieldFull"><label htmlFor="message">Project Details</label><textarea id="message" name="message" required placeholder="Tell me what you want to improve, what you have already tried, and the result you want." /></div>
      <div className="field fieldFull"><button className="btn btnPrimary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send Inquiry'}</button>{status && <p className="statusMessage" role="status">{status}</p>}</div>
    </form>
  );
}
