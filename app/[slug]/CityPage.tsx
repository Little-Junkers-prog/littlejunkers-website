import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import PriceCards from "@/components/PriceCards";
import { cityByName, type CityContent } from "@/lib/cities";
import { siteUrl, smsHref, telHref, company } from "@/lib/company";
import { formatUsd, getPricing, zipsForCity } from "@/lib/pricing";

// City template (TIER-1 spec §9A, Newnan visual grammar). ZIPs, zone and fee
// come from canonical ZIP rows. If a city has no active ZIP row, the page makes
// no serviceability claim and sends the visitor to the ZIP check instead.
export default async function CityPage({ city }: { city: CityContent }) {
  const pricing = await getPricing();
  const zips = pricing ? zipsForCity(pricing, city.city) : [];
  const zoneKeys = [...new Set(zips.map((z) => z.zone))];
  const zone = pricing && zoneKeys.length === 1 ? pricing.zones[zoneKeys[0]] : null;
  const singleZip = zips.length === 1 ? zips[0].zip : undefined;
  const documentedPhotos = city.proof.filter((slot) => "src" in slot);



  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Service Areas", href: "/service-areas" },
          { label: city.city, href: `/${city.slug}` },
        ]}
      />

      <section className="page-hero city-page-hero">
        <div className="container">
          <p className="eyebrow">Little Junkers · {city.county}</p>
          <h1>Dumpster Rental in <span className="accent">{city.city}, GA</span></h1>
          <p className="lead">{city.intro}</p>
          <p className="grounding">
            <span>{city.city}, {city.county}</span>
            {zips.length > 0 ? <span>ZIP {zips.map((z) => z.zip).join(" & ")}</span> : null}
            {zone ? <span>{zone.deliveryFee === 0 ? "$0 delivery fee" : `${formatUsd(zone.deliveryFee)} delivery fee`}</span> : null}
            {pricing && zips.length === 0 ? <span><Link href="/service-areas">Check delivery for your ZIP</Link></span> : null}
          </p>
          <div className="btn-row city-page-hero__actions">
            <Link className="btn btn--primary" href={`/plan?location=${encodeURIComponent(city.city)}`}>
              See my estimate
            </Link>
            <a className="btn btn--secondary" href="#prices">See sizes &amp; prices</a>
          </div>
          <p className="fine">
            Questions? <a href={telHref}>Call {company.phoneDisplay}</a> or{" "}
            <a href={smsHref}>text us</a>. Not in {city.city}?{" "}
            <Link href="/service-areas">Check another city</Link>.
          </p>
        </div>
      </section>

      <section className="section" id="prices">
        <div className="container">
          <div className="section-head">
            <h2>Dumpster prices in {city.city}</h2>
          </div>
          <PriceCards pricing={pricing} zip={singleZip} location={city.city} deliveryFee={zone?.deliveryFee} />
          <div className="city-comparison">
            <div>
              <h3>Shopping around?</h3>
              <p>Compare published dumpster prices, rental days and included weight before you decide.</p>
            </div>
            <Link className="btn btn--secondary" href={`/compare?location=${encodeURIComponent(city.city)}`}>
              See how we compare
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--surface city-proof">
        <div className="container">
          <div className="section-head">
            <h2>{city.proofHeading}</h2>
            <p>{city.proofCopy}</p>
          </div>
          {documentedPhotos.length > 1 ? (
            <PhotoRail photos={documentedPhotos} label={`Little Junkers dumpster photos from ${city.city}`} />
          ) : documentedPhotos.length === 1 ? (
            <div className="city-proof__single">
              <Photo photo={documentedPhotos[0]} sizes="(min-width: 800px) 520px, 100vw" />
            </div>
          ) : city.heroDisclosure ? (
            <div className="city-proof__single">
              <Photo photo={city.hero} sizes="(min-width: 800px) 520px, 100vw" caption={false} />
              <p className="fine">{city.heroDisclosure}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section city-rental-steps">
        <div className="container">
          <div className="section-head">
            <h2>How renting a Pink Bin works</h2>
            <p>We handle the delivery and pickup. You choose the bin and load it.</p>
          </div>
          <ol className="grid grid--3 steps">
            <li>
              <h3>Pick your size</h3>
              <p>Check your city or ZIP, compare the 11-, 16- and 21-yard options, and see the starting price.</p>
            </li>
            <li>
              <h3>Choose your dates</h3>
              <p>Tell us when you need it and for how long. We confirm the price and available dates before a reservation is made.</p>
            </li>
            <li>
              <h3>Fill it up</h3>
              <p>Load your Pink Bin level with the top. We'll pick it up when the rental is finished.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="stack">
            <h2>{city.placement.heading}</h2>
            <p className="muted">{city.placement.body}</p>
          </div>
          <div className="stack">
            <h2>Before you load it</h2>
            <p className="muted">
              A bigger dumpster holds more debris, but every size has a weight limit. Shingles, tile and other
              heavy materials can reach that limit before the bin is full.
            </p>
            <div className="btn-row">
              <Link className="btn btn--secondary" href="/#sizes">
                Compare our three sizes
              </Link>
              <a className="btn btn--secondary" href={smsHref}>
                Text us about a heavy load
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section city-materials">
        <div className="container callout">
          <div>
            <h2>What are you putting in the dumpster?</h2>
            <p className="muted">
              Furniture, wood, flooring and many other cleanup materials are fine. Paint, batteries,
              chemicals and some heavy loads need special handling. Check the list before you start loading.
            </p>
          </div>
          <div className="btn-row">
            <Link href="/what-can-i-put-in-a-dumpster" className="btn btn--secondary">Check accepted materials</Link>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <h2>{city.city} questions</h2>
          </div>
          <FaqList items={city.faqs} />
          <p style={{ marginTop: 16 }}>
            <Link className="text-link" href="/faq">
              More questions and answers
            </Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Nearby</h2>
          </div>
          <ul className="chips">
            {city.nearby.map((name) => {
              const nearby = cityByName(name);
              return nearby ? (
                <li key={name}>
                  <Link className="chip" href={`/${nearby.slug}`}>
                    {name}
                  </Link>
                </li>
              ) : null;
            })}
            <li>
              <Link className="chip" href="/service-areas">
                All service areas
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {zips.length > 0 ? (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${siteUrl}/${city.slug}#service`,
          name: `Dumpster Rental in ${city.city}, GA`,
          serviceType: "Dumpster rental",
          provider: { "@id": `${siteUrl}/#business` },
          url: `${siteUrl}/${city.slug}`,
          areaServed: {
            "@type": "City",
            name: city.city,
            address: {
              "@type": "PostalAddress",
              addressLocality: city.city,
              addressRegion: "GA",
              addressCountry: "US",
            },
          },
        }} />
      ) : null}
    </>
  );
}
