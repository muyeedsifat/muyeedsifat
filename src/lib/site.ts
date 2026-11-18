export const siteConfig = {
  name: 'Muyeed',
  fullName: 'Muyeed Sifat',
  role: 'Digital Marketer',
  email: 'muyeedsifatt@gmail.com',
  whatsappNumber: '+8801576624428',
  whatsappPrompt: 'Hi Muyeed, I visited your website and would like to discuss a digital marketing project.',
  description:
    'Digital marketer helping businesses grow with AI SEO, Google Ads and Meta Ads, with WordPress development available as a supporting skill.',
  linkedIn: 'https://www.linkedin.com/in/muyeedsifat/',
  upwork: 'https://www.upwork.com/freelancers/~01ceafed69d95ddfae',
  gbpUrl: 'https://share.google/uEeAi6WLiSSORniNf',
  gbpName: 'M A Muyeed Sifat',
  twitter: 'https://x.com/muyeed_sifat',
  discord: 'https://discord.com/users/1467129420715130883',
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
