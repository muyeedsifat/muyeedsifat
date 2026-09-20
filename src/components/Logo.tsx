import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Muyeed home">
      <span className="brandMark" aria-hidden="true">M</span>
      <span className="brandDivider" aria-hidden="true">|</span>
      <span>Muyeed</span>
    </Link>
  );
}
