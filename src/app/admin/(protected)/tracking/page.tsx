import type { Metadata } from 'next';
import { getSettings } from '@/lib/store';
import { TrackingSettingsForm } from '@/components/TrackingSettingsForm';

export const metadata: Metadata = {
  title: 'Tracking & Analytics Setup | Muyeed Admin'
};

export const dynamic = 'force-dynamic';

export default async function TrackingPage() {
  const settings = await getSettings();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <span className="eyebrow">Marketing Analytics</span>
        <h1 style={{ fontSize: '2.2rem', margin: '4px 0 8px' }}>Tracking &amp; Pixels Setup</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.94rem', margin: 0, maxWidth: '640px' }}>
          Connect your marketing measurement tools in one place. Simply paste your IDs below, and the tags will automatically be injected across all pages of your live website.
        </p>
      </div>

      <TrackingSettingsForm initial={settings as Record<string, unknown>} />
    </div>
  );
}