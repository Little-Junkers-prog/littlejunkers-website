import type { Metadata } from "next";
import Link from "next/link";
import { getPricing,formatUsd,formatTons } from "@/lib/pricing";
import { threeDayTier } from "@/lib/days-plus";
import { sizes } from "@/lib/sizes";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { company,telHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "How to Compare Dumpster Rentals in South Metro Atlanta",
  description: "Compare rental length, dumpster size, included weight, delivery charges and overage terms. We only publish competitor prices with checked sources and dates.",
  alternates: { canonical: "/compare" }
};
const comparisons = [
  ["Included rental days","Two similar prices may cover different rental lengths. Compare the number of days you'll actually have the dumpster."],
  ["Included disposal weight","An 11-yard and a 21-yard dumpster hold different amounts of debris. Confirm the allowed tons, not just cubic yards."],
  ["Delivery fee for your ZIP","An advertised base may not include an extended-area fee. Confirm the jobsite ZIP."],
  ["Excess weight and restricted materials","Concrete, dirt and heavy renovation debris require special planning. Understand the permitted load and possible charges."],
  ["Fleet availability","An advertised price is not a promise that a unit and delivery slot are available on your requested date."]
];
export default async function ComparePage() {
  const pricing = await getPricing();
  const base = pricing ? threeDayTier(pricing) : null;
  return <><section className="section"><div className="container cx-reading">
    <p className="eyebrow">Shop the complete rental</p>
    <h1>The cheapest headline isn't always the best fit.</h1>
    <p className="lead">We want local shoppers to compare real offers fairly. That means showing the rental period, weight allowance, delivery charges and source of every price—not just a number in a table.</p>
    <div className="cx-note"><h2>Verified competitor rates: coming later</h2><p>We have not loaded and approved sourced local competitor quotes and verification dates. Until that happens, we will not display competitor prices or imply that Little Junkers beats them.</p></div>
    <h2>Five questions to ask every company</h2>
    <div className="cx-compare-list">{comparisons.map(([heading,detail])=><article key={heading} className="card"><h3>{heading}</h3><p className="muted">{detail}</p></article>)}</div>
    <h2>Little Junkers: canonical three-day base</h2>
    {base && pricing ? <div className="cx-price-list">{sizes.map(size=><article className="card" key={size.yards}><h3>{size.yards}-yard · {size.name}</h3><p className="cx-money">{formatUsd(base.prices[size.yards])}</p><p>3 days · {formatTons(pricing.sizes[size.yards].includedTons)} included</p><Link href={"/plan?size="+size.yards}>Plan this size →</Link></article>)}</div> : <div className="notice">Live canonical base prices aren't available right now. Call <a href={telHref}>{company.phoneDisplay}</a> for current terms.</div>}
    <p className="fine">Three-day base prices do not equal an all-in quote. Delivery ZIP, extra prepaid days and the actual rental window require the new server-side pricing and Fleet checks. <Link href="/pricing">Detailed pricing explanation</Link>.</p>
  </div></section><section className="section section--surface"><div className="container"><h2>Ready to plan?</h2><p className="muted">You can skip comparison and select the dumpster that fits your project.</p><DaysPlusPlanner /></div></section></>;
}
