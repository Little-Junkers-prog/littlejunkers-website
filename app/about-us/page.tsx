import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Photo from "@/components/Photo";
import { cityByName } from "@/lib/cities";
import { bookingUrl, company, telHref } from "@/lib/company";
import { photos } from "@/lib/media";
import { sizes } from "@/lib/sizes";

export const metadata: Metadata = {
  title: "Meet Marcus and Ivy | Peachtree City",
  description:
    "Little Junkers is a dumpster rental company in Peachtree City, Georgia, owned and run by Marcus and Ivy since 2024.",
  alternates: { canonical: "/about-us" },
};

const proof = ["Locally owned in Peachtree City", "Established 2024", "Upfront pricing", "Driveway-friendly dumpsters", "Real local owners"];

const approach = [
  ["Simple booking", "Pick a size and dates online, any time. No phone tag unless you'd rather talk."],
  ["Prices you can see", "The price for your ZIP shows before you book. Extra days and extra weight only apply if you use them."],
  ["Care for your property", "We deliver with a hook-lift truck, not a full-size roll-off, and we check the spot before we set the dumpster down."],
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
              Local owners. Real service. Cleaner <span className="accent">neighborhoods.</span>
            </h1>
            <p className="lead">
              Little Junkers is a dumpster rental company in Peachtree City, Georgia. Marcus and Ivy started it in 2024 and
              run it today.
            </p>
            <div className="btn-row">
              <a className="btn btn--primary" href={bookingUrl()}>
                Rent a Dumpster
              </a>
              <a className="btn btn--secondary" href={telHref}>
                Call or text {company.phoneDisplay}
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
            <p>We&apos;re a dumpster rental company. We drop it off, you fill it, and we haul it away.</p>
            <p className="fine">
              Slot for the fuller story: how the name came about, why the dumpsters are pink, and the first blue one. It links here
              once &ldquo;The Little Junkers Story&rdquo; is written and published on the blog.
            </p>
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
            <h2>How we do it</h2>
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
            <p className="muted">Based in Peachtree City. Delivering across Fayette and Coweta County and nearby South Atlanta communities.</p>
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
                Real jobs, loading tips and what we&apos;re up to around town.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--secondary" href="/blog">
                Check Out Our Blog
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
