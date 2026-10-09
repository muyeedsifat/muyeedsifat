'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        router.replace('/admin');
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'Invalid credentials. Please verify your username and password.');
        setLoading(false);
      }
    } catch {
      setError('Connection failed. Please check your network and try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="formGrid" style={{ gridTemplateColumns: '1fr', gap: '16px' }}>
      <div className="field">
        <label htmlFor="dashboard-username">Username</label>
        <input
          id="dashboard-username"
          name="username"
          required
          autoComplete="username"
          placeholder="e.g. muyeed"
          defaultValue="muyeed"
        />
      </div>

      <div className="field">
        <label htmlFor="dashboard-password">Password</label>
        <input
          id="dashboard-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••••"
        />
      </div>

      <button className="btn btnPrimary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '6px' }}>
        {loading ? 'Authenticating…' : 'Enter Dashboard →'}
      </button>

      {error && (
        <div
          className="notice"
          role="alert"
          style={{ background: '#fef3f2', color: '#b42318', borderColor: '#fecdca', textAlign: 'center' }}
        >
          {error}
        </div>
      )}
    </form>
  );
}
