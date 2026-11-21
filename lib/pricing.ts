// Read-only client for the canonical pricing contract.
//
// Source: the booking app's /api/get-pricing, which normalizes Supabase
// get_pricing_config() + dumpster_sizes. The website never keeps its own price
// table. If the fetch or the shape check fails, getPricing() returns null and
// pages show a "see current prices" state. There is no stale fallback.

import { bookingOrigin } from "./company";
import type { ApprovedDaysPlusRates } from "./days-plus";

export type SizeYards = 11 | 16 | 21;
export const SIZE_YARDS: SizeYards[] = [11, 16, 21];

export type Tier = {
  tierKey: string;
  label: string;
  badge: string | null;
  days: number;
  extraDay: number | null;
  prices: Record<SizeYards, number>;
};

export type Zone = { zone: string; label: string; deliveryFee: number };
export type ZipEntry = { zip: string; zone: string; areaLabel: string };
export type SizeFacts = { includedTons: number; heightFt: number | null; truckLoads: string | null };

export type Pricing = {
  tiers: Tier[];
  zones: Record<string, Zone>;
  zips: Record<string, ZipEntry>;
  sizes: Record<SizeYards, SizeFacts>;
  // Per-ton rate for weight over the included tonnage, billed at disposal.
  overagePerTon: number | null;
  // Nullable until the canonical booking API explicitly exposes APPROVED prepaid Days Plus rates.
  // Legacy tier.dailyOverage must never populate this field.
  daysPlusRates: ApprovedDaysPlusRates | null;
};

const REVALIDATE_SECONDS = 600;

// Server-side only. Defaults to the live booking app; override per environment
// (for example a booking preview deployment) with PRICING_API_ORIGIN.
const pricingApiOrigin = process.env.PRICING_API_ORIGIN ?? bookingOrigin;

