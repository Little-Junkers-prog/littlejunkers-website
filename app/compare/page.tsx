import type { Metadata } from "next";
import ComparisonTool from "@/components/ComparisonTool";

export const metadata: Metadata = {
  title: "Compare Local Dumpster Rental Prices",
  description: "Compare Little Junkers with published dumpster rental offers around Peachtree City, Newnan and Fayetteville. Check size, rental days, included weight and fees.",
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
        <h1 id="comparison-heading">Compare dumpster rental prices.</h1>
        <p>Look at what each published price covers, from rental days to included disposal weight. Check the details with each company before booking.</p>
      </div>
    </section>
    <section className="section comparison-content">
      <div className="container">
        <ComparisonTool initialLocation={location} initialSize={size as 11 | 16 | 21} initialDays={days} />
      </div>
    </section>
  </>;
}
