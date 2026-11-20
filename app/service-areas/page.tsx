import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import PhotoRail from "@/components/PhotoRail";
import ZipCheck, { AreaAnswer } from "@/components/ZipCheck";
import { cityByName } from "@/lib/cities";
import { company, smsHref, telHref } from "@/lib/company";
import { photos } from "@/lib/media";
import { cityKey, formatUsd, getPricing, lookupArea, type Pricing } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Dumpster Delivery Areas in Fayette & Coweta County",
  description:
    "Check Little Junkers dumpster delivery areas around Peachtree City, Newnan and Fayetteville. Enter your city or ZIP to see the current delivery fee.",
  alternates: { canonical: "/service-areas" },
};

const ZONE_NAMES = ["Core area", "Nearby", "Extended"];

const faqs = [
  {
    q: "Do you charge more based on location?",
    a: "The dumpster price is the same everywhere. Outside our core area there's a delivery fee, added as its own line. Enter your ZIP to see it.",
  },
  {
    q: "Do you deliver outside the listed cities?",
    a: `Sometimes. Enter your ZIP, or call or text ${company.phoneDisplay} and we'll check.`,
  },
  {
    q: "Can you deliver to rural addresses?",
    a: "It depends on access. If you have a long gravel drive or a steep slope, text us a photo so we can check whether our truck can get in and out.",
  },
  {
    q: "How do I know if my address is in the service area?",
    a: "Your ZIP decides. Enter it above and you'll see whether we deliver there and what the delivery fee is.",
  },
];

// Zone groups are built from active canonical ZIP rows, never a hand-kept city list.
function zoneGroups(pricing: Pricing) {
  return Object.values(pricing.zones)
    .sort((a, b) => a.deliveryFee - b.deliveryFee)
    .map((zone, index) => {
      const labels = new Map<string, string>();
      for (const entry of Object.values(pricing.zips)) {
        if (entry.zone !== zone.zone) continue;
        const key = cityKey(entry.areaLabel);
        if (key) labels.set(key, key.replace(/\b[a-z]/g, (c) => c.toUpperCase()));
      }
      return {
        zone,
        name: ZONE_NAMES[index] ?? zone.label,
        index,
        cities: [...labels.values()].sort(),
        zipCount: Object.values(pricing.zips).filter((z) => z.zone === zone.zone).length,
      };
    });
}

export default async function ServiceAreas({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  const pricing = await getPricing();
  const groups = pricing ? zoneGroups(pricing) : [];
  const split = new Set(
    groups.flatMap((g) => g.cities).filter((name, _, all) => all.indexOf(name) !== all.lastIndexOf(name)),
  );

  return (
    <>
      <Breadcrumbs trail={[{ label: "Service Areas", href: "/service-areas" }]} />

      <section className="page-hero">
        <div className="container">
          <h1>
            Dumpster delivery in <span className="accent">South Metro Atlanta.</span>
          </h1>
          <p className="lead">Based in Peachtree City, we serve areas around Fayetteville, Newnan, Sharpsburg, Senoia and nearby towns. Enter your city or ZIP to check delivery.</p>
          <div id="delivery-zip-check" style={{ maxWidth: 560, scrollMarginTop: 100 }}>
            <ZipCheck cta="Check My Area" />
            {/* No-script path: the form submits here and the answer renders on the server. */}
            {query && pricing ? <AreaAnswer result={lookupArea(pricing, query)} /> : null}
            {query && !pricing ? (
              <div className="zip__result">
                <h3>We couldn&apos;t check that just now</h3>
                <p>
                  Call or text <a href={telHref}>{company.phoneDisplay}</a> and we&apos;ll tell you right away.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Delivery areas and fees</h2>
            <p>Our rental rates and delivery fees are listed separately, so you can see what applies to your ZIP.</p>
          </div>

          {groups.length > 0 ? (
            <div className="zones">
              {groups.map((group) => (
                <div className={`zone zone--${group.index}`} key={group.zone.zone}>
                  <h3>{group.name}</h3>
                  <p className="zone__fee">
                    {group.zone.deliveryFee === 0 ? "Free delivery ($0)" : `+${formatUsd(group.zone.deliveryFee)} delivery`}
                  </p>
                  {group.index === 0 ? (
                    <ul>
                      {group.cities.map((name) => {
                        const page = cityByName(name);
                        return <li key={name}>{page ? <Link href={`/${page.slug}`}>{name}</Link> : name}</li>;
                      })}
                    </ul>
                  ) : (
                    <details className="disclosure">
                      <summary className="chip">
                        {group.cities.length} areas, {group.zipCount} ZIP codes
                      </summary>
                      <ul>
                        {group.cities.map((name) => (
                          <li key={name}>
                            {name}
                            {split.has(name) ? "*" : ""}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="notice">
              <h3>We can&apos;t load the area list right now</h3>
              <p style={{ marginTop: 6 }}>
                Call or text <a href={telHref}>{company.phoneDisplay}</a> and we&apos;ll check your address.
              </p>
            </div>
          )}

          {split.size > 0 ? <p className="fine" style={{ marginTop: 12 }}>* Spans two delivery areas. Your ZIP decides the fee.</p> : null}

          <div className="callout" style={{ marginTop: 24 }}>
            <div>
              <h3>Don&apos;t see your city?</h3>
              <p className="muted">The list covers common locations, but it isn’t every ZIP we serve. Try yours in the checker above.</p>
            </div>
            <div className="btn-row">
              <a className="btn btn--secondary" href="#delivery-zip-check">
                Enter my ZIP
              </a>
              <a className="btn btn--secondary" href={smsHref}>
                Text us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <h2>Pink Bins around our service area</h2>
          </div>
          <PhotoRail
            label="Little Junkers job photos by city"
            photos={[photos.y16NewnanGarage, photos.y21PeachtreeCity, photos.y16Fayetteville, photos.y11Senoia, photos.y11Tyrone, photos.y21Fairburn]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Dumpster delivery questions</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
