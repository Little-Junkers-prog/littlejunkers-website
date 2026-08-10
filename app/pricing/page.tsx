import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

type PricingRow = {
  active?: boolean | null;
  tier_key?: string | null;
  display_label?: string | null;
  price_11?: number | string | null;
  price_16?: number | string | null;
  price_21?: number | string | null;
};

type SizeRow = {
  active?: boolean | null;
  size_yards?: number | string | null;
  included_tons?: number | string | null;
  short_desc?: string | null;
  best_for?: string | null;
  truck_loads?: string | null;
};

const productNames: Record<number, string> = {
  11: "The Little Junker",
  16: "The Mighty Middler",
  21: "The Big Junker",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
}

async function getPricing() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const [{ data: prices, error: pricesError }, { data: sizes, error: sizesError }] =
    await Promise.all([
      supabase
        .from("pricing")
        .select("active,tier_key,display_label,price_11,price_16,price_21"),
      supabase
        .from("dumpster_sizes")
        .select("active,size_yards,included_tons,short_desc,best_for,truck_loads"),
    ]);

  if (pricesError || sizesError) return [];

  const activePrices = (prices as PricingRow[]).filter((row) => row.active !== false);
  const activeSizes = (sizes as SizeRow[])
    .filter((row) => row.active !== false)
    .map((row) => ({
      size: Number(row.size_yards),
      tons: Number(row.included_tons || 0),
      description: row.short_desc || row.best_for || "A practical option for your cleanup.",
      bestFor: row.best_for || row.short_desc || "Cleanup and debris removal projects.",
      truckLoads: row.truck_loads || "",
      startingAt: Math.min(
        ...activePrices
          .map((price) => Number(price[`price_${Number(row.size_yards)}` as keyof PricingRow] || 0))
          .filter((price) => price > 0),
      ),
    }))
    .filter((row) => productNames[row.size] && Number.isFinite(row.startingAt))
    .sort((a, b) => a.size - b.size);

  return activeSizes;
}

export default async function PricingPage() {
  const products = await getPricing();

  return (
    <>
      <section className="py-5" style={{ backgroundColor: "var(--dark-hero)", color: "var(--card-background)" }}>
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="hero-eyebrow text-uppercase fw-bold mb-3">Dumpster rental pricing</p>
              <h1 className="display-4 fw-bold mb-4">
                Transparent Pricing. <span className="text-pink">No Hidden Fees.</span>
              </h1>
              <p className="fs-5 mb-4" style={{ color: "var(--ink-faint)" }}>
                Start with the size that fits your project. We will show current availability and the right rental options before you reserve.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <a href="https://book.littlejunkersllc.com" className="btn btn-brand btn-lg px-4">
                  Check Availability
                </a>
                <Link href="/#sizes" className="btn btn-outline-light btn-lg px-4">
                  Compare Dumpster Sizes
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card-featured p-4">
                <p className="text-uppercase fw-bold small mb-2" style={{ color: "var(--pink-text)" }}>A simpler way to book</p>
                <h2 className="h3 fw-bold">Pick a size, then choose your dates.</h2>
                <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                  Pricing is pulled from our live booking system. Your final quote reflects your rental choice and service area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
        <div className="container">
          <div className="row align-items-end mb-4 g-3">
            <div className="col-lg-8">
              <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--pink-text)", letterSpacing: "0.08em" }}>
                Choose your dumpster
              </p>
              <h2 className="fw-bold mb-3">Three Sizes for Real-World Cleanups</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                Every option includes tonnage and driveway-safe delivery from our local team.
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-lg-4" key={product.size}>
                  <article className={`card-standard h-100 p-4 ${product.size === 16 ? "border-2" : ""}`}>
                    {product.size === 16 ? (
                      <span className="badge mb-3" style={{ backgroundColor: "var(--pink-bar)", color: "var(--ink-primary)" }}>
                        Most Popular
                      </span>
                    ) : null}
                    <p className="text-uppercase small fw-bold mb-2" style={{ color: "var(--pink-text)" }}>
                      {product.size}-yard dumpster
                    </p>
                    <h3 className="h3 fw-bold">{productNames[product.size]}</h3>
                    <p style={{ color: "var(--ink-mid)" }}>{product.description}</p>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="check-badge" style={{ width: "auto", padding: "0 12px" }}>
                        Includes {product.tons} ton{product.tons === 1 ? "" : "s"}
                      </span>
                      {product.truckLoads ? <span className="check-badge" style={{ width: "auto", padding: "0 12px" }}>{product.truckLoads}</span> : null}
                    </div>
                    <div className="border-top pt-3 mt-auto" style={{ borderColor: "var(--border-card)" }}>
                      <p className="small mb-1" style={{ color: "var(--ink-muted)" }}>Starting at</p>
                      <p className="display-6 fw-bold mb-3">{formatCurrency(product.startingAt)}</p>
                      <a href={`https://book.littlejunkersllc.com/rent-a-dumpster?size=${product.size}`} className="btn btn-brand w-100">
                        Check Availability
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-standard p-4">
              <h2 className="h5 fw-bold">Pricing is temporarily unavailable.</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                Please call or text us at <a href="tel:+14705484733">(470) 548-4733</a> and we will help you choose a size.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: "var(--pink-background)" }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--pink-text)", letterSpacing: "0.08em" }}>Not sure you need a dumpster?</p>
              <h2 className="fw-bold mb-3">Bulk haul-away may be the better fit.</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                If you already have items staged outside, ask about our less expensive bulk haul-away option. We would rather point you to the right service than have you pay for more container than you need.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link href="/contactus?service=bulk-haul-away" className="btn btn-ghost px-4">
                Explore Bulk Haul-Away
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
