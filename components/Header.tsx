"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky-top w-100" style={{ backgroundColor: "var(--dark-hero)", zIndex: 1040 }}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        <Link href="/" className="text-decoration-none">
          <span className="fw-bold fs-4 m-0" style={{ color: "var(--card-background)" }}>
            Little Junkers
          </span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <a href="https://book.littlejunkersllc.com" className="btn btn-brand px-4 py-2">
            Book Now
          </a>

          <button
            className="btn border-0 p-2 d-flex flex-column justify-content-center gap-1"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            style={{ background: "transparent" }}
            type="button"
          >
            <span style={{ width: "24px", height: "2px", backgroundColor: "var(--card-background)" }} />
            <span style={{ width: "24px", height: "2px", backgroundColor: "var(--card-background)" }} />
            <span style={{ width: "24px", height: "2px", backgroundColor: "var(--card-background)" }} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          className="position-absolute w-100 shadow-sm border-bottom"
          style={{ backgroundColor: "var(--surface-background)", borderColor: "var(--border-surface)", left: 0, top: "100%" }}
        >
          <nav className="container py-4 d-flex flex-column gap-3">
            {[
              ["Home", "/"],
              ["Pricing", "/pricing"],
              ["Service Areas", "/service-areas"],
              ["What Can I Put in a Dumpster", "/what-can-i-put-in-a-dumpster"],
              ["About Us", "/about-us"],
              ["FAQ", "/dumpster-rental-faq"],
              ["Contact Us", "/contactus"],
            ].map(([label, href]) => (
              <Link
                className="text-decoration-none fs-5 fw-bold"
                href={href}
                key={href}
                onClick={() => setIsMenuOpen(false)}
                style={{ color: "var(--ink-primary)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
