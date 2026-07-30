import Link from "next/link";

const sizeLinks = [
  { href: "/11-yard-the-little-junker", label: "11-Yard Dumpster" },
  { href: "/16-yard-the-middle-junker", label: "16-Yard Dumpster" },
  { href: "/21-yard-the-big-junker", label: "21-Yard Dumpster" },
];

const quickLinks = [
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <h2 className="h4 fw-bold mb-3">Little Junkers LLC</h2>
            <p className="mb-2">Peachtree City, GA</p>
            <p className="mb-0">
              <a href="tel:+16784647364">(678) 464-7364</a>
            </p>
          </div>
          <div className="col-sm-6 col-lg-3">
            <h3 className="h6 fw-bold mb-3">Dumpster Sizes</h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {sizeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-sm-6 col-lg-4">
            <h3 className="h6 fw-bold mb-3">Quick Links</h3>
            <ul className="list-unstyled d-grid gap-2 mb-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
