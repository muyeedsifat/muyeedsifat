import Image from 'next/image';
import Link from 'next/link';
import type { ContentBlock } from '@/types/content';

function hasHtmlTags(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function ArticleBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="articleContent">
      {blocks.map((block) => {
        if (block.type === 'paragraph') {
          if (hasHtmlTags(block.text)) {
            return (
              <div
                key={block.id}
                className="richHtmlBlock"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }
          return <p key={block.id}>{block.text}</p>;
        }

        if (block.type === 'h2') {
          if (hasHtmlTags(block.text)) {
            return (
              <h2
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }
          return <h2 key={block.id}>{block.text}</h2>;
        }

        if (block.type === 'h3') {
          if (hasHtmlTags(block.text)) {
            return (
              <h3
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }
          return <h3 key={block.id}>{block.text}</h3>;
        }

        if (block.type === 'quote') {
          if (hasHtmlTags(block.text)) {
            return (
              <blockquote
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }
          return <blockquote key={block.id}>{block.text}</blockquote>;
        }

        if (block.type === 'list') {
          return (
            <ul key={block.id}>
              {block.items.map((item, index) =>
                hasHtmlTags(item) ? (
                  <li
                    key={`${block.id}-${index}`}
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ) : (
                  <li key={`${block.id}-${index}`}>{item}</li>
                )
              )}
            </ul>
          );
        }

        if (block.type === 'button') {
          return (
            <p key={block.id}>
              <Link href={block.url} className="btn btnPrimary">
                {block.text}
              </Link>
            </p>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={block.id}>
              <Image
                src={block.url}
                alt={block.alt || 'Post image'}
                width={1200}
                height={800}
                sizes="(max-width: 900px) 100vw, 820px"
                unoptimized={block.url.endsWith('.svg') || block.url.startsWith('http')}
              />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