function num(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parse(payload: any): Pricing | null {
  if (!payload?.success || !Array.isArray(payload.pricing)) return null;

  const tiers: Tier[] = [];
  for (const row of payload.pricing) {
    const prices = {} as Record<SizeYards, number>;
    for (const yards of SIZE_YARDS) {
      const price = num(row?.prices?.[String(yards)]);
      if (!price || price <= 0) return null;
      prices[yards] = price;
    }
    const days = num(row?.durationDays);
    if (!row?.tierKey || !days) return null;
    tiers.push({
      tierKey: String(row.tierKey),
      label: String(row.displayLabel ?? `${days}-Day`),
      badge: row.badgeTag ? String(row.badgeTag) : null,
      days,
      extraDay: num(row?.dailyOverage),
      prices,
    });
  }
  if (tiers.length === 0) return null;
  tiers.sort((a, b) => a.days - b.days);

  const zones: Record<string, Zone> = {};
  for (const [key, row] of Object.entries<any>(payload.serviceAreas ?? {})) {
    const fee = num(row?.deliveryFee);
    if (fee === null) return null;
    zones[key] = { zone: key, label: String(row?.label ?? key), deliveryFee: fee };
  }

  const zips: Record<string, ZipEntry> = {};
  for (const [zip, row] of Object.entries<any>(payload.zipCodes ?? {})) {
    if (!/^\d{5}$/.test(zip) || !zones[row?.zone]) continue;
    zips[zip] = { zip, zone: row.zone, areaLabel: String(row?.areaLabel ?? "") };
  }
  if (Object.keys(zones).length === 0 || Object.keys(zips).length === 0) return null;

  const sizes = {} as Record<SizeYards, SizeFacts>;
  for (const yards of SIZE_YARDS) {
    const row = payload.sizes?.[String(yards)];
    const tons = num(row?.includedTons);
    if (!tons || tons <= 0) return null;
    sizes[yards] = {
      includedTons: tons,
      heightFt: row?.heightFt != null ? num(row.heightFt) : null,
      truckLoads: row?.truckLoads ? String(row.truckLoads) : null,
    };
  }

  const overageRow = Array.isArray(payload.fees)
    ? payload.fees.find((fee: any) => fee?.fee_key === "weight_overage_disposal" && fee?.active !== false)
    : null;
  const overage = overageRow ? num(overageRow.amount) : null;


  // Future canonical contract: do not infer prepaid extra-day pricing from the
  // older 3/5/7-day packages or their dailyOverage column.
  const proposed = payload.daysPlusContract;
  let daysPlusRates: ApprovedDaysPlusRates | null = null;
  if (proposed?.status === "approved" && proposed?.baseDays === 3 &&
      proposed?.maxDays === 30 && typeof proposed.approvalId === "string" &&
      proposed.approvalId.trim().length > 0 &&
      typeof proposed.effectiveFrom === "string" &&
      /^\\d{4}-\\d{2}-\\d{2}$/.test(proposed.effectiveFrom)) {
    const today = new Date().toISOString().slice(0, 10);
    const from = proposed.effectiveFrom;
    const to = typeof proposed.effectiveTo === "string" ? proposed.effectiveTo : null;
    if (from <= today && (!to || (/^\\d{4}-\\d{2}-\\d{2}$/.test(to) && to >= today))) {
      const approved = {} as Record<SizeYards, number>;
      let valid = true;
      for (const yards of SIZE_YARDS) {
        const raw = proposed.ratePerExtraDay?.[String(yards)];
        const value = raw === null || raw === undefined || raw === "" ? null : num(raw);
        if (value === null || value < 0) { valid = false; break; }
        approved[yards] = value;
      }
      if (valid) {
        daysPlusRates = { baseDays: 3, maxDays: 30,
          ratePerExtraDay: approved, approvalId: proposed.approvalId };
      }
    }
  }

  return { tiers, zones, zips, sizes, overagePerTon: overage && overage > 0 ? overage : null, daysPlusRates };
}

export async function getPricing(): Promise<Pricing | null> {
  try {
    const res = await fetch(`${pricingApiOrigin}/api/get-pricing`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const pricing = parse(await res.json());
    if (!pricing) console.error("[pricing] payload failed the shape check");
    return pricing;
  } catch (error) {
    console.error("[pricing] fetch failed", error);
    return null;
  }
}

export function startingTier(pricing: Pricing): Tier {
  return pricing.tiers[0];
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatTons(tons: number): string {
  return `${tons} ${tons === 1 ? "ton" : "tons"}`;
}

// "Newnan area", "Sharpsburg, GA" and "Tyrone" all resolve to the same city key.
export function cityKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/,\s*ga$/i, "")
    .replace(/\s+area$/i, "")
    .trim();
}

export function zipsForCity(pricing: Pricing, city: string): ZipEntry[] {
  const key = cityKey(city);
  return Object.values(pricing.zips)
    .filter((entry) => cityKey(entry.areaLabel) === key)
    .sort((a, b) => a.zip.localeCompare(b.zip));
}

export type AreaResult =
  | { status: "served"; query: string; label: string; zone: Zone; zips: string[] }
  | { status: "split"; query: string; label: string; zones: Zone[] }
  | { status: "unknown"; query: string };

// Resolves a ZIP or a city name against canonical ZIP rows. Unknown never means
// "not served": the caller sends the customer to call or text instead.
export function lookupArea(pricing: Pricing, rawQuery: string): AreaResult {
  const query = rawQuery.trim().slice(0, 60);
  const zipMatch = query.match(/\b\d{5}\b/);
  if (zipMatch) {
    const entry = pricing.zips[zipMatch[0]];
    if (!entry) return { status: "unknown", query: zipMatch[0] };
    return {
      status: "served",
      query: entry.zip,
      label: cityKeyToTitle(entry.areaLabel),
      zone: pricing.zones[entry.zone],
      zips: [entry.zip],
    };
  }

  const matches = zipsForCity(pricing, query);
  if (matches.length === 0) return { status: "unknown", query };
  const zoneKeys = [...new Set(matches.map((m) => m.zone))].sort();
  const label = cityKeyToTitle(matches[0].areaLabel);
  if (zoneKeys.length > 1) {
    return { status: "split", query, label, zones: zoneKeys.map((z) => pricing.zones[z]) };
  }
  return {
    status: "served",
    query,
    label,
    zone: pricing.zones[zoneKeys[0]],
    zips: matches.map((m) => m.zip),
  };
}

function cityKeyToTitle(label: string): string {
  return cityKey(label).replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
