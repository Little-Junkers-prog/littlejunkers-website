"use client";

import { useId, useState } from "react";
import { company, smsHref, telHref } from "@/lib/company";
import type { AreaResult } from "@/lib/pricing";
import { saveArea, saveLocationQuery } from "./ZipContext";

type State = { status: "idle" } | { status: "loading" } | { status: "error" } | { status: "done"; result: AreaResult };

// City or ZIP serviceability check. Enhances a plain GET form: without script,
// the form submits to /service-areas, which renders the same answer on the server.
// Device location is not requested here. Manual entry is the default path.
export default function ZipCheck({ cta = "Check my area", label = "City or ZIP" }: { cta?: string; label?: string }) {
  const id = useId();
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!q) return;
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/service-area?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(String(res.status));
      const result = (await res.json()) as AreaResult;
      saveLocationQuery(result.status === "served" || result.status === "split" ? q : null);
      if (result.status === "served" && result.zips.length === 1) {
        saveArea({ zip: result.zips[0], label: result.label, deliveryFee: result.zone.deliveryFee });
      } else {
        saveArea(null);
      }
      setState({ status: "done", result });
    } catch {
      setState({ status: "error" });
    }
  }

  return (
    <div className="zip">
      <form action="/service-areas" method="get" onSubmit={onSubmit}>
        <label className="zip__label" htmlFor={id}>
          {label}
        </label>
        <div className="zip__row">
          <input
            className="zip__input"
            id={id}
            name="q"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="e.g. 30269 or Newnan"
            maxLength={60}
            required
          />
          <button className="btn btn--primary" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Checking…" : cta}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {state.status === "error" ? (
          <div className="zip__result">
            <h3>We couldn&apos;t check that just now</h3>
            <p>
              Call or text <a href={telHref}>{company.phoneDisplay}</a> and we&apos;ll tell you right away.
            </p>
          </div>
        ) : null}
        {state.status === "done" ? <AreaAnswer result={state.result} /> : null}
      </div>
    </div>
  );
}

export function AreaAnswer({ result }: { result: AreaResult }) {
  if (result.status === "unknown") {
    return (
      <div className="zip__result">
        <h3>We may still deliver there</h3>
        <p>
          &ldquo;{result.query}&rdquo; isn&apos;t on our list yet. Call or text{" "}
          <a href={telHref}>{company.phoneDisplay}</a> and we&apos;ll check for you.
        </p>
        <div className="btn-row" style={{ marginTop: 12 }}>
          <a className="btn btn--primary" href={smsHref}>
            Text us
          </a>
          <a className="btn btn--secondary" href={telHref}>
            Call us
          </a>
        </div>
      </div>
    );
  }

  if (result.status === "split") {
    return (
      <div className="zip__result">
        <h3>We deliver in {result.label}</h3>
        <p>Delivery fees vary by ZIP here. We can confirm the fee using your full address before booking.</p>
        <div className="btn-row" style={{ marginTop: 12 }}><a className="btn btn--primary" href={"/plan?location=" + encodeURIComponent(result.query)}>See my estimate</a></div>
      </div>
    );
  }

  const zip = result.zips.length === 1 ? result.zips[0] : undefined;
  return (
    <div className="zip__result">
      <h3>Yes, we deliver to {result.label}</h3>
      <dl>
        <dt>Delivery fee</dt>
        <dd>{result.zone.deliveryFee === 0 ? "Free ($0)" : `+$${result.zone.deliveryFee}, added to the rental price`}</dd>
        <dt>ZIP{result.zips.length > 1 ? "s" : ""}</dt>
        <dd>{result.zips.join(", ")}</dd>
      </dl>
      <div className="btn-row">
        <a className="btn btn--primary" href={zip ? "/plan?zip=" + encodeURIComponent(zip) : "/plan?location=" + encodeURIComponent(result.query)}>
          See my estimate
        </a>
        <a className="btn btn--secondary" href="/#sizes">
          See sizes and prices
        </a>
      </div>
    </div>
  );
}
