// Customer-safe, read-only projection of the canonical comparison tables.
// Keep all source observation filtering on the server. This module is never
// imported by a client component. No production writes or second price table.
import "server-only";
import { cityKey, type AreaResult } from "./pricing";
import { selectOfferSnapshot, observationIsCurrent } from "./comparison-selection";

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
  overagePerPound: number | null;
  priceQualifier: string | null;
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
  price_qualifier: string | null;
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
  const verified = new Date(record.last_verified + "T00:00:00Z");
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
  if (!o || o.value_numeric === null || o.value_numeric === "") return null;
  const value = Number(o.value_numeric);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function getComparisonCandidates(size: 11 | 16 | 21, area: AreaResult, requestedDays: number): Promise<ComparisonRead> {
  const origin = httpUrl(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null);
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!origin || !secret) return { status: "connection_pending", candidates: [] };
  try {
    // Unknown / split city data is not evidence of competitor serviceability.
    if (area.status !== "served") return { status: "ready", candidates: [] };
    const now = new Date();
    const [providers, products, coverage] = await Promise.all([
      readTable<Provider>("comparison_providers", {
        select: "id,name,website_url,is_active,visibility_status,sort_order",
        is_active: "eq.true", visibility_status: "eq.public", limit: "100"
      }, origin, secret),
      readTable<Product>("comparison_products", {
        select: "id,provider_id,product_name,actual_size_yards,container_type,comparison_class_yards,is_active",
        is_active: "eq.true", comparison_class_yards: "eq." + size, limit: "200"
      }, origin, secret),
      readTable<Coverage>("comparison_provider_coverage", {
        select: "provider_id,coverage_type,location_key,zip_code,state,coverage_status,last_verified,is_active",
        is_active: "eq.true", coverage_status: "eq.confirmed", limit: "1000"
      }, origin, secret)
    ]);

    const publicProviders = new Map(providers.filter((p) => p.is_active && p.visibility_status === "public").map((p) => [p.id, p]));
    const candidates = products.filter((product) => {
      const provider = publicProviders.get(product.provider_id);
      const yards = Number(product.actual_size_yards);
      return !!provider && !!httpUrl(provider.website_url) && product.is_active &&
        Number.isFinite(yards) && yards > 0 && Math.abs(yards - size) <= 4 &&
        coverage.some((row) => row.provider_id === product.provider_id && coversLocation(row, area, now));
    });
    if (!candidates.length) return { status: "ready", candidates: [] };

    // Query only fresh, independently publishable evidence for eligible products.
    // Earlier code silently truncated after 1,000 historical observations.
    // If we ever reach the cap, fail closed instead of showing a partial ranking.
    const observations = await readTable<Observation>("comparison_observations", {
      select: "provider_id,product_id,variant_id,attribute_name,value_numeric,unit,price_qualifier,source_url,observed_at,valid_until,verification_status,publication_status,conflict_type,location_scope_type,location_scope_value,market_city,market_zip",
      product_id: "in.(" + candidates.map((product) => product.id).join(",") + ")",
      valid_until: "gt." + now.toISOString(),
      verification_status: "eq.confirmed_published",
      publication_status: "eq.publishable",
      conflict_type: "eq.no_conflict",
      attribute_name: "in.(price,duration_days,included_tons,overage_per_ton,overage_per_pound,extra_day_fee)",
      limit: "1000"
    }, origin, secret);
    if (observations.length >= 1000) throw new Error("comparison observation page limit reached");
    const cards: CompetitorCard[] = [];
    for (const product of candidates) {
      const provider = publicProviders.get(product.provider_id);
      const website = httpUrl(provider?.website_url ?? null);
      const yards = Number(product.actual_size_yards);
      if (!provider || !website || !product.is_active || !Number.isFinite(yards) || yards <= 0 || Math.abs(yards - size) > 4) continue;
      const coverageValid = coverage.some((c) => c.provider_id === provider.id && coversLocation(c, area, now));
      // Never present a company as eligible when we lack documented location coverage.
      if (!coverageValid) continue;
      const fresh = observations.filter((o) => o.product_id === product.id && observationIsCurrent(o, now) && observationMatchesArea(o, area));
      const selection = selectOfferSnapshot(fresh, requestedDays);
      const hasOffer = coverageValid && !!selection;
      const facts = hasOffer && selection ? selection.facts : [];
      const variant = hasOffer && selection ? selection.price.variant_id : null;
      const included = observationFor(facts, "included_tons", variant);
      const overage = observationFor(facts, "overage_per_ton", variant);
      const overagePound = observationFor(facts, "overage_per_pound", variant);
      const extraDay = observationFor(facts, "extra_day_fee", variant);
      cards.push({
        providerId: provider.id, name: provider.name, website,
        product: product.product_name, actualYards: yards, containerType: product.container_type,
        coverage: coverageValid ? "verified" : "unverified",
        price: hasOffer && selection ? numeric(selection.price) : null,
        priceDays: hasOffer && selection ? selection.days : null,
        includedTons: numeric(included), overagePerTon: numeric(overage), overagePerPound: numeric(overagePound),
        priceQualifier: hasOffer && selection ? selection.price.price_qualifier : null,
        extraDayFee: numeric(extraDay),
        sourceUrl: hasOffer && selection ? httpUrl(selection.price.source_url) : null,
        verifiedOn: hasOffer && selection ? selection.price.observed_at.slice(0, 10) : null,
        priceStatus: hasOffer ? "verified" : "not_verified"
      });
    }
    // One product per provider by default. Rank on evidence/relevance rather
    // than favorable prices; suppress all unverified price amounts.
    cards.sort((a, b) =>
      Number(b.priceStatus === "verified") - Number(a.priceStatus === "verified") ||
      Number(b.coverage === "verified") - Number(a.coverage === "verified") ||
      // Prefer an offer whose advertised term covers the customer request.
      (a.priceDays !== null && b.priceDays !== null
        ? (a.priceDays >= requestedDays ? a.priceDays - requestedDays : 1000 + requestedDays - a.priceDays)
        - (b.priceDays >= requestedDays ? b.priceDays - requestedDays : 1000 + requestedDays - b.priceDays)
        : 0) ||
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
