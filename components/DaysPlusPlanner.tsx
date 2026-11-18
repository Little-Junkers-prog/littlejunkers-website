"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedArea } from "./ZipContext";
import { company, smsHref, telHref } from "@/lib/company";
import type { SizeYards } from "@/lib/pricing";

type Props = { initialSize?: SizeYards; initialDays?: number; initialZip?: string };
const choices: SizeYards[] = [11, 16, 21];

export default function DaysPlusPlanner({ initialSize, initialDays = 3, initialZip }: Props) {
  const savedArea = useSavedArea();
  const [size, setSize] = useState<SizeYards | undefined>(initialSize);
  const [days, setDays] = useState(Math.max(3, Math.min(30, initialDays)));
  const [zip, setZip] = useState(initialZip ?? "");
  const [date, setDate] = useState("");
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => {
    if (!zip && savedArea?.zip) setZip(savedArea.zip);
  }, [zip, savedArea]);
  const validZip = /^\d{5}$/.test(zip);
  const extra = days - 3;

  return (
    <div className="cx-planner">
      <div className="cx-planner__intro">
        <div>
          <p className="eyebrow">Days Plus · rental planner</p>
          <h3>Build the rental around your project.</h3>
          <p>Start with 3 days and add up to 27 more. This planning screen does not create a booking or hold.</p>
        </div>
        <small>Planning preview</small>
      </div>
      <div className="cx-planner__grid">
        <div className="cx-planner__form">
          <fieldset>
            <legend>1 · Pick your dumpster</legend>
            <div className="cx-planner__sizes">
              {choices.map((yards) => (
                <button key={yards} type="button" aria-pressed={size === yards} className={size === yards ? "selected" : ""} onClick={() => { setSize(yards); setReviewed(false); }}>
                  {yards}<span>yard</span>
                </button>
              ))}
            </div>
            <p>Need to compare sizes? <Link href="/#sizes">View dumpster details</Link>.</p>
          </fieldset>
          <div className="cx-planner__field">
            <label htmlFor="plan-zip">2 · Jobsite ZIP</label>
            <input id="plan-zip" type="text" inputMode="numeric" autoComplete="postal-code" value={zip} maxLength={5} onChange={(event) => { setZip(event.target.value.replace(/\D/g, "").slice(0,5)); setReviewed(false); }} placeholder="e.g. 30269" />
            <p>{validZip ? "ZIP format accepted. Serviceability and zone fee must still be verified." : "Five-digit ZIP required. No availability has been confirmed."}</p>
          </div>
          <div className="cx-planner__field">
            <label htmlFor="plan-date">3 · Preferred delivery date</label>
            <input id="plan-date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setReviewed(false); }} />
            <p>Actual dates and delivery windows come from Fleet, not this preview.</p>
          </div>
          <fieldset>
            <legend>4 · Total rental days</legend>
            <div className="cx-planner__days">
              <button type="button" aria-label="Remove one day" disabled={days === 3} onClick={() => { setDays((d) => Math.max(3,d-1)); setReviewed(false); }}>−</button>
              <output>{days} <small>days</small></output>
              <button type="button" aria-label="Add one day" disabled={days === 30} onClick={() => { setDays((d) => Math.min(30,d+1)); setReviewed(false); }}>+</button>
            </div>
            <label className="cx-planner__range-label" htmlFor="plan-days">Adjust rental length</label>
            <input id="plan-days" type="range" min={3} max={30} step={1} value={days} onChange={(event) => { setDays(Number(event.target.value)); setReviewed(false); }}/>
            <p>3 included + {extra} additional {extra === 1 ? "day" : "days"}. Extra-day pricing is not yet approved.</p>
            <Link href="/long-term-rental">Need 31 days or longer? Get a custom quote →</Link>
          </fieldset>
        </div>
        <aside className="cx-planner__summary" aria-label="Rental plan summary">
          <p className="eyebrow">Your rental plan</p>
          <dl>
            <div><dt>Dumpster</dt><dd>{size ? size + "-yard" : "Not chosen"}</dd></div>
            <div><dt>ZIP</dt><dd>{validZip ? zip : "Unverified"}</dd></div>
            <div><dt>Preferred date</dt><dd>{date || "Not chosen"}</dd></div>
            <div><dt>Total length</dt><dd>{days} days</dd></div>
          </dl>
          <div className="cx-planner__pending">
            <strong>Final amount: pending</strong>
            <p>Delivery fees, additional-day rates, pickup scheduling and available inventory must be confirmed through the canonical pricing and Fleet systems.</p>
          </div>
          <button type="button" className="btn btn--primary btn--block" onClick={() => setReviewed(true)}>Review rental plan</button>
          {reviewed ? <p role="status" className="cx-planner__status">{!size ? "Please choose a dumpster size." : !validZip ? "Please enter a five-digit ZIP." : !date ? "Please select a preferred date." : "Your choices are ready for review. Booking and payment remain disabled until the Days Plus engine is verified."}</p> : null}
          <p className="fine">Need assistance? <a href={telHref}>Call {company.phoneDisplay}</a> or <a href={smsHref}>text us</a>.</p>
        </aside>
      </div>
    </div>
  );
}
