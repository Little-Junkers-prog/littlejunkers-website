import Link from "next/link";

export type FaqItem = { id?: string; q: string; a: string; link?: { href: string; label: string } };

// Native <details>: answers stay in the HTML for crawlers and work without script.
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.id ?? item.q} id={item.id} data-faq={`${item.q} ${item.a}`.toLowerCase()}>
          <summary>{item.q}</summary>
          <div className="faq__answer">
            <p>{item.a}</p>
            {item.link ? (
              <p style={{ marginTop: 8 }}>
                <Link href={item.link.href}>{item.link.label}</Link>
              </p>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
