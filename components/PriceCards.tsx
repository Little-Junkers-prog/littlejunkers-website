import Link from "next/link";
import { company, smsHref, telHref } from "@/lib/company";
import { formatTons, formatUsd, type Pricing } from "@/lib/pricing";
import { sizes } from "@/lib/sizes";
import Photo from "./Photo";
import { DeliveryLine } from "./ZipContext";
import { PlanLink } from "./PlanLink";
import { threeDayTier } from "@/lib/days-plus";

// Three size cards with live prices from the canonical pricing contract.
// Badges render only when Finance set a `badge_tag` on the tier. No popularity
// claims are added here.
export default function PriceCards({ pricing, zip, location, deliveryFee }: { pricing: Pricing | null; zip?: string; location?: string; deliveryFee?: number }) {
  if (!pricing) return <PricingUnavailable />;
  const from = threeDayTier(pricing);
  if (!from) return <PricingUnavailable />;

  return (
    <>
      <div className="grid grid--3">
        {sizes.map((size) => (
          <article key={size.slug} className="card card--elevated price-card">
            <div className="price-card__photo">
              <Photo photo={size.hero} caption={false} />
            </div>
            <div className="price-card__body">
              <p className="price-card__size">{size.yards}-yard dumpster</p>
              <h3>{size.name}</h3>
              <p className="price">
                <small>3-day base</small> {formatUsd(from.prices[size.yards])}
              </p>
              <p className="muted">{size.fitLine}</p>
              <RateList pricing={pricing} yards={size.yards} />
              <div className="price-card__actions">
                <PlanLink className="btn btn--primary btn--block" size={size.yards} zip={zip} location={location}>See my estimate</PlanLink>
                <Link className="btn btn--secondary btn--block" href={"/" + size.slug}>Is the {size.yards}-yard right for me?</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="fine" style={{ marginTop: 14 }}>
        {deliveryFee === undefined ? (
          <DeliveryLine fallback="A delivery fee may apply outside our core area. Enter your ZIP above to see yours." />
        ) : deliveryFee === 0 ? (
          "Delivery is free for this area."
        ) : (
          `A ${formatUsd(deliveryFee)} delivery fee is added for this area.`
        )}{" "}
        Extra days and weight over the included amount cost more.
      </p>
    </>
  );
}

// What the starting price covers, and the two rates that can add to it.
// Every number is canonical: tier price, daily_overage, included_tons, fees.
export function RateList({ pricing, yards }: { pricing: Pricing; yards: 11 | 16 | 21 }) {
  const from = threeDayTier(pricing);
  if (!from) return null;
  return (
    <ul className="tiers" aria-label={`${yards}-yard pricing details`}>
      <li>
        <span>Base rental</span>
        <strong>{from.days} days</strong>
      </li>
      <li>
        <span>Disposal included</span>
        <strong>{formatTons(pricing.sizes[yards].includedTons)}</strong>
      </li>
      {pricing.overagePerTon ? (
        <li>
          <span>Over the included weight</span>
          <strong>{formatUsd(pricing.overagePerTon)} per ton</strong>
        </li>
      ) : null}
    </ul>
  );
}

// Shown when canonical pricing can't be read. Never a stale number.
export function PricingUnavailable() {
  return (
    <div className="notice">
      <h3>Prices aren&apos;t loading right now</h3>
      <p style={{ margin: "6px 0 14px" }}>
        Call or text {company.phoneDisplay} and we&apos;ll give you today&apos;s price.
      </p>
      <div className="btn-row">
        <a className="btn btn--primary" href="/plan">
          Plan your rental
        </a>
        <a className="btn btn--secondary" href={telHref}>
          Call
        </a>
        <a className="btn btn--secondary" href={smsHref}>
          Text
        </a>
      </div>
    </div>
  );
}
