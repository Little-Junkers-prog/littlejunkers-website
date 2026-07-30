import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type DumpsterSize = 11 | 16 | 21;
type PriceColumn = `price_${DumpsterSize}`;

type PricingRow = {
  tier_key: string | null;
  display_label: string | null;
  price_11: number | string | null;
  price_16: number | string | null;
  price_21: number | string | null;
};

type FeeRow = {
  id: string;
  fee_key: string;
  label: string;
  amount: number | string | null;
  unit: string;
  notes: string | null;
};

export type ProductPageLayoutProps = {
  size: DumpsterSize;
  productName: string;
  includedTons: number;
  featuredTierKey: string;
  imageAlt: string;
  bestFor: string[];
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Public Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function asMoney(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatFeeUnit(unit: string) {
  return unit
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function ProductPageLayout({
  size,
  productName,
  includedTons,
  featuredTierKey,
  imageAlt,
  bestFor,
}: ProductPageLayoutProps) {
  const supabase = getSupabaseClient();
  const priceColumn: PriceColumn = `price_${size}`;

  const [pricingResult, feesResult] = await Promise.all([
    supabase
      .from("pricing")
      .select(`tier_key, display_label, price_11, price_16, price_21`)
      .eq("active", true)
      .eq("tier_key", featuredTierKey)
      .maybeSingle<PricingRow>(),
    supabase
      .from("fees")
      .select("id, fee_key, label, amount, unit, notes")
      .eq("active", true)
      .order("label", { ascending: true })
      .returns<FeeRow[]>(),
  ]);

  if (pricingResult.error) {
    throw new Error(`Unable to load product pricing: ${pricingResult.error.message}`);
  }

  if (feesResult.error) {
    throw new Error(`Unable to load additional fees: ${feesResult.error.message}`);
  }

  const featuredPricing = pricingResult.data;
  const basePrice = featuredPricing?.[priceColumn];

  if (basePrice === null || basePrice === undefined) {
    throw new Error(`No active ${featuredTierKey} price is configured for the ${size}-yard dumpster.`);
  }

  return (
    <main>
      <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
        <div className="container py-lg-4">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <div
                className="ratio ratio-4x3 rounded-3 overflow-hidden"
                style={{
                  backgroundColor: "var(--pink-background)",
                  border: "1px solid var(--border-card)",
                }}
                role="img"
                aria-label={imageAlt}
              >
                <div className="d-flex align-items-center justify-content-center p-4 text-center">
                  <span className="fw-bold">{imageAlt}</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <p
                className="text-uppercase fw-bold mb-2"
                style={{ color: "var(--pink-text)", letterSpacing: "0.08em" }}
              >
                {size}-Yard Roll-Off Dumpster
              </p>
              <h1 className="display-5 fw-bold mb-3">{productName}</h1>
              <p className="fs-5 mb-4" style={{ color: "var(--ink-mid)" }}>
                A driveway-friendly dumpster sized for local cleanups, renovations, and debris removal.
              </p>

              <div className="card-standard p-4 mb-4">
                <p className="small text-uppercase fw-bold mb-1" style={{ color: "var(--ink-muted)" }}>
                  {featuredPricing?.display_label ?? featuredTierKey}
                </p>
                <p className="display-6 fw-bold mb-1">{asMoney(basePrice)}</p>
                <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                  Includes {includedTons} {includedTons === 1 ? "ton" : "tons"}.
                </p>
              </div>

              <h2 className="h5 fw-bold">Best for</h2>
              <ul className="mb-4">
                {bestFor.map((useCase) => (
                  <li className="mb-2" key={useCase}>
                    {useCase}
                  </li>
                ))}
              </ul>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <a href="https://book.littlejunkersllc.com" className="btn btn-brand btn-lg px-4">
                  Check Availability
                </a>
                <Link href="/pricing" className="btn btn-ghost btn-lg px-4">
                  Compare All Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "var(--surface-background)" }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2">Additional Fees</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                Pass-through costs apply only when the listed condition occurs. Current amounts are
                loaded directly from our pricing system.
              </p>
            </div>
          </div>

          <div className="row g-3">
            {(feesResult.data ?? []).map((fee) => (
              <div className="col-md-6 col-lg-4" key={fee.id}>
                <article className="card-standard h-100 p-4">
                  <h3 className="h6 fw-bold mb-2">{fee.label}</h3>
                  <p className="h5 fw-bold mb-2">
                    {fee.amount === null ? "Calculated when applicable" : asMoney(fee.amount)}
                    {fee.amount !== null ? (
                      <span className="fs-6 fw-normal"> / {formatFeeUnit(fee.unit)}</span>
                    ) : null}
                  </p>
                  {fee.notes ? (
                    <p className="small mb-0" style={{ color: "var(--ink-mid)" }}>
                      {fee.notes}
                    </p>
                  ) : null}
                </article>
              </div>
            ))}
          </div>

          <div
            className="mt-4 p-4 rounded-3"
            style={{
              backgroundColor: "var(--warning-background)",
              border: "1px solid var(--warning-border)",
            }}
          >
            <h3 className="h6 fw-bold">Fuel surcharge</h3>
            <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
              When applicable, fuel is a dynamic pass-through cost based on current operating
              conditions and delivery details. The current charge is shown during booking before
              payment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
