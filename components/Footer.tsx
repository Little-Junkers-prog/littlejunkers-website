import Link from "next/link";

const quickLinks = [
  { href: "/11-yard-the-little-junker", label: "11-Yard Dumpster" },
  { href: "/16-yard-the-middle-junker", label: "16-Yard Dumpster" },
  { href: "/21-yard-the-big-junker", label: "21-Yard Dumpster" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const localMarkets = ["Peachtree City", "Newnan", "Fayetteville", "Tyrone", "Senoia"];

export default function Footer() {
  return (
    <footer className="site-footer pt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h2 className="h4 fw-bold mb-3">Little Junkers LLC</h2>
            <p className="mb-2">Peachtree City, GA</p>
            <p className="mb-3">
              <a href="tel:+16784647364">(678) 464-7364</a>
            </p>
            <p className="small mb-0 site-footer-muted">
              Family-owned dumpster rental with clear pricing and driveway-safe delivery.
            </p>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h3 className="h6 fw-bold mb-3">Quick Links</h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h3 className="h6 fw-bold mb-3">Local Markets</h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {localMarkets.map((market) => (
                <li key={market}>
                  <Link href={`/service-areas/${market.toLowerCase().replaceAll(" ", "-")}`}>
                    {market}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <h3 className="h6 fw-bold mb-3">Hours & Coverage</h3>
            <p className="mb-2">Online booking is open 24/7.</p>
            <p className="mb-2">Local support available Monday-Saturday.</p>
            <p className="small mb-0 site-footer-muted">
              Serving Peachtree City and nearby south Atlanta communities.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom mt-5 py-3">
          <div className="row align-items-center g-3">
            <div className="col-lg-6">
              <p className="small mb-0 site-footer-muted">&copy; 2026 Little Junkers LLC. All rights reserved.</p>
            </div>
            <div className="col-lg-6">
              <div className="d-flex gap-3 justify-content-lg-end">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-of-service">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
