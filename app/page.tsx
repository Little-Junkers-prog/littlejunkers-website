import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import PriceCards from "@/components/PriceCards";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { basePriceSnapshot } from "@/lib/days-plus";
import ZipCheck from "@/components/ZipCheck";
import { cities } from "@/lib/cities";
import { company, siteUrl, smsHref, telHref } from "@/lib/company";
import { photos } from "@/lib/media";
import { getPricing } from "@/lib/pricing";
import { reviews } from "@/lib/reviews";

export const metadata = {
  alternates: { canonical: "/" },
};

const steps = [
  ["Check your city or ZIP", "See delivery-area fees, then choose your dumpster size."],
  ["Choose your dates", "See your estimate for a 3–30-day rental."],
  ["Fill it. We haul it away.", "We set it where you want it and pick it up when your rental ends."],
];

const reasons = [
  ["A smaller truck", "We deliver with a hook-lift truck, not a full-size roll-off, and we check the spot before we set the dumpster down."],
  ["Clear pricing information", "Compare the three-day base, included weight, ZIP delivery fee and conditional charges."],
  ["Plan the right rental", "Choose 3–30 total days in Days Plus, or request a custom quote for longer jobs."],
  ["Owned here", "Marcus and Ivy run Little Junkers from Peachtree City."],
];

export default async function Home() {
  const pricing = await getPricing();

  return (
    <>
      <section className="hero on-dark">
        <div className="hero__media" aria-hidden="true">
          <Image src={photos.hero.src} alt="" width={photos.hero.width} height={photos.hero.height} priority sizes="(min-width: 900px) 58vw, 100vw" />
        </div>
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1>
              Need a <span className="accent">dumpster?</span>
            </h1>
            <p className="lead">Check your delivery area and see dumpster prices. Enter a city or ZIP.</p>
            <ZipCheck />
            <p className="hero__meta">
              <span>11 · 16 · 21-yard dumpsters</span>
              <span>Locally owned</span>
              <span>11, 16 and 21 yards</span>
            </p>
            <p className="hero__meta">
              <Link href="/faq#which-size">Help me choose a size</Link>
              <a href={telHref}>Call {company.phoneDisplay}</a>
              <a href={smsHref}>Text us</a>
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="sizes">
        <div className="container">
          <div className="section-head">
            <h2>
              Three sizes. Today&apos;s <span className="accent">prices.</span>
            </h2>
            <p>Every rental includes drop-off, pickup and disposal up to the included weight.</p>
          </div>
          <PriceCards pricing={pricing} />
          <p className="fine" style={{ marginTop: 14 }}><Link href="/pricing">See detailed pricing and fees</Link> · <Link href="/compare">How to compare rental offers</Link></p>
          <div className="callout" style={{ marginTop: 24 }}>
            <div>
              <h3>Not sure which size?</h3>
              <p className="muted">Text us what you&apos;re tossing, or a photo of the pile. We&apos;ll point you to the right one.</p>
            </div>
            <div className="btn-row">
              <a className="btn btn--secondary" href={smsHref}>
                Text us
              </a>
              <Link className="btn btn--secondary" href="/faq#which-size">
                Size help
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--surface" id="compare">
        <div className="container cx-overview">
          <div><p className="eyebrow">Know what you're paying for</p><h2>See how rental prices compare.</h2><p>Rental length, included tonnage, delivery charges and weight overages can matter as much as the dumpster size. Check the details before you choose.</p><div className="btn-row"><Link className="btn btn--primary" href="/compare">See how we compare</Link><Link className="btn btn--secondary" href="/pricing">See our pricing details</Link></div></div>
          <div className="cx-note"><h3>Four questions worth asking</h3><ol><li>How many rental days are included?</li><li>How much disposal weight is covered?</li><li>What delivery fee applies to my ZIP?</li><li>Is the dumpster available for my full rental?</li></ol><p className="fine">Local competitor prices will only appear when the source and date have been verified.</p></div>
        </div>
      </section>
      <section className="section" id="plan">
        <div className="container">
          <div className="section-head"><p className="eyebrow">Days Plus planner</p><h2>Your project doesn't have to fit a fixed package.</h2><p>Start with three days. Add up to 27 more, or ask for a personal quote on longer projects. Select a size, city or ZIP, and dates to see an estimated price.</p></div>
          <DaysPlusPlanner basePrices={basePriceSnapshot(pricing)} />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div>
            <div className="section-head">
              <h2>How it works</h2>
            </div>
            <ol className="steps stack">
              {steps.map(([title, body]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
          <Photo photo={photos.truckDelivering} shape="landscape" sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why Little Junkers</h2>
          </div>
          <div className="grid grid--4">
            {reasons.map(([title, body]) => (
              <div className="card" key={title}>
                <h3>{title}</h3>
                <p className="muted" style={{ marginTop: 6 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <Photo photo={photos.marcusAndIvy} sizes="(min-width: 900px) 50vw, 100vw" />
          <div className="stack">
            <p className="eyebrow">Locally owned</p>
            <h2>We&apos;re Marcus and Ivy.</h2>
            <p className="lead">We started Little Junkers in Peachtree City in 2024, and we run it ourselves.</p>
            <p>
              <Link className="text-link" href="/about-us">
                Meet Marcus and Ivy
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Seen around town</h2>
            <p>Real Little Junkers jobs. No stock photos.</p>
          </div>
          <PhotoRail
            label="Little Junkers job photos"
            photos={[photos.y11Fayetteville, photos.y16NewnanYard, photos.y21PeachtreeCity, photos.y11Senoia, photos.y21Fairburn, photos.y11Tyrone]}
          />
          {reviews.length > 0 ? (
            <div className="grid grid--3" style={{ marginTop: 28 }}>
              {reviews.map((review) => (
                <figure className="card card--elevated" key={review.name} style={{ margin: 0 }}>
                  <blockquote style={{ margin: 0 }}>
                    <p>&ldquo;{review.text}&rdquo;</p>
                  </blockquote>
                  <figcaption className="fine" style={{ marginTop: 10 }}>
                    {review.name}
                    {review.area ? `, ${review.area}` : ""} · {review.source} review
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          <p style={{ marginTop: 20 }}>
            <a className="text-link" href={company.googleReviewsUrl} rel="noopener">
              Read our reviews on Google
            </a>
          </p>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <h2>Where we deliver</h2>
            <p>Based in Peachtree City. Delivering across Fayette and Coweta County and nearby South Atlanta communities.</p>
          </div>
          <ul className="chips">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link className="chip" href={`/${city.slug}`}>
                  {city.city}
                </Link>
              </li>
            ))}
            <li>
              <Link className="chip" href="/service-areas">
                All service areas
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="band on-dark">
            <div>
              <h2>
                Find the right <span className="accent">dumpster.</span>
              </h2>
              <p style={{ marginTop: 6 }}>Enter your city or ZIP to see an estimate. Call or text us {company.hoursDisplay}.</p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--primary" href="/plan">See my estimate</Link>
              <a className="btn btn--secondary" href={telHref}>
                Call {company.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: company.name,
          url: siteUrl,
        }}
      />
    </>
  );
}
