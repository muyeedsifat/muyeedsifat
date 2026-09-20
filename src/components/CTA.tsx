import Image from 'next/image';
import Link from 'next/link';

export function CTA({ title = 'Ready to Grow Your Digital Marketing?', text = 'Tell me what you want to improve and I’ll help identify the right digital marketing approach.' }: { title?: string; text?: string }) {
  return (
    <section className="section sectionOrangeSoft">
      <div className="container">
        <div className="ctaWrap">
          <div>
            <span className="eyebrow">Let&apos;s Work Together</span>
            <h2>{title}</h2>
            <p>{text}</p>
            <Link className="btn btnPrimary" href="/contact">Let&apos;s Talk</Link>
          </div>
          <div className="ctaMedia">
            <Image src="/images/cta-muyeed.webp" alt="" width={900} height={1125} sizes="(max-width: 800px) 100vw, 340px" />
          </div>
        </div>
      </div>
    </section>
  );
}
