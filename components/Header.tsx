import Image from "next/image";
import Link from "next/link";
import { company, telHref } from "@/lib/company";
import { logo } from "@/lib/media";
import { sizes } from "@/lib/sizes";
import MobileMenu from "./MobileMenu";

// Shopping hub and dedicated intent pages. Spanish navigation joins when localized routes ship.
const links = [
  { href: "/#sizes", label: "Dumpsters" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/what-can-i-put-in-a-dumpster", label: "What Goes In" },
  { href: "/faq", label: "FAQ" },
  { href: "/about-us", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="brand" aria-label="Little Junkers home">
          <Image src={logo.src} alt="" width={44} height={44} priority />
          <span>Little Junkers</span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="site-header__phone" href={telHref}>
            {company.phoneDisplay}
          </a>
          <a className="btn btn--primary" href="/plan">
            Book Online
          </a>
          <MobileMenu
            dumpsters={sizes.map((size) => ({ href: `/${size.slug}`, label: `${size.yards}-Yard · ${size.name}` }))}
            more={links.slice(1)}
          />
        </div>
      </div>
    </header>
  );
}
