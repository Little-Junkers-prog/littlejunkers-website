import type { Pricing, SizeYards, Tier } from "./pricing";

// Never use legacy daily_overage as a prepaid Days Plus price.
export type BasePriceMap = Record<SizeYards, number>;
export function threeDayTier(pricing: Pricing): Tier | null {
  return pricing.tiers.find((tier) => tier.days === 3) ?? null;
}
export function basePriceSnapshot(pricing: Pricing | null): BasePriceMap | null {
  if (!pricing) return null;
  return threeDayTier(pricing)?.prices ?? null;
}
