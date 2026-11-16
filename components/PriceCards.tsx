import Link from "next/link";
import { bookingUrl, company, smsHref, telHref } from "@/lib/company";
import { formatTons, formatUsd, startingTier, type Pricing } from "@/lib/pricing";
import { sizes } from "@/lib/sizes";
import Photo from "./Photo";

// Three size cards with live prices from the canonical pricing contract.
// Badges render only when Finance set a `badge_tag` on the tier. No popularity
// claims are added here.
export default function PriceCards({ pricing, zip, deliveryFee }: { pricing: Pricing | null; zip?: string; deliveryFee?: number }) {
  if (!pricing) return <PricingUnavailable />;
  const from = startingTier(pricing);

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
                {formatUsd(from.prices[size.yards])} <small>for {from.days} days</small>
              </p>
              <p className="muted">
                {formatTons(pricing.sizes[size.yards].includedTons)} of disposal included. {size.fitLine}
              </p>
              <ul className="tiers" aria-label={`${size.yards}-yard rental lengths`}>
                {pricing.tiers.map((tier) => (
                  <li key={tier.tierKey}>
                    <span>
                      {tier.days} days
                      {tier.badge ? <span className="tag">{tier.badge}</span> : null}
                    </span>
                    <strong>{formatUsd(tier.prices[size.yards])}</strong>
                  </li>
                ))}
              </ul>
              <div className="price-card__actions">
                <a className="btn btn--primary btn--block" href={bookingUrl({ size: size.yards, zip })}>
                  Check Dates &amp; Book
                </a>
                <Link className="btn btn--secondary btn--block" href={`/${size.slug}`}>
                  Is the {size.yards}-yard right for me?
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="fine" style={{ marginTop: 14 }}>
        {deliveryFee === undefined
          ? "Prices are the dumpster rental. A delivery fee may apply outside our core area."
          : deliveryFee === 0
            ? "Delivery is free for this area."
            : `A ${formatUsd(deliveryFee)} delivery fee is added for this area.`}{" "}
        Extra days and extra weight only apply if you use them.
      </p>
    </>
  );
}

// Shown when canonical pricing can't be read. Never a stale number.
export function PricingUnavailable() {
  return (
    <div className="notice">
      <h3>See today&apos;s prices when you book</h3>
      <p style={{ margin: "6px 0 14px" }}>
        We can&apos;t show live prices here right now. The booking page has them, or call or text {company.phoneDisplay}.
      </p>
      <div className="btn-row">
        <a className="btn btn--primary" href={bookingUrl()}>
          See Prices &amp; Availability
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
