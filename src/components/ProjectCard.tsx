export function ProjectCard({ category, title, description, result, index = 0 }: { category: string; title: string; description: string; result?: string; index?: number }) {
  return (
    <article className="card projectCard">
      <div className={`projectVisual visual${index % 3}`} aria-hidden="true"><span>{category}</span></div>
      <span className="tag">{category}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {result && <p className="projectResult">{result}</p>}
    </article>
  );
}
