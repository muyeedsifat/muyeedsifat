export const siteConfig = {
  name: 'Muyeed',
  fullName: 'Muyeed Sifat',
  role: 'Digital Marketer',
  email: 'muyeedsifatt@gmail.com',
  description:
    'Digital marketer helping businesses grow with AI SEO, Google Ads and Meta Ads, with WordPress development available as a supporting skill.',
  linkedIn: 'https://www.linkedin.com/in/muyeedsifat/',
  upwork: 'https://www.upwork.com/freelancers/~01ceafed69d95ddfae',
  services: ['AI SEO', 'Google Ads', 'Meta Ads'],
  supportingSkill: 'WordPress Development'
} as const;

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return 'https://' + process.env.VERCEL_URL.replace(/\/$/, '');
  }
  return 'https://muyeedsifat.vercel.app';
}

export function absoluteUrl(path = '/') {
  return getSiteUrl() + (path.startsWith('/') ? path : '/' + path);
}
