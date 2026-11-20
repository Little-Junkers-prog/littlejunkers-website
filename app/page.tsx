import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/Photo";
import PhotoRail from "@/components/PhotoRail";
import RevealOnScroll from "@/components/RevealOnScroll";
import { PricingUnavailable } from "@/components/PriceCards";
import PinkBinExperience from "@/components/PinkBinExperience";
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
      <section className="hero on-dark experience-hero">
        <div className="hero__media" aria-hidden="true">
          <Image src={photos.hero.src} alt="" width={photos.hero.width} height={photos.hero.height} priority sizes="(min-width: 900px) 58vw, 100vw" />
        </div>
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow experience-hero__eyebrow">Peachtree City, GA · Local Pink Bin rentals</p>
            <h1>
              <span className="experience-hero__title-first">Need a</span>{" "}
              <span className="accent experience-hero__title-last">dumpster?</span>
            </h1>
            <p className="lead">Check your delivery area and see dumpster prices. Enter a city or ZIP.</p>
            <ZipCheck />
            <p className="hero__meta">
              <span>11-, 16- and 21-yard Pink Bins</span>
              <span>Locally owned in Peachtree City</span>
            </p>
            <p className="hero__meta">
              <Link href="/faq#which-size">Help me choose a size</Link>
              <a href={telHref}>Call {company.phoneDisplay}</a>
              <a href={smsHref}>Text us</a>
            </p>
          </div>
          <div className="experience-hero__field-note" aria-hidden="true">
            <span>THE PINK BIN LINEUP</span>
            <strong>11 <i>·</i> 16 <i>·</i> 21</strong>
            <small>yard dumpsters · local deliveries</small>
          </div>
        </div>
      </section>

      <section className="section experience-sizes" id="sizes">
        <div className="container">
          <div className="section-head">
            <h2>
              Meet the <span className="accent">Pink Bins.</span>
            </h2>
            <p>Pick a size, look at the actual bin, and see what your three-day starting price covers.</p>
          </div>
          {pricing ? <PinkBinExperience pricing={pricing} /> : <PricingUnavailable />}
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

      <section className="section section--surface experience-compare" id="compare">
        <div className="container cx-overview">
          <div><p className="eyebrow">Know what you're paying for</p><h2>See how rental prices compare.</h2><p>Rental length, included tonnage, delivery charges and weight overages can matter as much as the dumpster size. Check the details before you choose.</p><div className="btn-row"><Link className="btn btn--primary" href="/compare">See how we compare</Link><Link className="btn btn--secondary" href="/pricing">See our pricing details</Link></div></div>
          <div className="cx-note"><h3>Four questions worth asking</h3><ol><li>How many rental days are included?</li><li>How much disposal weight is covered?</li><li>What delivery fee applies to my ZIP?</li><li>Is the dumpster available for my full rental?</li></ol><p className="fine">Local competitor prices will only appear when the source and date have been verified.</p></div>
        </div>
      </section>
      <section className="section experience-plan" id="plan">
        <div className="container">
          <div className="section-head"><p className="eyebrow">Days Plus planner</p><h2>Your project doesn't have to fit a fixed package.</h2><p>Start with three days. Add up to 27 more, or ask for a personal quote on longer projects. Select a size, city or ZIP, and dates to see an estimated price.</p></div>
          <DaysPlusPlanner basePrices={basePriceSnapshot(pricing)} />
        </div>
      </section>

      <section className="section section--surface experience-process">
        <div className="container split experience-process__inner">
          <div>
            <div className="section-head">
              <p className="eyebrow">From delivery to pickup</p>
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
          <RevealOnScroll className="experience-process__visual">
            <Photo photo={photos.truckDelivering} shape="landscape" sizes="(min-width: 900px) 50vw, 100vw" caption={false} />
            <p className="experience-process__caption">The Little Junkers truck at work.</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section experience-reasons">
        <RevealOnScroll className="container">
          <div className="section-head">
            <p className="eyebrow">A different kind of dumpster company</p>
            <h2>Why Little Junkers</h2>
          </div>
          <div className="grid grid--4 experience-reasons__grid">
            {reasons.map(([title, body]) => (
              <div className="card experience-reason" key={title}>
                <h3>{title}</h3>
                <p className="muted" style={{ marginTop: 6 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      <section className="section section--surface experience-owners">
        <div className="container split experience-owners__inner">
          <div className="experience-owners__photo">
            <Photo photo={photos.marcusAndIvy} sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
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

      <section className="section experience-gallery">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">On actual Little Junkers jobs</p>
            <h2>Seen around town</h2>
            <p>Photos from our deliveries around Fayette and Coweta County.</p>
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

      <section className="section experience-close">
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
