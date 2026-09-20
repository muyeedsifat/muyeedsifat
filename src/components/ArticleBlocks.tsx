import Image from 'next/image';
import Link from 'next/link';
import type { ContentBlock } from '@/types/content';

export function ArticleBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="articleContent">
      {blocks.map((block) => {
        if (block.type === 'paragraph') return <p key={block.id}>{block.text}</p>;
        if (block.type === 'h2') return <h2 key={block.id}>{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={block.id}>{block.text}</h3>;
        if (block.type === 'quote') return <blockquote key={block.id}>{block.text}</blockquote>;
        if (block.type === 'list') return <ul key={block.id}>{block.items.map((item, index) => <li key={`${block.id}-${index}`}>{item}</li>)}</ul>;
        if (block.type === 'button') return <p key={block.id}><Link href={block.url} className="btn btnPrimary">{block.text}</Link></p>;
        if (block.type === 'image') return (
          <figure key={block.id}>
            <Image src={block.url} alt={block.alt} width={1200} height={800} sizes="(max-width: 900px) 100vw, 820px" />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        );
        return null;
      })}
    </div>
  );
}
