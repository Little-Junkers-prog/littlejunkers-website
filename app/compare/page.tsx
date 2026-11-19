import type { Metadata } from "next";
import Link from "next/link";
import { getPricing,formatUsd,formatTons } from "@/lib/pricing";
import { threeDayTier, basePriceSnapshot } from "@/lib/days-plus";
import { sizes } from "@/lib/sizes";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { company,telHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "Compare Dumpster Rental Prices in South Metro Atlanta",
  description: "Compare rental length, dumpster size, included weight, delivery charges and overage terms. We only publish competitor prices with checked sources and dates.",
  alternates: { canonical: "/compare" }
};
const comparisons = [
  ["Rental days","Check how many days the quoted price includes."],
  ["Included weight","Check the included disposal tons and excess-weight rate."],
  ["Delivery fee","Enter your city or ZIP to check delivery charges."],
  ["Heavy debris","Tell us if you're loading shingles, concrete, dirt or other dense material."],
  ["Delivery date","Confirm available dates before paying."]
];
export default async function ComparePage() {
  const pricing = await getPricing();
  const base = pricing ? threeDayTier(pricing) : null;
  return <><section className="section"><div className="container cx-reading">
    <p className="eyebrow">Local dumpster prices</p>
    <h1>See how we compare.</h1>
    <p className="lead">Compare dumpster sizes, rental days, included weight and delivery fees. We'll add other local rates when we can verify the prices and terms.</p>
    <div className="cx-note"><h2>Other local rental prices</h2><p>We're checking local offers and their terms. Until those prices are verified, you can compare our current rates and the details that affect your total.</p></div>
    <h2>Compare these details</h2>
    <div className="cx-compare-list">{comparisons.map(([heading,detail])=><article key={heading} className="card"><h3>{heading}</h3><p className="muted">{detail}</p></article>)}</div>
    <h2>Little Junkers prices</h2>
    {base && pricing ? <div className="cx-price-list">{sizes.map(size=><article className="card" key={size.yards}><h3>{size.yards}-yard · {size.name}</h3><p className="cx-money">{formatUsd(base.prices[size.yards])}</p><p>3 days · {formatTons(pricing.sizes[size.yards].includedTons)} included</p><Link href={"/plan?size="+size.yards}>See estimate →</Link></article>)}</div> : <div className="notice">Current base prices aren't available right now. Call <a href={telHref}>{company.phoneDisplay}</a> for current terms.</div>}
    <p className="fine">These are three-day starting prices. Enter a city or ZIP and your rental dates to see your estimate. <Link href="/pricing">Detailed pricing explanation</Link>.</p>
  </div></section><section className="section section--surface"><div className="container"><h2>Ready to plan?</h2><p className="muted">Choose your size and check your estimated price.</p><DaysPlusPlanner basePrices={basePriceSnapshot(pricing)} /></div></section></>;
}
