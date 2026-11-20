import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import { PricingUnavailable, RateList } from "@/components/PriceCards";
import { BookLink } from "@/components/ZipContext";
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
                  <small>Starting at</small> {formatUsd(from.prices[size.yards])}
                </p>
                <p className="muted">
                  {from.days} days and {formatTons(facts.includedTons)} of disposal included. A delivery fee may apply outside our
                  core area.
                </p>
                <div className="btn-row">
                  <BookLink className="btn btn--primary" size={size.yards}>
                    See my estimate
                  </BookLink>
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
                <dd>{size.box.lengthFt} ft</dd>
              </div>
              <div>
                <dt>Width</dt>
                <dd>{size.box.widthFt} ft</dd>
              </div>
              <div>
                <dt>Wall height</dt>
                <dd>{size.box.wallFt} ft</dd>
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
                <p className="price" style={{ marginTop: 8 }}>
                  <small>Starting at</small> {formatUsd(pricing.tiers[0].prices[size.yards])}
                </p>
                <div style={{ marginTop: 10 }}>
                  <RateList pricing={pricing} yards={size.yards} />
                </div>
                <ZipCheck cta="Check My ZIP" label="Delivery fee for your city or ZIP" />
                <BookLink className="btn btn--primary btn--block" size={size.yards}>
                  See my estimate
                </BookLink>
                <p className="fine" style={{ marginTop: 10 }}>
                  Comparing options?{" "}
                  <Link href={`/compare?size=${size.yards}`}>See how our {size.yards}-yard compares</Link>.
                </p>
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
            areaServed: ["Fayette County, GA", "Coweta County, GA"],
            offers: {
              "@type": "Offer",
              name: `${pricing.tiers[0].days}-day rental`,
              price: pricing.tiers[0].prices[size.yards],
              priceCurrency: "USD",
              url: book,
            },
          }}
        />
      ) : null}
    </>
  );
}
