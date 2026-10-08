import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CTA } from '@/components/CTA';
import { ServiceCard } from '@/components/ServiceCard';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Muyeed | Digital Marketer for AI SEO, Google Ads & Meta Ads',
  description: 'Digital marketer helping businesses grow with AI SEO, Google Ads and Meta Ads, with WordPress development available as a supporting skill.',
  path: '/'
});

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container heroGrid">
          <div className="heroCopy">
            <span className="eyebrow">Digital Marketing • AI SEO • PPC</span>
            <h1 className="heroTitle">
              <span className="heroLine1">Digital Marketing That</span>
              <span className="heroLine2">Drives Growth</span>
            </h1>
            <p className="lead">I help businesses grow through AI SEO, Google Ads and Meta Ads. When the website or landing page needs improvement too, I can handle the WordPress side as well.</p>
            <div className="btnRow"><Link className="btn btnPrimary" href="/contact">Let&apos;s Talk</Link><Link className="btn btnSecondary" href="/projects">View Projects</Link></div>
          </div>
          <div className="heroMedia">
            <div className="heroCircleBackdrop" aria-hidden="true" />
            <div className="heroCircleClip">
              <Image
                className="heroAvatarImg"
                src="/images/hero-muyeed.webp"
                alt="Muyeed Sifat, digital marketer specializing in AI SEO, Google Ads and Meta Ads"
                width={900}
                height={1125}
                priority
                sizes="(max-width: 980px) 100vw, 46vw"
              />
            </div>
            <div className="heroAvatarHeadPop" aria-hidden="true">
              <Image
                className="heroAvatarImg"
                src="/images/hero-muyeed.webp"
                alt=""
                width={900}
                height={1125}
                priority
                sizes="(max-width: 980px) 100vw, 46vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="trust"><div className="container trustGrid"><div className="trustItem">SEO</div><div className="trustItem">AI Search Visibility</div><div className="trustItem">Google Ads</div><div className="trustItem">Meta Ads</div><div className="trustItem">Conversion Strategy</div></div></section>

      <section className="section">
        <div className="container">
          <div className="center"><span className="eyebrow">Core Services</span><h2>Digital Marketing Services for Growth</h2><p className="lead">My main work sits across organic visibility and paid acquisition, so search, AI visibility and advertising can support the same business goal.</p></div>
          <div className="grid3" style={{ marginTop: 36 }}>
            <ServiceCard icon="AI" title="AI SEO" description="SEO, AEO and GEO strategies for stronger visibility across Google Search, AI Overviews and answer engines." href="/services/ai-seo" />
            <ServiceCard icon="G" title="Google Ads" description="High-intent search campaigns built around qualified traffic, conversion tracking and ongoing optimization." href="/services/google-ads" />
            <ServiceCard icon="M" title="Meta Ads" description="Facebook and Instagram campaigns focused on audience targeting, creative testing, retargeting and conversions." href="/services/meta-ads" />
          </div>
          <div className="supportSkill"><div><span className="tag">Supporting Skill</span><h3>WordPress Development When the Website Needs Work</h3><p>I also build and improve WordPress websites and landing pages when the marketing strategy needs a faster, clearer conversion path.</p></div><Link className="btn btnSecondary" href="/services/wordpress-development">View WordPress</Link></div>
        </div>
      </section>

      <section className="section sectionSoft"><div className="container"><span className="eyebrow">Selected Work</span><h2>Marketing Projects and Results</h2><div className="grid3" style={{ marginTop: 30 }}>{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.title} {...project} index={index} />)}</div><div className="btnRow" style={{ justifyContent: 'center' }}><Link className="btn btnSecondary" href="/projects">View All Projects</Link></div></div></section>

      <section className="section"><div className="container whyLayout"><div className="whyMedia"><Image src="/images/why-muyeed.webp" alt="Muyeed reviewing digital marketing work on a laptop" width={900} height={1125} sizes="(max-width: 980px) 100vw, 42vw" /></div><div><span className="eyebrow">Why Work With Me</span><h2>One Strategy Across Search and Paid Media</h2><p className="lead">I work across organic search, AI visibility and paid advertising, then use WordPress when the website itself becomes the conversion bottleneck.</p><div className="reasonList"><div className="reason"><span className="reasonNum">01</span><div><h3>Digital marketing first</h3><p>AI SEO, Google Ads and Meta Ads are the core services, not disconnected add-ons.</p></div></div><div className="reason"><span className="reasonNum">02</span><div><h3>Strategy plus implementation</h3><p>I can move from analysis and planning into hands-on optimization and execution.</p></div></div><div className="reason"><span className="reasonNum">03</span><div><h3>Website support when needed</h3><p>WordPress development supports the marketing work when landing pages, speed or structure need improvement.</p></div></div></div></div></div></section>
      <section className="section sectionSoft"><div className="container"><div className="center"><span className="eyebrow">Client Feedback</span><h2>What Clients Say About Working With Me</h2><p className="lead">Real feedback from founders, e-commerce brands, and growth teams across SEO, paid media, and web optimization.</p></div><div className="grid4" style={{marginTop:32}}><article className="card testimonialCard"><div className="testimonialHeader"><span className="tag">AI SEO</span><span className="testimonialStars" aria-label="5 stars">★★★★★</span></div><p className="testimonialText">&ldquo;Muyeed revamped our content and technical graph for both Google and AI Overviews. Organic impressions doubled within 3 months, and we regularly appear as cited sources in Perplexity and ChatGPT.&rdquo;</p><div className="testimonialAuthor"><strong>Liam Vance</strong><span>Founder, SaaSify Metrics</span></div></article><article className="card testimonialCard"><div className="testimonialHeader"><span className="tag">Google Ads</span><span className="testimonialStars" aria-label="5 stars">★★★★★</span></div><p className="testimonialText">&ldquo;Restructured our search campaigns from the ground up and eliminated thousands in wasted search terms. Our cost per lead dropped by 38% while qualified inbound calls increased consistently.&rdquo;</p><div className="testimonialAuthor"><strong>Marcus Reed</strong><span>E-Commerce Director, Apex Gear</span></div></article><article className="card testimonialCard"><div className="testimonialHeader"><span className="tag">Meta Ads</span><span className="testimonialStars" aria-label="5 stars">★★★★★</span></div><p className="testimonialText">&ldquo;The creative testing process and audience angles Muyeed built scaled our Facebook and Instagram campaigns to a steady 3.4x ROAS. Fast communication, transparent reporting, and zero fluff.&rdquo;</p><div className="testimonialAuthor"><strong>Sarah Jenkins</strong><span>Head of Growth, Aura Living</span></div></article><article className="card testimonialCard"><div className="testimonialHeader"><span className="tag">WordPress</span><span className="testimonialStars" aria-label="5 stars">★★★★★</span></div><p className="testimonialText">&ldquo;Our website had terrible Core Web Vitals and slow page speed. Muyeed cleaned up the site architecture and optimized our landing pages, which brought mobile conversion up by 22%.&rdquo;</p><div className="testimonialAuthor"><strong>David Chen</strong><span>Managing Partner, Nexa Consulting</span></div></article></div></div></section>
      <CTA />
    </>
  );
}
