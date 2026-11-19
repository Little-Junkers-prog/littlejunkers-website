// Customer-safe, read-only projection of the canonical comparison tables.
// Keep all source observation filtering on the server. This module is never
// imported by a client component. No production writes or second price table.
import "server-only";
import { cityKey, type AreaResult } from "./pricing";

export type CompetitorCard = {
  providerId: string;
  name: string;
  website: string;
  product: string;
  actualYards: number;
  containerType: string | null;
  coverage: "verified" | "unverified";
  price: number | null;
  priceDays: number | null;
  includedTons: number | null;
  overagePerTon: number | null;
  extraDayFee: number | null;
  sourceUrl: string | null;
  verifiedOn: string | null;
  priceStatus: "verified" | "not_verified";
};

export type ComparisonRead = {
  status: "ready" | "connection_pending" | "source_unavailable";
  candidates: CompetitorCard[];
};

type Provider = {
  id: string; name: string; website_url: string | null; is_active: boolean;
  visibility_status: string; sort_order: number;
};
type Product = {
  id: string; provider_id: string; product_name: string; actual_size_yards: number | string | null;
  container_type: string | null; comparison_class_yards: number; is_active: boolean;
};
type Coverage = {
  provider_id: string; coverage_type: string; location_key: string; zip_code: string | null;
  state: string; coverage_status: string; last_verified: string | null; is_active: boolean;
};
type Observation = {
  provider_id: string; product_id: string | null; variant_id: string | null;
  attribute_name: string; value_numeric: number | string | null; unit: string | null;
  source_url: string; observed_at: string; valid_until: string | null;
  verification_status: string; publication_status: string; conflict_type: string;
  location_scope_type: string | null; location_scope_value: string | null;
  market_city: string | null; market_zip: string | null;
};

function httpUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

async function readTable<T>(table: string, query: Record<string, string>, origin: string, key: string): Promise<T[]> {
  const url = new URL("/rest/v1/" + table, origin);
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);
  const headers: Record<string, string> = { apikey: key, Accept: "application/json" };
  if (!key.startsWith("sb_secret_")) headers.Authorization = "Bearer " + key;
  const result = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(7000) });
  if (!result.ok) throw new Error("comparison data read failed: " + result.status + " (" + table + ")");
  return await result.json() as T[];
}

// Conservative temporary review threshold. Make this an approved Admin policy
// before launch: a source-verified city or ZIP entry expires after 30 days.
const COVERAGE_MAX_AGE_DAYS = 30;
function coversLocation(record: Coverage, area: AreaResult, now: Date): boolean {
  if (!record.is_active || record.coverage_status !== "confirmed" || record.state.toUpperCase() !== "GA") return false;
  if (!record.last_verified) return false;
  const verified = new Date(record.last_verified + "T23:59:59Z");
  if (!Number.isFinite(verified.getTime()) || verified.getTime() > now.getTime() ||
      now.getTime() - verified.getTime() > COVERAGE_MAX_AGE_DAYS * 86400000) return false;
  if (area.status !== "served") return false;
  if (record.coverage_type === "zip") {
    return area.zips.length === 1 && (record.zip_code === area.zips[0] || record.location_key === area.zips[0]);
  }
  if (record.coverage_type === "city") {
    return cityKey(record.location_key) === cityKey(area.label);
  }
  // A county/radius label without an evaluated geographic boundary is not
  // sufficient evidence for a particular delivery location.
  return false;
}

function sourceIsCurrent(o: Observation, now: Date): boolean {
  if (o.verification_status !== "confirmed_published" ||
      o.publication_status !== "publishable" || o.conflict_type !== "no_conflict" ||
      !httpUrl(o.source_url) || !o.valid_until) return false;
  const observed = Date.parse(o.observed_at), expiry = Date.parse(o.valid_until);
  return Number.isFinite(observed) && Number.isFinite(expiry) && observed <= now.getTime() && expiry > now.getTime();
}

function observationMatchesArea(o: Observation, area: AreaResult): boolean {
  if (!o.location_scope_type || o.location_scope_type === "provider_wide") return true;
  if (area.status !== "served") return false;
  if (o.location_scope_type === "city") return !!o.market_city && cityKey(o.market_city) === cityKey(area.label);
  if (o.location_scope_type === "zip") return area.zips.length === 1 && o.market_zip === area.zips[0];
  return false;
}

function observationFor(rows: Observation[], attribute: string, variant: string | null): Observation | null {
  const matched = rows
    .filter((row) => row.attribute_name === attribute && row.variant_id === variant)
    .sort((a, b) => b.observed_at.localeCompare(a.observed_at));
  return matched[0] ?? null;
}

