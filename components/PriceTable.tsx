import { SIZE_YARDS, formatTons, formatUsd, type Pricing } from "@/lib/pricing";
import { PricingUnavailable } from "@/components/PriceCards";

const NAMES: Record<11 | 16 | 21, string> = { 11: "Little Junker", 16: "Mighty Middler", 21: "Big Junker" };

// Full rate table for articles. Every number comes from the booking app's
// canonical pricing at build/revalidate time; nothing is typed into the post.
export default function PriceTable({ pricing }: { pricing: Pricing | null }) {
  if (!pricing) return <PricingUnavailable />;
  const zones = Object.values(pricing.zones).sort((a, b) => a.deliveryFee - b.deliveryFee);
  return (
    <div className="price-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Dumpster</th>
            <th scope="col">Included weight</th>
            {pricing.tiers.map((tier) => (
              <th scope="col" key={tier.tierKey}>
                {tier.days}-day
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZE_YARDS.map((yards) => (
            <tr key={yards}>
              <th scope="row">
                {NAMES[yards]}
                <br />
                <span className="muted">{yards}-yard</span>
              </th>
              <td>{formatTons(pricing.sizes[yards].includedTons)}</td>
              {pricing.tiers.map((tier) => (
                <td key={tier.tierKey}>{formatUsd(tier.prices[yards])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: "0.95rem" }}>
        {zones.map((zone) => (zone.deliveryFee === 0 ? `${zone.label}: delivery included` : `${zone.label}: +${formatUsd(zone.deliveryFee)} delivery`)).join(" · ")}
        {pricing.overagePerTon ? ` · Over the included weight: ${formatUsd(pricing.overagePerTon)} per ton` : ""}
      </p>
    </div>
  );
}
