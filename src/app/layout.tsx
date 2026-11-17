import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import { getSiteUrl, siteConfig } from '@/lib/site';
import { getSettings } from '@/lib/store';

function parseGscVerification(raw?: string | null): string {
  if (!raw) return '5388e14e0b0d0a6d';
  const trimmed = raw.trim();
  if (!trimmed) return '5388e14e0b0d0a6d';
  const match = trimmed.match(/content=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return trimmed.replace(/^["']|["']$/g, '');
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: { default: 'Muyeed | Digital Marketer for AI SEO, Google Ads & Meta Ads', template: '%s | Muyeed' },
    description: siteConfig.description,
    applicationName: 'Muyeed',
    category: 'Digital Marketing',
    icons: { icon: '/images/favicon.svg' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
  };

  const gscCode = parseGscVerification(settings?.gscVerification);
  if (gscCode) {
    metadata.verification = {
      google: gscCode
    };
  }

  return metadata;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings().catch(() => null);

  const gtmId = typeof settings?.gtmId === 'string' ? settings.gtmId.trim() : '';
  const ga4Id = typeof settings?.ga4Id === 'string' ? settings.ga4Id.trim() : '';
  const clarityId = typeof settings?.clarityId === 'string' ? settings.clarityId.trim() : '';
  const metaPixelId = typeof settings?.metaPixelId === 'string' ? settings.metaPixelId.trim() : '';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Google Tag Manager in <head> for immediate discovery and GSC verification */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`
            }}
          />
        )}

        {/* Google Analytics 4 (GA4 in <head>) */}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');`
              }}
            />
          </>
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript fallback immediately after opening body tag) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Microsoft Clarity */}
        {clarityId && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}

        {/* Meta (Facebook) Pixel */}
        {metaPixelId && (
          <Script id="meta-pixel-script" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');`}
          </Script>
        )}

        {children}
      </body>
    </html>
  );
}
