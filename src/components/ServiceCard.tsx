import Link from 'next/link';

export function ServiceCard({ icon, title, description, href, supporting = false }: { icon: string; title: string; description: string; href: string; supporting?: boolean }) {
  return (
    <Link href={href} className={`card serviceCard serviceCardLink ${supporting ? 'supportingCard' : ''}`}>
      <div className="iconBox">{icon}</div>
      {supporting && <span className="tag">Supporting skill</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="textLink">Explore {title} <span aria-hidden="true">→</span></span>
    </Link>
  );
}
