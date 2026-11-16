import Link from "next/link";
import { cities } from "@/lib/cities";
import { company, smsHref, telHref } from "@/lib/company";
import { legalLinks } from "@/lib/legal-links";
import { sizes } from "@/lib/sizes";
import { PrivacyChoicesLink } from "./ConsentBanner";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <h2>Little Junkers</h2>
            <p>Dumpster rental, locally owned by {company.owners}.</p>
            <p className="site-footer__muted">
              {company.locality}, {company.region}
            </p>
            <ul style={{ marginTop: 10 }}>
              <li>
                <a href={telHref}>Call {company.phoneDisplay}</a>
              </li>
              <li>
                <a href={smsHref}>Text us</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
            <p className="site-footer__muted" style={{ marginTop: 10 }}>
              Calls and texts {company.hoursDisplay}. Book online any time.
            </p>
          </div>

          <nav aria-label="Dumpsters">
            <h2>Dumpsters</h2>
            <ul>
              {sizes.map((size) => (
                <li key={size.slug}>
                  <Link href={`/${size.slug}`}>
                    {size.yards}-Yard {size.name.replace("The ", "")}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/what-can-i-put-in-a-dumpster">What can go in</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Service areas">
            <h2>Service areas</h2>
            <ul>
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}`}>{city.city}</Link>
                </li>
              ))}
              <li>
                <Link href="/service-areas">All service areas</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2>Company</h2>
            <ul>
              <li>
                <Link href="/about-us">About Marcus &amp; Ivy</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              {company.social.map((profile) => (
                <li key={profile.label}>
                  <a href={profile.href} rel="noopener">
                    {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <ul className="site-footer__legal">
            {legalLinks.map((link) => (
              <li key={link.slug}>
                <Link href={`/${link.slug}`}>{link.label}</Link>
              </li>
            ))}
            <li>
              <PrivacyChoicesLink />
            </li>
          </ul>
          <p>
            © {new Date().getFullYear()} {company.legalName}. Dumpster rental in Fayette and Coweta County, Georgia.
          </p>
        </div>
      </div>
    </footer>
  );
}
