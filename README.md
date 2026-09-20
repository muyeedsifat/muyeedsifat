# Muyeed Next.js Portfolio + CMS

A production-oriented React/Next.js rebuild of Muyeed's digital marketing portfolio. The site positions **AI SEO, Google Ads and Meta Ads** as the core services, with **WordPress Development** as a supporting skill.

## Stack

- Next.js 16.3.5 App Router
- React 19.2.8
- TypeScript
- Sharp for automated image optimization
- File-backed CMS data for a simple persistent Node/VPS deployment
- Poppins loaded from Google Fonts with `display=swap`

## Public pages

- `/`
- `/services`
- `/services/ai-seo`
- `/services/google-ads`
- `/services/meta-ads`
- `/services/wordpress-development`
- `/projects`
- `/about`
- `/blog`
- `/blog/[slug]`
- `/contact`

## Admin CMS

Admin URL: `/admin`

The CMS includes:

- Secure cookie-based admin authentication
- Posts and drafts
- Gutenberg-style block editor
- Paragraph, H2, H3, list, quote, image and button blocks
- Featured image selection
- Media library
- Automated image filename cleanup, resizing and WebP conversion
- Auto-generated image title/alt suggestions with manual editing
- Categories and tags
- Editable SEO URL slug
- Focus keyword checks
- Meta title and meta description editor
- Character and approximate pixel measurements
- Article / BlogPosting / FAQ / HowTo schema controls
- FAQ schema builder
- Custom JSON-LD field
- Dynamic blog pages, XML sitemap and robots.txt
- Contact-form inquiry storage

## Local setup

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set a unique `ADMIN_PASSWORD` and a random `AUTH_SECRET` of at least 32 characters.
4. Set `NEXT_PUBLIC_SITE_URL` to the final canonical domain before production deployment.
5. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Development login fallback

If environment variables are not set and `NODE_ENV` is not production only:

- Username: `muyeed`
- Password: `ChangeMe!2026`

There is **no production credential fallback**. Production requires `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `AUTH_SECRET`.

## Production

```bash
npm install
npm run build
npm start
```

This project writes CMS content to `data/` and uploaded images to `public/uploads/`. Deploy it on a Node.js server/VPS or another environment with a **persistent writable filesystem**.

For Vercel or another ephemeral/serverless environment, replace the file store with a persistent database and object storage before using the CMS in production.

## SEO implementation

The project includes:

- Server-rendered indexable pages
- Separate crawlable URLs for every service
- Unique title and meta description per primary page
- Canonical URLs
- Open Graph and Twitter metadata
- Semantic headings with one H1 per main page
- Breadcrumb navigation and BreadcrumbList structured data
- Person structured data
- Service structured data
- FAQ structured data on service pages
- BlogPosting / Article structured data on posts
- Editable custom JSON-LD for posts
- Dynamic `sitemap.xml`
- Dynamic `robots.txt`
- Admin and API routes excluded from indexing
- Next.js Image optimization and explicit image dimensions
- Priority loading for the hero image and optimized loading for other imagery
- WebP media conversion for CMS uploads
- Descriptive image alt controls
- Internal linking across services, projects and blog content
- Security headers and disabled `X-Powered-By`
- Responsive layouts

No SEO implementation can guarantee rankings or perfect Lighthouse scores across every hosting environment. Before launch, validate the deployed site in Google Search Console, PageSpeed Insights, Rich Results Test and your preferred crawler after the real domain, analytics and production hosting are configured.

## Important deployment values

Update `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ADMIN_USERNAME=muyeed
ADMIN_PASSWORD=use-a-long-unique-password
AUTH_SECRET=use-at-least-32-random-characters
CMS_DATA_DIR=./data
```
