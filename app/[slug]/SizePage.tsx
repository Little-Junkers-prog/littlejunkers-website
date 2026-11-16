import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import { PricingUnavailable } from "@/components/PriceCards";
import ZipCheck from "@/components/ZipCheck";
import { bookingUrl, company, siteUrl, smsHref } from "@/lib/company";
import { formatTons, formatUsd, getPricing, startingTier } from "@/lib/pricing";
import type { SizeContent } from "@/lib/sizes";

// One template for all three product pages (STRATEGY-ARCHIVE §19.3).
export default async function SizePage({ size }: { size: SizeContent }) {
  const pricing = await getPricing();
  const facts = pricing?.sizes[size.yards] ?? null;
  const from = pricing ? startingTier(pricing) : null;
  const book = bookingUrl({ size: size.yards });
  const title = `${size.yards}-Yard Dumpster`;

  return (
    <>
      <Breadcrumbs trail={[{ label: title, href: `/${size.slug}` }]} />

      <section className="page-hero">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">{size.name}</p>
            <h1>
              {size.yards}-Yard <span className="accent">Dumpster</span>
            </h1>
            <p className="lead">{size.fitLine}</p>
            {pricing && from && facts ? (
              <>
                <p className="price">
                  {formatUsd(from.prices[size.yards])} <small>for {from.days} days</small>
                </p>
                <p className="muted">
                  {formatTons(facts.includedTons)} of disposal included. A delivery fee may apply outside our core area.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href={book}>
                    Check Dates &amp; Book
                  </a>
                  <a className="btn btn--secondary" href="#price">
                    See the price for my ZIP
                  </a>
                </div>
              </>
            ) : (
              <PricingUnavailable />
            )}
          </div>
          <Photo photo={size.hero} sizes="(min-width: 900px) 50vw, 100vw" priority caption={false} />
        </div>
      </section>

      <section className="section">
        <div className="container split split--wide">
          <div>
            <div className="section-head">
              <h2>A great fit for</h2>
            </div>
            <div className="grid grid--2">
              {size.fitTiles.map((tile) => (
                <div className="tile" key={tile}>
                  {tile}
                </div>
              ))}
            </div>
          </div>
          <div className="stack">
            {size.adjacent.map((option) => (
              <div className="card" key={option.slug}>
                <h3>{option.text}</h3>
                <p style={{ marginTop: 6 }}>
                  <Link className="text-link" href={`/${option.slug}`}>
                    {option.label}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <h2>What fits</h2>
            {facts?.truckLoads ? <p className="stat">About {facts.truckLoads}</p> : null}
            <ul className="checklist">
              {size.fitsList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fine">Capacity shown is an approximate volume comparison. Weight limits still apply.</p>
          </div>
          <div className="callout" style={{ gridTemplateColumns: "1fr" }}>
            <div>
              <h3>Heavy stuff? Check the weight first.</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                {size.weightNote}
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn--secondary" href={smsHref}>
                Text us about your load
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="stack">
            <h2>Dumpster size &amp; footprint</h2>
            <dl className="spec">
              <div>
                <dt>Length</dt>
                <dd>{size.draftFootprint.lengthFt} ft</dd>
              </div>
              <div>
                <dt>Width</dt>
                <dd>{size.draftFootprint.widthFt} ft</dd>
              </div>
              <div>
                <dt>Height</dt>
                <dd>{facts?.heightFt ? `${facts.heightFt} ft` : "Ask us"}</dd>
              </div>
            </dl>
            <p className="muted">
              Leave room for the truck to back straight in, and look up: low branches and wires over the spot are the usual problem.
              Not sure it fits? Text a photo of your driveway to <a href={smsHref}>{company.phoneDisplay}</a>.
            </p>
          </div>

          <div className="card card--elevated" id="price">
            <h2 style={{ fontSize: "1.4rem" }}>Your price</h2>
            {pricing && facts ? (
              <>
                <ul className="tiers" style={{ marginTop: 12 }}>
                  {pricing.tiers.map((tier) => (
                    <li key={tier.tierKey}>
                      <span>
                        {tier.days} days
                        {tier.badge ? <span className="tag">{tier.badge}</span> : null}
                      </span>
                      <strong>{formatUsd(tier.prices[size.yards])}</strong>
                    </li>
                  ))}
                  <li>
                    <span>Disposal included</span>
                    <strong>{formatTons(facts.includedTons)}</strong>
                  </li>
                </ul>
                <ZipCheck cta="Check My ZIP" label="Delivery fee for your city or ZIP" />
                <a className="btn btn--primary btn--block" href={book} style={{ marginTop: 16 }}>
                  Check Dates &amp; Book
                </a>
                <p className="fine" style={{ marginTop: 10 }}>
                  Extra days and extra weight only apply if you use them.
                </p>
              </>
            ) : (
              <div style={{ marginTop: 12 }}>
                <PricingUnavailable />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <h2>What can go in</h2>
            <p className="muted">
              Household junk, furniture, wood, drywall, flooring and remodel debris are all fine. Dirt, concrete, compressed
              cylinders and hazardous chemicals are not. Paint, batteries and motor oil have their own rules.
            </p>
            <p>
              <Link className="text-link" href="/what-can-i-put-in-a-dumpster">
                Look up an item
              </Link>
            </p>
          </div>
          <div className="stack">
            <h2>Junker in the wild</h2>
            <PhotoRail photos={size.gallery} label={`${size.yards}-yard dumpster job photos`} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{size.yards}-yard questions</h2>
          </div>
          <FaqList items={size.faqs} />
          <p style={{ marginTop: 16 }}>
            <Link className="text-link" href="/faq">
              More questions and answers
            </Link>
          </p>
        </div>
      </section>

      {pricing && facts ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${size.yards}-Yard Dumpster Rental (${size.name})`,
            serviceType: "Roll-off dumpster rental",
            provider: { "@id": `${siteUrl}/#business` },
            url: `${siteUrl}/${size.slug}`,
            offers: pricing.tiers.map((tier) => ({
              "@type": "Offer",
              name: `${tier.days}-day rental`,
              price: tier.prices[size.yards],
              priceCurrency: "USD",
              url: book,
            })),
          }}
        />
      ) : null}
    </>
  );
}
