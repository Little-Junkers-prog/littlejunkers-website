import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type PricingRow = {
  id?: string | number;
  dumpster_size?: string | number | null;
  size?: string | number | null;
  size_yards?: string | number | null;
  yards?: string | number | null;
  tier?: string | null;
  package?: string | null;
  package_name?: string | null;
  rental_tier?: string | null;
  price?: string | number | null;
  amount?: string | number | null;
  base_price?: string | number | null;
  active?: boolean | null;
  is_active?: boolean | null;
};

type SizePricing = {
  size: 11 | 16 | 21;
  title: string;
  bestFor: string;
  included: string;
  featured?: boolean;
  tiers: Array<{ label: string; price: number }>;
};

const sizeCards: Omit<SizePricing, "tiers">[] = [
  {
    size: 11,
    title: "11-yard dumpster",
    bestFor: "Garage cleanouts, small renovations, and lighter home projects.",
    included: "Compact footprint for tighter driveways.",
  },
  {
    size: 16,
    title: "16-yard dumpster",
    bestFor: "Roofing, flooring, remodel debris, and bigger weekend cleanups.",
    included: "The easy middle choice for most household projects.",
    featured: true,
  },
  {
    size: 21,
    title: "21-yard dumpster",
    bestFor: "Large cleanouts, contractor jobs, and bulky material loads.",
    included: "More room when one trip needs to do the work.",
  },
];

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://fobkdakjawryhzkcdbbo.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

function normalizeSize(row: PricingRow) {
  const rawSize = row.size_yards ?? row.dumpster_size ?? row.size ?? row.yards;
  const match = String(rawSize ?? "").match(/11|16|21/);
  return match ? Number(match[0]) : null;
}

function normalizeLabel(row: PricingRow) {
  return row.package_name ?? row.rental_tier ?? row.tier ?? row.package ?? "Rental rate";
}

