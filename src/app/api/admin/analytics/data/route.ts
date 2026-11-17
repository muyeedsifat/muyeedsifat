import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getServiceAccountCredentials() {
  const envKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      return JSON.parse(envKey);
    } catch {
      return null;
    }
  }
  return null;
}

async function getGoogleToken(keyData: { client_email: string; private_key: string }) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64ClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signInput = `${b64Header}.${b64ClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(keyData.private_key, 'base64url');
  const jwt = `${signInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenRes.ok) {
    throw new Error(`Token exchange failed: ${tokenRes.status}`);
  }

  const data = (await tokenRes.json()) as { access_token: string };
  return data.access_token;
}

export async function GET(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const creds = getServiceAccountCredentials();
  if (!creds || !creds.client_email || !creds.private_key) {
    return NextResponse.json({
      configured: false,
      message: 'GOOGLE_SERVICE_ACCOUNT_KEY is not configured in Vercel environment variables.'
    });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const days = range === '7d' ? 7 : range === '14d' ? 14 : range === '90d' ? 90 : 30;

  try {
    const token = await getGoogleToken(creds);
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 1. GA4 Overview Report
    const ga4OverviewPromise = fetch('https://analyticsdata.googleapis.com/v1beta/properties/564789966:runReport', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'keyEvents' },
          { name: 'bounceRate' }
        ]
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    // 2. GA4 Realtime Events
    const ga4RealtimePromise = fetch('https://analyticsdata.googleapis.com/v1beta/properties/564789966:runRealtimeReport', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        metrics: [{ name: 'eventCount' }],
        dimensions: [{ name: 'eventName' }]
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    // 3. GA4 Traffic Acquisition
    const ga4TrafficPromise = fetch('https://analyticsdata.googleapis.com/v1beta/properties/564789966:runReport', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'keyEvents' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    // 4. Google Search Console Performance
    const now = new Date();
    const endDateStr = now.toISOString().split('T')[0];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const startDateStr = startDate.toISOString().split('T')[0];

    const siteUrl = encodeURIComponent('https://muyeedsifat.vercel.app/');

    const gscOverviewPromise = fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['date'],
        rowLimit: 90
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    // 5. GSC Top Queries
    const gscQueriesPromise = fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['query'],
        rowLimit: 10
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    // 6. GSC Top Pages
    const gscPagesPromise = fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['page'],
        rowLimit: 10
      })
    })
      .then((r) => r.json())
      .catch(() => ({}));

    const [ga4Overview, ga4Realtime, ga4Traffic, gscOverview, gscQueries, gscPages] = await Promise.all([
      ga4OverviewPromise,
      ga4RealtimePromise,
      ga4TrafficPromise,
      gscOverviewPromise,
      gscQueriesPromise,
      gscPagesPromise
    ]);

    return NextResponse.json({
      configured: true,
      range,
      ga4: {
        overview: ga4Overview,
        realtime: ga4Realtime,
        traffic: ga4Traffic
      },
      gsc: {
        overview: gscOverview,
        queries: gscQueries,
        pages: gscPages
      }
    });
  } catch (err) {
    return NextResponse.json(
      {
        configured: true,
        error: 'api_fetch_failed',
        message: err instanceof Error ? err.message : 'Failed to query Google APIs'
      },
      { status: 500 }
    );
  }
}
