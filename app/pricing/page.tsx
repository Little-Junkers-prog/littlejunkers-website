import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

type DumpsterSize = 11 | 16 | 21;
type PriceColumn = `price_${DumpsterSize}`;

type PricingRow = {
  id: string;
  tier_key: string | null;
  display_label: string | null;
  duration_days: number | null;
  day_restriction: string | null;
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

const dumpsterSizes: DumpsterSize[] = [11, 16, 21];

export const metadata: Metadata = {
  title: "Dumpster Rental Pricing | Little Junkers",
  description:
    "Compare current 11-yard, 16-yard, and 21-yard dumpster rental prices and review additional pass-through costs.",
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

export default async function PricingPage() {
  const supabase = getSupabaseClient();

  const [pricingResult, feesResult] = await Promise.all([
    supabase
      .from("pricing")
      .select(
        "id, tier_key, display_label, duration_days, day_restriction, price_11, price_16, price_21",
      )
      .eq("active", true)
      .order("duration_days", { ascending: true })
      .order("display_label", { ascending: true })
      .returns<PricingRow[]>(),
    supabase
      .from("fees")
      .select("id, fee_key, label, amount, unit, notes")
      .eq("active", true)
      .order("label", { ascending: true })
      .returns<FeeRow[]>(),
  ]);

  if (pricingResult.error) {
    throw new Error(`Unable to load the pricing matrix: ${pricingResult.error.message}`);
  }

  if (feesResult.error) {
    throw new Error(`Unable to load additional fees: ${feesResult.error.message}`);
  }

  return (
    <main>
      <section className="py-5" style={{ backgroundColor: "var(--dark-hero)", color: "var(--card-background)" }}>
        <div className="container py-lg-4">
          <div className="row">
            <div className="col-lg-8">
              <p className="hero-eyebrow text-uppercase fw-bold mb-3">Current rental rates</p>
              <h1 className="display-5 fw-bold mb-3">Dumpster Rental Pricing</h1>
              <p className="fs-5 mb-0" style={{ color: "var(--ink-faint)" }}>
                Compare every active rental tier, then choose the size and schedule that fit your
                project.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2">Pricing Matrix</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                Rates below are loaded directly from our current pricing table.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle bg-white mb-0">
              <caption className="visually-hidden">
                Active rental rates for 11-yard, 16-yard, and 21-yard dumpsters
              </caption>
              <thead>
                <tr>
                  <th scope="col">Rental tier</th>
                  {dumpsterSizes.map((size) => (
                    <th scope="col" className="text-center" key={size}>
                      {size}-Yard
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(pricingResult.data ?? []).map((tier) => (
                  <tr key={tier.id}>
                    <th scope="row">
                      <span className="d-block">{tier.display_label ?? tier.tier_key}</span>
                      {tier.day_restriction ? (
                        <span className="small fw-normal" style={{ color: "var(--ink-mid)" }}>
                          Delivery-day restrictions apply
                        </span>
                      ) : null}
                    </th>
                    {dumpsterSizes.map((size) => {
                      const priceColumn: PriceColumn = `price_${size}`;
                      const price = tier[priceColumn];

                      return (
                        <td className="text-center fw-bold" key={`${tier.id}-${size}`}>
                          {price === null ? "Contact us" : asMoney(price)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="small mt-3 mb-0" style={{ color: "var(--ink-mid)" }}>
            Rental availability, delivery area, and project details may affect the final checkout
            total.
          </p>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "var(--surface-background)" }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2">Additional Fees &amp; Pass-Through Costs</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                These charges apply only when the listed condition occurs. The values shown come
                directly from the active fees table.
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

          <div className="row g-4 mt-2">
            <div className="col-lg-6">
              <div className="card-standard h-100 p-4">
                <h3 className="h5 fw-bold">Weight overages</h3>
                <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                  Each dumpster includes a defined weight allowance. If the disposal weight exceeds
                  that allowance, the active per-ton overage rate applies.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="h-100 p-4 rounded-3"
                style={{
                  backgroundColor: "var(--warning-background)",
                  border: "1px solid var(--warning-border)",
                }}
              >
                <h3 className="h5 fw-bold">Fuel surcharge</h3>
                <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                  When applicable, fuel is a dynamic pass-through cost based on current operating
                  conditions and delivery details. The current charge is shown during booking before
                  payment.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <a href="https://book.littlejunkersllc.com" className="btn btn-brand btn-lg px-4">
              Check Availability
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
