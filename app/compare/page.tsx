import type { Metadata } from "next";
import ComparisonTool from "@/components/ComparisonTool";

export const metadata: Metadata = {
  title: "Compare Local Dumpster Rental Prices",
  description: "Compare local dumpster sizes, published rental prices, included weight, rental terms and delivery details for a city or ZIP in South Metro Atlanta.",
  alternates: { canonical: "/compare" }
};

type Search = Record<string, string | string[] | undefined>;
function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const rawSize = Number(first(query.size));
  const size = rawSize === 11 || rawSize === 16 || rawSize === 21 ? rawSize : 16;
  const rawDays = Number(first(query.days));
  const days = Number.isInteger(rawDays) && rawDays >= 3 && rawDays <= 30 ? rawDays : 3;
  const location = (first(query.location) ?? first(query.zip) ?? "").slice(0, 60);

  return <>
    <section className="comparison-hero" aria-labelledby="comparison-heading">
      <div className="container comparison-hero__inner">
        <p className="eyebrow">Local dumpster rental comparison</p>
        <h1 id="comparison-heading">See how we compare.</h1>
        <p>Published rental prices, dumpster sizes, and the terms worth checking before you rent.</p>
      </div>
    </section>
    <section className="section comparison-content">
      <div className="container">
        <ComparisonTool initialLocation={location} initialSize={size as 11 | 16 | 21} initialDays={days} />
      </div>
    </section>
  </>;
}
