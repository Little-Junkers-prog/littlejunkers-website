import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Photo from "@/components/Photo";
import { cityByName } from "@/lib/cities";
import { company, telHref, smsHref } from "@/lib/company";
import { photos } from "@/lib/media";
import { sizes } from "@/lib/sizes";

export const metadata: Metadata = {
  title: "Meet Marcus and Ivy in Peachtree City",
  description:
    "Meet Marcus and Ivy, the owners of Little Junkers in Peachtree City, GA. Learn why the dumpsters are pink and how to find the right size.",
  alternates: { canonical: "/about-us" },
};

const proof = ["Peachtree City, GA", "In business since 2024", "11-, 16- and 21-yard Pink Bins"];

const approach = [
  ["Simple booking", "Pick a size and dates online, any time. No phone tag unless you'd rather talk."],
  ["Understand what’s included", "Each size has an included disposal-weight allowance. If you need extra days or have heavy debris, ask us about the charges."],
  ["We check the delivery spot", "Our dumpsters come on a hook-lift truck. Tell us about low branches, a steep driveway or a tight turn before delivery."],
];

export default function About() {
  const featured = ["Peachtree City", "Fayetteville", "Newnan"].map((name) => cityByName(name)!);

  return (
    <>
      <Breadcrumbs trail={[{ label: "About", href: "/about-us" }]} />

      <section className="page-hero">
        <div className="container split">
          <div className="stack">
            <h1>
              Meet the people behind the <span className="accent">Pink Bins.</span>
            </h1>
            <p className="lead">
              We’re Marcus and Ivy. We started Little Junkers in Peachtree City in 2024 to make renting a dumpster a little less complicated.
            </p>
            <div className="btn-row">
              <Link className="btn btn--primary" href="/plan">
                Start Online Booking
              </Link>
              <a className="btn btn--secondary" href={telHref}>
                Call {company.phoneDisplay}
              </a>
            </div>
          </div>
          <Photo photo={photos.marcusAndIvy} sizes="(min-width: 900px) 50vw, 100vw" priority />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ul className="chips" aria-label="About Little Junkers">
            {proof.map((item) => (
              <li className="chip" key={item} style={{ cursor: "default" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div className="stack">
            <p className="eyebrow">Who we are</p>
            <h2>Marcus and Ivy</h2>
            <p>
              We own Little Junkers and we run it. We rent three sizes of pink roll-off dumpsters:{" "}
              {sizes.map((size, index) => (
                <span key={size.slug}>
                  {index > 0 ? (index === sizes.length - 1 ? " and " : ", ") : ""}
                  <Link href={`/${size.slug}`}>the {size.yards}-yard</Link>
                </span>
              ))}
              . We deliver them to homes and job sites across Fayette and Coweta County.
            </p>
            <p>For us, pink was part of the idea from the start. The bins are easy to spot, and they look a little different from the usual dumpster. We wanted the service to feel just as approachable.</p>
            <p>Marcus handles the day-to-day equipment and delivery work. Ivy helps customers with questions and scheduling. If you’re not sure which size you need, talk to us. You don’t need to know anything about dumpsters to get started.</p>
          </div>
          <div className="grid grid--2">
            <Photo photo={photos.ivyTruck} sizes="(min-width: 900px) 25vw, 100vw" />
            <Photo photo={photos.marcusTruck} sizes="(min-width: 900px) 25vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What you can expect</h2>
          </div>
          <div className="grid grid--3">
            {approach.map(([title, body]) => (
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
          <div className="stack">
            <h2>Where we work</h2>
            <p className="muted">We work out of Peachtree City and serve nearby communities in Fayette and Coweta County. Enter your ZIP on our service-area page to see the delivery fee.</p>
            <ul className="chips">
              {featured.map((city) => (
                <li key={city.slug}>
                  <Link className="chip" href={`/${city.slug}`}>
                    {city.city}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="chip" href="/service-areas">
                  View All Service Areas
                </Link>
              </li>
            </ul>
          </div>
          <Photo photo={photos.truckDoor} sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="callout">
            <div>
              <h2>From the job site</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                Loading tips, answers to common rental questions and photos from local jobs.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--secondary" href="/blog">
                Read our guides
              </Link>
              <Link className="btn btn--primary" href="/#sizes">
                See Sizes &amp; Prices
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
