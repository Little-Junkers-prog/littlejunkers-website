"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTons, formatUsd, type Pricing, type SizeYards } from "@/lib/pricing";
import { sizes } from "@/lib/sizes";
import { threeDayTier } from "@/lib/days-plus";
import { PlanLink } from "@/components/PlanLink";
import { DeliveryLine } from "@/components/ZipContext";

const choices: SizeYards[] = [11, 16, 21];

/**
 * First-party, interactive product comparison for the homepage.
 * This is presentation-only: current base prices and included tonnage
 * come from the existing canonical API. Booking stays in the existing /plan flow.
 * City pages keep their original PriceCards component and SEO structure.
 */
export default function PinkBinExperience({ pricing }: { pricing: Pricing }) {
  const [selected, setSelected] = useState<SizeYards>(11);
  const tier = threeDayTier(pricing);
  const size = sizes.find((item) => item.yards === selected) ?? sizes[0];

  if (!tier) {
    return (
      <div className="notice" role="status">
        <h3>We can’t load our current rental prices</h3>
        <p>Call or text us to check the rate for your job.</p>
        <Link href="/pricing">See pricing details</Link>
      </div>
    );
  }

  const included = pricing.sizes[selected]?.includedTons;
  const price = tier.prices[selected];

  return (
    <div className="bin-shop">
      <div className="bin-shop__intro">
        <p className="eyebrow">Choose your Pink Bin</p>
        <p>Pick a size to see it up close. Every bin has the same 12-by-8-foot footprint; the sides get taller as you go up.</p>
      </div>

      <div className="bin-shop__choices" role="group" aria-label="Choose a dumpster size">
        {choices.map((yards) => {
          const option = sizes.find((item) => item.yards === yards)!;
          const active = selected === yards;
          return (
            <button
              key={yards}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(yards)}
              className={`bin-shop__choice${active ? " bin-shop__choice--active" : ""}`}
            >
              <span className="bin-shop__choice-number">{yards}<small>yd³</small></span>
              <span className="bin-shop__choice-info">
                <strong>{option.name}</strong>
                <small>{option.yards === 11 ? "Small cleanouts" : option.yards === 16 ? "Remodels & bigger cleanouts" : "Bulky, larger cleanouts"}</small>
              </span>
              <span className="bin-shop__choice-price">
                <span>{formatUsd(tier.prices[yards])}</span>
                <small>3-day base</small>
              </span>
              <span className="bin-shop__choice-check" aria-hidden="true">{active ? "✓" : "↗"}</span>
            </button>
          );
        })}
      </div>

      <div className="bin-shop__stage" id="pink-bin-details">
        <div className="bin-shop__photo-panel">
          <div className="bin-shop__photo-backdrop" aria-hidden="true" />
          <div className="bin-shop__photo" key={selected}>
            <Image
              src={size.hero.src}
              alt={size.hero.alt}
              width={size.hero.width}
              height={size.hero.height}
              sizes="(max-width: 740px) 100vw, 52vw"
              priority={false}
            />
          </div>
          <div className="bin-shop__photo-index" aria-hidden="true">
            <span>THE PINK BIN LINEUP</span>
            <strong>{selected}<small>YARD</small></strong>
          </div>
          <p className="bin-shop__photo-credit">Real Little Junkers equipment · {size.hero.caption ?? "From our service area"}</p>
        </div>

        <div className="bin-shop__details" aria-live="polite" aria-atomic="false">
          <p className="eyebrow">Meet your Pink Bin</p>
          <h3>{size.name}</h3>
          <p className="bin-shop__details-description">{size.fitLine}</p>
          <div className="bin-shop__price">
            <div>
              <small>3-day base rental</small>
              <strong>{formatUsd(price)}</strong>
            </div>
            <span>Price before any ZIP-based delivery fee or extra charges</span>
          </div>
          <div className="bin-shop__fits">
            <h4>A good fit for</h4>
            <ul>
              {size.fitTiles.slice(0, 3).map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>
          <dl className="bin-shop__facts">
            <div><dt>Dumpster size</dt><dd>{selected} cubic yards</dd></div>
            <div><dt>Included disposal weight</dt><dd>{typeof included === "number" ? formatTons(included) : "Confirm with us"}</dd></div>
            <div><dt>Footprint</dt><dd>{size.box.lengthFt} ft × {size.box.widthFt} ft</dd></div>
            <div><dt>Sidewall height</dt><dd>{size.box.wallFt} ft</dd></div>
            {pricing.overagePerTon != null ? (
              <div><dt>Extra disposal weight</dt><dd>{formatUsd(pricing.overagePerTon)}/ton</dd></div>
            ) : null}
          </dl>
          <p className="bin-shop__delivery"><DeliveryLine fallback="Enter your city or ZIP to confirm the delivery fee." /></p>
          <div className="bin-shop__actions">
            <PlanLink className="btn btn--primary" size={selected}>
              Start with the {selected}-yard
            </PlanLink>
            <Link className="btn btn--secondary" href={`/${size.slug}`}>
              See size details
            </Link>
          </div>
          <p className="fine bin-shop__smallprint">
            Need more than three days? Choose your rental length in the next step.
            Additional-day pricing and availability are confirmed before a reservation.
          </p>
        </div>
      </div>

      <div className="bin-shop__footer">
        <p>Still comparing rental companies? Compare the included days, weight and delivery fees—not just the starting price.</p>
        <Link href={`/compare?size=${selected}`}>Compare local offers for the {selected}-yard <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  );
}
