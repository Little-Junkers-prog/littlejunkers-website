import type { Pricing, Tier } from "./pricing";
// Never treat legacy daily_overage as the approved prepaid Days Plus rate.
export function threeDayTier(pricing: Pricing): Tier | null {
  return pricing.tiers.find((tier) => tier.days === 3) ?? null;
}
