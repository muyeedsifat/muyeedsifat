import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Muyeed | Digital Marketing',
    short_name: 'Muyeed',
    description: 'AI SEO, Google Ads, Meta Ads and WordPress support.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff7d00',
    icons: [{ src: '/images/favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
  };
}
