import Link from "next/link";
import { company, telHref } from "@/lib/company";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container stack">
        <h1>
          We can&apos;t find that <span className="accent">page.</span>
        </h1>
        <p className="lead">Find your dumpster size, check your delivery area or call us for help.</p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <Link className="btn btn--primary" href="/#sizes">
            See dumpster sizes and prices
          </Link>
          <Link className="btn btn--secondary" href="/service-areas">
            Check your city or ZIP
          </Link>
          <a className="btn btn--secondary" href={telHref}>
            Call {company.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
