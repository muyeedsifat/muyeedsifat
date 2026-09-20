import Link from 'next/link';

export function ServiceCard({ icon, title, description, href, supporting = false }: { icon: string; title: string; description: string; href: string; supporting?: boolean }) {
  return (
    <article className={`card serviceCard ${supporting ? 'supportingCard' : ''}`}>
      <div className="iconBox">{icon}</div>
      {supporting && <span className="tag">Supporting skill</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="textLink" href={href}>Explore {title} <span aria-hidden="true">→</span></Link>
    </article>
  );
}
