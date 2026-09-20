export function FAQ({ title, faqs }: { title: string; faqs: { question: string; answer: string }[] }) {
  return (
    <section className="section sectionSoft">
      <div className="container narrow center">
        <span className="eyebrow">FAQ</span>
        <h2>{title}</h2>
        <div className="faqList">
          {faqs.map((faq) => (
            <details key={faq.question} className="faqItem">
              <summary>{faq.question}<span aria-hidden="true">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
