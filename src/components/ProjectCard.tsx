import Image from 'next/image';

export function ProjectCard({
  category,
  title,
  description,
  result,
  client,
  metrics,
  featuredImage,
  featuredAlt,
  index = 0
}: {
  category: string;
  title: string;
  description: string;
  result?: string;
  client?: string;
  metrics?: { label: string; value: string }[];
  featuredImage?: string;
  featuredAlt?: string;
  index?: number;
}) {
  return (
    <article className="card projectCard" style={{ display: 'flex', flexDirection: 'column' }}>
      {featuredImage ? (
        <div
          className="projectVisual"
          style={{
            position: 'relative',
            padding: 0,
            overflow: 'hidden',
            background: '#141414'
          }}
        >
          <Image
            src={featuredImage}
            alt={featuredAlt || title}
            width={600}
            height={340}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            unoptimized
          />
          <span
            className="tag"
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              margin: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {category}
          </span>
        </div>
      ) : (
        <div className={`projectVisual visual${index % 3}`} aria-hidden="true">
          <span>{category}</span>
        </div>
      )}

      {!featuredImage && <span className="tag">{category}</span>}

      {client && (
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', fontWeight: 700, marginBottom: 4 }}>
          {client}
        </span>
      )}

      <h3 style={{ margin: '4px 0 10px', fontSize: '1.25rem' }}>{title}</h3>
      {/<[a-z][\s\S]*>/i.test(description) ? (
        <div
          style={{ fontSize: '0.92rem', color: 'var(--muted)', flexGrow: 1, lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', flexGrow: 1 }}>{description}</p>
      )}

      {metrics && metrics.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 6px' }}>
          {metrics.map((m, i) => (
            <span
              key={i}
              style={{
                background: 'var(--orange-soft)',
                color: 'var(--orange-dark)',
                fontSize: '0.78rem',
                fontWeight: 750,
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              {m.label}: <strong>{m.value}</strong>
            </span>
          ))}
        </div>
      )}

      {result && <p className="projectResult">{result}</p>}
    </article>
  );
}
