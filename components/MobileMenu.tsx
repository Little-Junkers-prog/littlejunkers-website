"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; label: string };

// Slide-in mobile menu. Closes when a link is chosen, when the route changes,
// on Escape and on a tap outside the panel. Focus returns to the menu button.
export default function MobileMenu({ dumpsters, more }: { dumpsters: Item[]; more: Item[] }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="menu">
      <button ref={button} className="menu__button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        <span className={`menu__icon${open ? " menu__icon--open" : ""}`} aria-hidden="true" />
      </button>
      <div className={`menu__backdrop${open ? " is-open" : ""}`} onClick={close} aria-hidden="true" />
      <nav id="mobile-menu" className={`menu__panel${open ? " is-open" : ""}`} aria-label="Mobile" inert={!open}>
        <p className="menu__group">Dumpsters</p>
        {dumpsters.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
        <p className="menu__group">More</p>
        {more.map((item) => (
          <Link key={item.href} href={item.href} onClick={close}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
