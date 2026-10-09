import type { Metadata } from 'next';
import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login Dashboard | Muyeed Sifat',
  description: 'Secure management portal for digital marketing services, case studies, blog posts, and chatbot logs.',
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginDashboardPage() {
  return (
    <main className="loginPage">
      <div className="loginCard">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 12 }}>
          <span className="brandMark">M</span>
          <span className="brandDivider">|</span>
          <span>Muyeed Management Portal</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.85rem', margin: '10px 0 6px' }}>Login Dashboard</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            Sign in to manage your posts, pages, case studies, media, and chat conversations.
          </p>
        </div>

        <AdminLoginForm />

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', textAlign: 'center', fontSize: '0.82rem', color: '#888' }}>
          <p style={{ margin: '0 0 6px' }}>Default access: <code>muyeed</code> / <code>ChangeMe!2026</code></p>
          <p style={{ margin: 0 }}>
            <a href="/" style={{ color: 'var(--orange-dark)', fontWeight: 600 }}>← Return to Website</a>
          </p>
        </div>
      </div>
    </main>
  );
}