function normalizePrice(row: PricingRow) {
  const rawPrice = row.price ?? row.base_price ?? row.amount;
  const numeric = Number(String(rawPrice ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

async function getPricingBySize() {
  const supabase = getSupabaseClient();
  const pricingBySize = new Map<number, Array<{ label: string; price: number }>>();

  if (!supabase) {
    return pricingBySize;
  }

  const { data, error } = await supabase.from("pricing").select("*").order("price", { ascending: true });

  if (error || !data) {
    return pricingBySize;
  }

  for (const row of data as PricingRow[]) {
    if (row.active === false || row.is_active === false) {
      continue;
    }

    const size = normalizeSize(row);
    const price = normalizePrice(row);

    if (!size || !price || ![11, 16, 21].includes(size)) {
      continue;
    }

    const tiers = pricingBySize.get(size) ?? [];
    tiers.push({ label: normalizeLabel(row), price });
    pricingBySize.set(size, tiers);
  }

  return pricingBySize;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price);
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <DumpsterLineup />
      <ValueProps />
      <Testimonials />
      <HomeFaq />
    </>
  );
}

function Hero() {
  return (
    <section className="py-5" style={{ backgroundColor: "var(--dark-hero)", color: "var(--card-background)" }}>
      <div className="container py-lg-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="text-uppercase fw-bold mb-3" style={{ color: "var(--pink-bar)", letterSpacing: "0.08em" }}>
              Local dumpster rental
            </p>
            <h1 className="display-4 fw-bold mb-4">Driveway-Safe Dumpster Rental in Peachtree City</h1>
            <p className="fs-5 mb-4" style={{ color: "var(--ink-faint)" }}>
              Get a clean, driveway-friendly roll-off dumpster delivered by a local team that keeps pricing clear and the process simple.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <a href="https://book.littlejunkersllc.com" className="btn btn-brand btn-lg px-4">
                Book Your Dumpster
              </a>
              <Link href="#sizes" className="btn btn-outline-light btn-lg px-4">
                See Sizes and Pricing
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ratio ratio-4x3 rounded-3 overflow-hidden" style={{ backgroundColor: "var(--surface-background)" }}>
              <div className="d-flex align-items-center justify-content-center text-center p-4" role="img" aria-label="Pink Little Junkers dumpster placed carefully on a residential driveway">
                <span className="fw-bold fs-4" style={{ color: "var(--ink-primary)" }}>
                  Pink Little Junkers dumpster on a driveway
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["1", "Pick your size", "Choose the dumpster that fits your cleanup. If you are unsure, start with the 16-yard."],
    ["2", "Choose your dates", "Book online, see your delivery options, and know what you are paying before checkout."],
    ["3", "Fill it up", "We place it carefully, you load it, and we come back for pickup when the rental is done."],
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-3">How It Works</h2>
            <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
              No phone tag required. Book the dumpster, get it delivered, and keep your project moving.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {steps.map(([number, title, copy]) => (
            <div className="col-md-4" key={title}>
              <article className="card-standard h-100 p-4">
                <span className="check-badge mb-3">{number}</span>
                <h3 className="h5 fw-bold">{title}</h3>
                <p className="mb-0" style={{ color: "var(--ink-mid)" }}>{copy}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function DumpsterLineup() {
  const pricingBySize = await getPricingBySize();
  const cards: SizePricing[] = sizeCards.map((card) => ({ ...card, tiers: pricingBySize.get(card.size) ?? [] }));

  return (
    <section id="sizes" className="py-5" style={{ backgroundColor: "var(--surface-background)" }}>
      <div className="container">
        <div className="row align-items-end mb-4 g-3">
          <div className="col-lg-8">
            <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--pink-text)", letterSpacing: "0.08em" }}>
              Dumpster lineup
            </p>
            <h2 className="fw-bold mb-3">Three Sizes, Clear Rates</h2>
            <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
              Prices come from our live pricing table so the homepage stays aligned with the booking system.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <a href="https://book.littlejunkersllc.com" className="btn btn-brand px-4">
              Check Availability
            </a>
          </div>
        </div>

        <div className="row g-4">
          {cards.map((card) => (
            <div className="col-lg-4" key={card.size}>
              <article className={`${card.featured ? "card-featured" : "card-standard"} h-100 p-4 position-relative`}>
                {card.featured ? (
                  <span className="badge position-absolute top-0 start-50 translate-middle px-3 py-2" style={{ backgroundColor: "var(--pink-bar)", color: "var(--ink-primary)" }}>
                    Most Popular
                  </span>
                ) : null}
                <h3 className="h4 fw-bold mt-2">{card.title}</h3>
                <p style={{ color: "var(--ink-mid)" }}>{card.bestFor}</p>
                <p className="small fw-semibold" style={{ color: "var(--pink-text)" }}>{card.included}</p>
                <div className="border-top pt-3 mt-3" style={{ borderColor: "var(--border-card)" }}>
                  {card.tiers.length > 0 ? (
                    card.tiers.map((tier) => (
                      <div className="d-flex justify-content-between gap-3 py-2" key={`${card.size}-${tier.label}-${tier.price}`}>
                        <span style={{ color: "var(--ink-mid)" }}>{tier.label}</span>
                        <strong>{formatPrice(tier.price)}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                      Live pricing is available in the booking flow.
                    </p>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueProps() {
  const values = [
    ["Locally owned", "You are working with a Peachtree City business, not a national call center."],
    ["Driveway-safe", "Our smaller roll-off setup is built for residential driveways and careful placement."],
    ["Transparent pricing", "Rates, delivery zones, and common fees are kept clear before you book."],
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-5">
            <h2 className="fw-bold mb-3">Built for Local Cleanups</h2>
            <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
              From weekend garage projects to contractor debris, Little Junkers keeps dumpster rental straightforward and neighborly.
            </p>
          </div>
          <div className="col-lg-7">
            <div className="row g-3">
              {values.map(([title, copy]) => (
                <div className="col-md-4" key={title}>
                  <div className="card-standard h-100 p-4">
                    <span className="check-badge mb-3">✓</span>
                    <h3 className="h6 fw-bold">{title}</h3>
                    <p className="small mb-0" style={{ color: "var(--ink-mid)" }}>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StarRating() {
  return (
    <div className="mb-3" aria-label="5 out of 5 stars" style={{ color: "var(--pink-bar)", letterSpacing: "0.08em" }}>
      ★★★★★
    </div>
  );
}

function Testimonials() {
  const reviews = [
    {
      reviewer: "Nicholas O.",
      review:
        "Dumpster was great, no damage to the driveway. I was at work during both drop-off and pickup but my wife said they were very easy to work with and very friendly.",
    },
    {
      reviewer: "john trojanczyk",
      review:
        "Everything went smoothly. The dumpster arrived as promised and the truck driver, Marcus, was very professional and helpful.",
    },
    {
      reviewer: "Teddy Gil",
      review:
        "Super great service. As advertised and super friendly. Pickup was on time and a breeze. Highly recommended!",
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <p className="text-uppercase fw-bold mb-2" style={{ color: "var(--pink-text)", letterSpacing: "0.08em" }}>
              Google Reviews
            </p>
            <h2 className="fw-bold mb-3">What Local Customers Are Saying</h2>
            <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
              Friendly service, careful driveway placement, and pickup when promised.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {reviews.map((review) => (
            <div className="col-md-4" key={review.reviewer}>
              <article className="card-standard h-100 p-4">
                <StarRating />
                <p className="mb-4">"{review.review}"</p>
                <p className="fw-semibold mb-0">{review.reviewer}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeFaq() {
  return (
    <section className="py-5" style={{ backgroundColor: "var(--page-background)" }}>
      <div className="container">
        <div className="card-standard p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Have questions about what you can throw away or how delivery works?</h2>
              <p className="mb-0" style={{ color: "var(--ink-mid)" }}>
                Get clear answers before you book, including delivery basics, accepted materials, and rental rules.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link href="/dumpster-rental-faq" className="btn btn-outline-dark px-4">
                View Rental FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
