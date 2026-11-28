"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedArea, useSavedLocationQuery } from "./ZipContext";
import { formatTons, formatUsd } from "@/lib/pricing";
import CompetitorExitDialog, { type CompetitorExitTarget } from "./CompetitorExitDialog";

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
  request: { location: string; size: number; days: number };
  location: Area; size: number; days: number;
  littleJunkers: {
    base: number | null; baseDays: number; includedTons: number;
    overagePerTon: number | null; deliveryFee: number | null;
    knownSubtotal: number | null; additionalDaysPriced: boolean;
    extraDaysCharge: number | null; perExtraDay: number | null;
    estimatedRentalSubtotal: number | null; confirmedQuote: false;
  };
  comparison: { status: "ready" | "source_unavailable"; source: "live" | "review_snapshot" | "unavailable"; snapshotAsOf: string | null; verifiedLocalCount: number; fallbackUsed: boolean; candidates: Offer[] };
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
  const [exitTarget, setExitTarget] = useState<CompetitorExitTarget | null>(null);
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
        if (!controller.signal.aborted) { setPayload(null); setStatus("error"); setError("We couldn't load the prices right now. Try again in a minute."); }
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [location, size, days]);

  // Never display a previous city's offers while the next lookup is in flight.
  const current = status === "ready" && payload &&
    payload.size === size && payload.days === days &&
    payload.request.location.trim().toLowerCase() === location.trim().toLowerCase()
    ? payload : null;
  const local = current?.littleJunkers;
  const results = current?.comparison.candidates ?? [];
  const visible = showMore ? results : results.slice(0, 2);
  const visibleCount = visible.length;
  const showCompetitorCue = !!current && current.comparison.status === "ready" && visibleCount > 0;
  const localSubtotal = local?.estimatedRentalSubtotal ?? null;
  const incompleteDays = days > 3 && !local?.additionalDaysPriced;
  // Anonymous first-party click count. Navigation always wins if reporting fails.
  // No cookies, visitor ID, name, phone or address are sent in this payload.
  function recordCompetitorClick(providerId: string, action: "detail" | "outbound") {
    void fetch("/api/comparison/click", {
      method:"POST",headers:{"Content-Type":"application/json"},
      credentials:"same-origin",cache:"no-store",keepalive:true,
      body:JSON.stringify({providerId,size,days,action})
    }).catch(()=>undefined);
  }
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
          {Array.from({ length: 28 }, (_, i) => i + 3).map((value) => <option key={value} value={value}>{value} days</option>)}
        </select>
      </div>
    </form>

    <div role="status" aria-live="polite" className="comparison-status">
      {status === "idle" ? "Enter your city or ZIP to check local options." :
       status === "error" ? error :
       !current ? "Checking local options…" :
       current.location.status === "served" ? "Prices for " + current.location.label + ". Check the final price and delivery with each company." :
       current.location.status === "split" ? "Type your ZIP to get a closer delivery price." :
       "We haven't confirmed two other companies that deliver to " + current.request.location + ". Here are some nearby ones."}
    </div>

    {current?.comparison.fallbackUsed && <div className="comparison-fallback" role="note">
      <strong>Nearby companies</strong>
      <p>
        We haven&apos;t found two other companies that deliver to {current.request.location}.
        These companies are nearby and have similar dumpsters. We <strong>don&apos;t know</strong> if
        they deliver to you or what they&apos;d charge. Ask them.
      </p>
    </div>}
    {showCompetitorCue && <div className="comparison-scroll-hint">
      <span className="comparison-scroll-hint__label">Your comparisons are ready</span>
      <a href="#comparison-competitors" className="comparison-scroll-hint__link">
        View {visibleCount} more {visibleCount === 1 ? "company" : "companies"} below
        <span className="comparison-scroll-hint__arrow" aria-hidden="true">↓</span>
      </a>
    </div>}
    <div className="comparison-results">
      <article className="comparison-card comparison-card--lj">
        <p className="comparison-card__eyebrow">Little Junkers</p>
        <h2>{size}-yard dumpster</h2>
        <p className="comparison-card__price">
          {incompleteDays ? "Full price pending" :
            localSubtotal !== null ? formatUsd(localSubtotal) :
            local?.knownSubtotal !== null && local?.knownSubtotal !== undefined ? formatUsd(local.knownSubtotal) :
            local?.base !== null && local?.base !== undefined ? formatUsd(local.base) : "Check current price"}
        </p>
        <p className="comparison-card__price-note">
          {incompleteDays ? "3-day rental: " + (local?.base !== null && local?.base !== undefined ? formatUsd(local.base) : "Checking") + ". Call us to price the other " + (days - 3) + " days." :
            localSubtotal !== null ? "Estimate for " + days + " days. Other fees may apply." :
            "Price so far. Delivery and other fees may apply."}
        </p>
        <dl>
          <div><dt>Size</dt><dd>{size}-yard dumpster</dd></div>
          <div><dt>Rental duration</dt><dd>{days} days</dd></div>
          <div><dt>Included weight</dt><dd>{local ? formatTons(local.includedTons) : "Checking"}</dd></div>
          <div><dt>Delivery</dt><dd>{local ? (local.deliveryFee === null ? "Not yet priced" : local.deliveryFee === 0 ? "Free for this area" : formatUsd(local.deliveryFee)) : "Check city or ZIP"}</dd></div>
          <div><dt>Extra weight</dt><dd>{local ? money(local.overagePerTon) + (local.overagePerTon !== null ? "/ton" : "") : "Checking"}</dd></div>
          <div><dt>Extra day</dt><dd>{days > 3 && local?.perExtraDay !== null && local?.perExtraDay !== undefined
          ? formatUsd(local.perExtraDay) + "/day" : "Rate not yet confirmed"}</dd></div>
        </dl>
        {incompleteDays ? <p className="comparison-card__notice">The other {days - 3} days aren&apos;t in this price yet. Call or text us and we&apos;ll quote them.</p> : null}
        <Link className="btn btn--primary btn--block" href={planHref}>See my estimate</Link>
        <p className="fine">We confirm your final price and delivery date before you book.</p>
      </article>
      {showCompetitorCue && <div className="comparison-between-cards">
        <span>Keep scrolling to compare the other companies</span>
        <a href="#comparison-competitors" aria-label="Jump to competitor offers">
          <span className="comparison-scroll-hint__arrow" aria-hidden="true">↓</span>
        </a>
      </div>}
      {visible.map((offer, index) => <article className="comparison-card"
        key={offer.providerId} id={index === 0 ? "comparison-competitors" : undefined}>
        <p className="comparison-card__eyebrow">{offer.coverage === "verified" ? "Serves your city" : "Nearby · may not deliver to you"}</p>
        <h2>{offer.name}</h2>
        <p className="comparison-card__price">
          {offer.priceStatus !== "verified" ? "No posted price" :
           offer.priceDays !== null && offer.priceDays < days ? "Request " + days + "-day price" :
           (offer.priceQualifier === "starting_plus_delivery" ? "From " : "") + money(offer.price)}
        </p>
        <p className="comparison-card__price-note">
          {offer.priceStatus !== "verified" ? "Check their website for current prices" :
           offer.priceDays !== null && offer.priceDays < days
             ? money(offer.price) + " for up to " + offer.priceDays + " days. Ask them about " + days + " days."
             : offer.priceQualifier === "starting_plus_delivery"
               ? "Starting price for " + offer.priceDays + " days, plus delivery"
               : "Price for " + offer.priceDays + " days. Ask them about delivery."}
        </p>
        <dl>
          <div><dt>Size</dt><dd>{offer.actualYards}-yard {offer.containerType === "dump_trailer" ? "dump trailer" : "dumpster"}</dd></div>
          <div><dt>Rental duration</dt><dd>{offer.priceDays ? offer.priceDays + " days" : "Not posted"}</dd></div>
          <div><dt>Included weight</dt><dd>{offer.includedTons !== null ? formatTons(offer.includedTons) : "Not posted"}</dd></div>
          <div><dt>Delivery</dt><dd>Fee not confirmed</dd></div>
          <div><dt>Extra weight</dt><dd>{offer.overagePerPound !== null ? formatUsd(offer.overagePerPound) + "/lb" :
            offer.overagePerTon !== null ? money(offer.overagePerTon) + "/ton" : "Not posted"}</dd></div>
          <div><dt>Extra day</dt><dd>{offer.extraDayFee !== null ? money(offer.extraDayFee) + "/day" : "Not posted"}</dd></div>
        </dl>
        {offer.priceStatus === "verified" && offer.priceDays !== days ? <p className="comparison-card__notice">
          {offer.priceDays !== null && offer.priceDays > days
            ? "Their price covers up to " + offer.priceDays + " days. We didn't lower it for your " + days + " days."
            : "Their price covers " + offer.priceDays + " days, so the rest of your " + days + " days aren't included."}
        </p> : null}
        <a className="btn btn--secondary btn--block" href={offer.sourceUrl ?? offer.website} target="_blank" rel="noopener noreferrer"
          onAuxClick={() => recordCompetitorClick(offer.providerId, "outbound")}
          onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
              recordCompetitorClick(offer.providerId, "outbound");
              return;
            }
            event.preventDefault();
            recordCompetitorClick(offer.providerId, "detail");
            setExitTarget({ providerId: offer.providerId, name: offer.name, website: offer.website, destination: offer.sourceUrl ?? offer.website });
          }}>
          Visit {offer.name} <span aria-hidden="true">↗</span>
        </a>
        <p className="fine comparison-card__source">
          Independent provider; not affiliated with Little Junkers.{" "}
          {offer.verifiedOn
            ? <> We checked their website on {labelDate(offer.verifiedOn)}.</>
            : <> We haven&apos;t checked their current prices.</>}
          {" "}Confirm prices and terms with them.
        </p>
      </article>)}
      {current && current.comparison.status === "ready" && results.length < 2 && <article className="comparison-card comparison-card--empty">
        <h2>More local companies</h2>
        <p>We haven&apos;t found two other companies with posted prices for this size here yet. Others may still serve your area.</p>
      </article>}
    </div>
    {results.length > 2 && <button className="btn btn--secondary comparison-more" type="button"
      aria-expanded={showMore} onClick={() => setShowMore((value) => !value)}>
      {showMore ? "Show fewer companies" : "See more companies (" + (results.length - 2) + ")"}
    </button>}
    {current && current.comparison.status !== "ready" &&
      <p className="comparison-source-note" role="alert">Other companies' prices won't load right now. Try again in a minute.</p>}
    {current?.comparison.source === "review_snapshot" &&
      <p className="comparison-source-note">We last checked other companies' prices on {labelDate(current.comparison.snapshotAsOf)}. They may have changed since.</p>}
    <p className="comparison-source-note">Other companies' details come from offers publicly posted on each company's website. Little Junkers isn't affiliated with these companies. They don't endorse us, and we don't act for them. Their prices, days, weight limits and fees can change or be different where you live. Check with each company before you rent.</p>
    <p className="fine"><Link href="/pricing">Our prices and fees</Link> · <Link href="/long-term-rental">Need more than 30 days?</Link></p>
    <CompetitorExitDialog target={exitTarget} onClose={() => setExitTarget(null)}
      onOutboundClick={(providerId) => recordCompetitorClick(providerId, "outbound")}
      location={current?.location.status === "served"
        ? (/^\d{5}$/.test(location.trim()) ? location.trim() : current.location.label)
        : ""} size={size} days={days} />
  </div>;
}
