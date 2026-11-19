// Restricted customer-safe comparison projection. Supabase remains canonical.
// The bundled dated snapshot is a read-only preview bridge when Vercel's
// server-only Supabase environment variables are not yet connected.
import "server-only";
import snapshot from "./comparison-snapshot.json";
import { cityKey, type AreaResult } from "./pricing";
import { selectOfferSnapshot, observationIsCurrent, rankComparisonCards } from "./comparison-selection";

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
  status: "ready" | "source_unavailable";
  source: "live" | "review_snapshot" | "unavailable";
  snapshotAsOf: string | null;
  verifiedLocalCount: number;
  fallbackUsed: boolean;
  candidates: CompetitorCard[];
};

type Provider = {
  id: string; name: string; website_url: string | null;
  is_active: boolean; visibility_status: string; sort_order: number;
};
type Product = {
  id: string; provider_id: string; product_name: string;
  actual_size_yards: number | string | null;
  container_type: string | null; comparison_class_yards: number | null;
  is_active: boolean;
};
type Coverage = {
  provider_id: string; coverage_type: string; location_key: string;
  zip_code: string | null; state: string;
  coverage_status: string; last_verified: string | null; is_active: boolean;
};
type Observation = {
  provider_id: string; product_id: string | null; variant_id: string | null;
  attribute_name: string; value_numeric: number | string | null;
  unit: string | null; price_qualifier: string | null;
  source_url: string; observed_at: string; valid_until: string | null;
  verification_status: string; publication_status: string; conflict_type: string;
  location_scope_type: string | null; location_scope_value: string | null;
  market_city: string | null; market_zip: string | null;
};
type SourceData = {
  providers: Provider[]; products: Product[];
  coverage: Coverage[]; observations: Observation[];
};

const COVERAGE_MAX_AGE_DAYS = 30;
class ComparisonSourceConfigurationError extends Error {}

function httpsUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "https:" ? u.toString() : null;
  } catch { return null; }
}

function hasCoverage(record: Coverage, area: AreaResult, now: Date): boolean {
  if (area.status !== "served" || !record.is_active ||
      record.coverage_status !== "confirmed" ||
      record.state.toUpperCase() !== "GA" || !record.last_verified) return false;
  const date = Date.parse(record.last_verified.slice(0, 10) + "T00:00:00Z");
  if (!Number.isFinite(date) || date > now.getTime() ||
      now.getTime() - date > COVERAGE_MAX_AGE_DAYS * 86400000) return false;
  if (record.coverage_type === "city")
    return cityKey(record.location_key) === cityKey(area.label);
  if (record.coverage_type === "zip")
    return area.zips.length === 1 &&
      (record.zip_code === area.zips[0] || record.location_key === area.zips[0]);
  return false;
}

function matchesOfferLocation(o: Observation, area: AreaResult): boolean {
  if (!o.location_scope_type || o.location_scope_type === "provider_wide") return true;
  if (area.status !== "served") return false;
  if (o.location_scope_type === "city")
    return !!o.market_city && cityKey(o.market_city) === cityKey(area.label);
  if (o.location_scope_type === "zip")
    return area.zips.length === 1 && o.market_zip === area.zips[0];
  return false;
}
function amount(o: Observation | null): number | null {
  if (!o || o.value_numeric === null || o.value_numeric === "") return null;
  const v = Number(o.value_numeric);
  return Number.isFinite(v) && v >= 0 ? v : null;
}
function fact(rows: Observation[], attribute: string): Observation | null {
  return rows.find((row) => row.attribute_name === attribute) ?? null;
}
export function buildComparisonCards(
  data: SourceData, size: 11 | 16 | 21, area: AreaResult, days: number, now: Date
): CompetitorCard[] {
  const providers = new Map(data.providers
    .filter((p) => p.is_active && p.visibility_status === "public" && httpsUrl(p.website_url))
    .map((p) => [p.id, p]));
  const cards: CompetitorCard[] = [];
  for (const product of data.products) {
    const p = providers.get(product.provider_id);
    const actual = Number(product.actual_size_yards);
    // The comparison classes are vetted in the canonical products table.
    // Avoid combining unrelated 30-yard products with a 21-yard customer request.
    if (!p || !product.is_active || product.comparison_class_yards !== size ||
        !Number.isFinite(actual) || actual <= 0 || Math.abs(actual - size) > 4) continue;
    const local = data.coverage.some((row) => row.provider_id === p.id && hasCoverage(row, area, now));
    const relevant = data.observations.filter((o) => o.product_id === product.id &&
      observationIsCurrent(o, now) && matchesOfferLocation(o, area));
    const selected = selectOfferSnapshot(relevant, days);
    const attributes = selected?.facts ?? [];
    cards.push({
      providerId: p.id, name: p.name, website: httpsUrl(p.website_url)!,
      product: product.product_name, actualYards: actual,
      containerType: product.container_type,
      coverage: local ? "verified" : "unverified",
      price: selected ? amount(selected.price) : null,
      priceDays: selected?.days ?? null,
      includedTons: amount(fact(attributes, "included_tons")),
      overagePerTon: amount(fact(attributes, "overage_per_ton")),
      overagePerPound: amount(fact(attributes, "overage_per_pound")),
      priceQualifier: selected?.price.price_qualifier ?? null,
      extraDayFee: amount(fact(attributes, "extra_day_fee")),
      sourceUrl: selected ? httpsUrl(selected.price.source_url) : null,
      verifiedOn: selected?.price.observed_at.slice(0, 10) ?? null,
      priceStatus: selected ? "verified" : "not_verified",
    });
  }
  return rankComparisonCards(cards, size, days);
}

