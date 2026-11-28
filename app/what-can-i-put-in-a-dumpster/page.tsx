import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import MaterialSearch from "@/components/MaterialSearch";
import { smsHref } from "@/lib/company";
import { byStatus, type Material } from "@/lib/materials";
import { sizes } from "@/lib/sizes";

export const metadata: Metadata = {
  title: "What Can I Put in a Dumpster? Do's and Don'ts",
  description:
    "What you can and can't put in a Little Junkers dumpster: furniture, wood, drywall and shingles are fine. Dirt, concrete and hazardous items are not. Look up any item.",
  alternates: { canonical: "/what-can-i-put-in-a-dumpster" },
};

const faqs = [
  { q: "Can I put furniture in the dumpster?", a: "Yes. Couches, tables, dressers and other household furniture are fine." },
  { q: "Can I put roofing shingles in the dumpster?", a: "Yes. They're heavy, so check the weight before you book a roofing job." },
  {
    q: "What should I do with batteries, oil, or paint?",
    a: "Keep batteries and motor oil out of the dumpster. Set them outside at the front and tell us, and we'll coordinate recycling. Oil is limited to 10 quarts in sealed containers. Paint is fine if it's dried out or tightly sealed.",
  },
  {
    q: "What items are not accepted?",
    a: "Dirt, concrete, compressed cylinders like helium tanks and fire extinguishers, hazardous chemicals, and wet or leaking paint.",
  },
];

function ItemCard({ item }: { item: Material }) {
  return (
    <div className="item-card">
      {item.photo ? (
        <div className="item-card__photo">
          <Image src={item.photo.src} alt={item.photo.alt} width={item.photo.width} height={item.photo.height} sizes="(min-width: 900px) 25vw, 50vw" />
        </div>
      ) : null}
      <div className="item-card__body">
        <h3>{item.name}</h3>
        {item.note ? <p>{item.note}</p> : null}
      </div>
    </div>
  );
}

export default function Materials() {
  const allowed = byStatus("yes");
  const instructions = byStatus("instructions");
  const prohibited = byStatus("no");

  return (
    <>
      <Breadcrumbs trail={[{ label: "What Can I Put in a Dumpster?", href: "/what-can-i-put-in-a-dumpster" }]} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">What can I put in a dumpster?</p>
          <h1>
            Can I toss <span className="accent">this?</span>
          </h1>
          <p className="lead">Most household and remodel debris is fine. A few things need a heads-up. A few can&apos;t go in at all.</p>
          <MaterialSearch />
        </div>
      </section>

      <section className="section" id="allowed">
        <div className="container">
          <div className="section-head">
            <span className="status status--yes">Yes</span>
            <h2 style={{ marginTop: 8 }}>Common items you can toss</h2>
          </div>
          <div className="grid grid--4">
            {allowed.slice(0, 4).map((item) => (
              <ItemCard item={item} key={item.name} />
            ))}
          </div>
          <details className="disclosure" style={{ marginTop: 16 }}>
            <summary className="btn btn--secondary">See all allowed items</summary>
            <ul className="checklist columns">
              {allowed.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  {item.aliases?.length ? <span className="muted"> ({item.aliases.slice(0, 4).join(", ")})</span> : null}
                  {item.note ? <span className="fine"> {item.note}</span> : null}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section className="section section--surface" id="instructions">
        <div className="container">
          <div className="section-head">
            <span className="status status--instructions">Accepted with instructions</span>
            <h2 style={{ marginTop: 8 }}>Accepted, with a few conditions</h2>
          </div>
          <div className="grid grid--3">
            {instructions.map((item) => (
              <ItemCard item={item} key={item.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="not-accepted">
        <div className="container">
          <div className="section-head">
            <span className="status status--no">Not accepted</span>
            <h2 style={{ marginTop: 8 }}>Keep these out</h2>
          </div>
          <div className="grid grid--4">
            {prohibited.slice(0, 4).map((item) => (
              <ItemCard item={item} key={item.name} />
            ))}
          </div>
          <details className="disclosure" style={{ marginTop: 16 }}>
            <summary className="btn btn--secondary">See all prohibited items</summary>
            <ul className="checklist checklist--no columns">
              {prohibited.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  {item.aliases?.length ? <span className="muted"> ({item.aliases.join(", ")})</span> : null}
                  {item.note ? <span className="fine"> {item.note}</span> : null}
                </li>
              ))}
            </ul>
          </details>

          <div className="callout" style={{ marginTop: 24 }}>
            <div>
              <h3>Heavy project? Check the weight first.</h3>
              <p className="muted">
                Shingles, tile and dense demo debris are allowed, but they can reach the included weight before the dumpster looks full.
              </p>
            </div>
            <a className="btn btn--secondary" href={smsHref}>
              Text us about your load
            </a>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <h2>Common questions</h2>
          </div>
          <FaqList items={faqs} />
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href="/plan">
              See my estimate
            </Link>
            {sizes.map((size) => (
              <Link className="btn btn--secondary" href={`/${size.slug}`} key={size.slug}>
                {size.yards}-Yard
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
