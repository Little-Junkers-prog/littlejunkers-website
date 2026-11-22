"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedArea, useSavedLocationQuery } from "./ZipContext";
import { company, smsHref, telHref } from "@/lib/company";
import { formatUsd, type AreaResult, type SizeYards } from "@/lib/pricing";
import { estimateDaysPlus, type BasePriceMap, type ApprovedDaysPlusRates } from "@/lib/days-plus";

type Props = {
  initialSize?: SizeYards;
  initialDays?: number;
  initialZip?: string;
  initialLocation?: string;
  basePrices: BasePriceMap | null;
  daysPlusRates: ApprovedDaysPlusRates | null;
};
type Lookup =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "error"; query: string }
  | { status: "done"; query: string; result: AreaResult };
const sizes: SizeYards[] = [11, 16, 21];

function displayDate(value: string) {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return value;
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
  });
}

export default function DaysPlusPlanner({
  initialSize, initialDays = 3, initialZip, initialLocation, basePrices, daysPlusRates
}: Props) {
  const savedArea = useSavedArea();
  const savedLocation = useSavedLocationQuery();
  const [size, setSize] = useState<SizeYards | undefined>(initialSize);
  const [days, setDays] = useState(Math.max(3, Math.min(30, initialDays)));
  const [location, setLocation] = useState(initialLocation ?? initialZip ?? "");
  const [date, setDate] = useState("");
  const [lookup, setLookup] = useState<Lookup>({ status: "idle" });
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (!initialLocation && !initialZip && !location) {
      const known = savedLocation || savedArea?.zip;
      if (known) setLocation(known);
    }
    // Saved location is the initial default, never a forceful overwrite of user edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLocation, savedArea?.zip]);

  // One customer-facing city/ZIP field; no guessed ZIP from a multi-ZIP city.
  // This uses the website's existing canonical, read-only service-area endpoint.
  useEffect(() => {
    const q = location.trim();
    if (q.length < 2 || (/^\d+$/.test(q) && q.length !== 5)) {
      setLookup({ status: "idle" });
      return;
    }
    const abort = new AbortController();
    const timer = window.setTimeout(async () => {
      setLookup({ status: "loading", query: q });
      try {
        const response = await fetch("/api/service-area?q=" + encodeURIComponent(q), { signal: abort.signal });
        if (!response.ok) throw new Error("Service lookup unavailable");
        const result = (await response.json()) as AreaResult;
        if (!abort.signal.aborted) setLookup({ status: "done", query: q, result });
      } catch {
        if (!abort.signal.aborted) setLookup({ status: "error", query: q });
      }
    }, 350);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [location]);

  const currentQuery = location.trim();
  const currentResult = lookup.status === "done" && lookup.query === currentQuery ? lookup.result : null;
  const verifiedArea = currentResult?.status === "served" ? currentResult : null;
  const areaFee = verifiedArea ? verifiedArea.zone.deliveryFee : null;
  const estimate = estimateDaysPlus({ basePrices, rates: daysPlusRates, size, days, deliveryFee: areaFee });
  const startingBase = basePrices ? Math.min(...Object.values(basePrices)) : null;
  const extraDays = estimate.extraDays;
  const needsDaysPrice = estimate.missing.includes("extra_day_rate");
  const fullRentalSubtotal = estimate.estimatedRentalSubtotal;
  const knownSubtotal = estimate.knownSubtotal;

  let areaMessage = "Enter a city or ZIP to check delivery fees.";
  if (currentQuery) {
    if (lookup.status === "loading" && lookup.query === currentQuery) areaMessage = "Checking " + currentQuery + "…";
    else if (currentResult?.status === "served") {
      areaMessage = "We deliver to " + currentResult.label + ". Delivery fee: " + (currentResult.zone.deliveryFee === 0 ? "free" : formatUsd(currentResult.zone.deliveryFee)) + ".";
      if (currentResult.zips.length > 1) areaMessage += " We'll check your address before you book.";
    } else if (currentResult?.status === "split") {
      areaMessage = "We deliver in " + currentResult.label + ". The fee depends on your ZIP, so we'll confirm it with your address.";
    } else if (currentResult?.status === "unknown") areaMessage = "We couldn't confirm that location. Call or text us and we'll check.";
    else if (lookup.status === "error" && lookup.query === currentQuery) areaMessage = "We can't check that right now. Call or text us for your delivery fee.";
    else areaMessage = "Checking the delivery area…";
  }

  return (
    <div className="cx-planner">
      <div className="cx-planner__intro">
        <div>
          <p className="eyebrow">Plan your Pink Bin rental</p>
          <h3>Tell us what you need.</h3>
          <p>Pick your dumpster, tell us where it's going, and choose your dates. We'll show the rental charges as you go.</p>
        </div>
        <small>Preview · no reservations</small>
      </div>
      <div className="cx-planner__grid">
        <div className="cx-planner__form">
          <fieldset>
            <legend>1 · Dumpster size</legend>
            <div className="cx-planner__sizes">
              {sizes.map((yards) => (
                <button key={yards} type="button" aria-pressed={size === yards}
                  className={size === yards ? "selected" : ""}
                  onClick={() => { setSize(yards); setReviewed(false); }}>
                  {yards}<span>yard</span>
                </button>
              ))}
            </div>
            <p><Link href="/#sizes">Compare dumpster sizes</Link></p>
          </fieldset>
          <div className="cx-planner__field">
            <label htmlFor="plan-location">2 · Delivery city or ZIP</label>
            <input id="plan-location" type="text" inputMode="text" autoComplete="address-level2"
              value={location} maxLength={60} placeholder="e.g. Newnan or 30269"
              onChange={(event) => { setLocation(event.target.value); setReviewed(false); }} />
            <p role="status" aria-live="polite">{areaMessage}</p>
          </div>
          <div className="cx-planner__field">
            <label htmlFor="plan-date">3 · Preferred delivery date</label>
            <input id="plan-date" type="date" value={date}
              onChange={(event) => { setDate(event.target.value); setReviewed(false); }} />
            <p>We'll confirm your delivery date before booking.</p>
          </div>
          <fieldset>
            <legend>4 · Rental length</legend>
            <div className="cx-planner__days">
              <button type="button" aria-label="Remove one day" disabled={days === 3}
                onClick={() => { setDays((d) => Math.max(3, d - 1)); setReviewed(false); }}>−</button>
              <output>{days} <small>days</small></output>
              <button type="button" aria-label="Add one day" disabled={days === 30}
                onClick={() => { setDays((d) => Math.min(30, d + 1)); setReviewed(false); }}>+</button>
            </div>
            <label className="cx-planner__range-label" htmlFor="plan-days">Choose 3–30 days</label>
            <input id="plan-days" type="range" min={3} max={30} step={1} value={days}
              onChange={(event) => { setDays(Number(event.target.value)); setReviewed(false); }} />
            <p>{days === 3 ? "Your base rental covers three days." :
              estimate.extraDaysCharge !== null && estimate.perExtraDay !== null
                ? extraDays + " extra " + (extraDays === 1 ? "day" : "days") + " at " + formatUsd(estimate.perExtraDay) + "/day: " + formatUsd(estimate.extraDaysCharge) + "."
                : extraDays + " extra " + (extraDays === 1 ? "day" : "days") + ". We'll confirm the additional-day price before booking."}</p>
            <Link href="/long-term-rental">Need more than 30 days? Request a quote</Link>
          </fieldset>
        </div>
        <aside className="cx-planner__summary" aria-label="Rental pricing summary">
          <p className="eyebrow">Your estimate</p>
          <div className="cx-planner__pending" aria-live="polite">
            <p className="cx-planner__subtotal-label">{fullRentalSubtotal !== null ? "Estimated rental subtotal" :
              !size ? "Starting at · 3-day rental" : needsDaysPrice ? "Full rental price pending" : "Your price so far"}</p>
            <strong className="cx-estimate-price">
              {fullRentalSubtotal !== null ? formatUsd(fullRentalSubtotal) :
                !size && startingBase !== null ? formatUsd(startingBase) :
                needsDaysPrice ? "Extra days not priced" :
                knownSubtotal !== null ? formatUsd(knownSubtotal) : "Price unavailable"}
            </strong>
            <div className="cx-planner__breakdown">
              <div><span>3-day rental</span><strong>{size && estimate.base !== null ? formatUsd(estimate.base) : !size && startingBase !== null ? "From " + formatUsd(startingBase) : "Choose a size"}</strong></div>
              {extraDays > 0 ? <div className={needsDaysPrice ? "cx-planner__unpriced" : ""}>
                <span>{extraDays} extra {extraDays === 1 ? "day" : "days"}{estimate.perExtraDay !== null ? " × " + formatUsd(estimate.perExtraDay) : ""}</span>
                <strong>{estimate.extraDaysCharge !== null ? formatUsd(estimate.extraDaysCharge) : "Call for price"}</strong>
              </div> : null}
              <div><span>Delivery fee</span><strong>{estimate.delivery !== null ? formatUsd(estimate.delivery) : "Enter a city or ZIP"}</strong></div>
            </div>
            {needsDaysPrice ? <p className="cx-planner__incomplete">
              We can&apos;t show a {days}-day total online yet. The 3-day rental
              {estimate.base !== null ? " is " + formatUsd(estimate.base) : ""}
              {estimate.delivery !== null ? " and delivery is " + formatUsd(estimate.delivery) : ""}.
              Call or text us and we&apos;ll quote the extra days.
            </p> : null}
            <p className="fine">This is an estimate. We confirm your final price and delivery date before you pay.</p>
          </div>
          <dl>
            <div><dt>Dumpster</dt><dd>{size ? size + "-yard" : "Choose a size"}</dd></div>
            <div><dt>Delivery area</dt><dd>{verifiedArea ? verifiedArea.label : location || "Enter city or ZIP"}</dd></div>
            <div><dt>Delivery fee</dt><dd>{areaFee !== null ? formatUsd(areaFee) : "Not yet included"}</dd></div>
            <div><dt>Requested date</dt><dd>{date ? displayDate(date) : "Choose a date"}</dd></div>
            <div><dt>Rental length</dt><dd>{days} days</dd></div>
          </dl>
          <button type="button" className="btn btn--primary btn--block" onClick={() => setReviewed(true)}>Review rental details</button>
          {reviewed ? <p role="status" className="cx-planner__status">
            {!size ? "Pick a size to see your price." :
              !currentQuery ? "Enter a city or ZIP to check delivery fees." :
              !date ? "Pick the day you want it." :
              currentResult?.status === "unknown" ? "Call or text us and we'll check that location." :
              needsDaysPrice ? "We can't price extra days online yet. Call or text us and we'll give you the full price." :
              fullRentalSubtotal === null ? "We'll confirm the delivery fee and any other charges before you book." :
              "That's your estimate. We'll confirm the date and any other charges before you pay."}
          </p> : null}
          <p className="fine"><a href={telHref}>Call {company.phoneDisplay}</a> or <a href={smsHref}>text us</a> with questions.</p>
        </aside>
      </div>
    </div>
  );
}