function response(
  data: SourceData, source: "live" | "review_snapshot",
  size: 11 | 16 | 21, area: AreaResult, days: number,
  now: Date
): ComparisonRead {
  const candidates = buildComparisonCards(data, size, area, days, now);
  return {
    status: "ready",
    source,
    snapshotAsOf: source === "review_snapshot" ? snapshot.exportedAt : null,
    verifiedLocalCount: candidates.filter((c) => c.coverage === "verified").length,
    fallbackUsed: candidates.slice(0, 2).some((c) => c.coverage === "unverified"),
    candidates,
  };
}

async function readTable<T>(
  table: string, query: Record<string, string>, origin: string, key: string
): Promise<T[]> {
  const url = new URL("/rest/v1/" + table, origin);
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);
  const headers: Record<string, string> = { apikey: key, Accept: "application/json" };
  if (!key.startsWith("sb_secret_")) headers.Authorization = "Bearer " + key;
  const res = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(7000) });
  if (!res.ok) {
    if (res.status >= 400 && res.status < 429)
      throw new ComparisonSourceConfigurationError("comparison source authorization or query returned " + res.status + " (" + table + ")");
    throw new Error("comparison source returned " + res.status + " (" + table + ")");
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("comparison source did not return an array");
  return data as T[];
}

export async function getComparisonCandidates(
  size: 11 | 16 | 21, area: AreaResult, days: number
): Promise<ComparisonRead> {
  const now = new Date();
  const origin = httpsUrl(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null);
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Temporary bridge for the unconnected Vercel preview only. This snapshot
  // was exported from the canonical database, not authored or guessed.
  // Source freshness is still enforced at request time; expired prices
  // become "not verified" instead of silently remaining current.
  if (!origin || !key)
    return response(snapshot as SourceData, "review_snapshot", size, area, days, now);

  try {
    const [providers, products, coverage] = await Promise.all([
      readTable<Provider>("comparison_providers", {
        select: "id,name,website_url,is_active,visibility_status,sort_order",
        is_active: "eq.true", visibility_status: "eq.public", limit: "100"
      }, origin, key),
      readTable<Product>("comparison_products", {
        select: "id,provider_id,product_name,actual_size_yards,container_type,comparison_class_yards,is_active",
        is_active: "eq.true", comparison_class_yards: "eq." + size, limit: "200"
      }, origin, key),
      readTable<Coverage>("comparison_provider_coverage", {
        select: "provider_id,coverage_type,location_key,zip_code,state,coverage_status,last_verified,is_active",
        is_active: "eq.true", coverage_status: "eq.confirmed", limit: "1000"
      }, origin, key)
    ]);
    const productIds = products.map((p) => p.id);
    const observations = productIds.length === 0 ? [] :
      await readTable<Observation>("comparison_observations", {
        select: "provider_id,product_id,variant_id,attribute_name,value_numeric,unit,price_qualifier,source_url,observed_at,valid_until,verification_status,publication_status,conflict_type,location_scope_type,location_scope_value,market_city,market_zip",
        product_id: "in.(" + productIds.join(",") + ")",
        valid_until: "gt." + now.toISOString(),
        verification_status: "eq.confirmed_published",
        publication_status: "eq.publishable",
        conflict_type: "eq.no_conflict",
        attribute_name: "in.(price,duration_days,included_tons,overage_per_ton,overage_per_pound,extra_day_fee)",
        limit: "1000"
      }, origin, key);
    if (observations.length >= 1000) throw new Error("comparison observation safety page limit reached");
    return response({ providers, products, coverage, observations }, "live", size, area, days, now);
  } catch (error) {
    if (error instanceof ComparisonSourceConfigurationError) {
      console.warn("[comparison] unconnected review data source; using dated Supabase export:",
        error.message);
      return response(snapshot as SourceData, "review_snapshot", size, area, days, now);
    }
    console.error("[comparison] live Supabase source unavailable",
      error instanceof Error ? error.message : "unknown error");
    return {
      status: "source_unavailable", source: "unavailable", snapshotAsOf: null,
      verifiedLocalCount: 0, fallbackUsed: false, candidates: []
    };
  }
}
