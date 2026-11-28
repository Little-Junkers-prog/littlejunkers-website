import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import FaqSearch from "@/components/FaqSearch";
import JsonLd from "@/components/JsonLd";
import { company, smsHref, telHref } from "@/lib/company";
import { buildFaqs } from "@/lib/faqs";
import { getPricing } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Dumpster Rental FAQ",
  description:
    "Straight answers about renting a Little Junkers dumpster: cost, sizes, delivery, weight, what can go in, driveways and service area.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const groups = buildFaqs(await getPricing());
  const all = groups.flatMap((group) => group.items);
  const top = all.filter((item) => item.top);

  return (
    <>
      <Breadcrumbs trail={[{ label: "FAQ", href: "/faq" }]} />

      <section className="page-hero">
        <div className="container">
          <h1>
            Questions, <span className="accent">answered.</span>
          </h1>
          <FaqSearch />
          <ul className="chips" aria-label="Topics" style={{ marginTop: 8 }}>
            {groups.map((group) => (
              <li key={group.id}>
                <a className="chip" href={`#${group.id}`}>
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Top 5 questions</h2>
          </div>
          <FaqList items={top.map((item) => ({ ...item, id: `top-${item.id}` }))} />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container" id="faq-groups">
          {groups.map((group) => (
            <div key={group.id} id={group.id} data-faq-group style={{ marginBottom: 32, scrollMarginTop: 80 }}>
              <h2 style={{ marginBottom: 12 }}>{group.title}</h2>
              <FaqList items={group.items} />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="callout">
            <div>
              <h2>Still stuck?</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                Call or text {company.phoneDisplay}, {company.hoursDisplay}.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn--secondary" href={telHref}>
                Call
              </a>
              <a className="btn btn--secondary" href={smsHref}>
                Text
              </a>
              <Link className="btn btn--primary" href="/plan">
                See my estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: all.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  );
}