function numeric(o: Observation | null): number | null {
  if (!o) return null;
  const value = Number(o.value_numeric);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function getComparisonCandidates(size: 11 | 16 | 21, area: AreaResult): Promise<ComparisonRead> {
  const origin = httpUrl(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null);
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!origin || !secret) return { status: "connection_pending", candidates: [] };
  try {
    const [providers, products, observations, coverage] = await Promise.all([
      readTable<Provider>("comparison_providers", {
        select: "id,name,website_url,is_active,visibility_status,sort_order",
        is_active: "eq.true", visibility_status: "eq.public", limit: "100"
      }, origin, secret),
      readTable<Product>("comparison_products", {
        select: "id,provider_id,product_name,actual_size_yards,container_type,comparison_class_yards,is_active",
        is_active: "eq.true", comparison_class_yards: "eq." + size, limit: "200"
      }, origin, secret),
      readTable<Observation>("comparison_observations", {
        select: "provider_id,product_id,variant_id,attribute_name,value_numeric,unit,source_url,observed_at,valid_until,verification_status,publication_status,conflict_type,location_scope_type,location_scope_value,market_city,market_zip",
        attribute_name: "in.(price,duration_days,included_tons,overage_per_ton,extra_day_fee)", limit: "1000"
      }, origin, secret),
      readTable<Coverage>("comparison_provider_coverage", {
        select: "provider_id,coverage_type,location_key,zip_code,state,coverage_status,last_verified,is_active",
        is_active: "eq.true", coverage_status: "eq.confirmed", limit: "1000"
      }, origin, secret)
    ]);

    const now = new Date();
    const cards: CompetitorCard[] = [];
    const publicProviders = new Map(providers.filter((p) => p.is_active && p.visibility_status === "public").map((p) => [p.id, p]));
    for (const product of products) {
      const provider = publicProviders.get(product.provider_id);
      const website = httpUrl(provider?.website_url ?? null);
      const yards = Number(product.actual_size_yards);
      if (!provider || !website || !product.is_active || !Number.isFinite(yards) || yards <= 0 || Math.abs(yards - size) > 4) continue;
      const coverageValid = coverage.some((c) => c.provider_id === provider.id && coversLocation(c, area, now));
      const fresh = observations.filter((o) => o.product_id === product.id && sourceIsCurrent(o, now) && observationMatchesArea(o, area));
      const priceChoices = fresh.filter((o) => o.attribute_name === "price" && numeric(o) !== null);
      // Do not mix a price from one named offer variant with the rental duration
      // from a different offer. Older data with ambiguous variants is omitted.
      const matched = priceChoices
        .map((o) => ({ price: o, days: observationFor(fresh, "duration_days", o.variant_id) }))
        .filter((x) => x.days && Number.isInteger(numeric(x.days)) && Number(numeric(x.days)) > 0)
        .sort((a, b) => b.price.observed_at.localeCompare(a.price.observed_at))[0];
      const hasOffer = coverageValid && !!matched;
      const variant = matched?.price.variant_id ?? null;
      const included = hasOffer ? observationFor(fresh, "included_tons", variant) : null;
      const overage = hasOffer ? observationFor(fresh, "overage_per_ton", variant) : null;
      const extraDay = hasOffer ? observationFor(fresh, "extra_day_fee", variant) : null;
      cards.push({
        providerId: provider.id, name: provider.name, website,
        product: product.product_name, actualYards: yards, containerType: product.container_type,
        coverage: coverageValid ? "verified" : "unverified",
        price: hasOffer && matched ? numeric(matched.price) : null,
        priceDays: hasOffer && matched ? numeric(matched.days) : null,
        includedTons: numeric(included), overagePerTon: numeric(overage), extraDayFee: numeric(extraDay),
        sourceUrl: hasOffer && matched ? httpUrl(matched.price.source_url) : null,
        verifiedOn: hasOffer && matched ? matched.price.observed_at.slice(0, 10) : null,
        priceStatus: hasOffer ? "verified" : "not_verified"
      });
    }
    // One product per provider by default. Rank on evidence/relevance rather
    // than favorable prices; suppress all unverified price amounts.
    cards.sort((a, b) =>
      Number(b.priceStatus === "verified") - Number(a.priceStatus === "verified") ||
      Number(b.coverage === "verified") - Number(a.coverage === "verified") ||
      Math.abs(a.actualYards - size) - Math.abs(b.actualYards - size) ||
      a.name.localeCompare(b.name) || a.product.localeCompare(b.product));
    const seen = new Set<string>();
    return { status: "ready", candidates: cards.filter((card) => {
      if (seen.has(card.providerId)) return false;
      seen.add(card.providerId);
      return true;
    }) };
  } catch (error) {
    console.error("[comparison] source unavailable", error instanceof Error ? error.message : "unknown error");
    return { status: "source_unavailable", candidates: [] };
  }
}
