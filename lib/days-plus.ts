import type { Pricing, SizeYards, Tier } from "./pricing";

// Days Plus prepaid rates are distinct from legacy daily_overage (post-rental).
// Only an explicitly approved canonical pricing contract may supply them.
export type BasePriceMap = Record<SizeYards, number>;
export type ApprovedDaysPlusRates = {
  baseDays: 3;
  maxDays: 30;
  ratePerExtraDay: Record<SizeYards, number>;
  approvalId: string;
};

export function threeDayTier(pricing: Pricing): Tier | null {
  return pricing.tiers.find((tier) => tier.days === 3) ?? null;
}
export function basePriceSnapshot(pricing: Pricing | null): BasePriceMap | null {
  if (!pricing) return null;
  return threeDayTier(pricing)?.prices ?? null;
}

export type DaysPlusEstimate = {
  base: number | null;
  delivery: number | null;
  extraDays: number;
  perExtraDay: number | null;
  extraDaysCharge: number | null;
  // This may exclude an unconfirmed location fee or extra-day charge.
  knownSubtotal: number | null;
  // Only present when ALL configured components are priced. Not a booking quote:
  // taxes, promotions, vehicle availability and other fees are server-side.
  estimatedRentalSubtotal: number | null;
  missing: Array<"size" | "base" | "delivery" | "extra_day_rate" | "duration">;
};

const cents = (n: number) => Math.round(n * 100);
const money = (n: number) => Math.round(n) / 100;

/** Read-only display arithmetic. Never use this to charge a customer. */
export function estimateDaysPlus({
  basePrices, rates, size, days, deliveryFee
}: {
  basePrices: BasePriceMap | null;
  rates: ApprovedDaysPlusRates | null;
  size?: SizeYards;
  days: number;
  deliveryFee: number | null;
}): DaysPlusEstimate {
  const missing: DaysPlusEstimate["missing"] = [];
  const validDays = Number.isInteger(days) && days >= 3 && days <= 30;
  if (!validDays) missing.push("duration");
  if (!size) missing.push("size");

  const price = size && basePrices ? basePrices[size] : null;
  const base = price !== null && price !== undefined && Number.isFinite(price) && price > 0 ? price : null;
  if (base === null) missing.push("base");
  const delivery = deliveryFee !== null && Number.isFinite(deliveryFee) && deliveryFee >= 0 ? deliveryFee : null;
  if (delivery === null) missing.push("delivery");

  const extraDays = validDays ? days - 3 : 0;
  const rate = size && rates && rates.baseDays === 3 && rates.maxDays === 30 &&
    typeof rates.approvalId === "string" && rates.approvalId.trim() !== "" ?
      rates.ratePerExtraDay[size] : null;
  const perExtraDay = rate !== null && rate !== undefined && Number.isFinite(rate) && rate >= 0 ? rate : null;
  const extraDaysCharge = extraDays === 0 ? 0 : perExtraDay === null ? null : money(cents(perExtraDay) * extraDays);
  if (extraDays > 0 && extraDaysCharge === null) missing.push("extra_day_rate");

  const knownSubtotal = base === null ? null : money(
    cents(base) + (delivery === null ? 0 : cents(delivery)) +
    (extraDaysCharge === null ? 0 : cents(extraDaysCharge))
  );
  const estimatedRentalSubtotal = missing.length === 0 ? knownSubtotal : null;
  return { base, delivery, extraDays, perExtraDay, extraDaysCharge,
    knownSubtotal, estimatedRentalSubtotal, missing };
}
