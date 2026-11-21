"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { company, telHref } from "@/lib/company";

type Item = { href: string; label: string };

/**
 * A single right-side navigation drawer on phones, tablets, and desktops.
 * The links are included in server HTML for crawlability and progressively
 * portaled to the document body so a sticky header can't clip the backdrop.
 */
export default function MobileMenu({ dumpsters, more }: { dumpsters: Item[]; more: Item[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const restoreOnClose = useRef(false);
  const pathname = usePathname();
  const id = useId();
  const panelId = `site-menu-${id}`;
  const titleId = `site-menu-heading-${id}`;

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) {
      if (restoreOnClose.current) {
        restoreOnClose.current = false;
        button.current?.focus();
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreOnClose.current = true;
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel.current) return;
      const items = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        ),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close(returnFocus: boolean) {
    restoreOnClose.current = returnFocus;
    setOpen(false);
  }

  const drawer = (
    <div className={`menu__layer${open ? " is-open" : ""}`}>
      <button
        className={`menu__backdrop${open ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => close(true)}
      />
      <section
        ref={panel}
        id={panelId}
        className={`menu__panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-labelledby={titleId}
        inert={!open}
      >
        <div className="menu__panel-head">
          <div>
            <p className="menu__eyebrow">Little Junkers</p>
            <h2 className="menu__title" id={titleId}>Where to?</h2>
          </div>
          <button ref={closeButton} type="button" className="menu__close" onClick={() => close(true)}>
            <span aria-hidden="true">×</span>
            <span className="visually-hidden">Close navigation menu</span>
          </button>
        </div>
        <Link className="btn btn--primary menu__start" href="/plan" onClick={() => close(false)}>
          Start Booking <span aria-hidden="true">↗</span>
        </Link>
        <nav className="menu__links" aria-label="Site navigation">
          <p className="menu__group">Find your Pink Bin</p>
          <Link href="/#sizes" onClick={() => close(false)}>All dumpster sizes</Link>
          {dumpsters.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => close(false)}>
              {item.label}
            </Link>
          ))}
          <p className="menu__group">Explore Little Junkers</p>
          {more.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => close(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="menu__contact">
          Have a question? <a href={telHref} onClick={() => close(false)}>Call {company.phoneDisplay}</a>.
        </p>
      </section>
    </div>
  );

  return (
    <div className="menu">
      <button
        ref={button}
        className="menu__button"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
      >
        <span className="menu__icon" aria-hidden="true" />
        <span className="menu__button-label" aria-hidden="true">Menu</span>
      </button>
      {mounted ? createPortal(drawer, document.body) : drawer}
    </div>
  );
}
