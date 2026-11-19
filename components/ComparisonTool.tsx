"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedArea, useSavedLocationQuery } from "./ZipContext";
import { formatUsd } from "@/lib/pricing";

type Area = { status: "served"; query: string; label: string; zips: string[]; zone: { deliveryFee: number } }
  | { status: "split"; query: string; label: string }
  | { status: "unknown"; query: string };
type Offer = {
  providerId: string; name: string; website: string; product: string;
  actualYards: number; containerType: string | null;
  coverage: "verified" | "unverified";
  price: number | null; priceDays: number | null; includedTons: number | null;
  overagePerTon: number | null; overagePerPound: number | null; priceQualifier: string | null; extraDayFee: number | null;
  sourceUrl: string | null; verifiedOn: string | null; priceStatus: "verified" | "not_verified";
};
type Payload = {
  location: Area; size: number; days: number;
  littleJunkers: {
    base: number | null; baseDays: number; includedTons: number;
    overagePerTon: number | null; deliveryFee: number | null;
    knownSubtotal: number | null; additionalDaysPriced: boolean; confirmedQuote: false;
  };
  comparison: { status: "ready" | "connection_pending" | "source_unavailable"; candidates: Offer[] };
};
type Status = "idle" | "loading" | "ready" | "error";

const sizes = [11, 16, 21] as const;
function money(value: number | null) { return value === null ? "Not published" : formatUsd(value); }
function labelDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value + "T12:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function ComparisonTool({
  initialLocation = "", initialSize = 16, initialDays = 3
}: { initialLocation?: string; initialSize?: 11 | 16 | 21; initialDays?: number }) {
  const area = useSavedArea(), savedLocation = useSavedLocationQuery();
  const [location, setLocation] = useState(initialLocation);
  const [size, setSize] = useState<11 | 16 | 21>(initialSize);
  const [days, setDays] = useState(initialDays);
  const [status, setStatus] = useState<Status>("idle");
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    if (!initialLocation && !location) {
      const q = savedLocation || area?.zip;
      if (q) setLocation(q);
    }
    // Only use previously confirmed location to seed a blank field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLocation, area?.zip]);

  useEffect(() => {
    const q = location.trim();
    if (q.length < 2 || (/^\d+$/.test(q) && q.length !== 5)) {
      setPayload(null); setStatus("idle"); return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading"); setError("");
      try {
        const params = new URLSearchParams({ location: q, size: String(size), days: String(days) });
        const response = await fetch("/api/comparison?" + params.toString(), { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("We couldn't load the comparison right now.");
        const result = await response.json() as Payload;
        if (!controller.signal.aborted) { setPayload(result); setStatus("ready"); }
      } catch {
        if (!controller.signal.aborted) { setPayload(null); setStatus("error"); setError("We couldn't load the comparison right now. Try again or check the companies' websites."); }
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [location, size, days]);

  // Never display a previous city's offers while the next lookup is in flight.
  const current = status === "ready" && payload &&
    payload.size === size && payload.days === days &&
    payload.location.query.trim().toLowerCase() === location.trim().toLowerCase()
    ? payload : null;
  const local = current?.littleJunkers;
  const results = current?.comparison.candidates ?? [];
  const visible = showMore ? results : results.slice(0, 2);
  const path = new URLSearchParams({ size: String(size), days: String(days) });
  if (/^\d{5}$/.test(location.trim())) path.set("zip", location.trim());
  else if (location.trim()) path.set("location", location.trim());
  const planHref = "/plan?" + path.toString();

  return <div className="comparison-tool">
    <form className="comparison-filters" onSubmit={(event) => event.preventDefault()} aria-label="Compare dumpster rentals">
      <div className="comparison-filters__location">
        <label htmlFor="comparison-city">City or ZIP</label>
        <input id="comparison-city" type="text" autoComplete="address-level2" maxLength={60}
          value={location} onChange={(event) => { setLocation(event.target.value); setShowMore(false); }}
          placeholder="Newnan or 30269" />
      </div>
      <fieldset className="comparison-filters__sizes">
        <legend>Dumpster size</legend>
        <div className="comparison-sizes">
          {sizes.map((value) => <button type="button" key={value} aria-pressed={size === value}
            className={size === value ? "active" : ""}
            onClick={() => { setSize(value); setShowMore(false); }}>{value}-yard</button>)}
        </div>
      </fieldset>
      <div className="comparison-filters__days">
        <label htmlFor="comparison-days">Rental length</label>
        <select id="comparison-days" value={days} onChange={(event) => { setDays(Number(event.target.value)); setShowMore(false); }}>
          {[3, 4, 5, 7, 10, 14, 21, 30].map((value) => <option key={value} value={value}>{value} days</option>)}
        </select>
      </div>
    </form>

    <div role="status" aria-live="polite" className="comparison-status">
      {status === "idle" ? "Enter your city or ZIP to check local options." :
       status === "error" ? error :
       !current ? "Checking local options…" :
       current.location.status === "served" ? "Published offers for " + current.location.label + ". Confirm delivery and final price directly." :
       current.location.status === "split" ? "Enter your ZIP for a more precise delivery estimate." :
       "We couldn't confirm the delivery area. Contact each company for service availability."}
    </div>

    <div className="comparison-results">
      <article className="comparison-card comparison-card--lj">
        <p className="comparison-card__eyebrow">Little Junkers</p>
        <h2>{size}-yard dumpster</h2>
        <p className="comparison-card__price">{local?.base !== null && local?.base !== undefined ? formatUsd(local.base) : "Check current price"}</p>
        <p className="comparison-card__price-note">3-day base {local?.base !== null && local?.base !== undefined ? "estimate" : "price"}</p>
        <dl>
          <div><dt>Actual size</dt><dd>{size} yards</dd></div>
          <div><dt>Rental duration</dt><dd>{days} days selected</dd></div>
          <div><dt>Included weight</dt><dd>{local ? local.includedTons + " tons" : "Checking"}</dd></div>
          <div><dt>Delivery</dt><dd>{local ? (local.deliveryFee === null ? "Not yet priced" : local.deliveryFee === 0 ? "Free for this area" : formatUsd(local.deliveryFee)) : "Check city or ZIP"}</dd></div>
          <div><dt>Extra weight</dt><dd>{local ? money(local.overagePerTon) + (local.overagePerTon !== null ? "/ton" : "") : "Checking"}</dd></div>
        </dl>
        {days > 3 ? <p className="comparison-card__notice">{days - 3} additional days are not yet included in this estimate.</p> : null}
        <Link className="btn btn--primary btn--block" href={planHref}>See my estimate</Link>
        <p className="fine">The final price and delivery availability are confirmed before booking.</p>
      </article>
      {visible.map((offer) => <article className="comparison-card" key={offer.providerId}>
        <p className="comparison-card__eyebrow">{offer.coverage === "verified" ? "Local company" : "Company · delivery area unverified"}</p>
        <h2>{offer.name}</h2>
        <p className="comparison-card__price">{offer.priceStatus === "verified" ? money(offer.price) : "Price not verified"}</p>
        <p className="comparison-card__price-note">{offer.priceStatus !== "verified" ? "Check directly for current terms" :
          offer.priceQualifier === "starting_plus_delivery" ? "Starting price for " + offer.priceDays + " days; delivery extra" :
          "Published " + offer.priceDays + "-day offer; delivery fee unconfirmed"}</p>
        <dl>
          <div><dt>Actual size</dt><dd>{offer.actualYards}-yard {offer.containerType ?? "container"}</dd></div>
          <div><dt>Rental duration</dt><dd>{offer.priceDays ? offer.priceDays + " days" : "Not verified"}</dd></div>
          <div><dt>Included weight</dt><dd>{offer.includedTons !== null ? offer.includedTons + " tons" : "Not verified"}</dd></div>
          <div><dt>Delivery for your area</dt><dd>{offer.coverage === "verified" ? "City listed; fee not confirmed" : "Service area not verified"}</dd></div>
          <div><dt>Extra weight</dt><dd>{offer.overagePerPound !== null ? formatUsd(offer.overagePerPound) + "/lb" :
            offer.overagePerTon !== null ? money(offer.overagePerTon) + "/ton" : "Not verified"}</dd></div>
          <div><dt>Extra day</dt><dd>{offer.extraDayFee !== null ? money(offer.extraDayFee) + "/day (provider terms apply)" : "Not verified"}</dd></div>
        </dl>
        {offer.priceStatus === "verified" && offer.priceDays !== days ? <p className="comparison-card__notice">
          {offer.priceDays !== null && offer.priceDays > days
            ? "This offer includes up to " + offer.priceDays + " days; you selected " + days + ". The published price is shown without adjustment."
            : "This published price covers " + offer.priceDays + " days, shorter than your " + days + "-day selection. Extra days are not included."}
        </p> : null}
        {offer.verifiedOn ? <p className="fine">Price source checked {labelDate(offer.verifiedOn)}.</p> :
          <p className="fine">A current price and location-specific offer have not been confirmed.</p>}
        <a className="btn btn--secondary btn--block" href={offer.website} target="_blank" rel="noopener noreferrer">
          Visit {offer.name} <span aria-hidden="true">↗</span>
        </a>
        {offer.sourceUrl ? <p className="fine"><a href={offer.sourceUrl} target="_blank" rel="noopener noreferrer">View published offer</a></p> : null}
      </article>)}
      {current && results.length < 2 && <article className="comparison-card comparison-card--empty">
        <h2>More local companies</h2>
        <p>We haven't confirmed two comparable offers for this location and size yet. That doesn't mean other companies don't serve your area.</p>
        <p>We only show a price when the source, rental term and local coverage have been verified.</p>
      </article>}
    </div>
    {results.length > 2 && <button className="btn btn--secondary comparison-more" type="button"
      aria-expanded={showMore} onClick={() => setShowMore((value) => !value)}>
      {showMore ? "Show fewer companies" : "See more companies (" + (results.length - 2) + ")"}
    </button>}
    {current && current.comparison.status !== "ready" &&
      <p className="comparison-source-note">Competitor details are temporarily unavailable; please check the companies directly.</p>}
    <p className="comparison-source-note">Prices are based on each company's stated terms. Dumpster sizes, included weight, fees and rental days can differ. An external website may show a different price at checkout.</p>
    <p className="fine"><Link href="/pricing">Little Junkers pricing details</Link> · <Link href="/long-term-rental">Need more than 30 days?</Link></p>
  </div>;
}
