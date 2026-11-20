import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import PriceCards from "@/components/PriceCards";
import { cityByName, type CityContent } from "@/lib/cities";
import { company, siteUrl, smsHref, telHref } from "@/lib/company";
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

  const delivered =
    city.sizesDelivered.length === 3
      ? "Completed rental records include all three dumpster sizes."
      : city.sizesDelivered.length > 0
        ? "Completed rentals recorded here: " + city.sizesDelivered.map((y) => y + "-yard").join(" and ") + "."
        : null;

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Service Areas", href: "/service-areas" },
          { label: city.city, href: `/${city.slug}` },
        ]}
      />

      <section className="page-hero">
        <div className="container split">
          <div className="stack">
            <h1>
              Dumpster Rental in <span className="accent">{city.city}, GA</span>
            </h1>
            <p className="lead">{city.intro}</p>
            <p className="grounding">
              <span>
                {city.city}, {city.county}
              </span>
              {zips.length > 0 ? <span>{zips.map((z) => z.zip).join(" & ")}</span> : null}
              {zone ? <span>{zone.deliveryFee === 0 ? "$0 delivery fee" : `${formatUsd(zone.deliveryFee)} delivery fee`}</span> : null}
              {pricing && zips.length === 0 ? <span>Enter your ZIP below to confirm delivery</span> : null}
            </p>
            <div className="btn-row" style={{ marginTop: 18 }}>
              <a className="btn btn--primary" href="#prices">
                See {city.city} Prices
              </a>
              <a className="btn btn--secondary" href={telHref}>
                Call or text {company.phoneDisplay}
              </a>
            </div>
            <p className="fine">
              Not in {city.city}? <Link href="/service-areas">Check another area</Link>
            </p>
          </div>
          <div className="city-hero-media">
            <Photo photo={city.hero} sizes="(min-width: 900px) 50vw, 100vw" priority caption={false} />
            {city.heroDisclosure ? <p className="fine">{city.heroDisclosure}</p> : null}
          </div>
        </div>
      </section>

      <section className="section" id="prices">
        <div className="container">
          <div className="section-head">
            <h2>Dumpster prices in {city.city}</h2>
          </div>
          <PriceCards pricing={pricing} zip={singleZip} location={city.city} deliveryFee={zone?.deliveryFee} />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Local experience</p>
            <h2>{city.proofHeading}</h2>
            <p>{city.proofCopy}</p>
            {delivered ? <p className="fine">{delivered}</p> : null}
          </div>
          {documentedPhotos.length > 0 ? (
            <PhotoRail photos={documentedPhotos} label={`Real Little Junkers job photos from ${city.city}`} />
          ) : (
            <div className="city-proof-summary" role="note">
              <strong>Documented Sharpsburg rentals</strong>
              <p>Our rental history includes these sizes at Sharpsburg addresses. Photos on this page show our actual equipment, not a claimed Sharpsburg project.</p>
              <ul className="chips" aria-label="Dumpster sizes previously rented in Sharpsburg">
                {city.sizesDelivered.map((yards) => <li className="chip" key={yards}>{yards}-yard</li>)}
              </ul>
            </div>
          )}
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
              Size is how much room you get. Weight is what disposal charges for. Heavy debris like shingles or tile can reach the
              included weight early.
            </p>
            <div className="btn-row">
              <Link className="btn btn--secondary" href="/what-can-i-put-in-a-dumpster">
                What can go in
              </Link>
              <a className="btn btn--secondary" href={smsHref}>
                Text us about a heavy load
              </a>
            </div>
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
    </>
  );
}
