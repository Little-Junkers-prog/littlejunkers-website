import type { Metadata } from "next";
import Link from "next/link";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing, formatUsd, formatTons } from "@/lib/pricing";
import { threeDayTier, basePriceSnapshot } from "@/lib/days-plus";
import { sizes } from "@/lib/sizes";
import { smsHref,telHref,company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Dumpster Rental Pricing in Fayette & Coweta County",
  description: "See Little Junkers dumpster prices, included disposal weight, delivery fees and rental-day options for Fayette and Coweta County.",
  alternates: { canonical: "/pricing" }
};
export default async function PricingPage() {
  const pricing = await getPricing();
  const base = pricing ? threeDayTier(pricing) : null;
  return <><section className="section"><div className="container cx-reading">
    <p className="eyebrow">Local dumpster pricing</p>
    <h1>Dumpster rental prices</h1>
    <p className="lead">See the three-day starting price for each dumpster. The price for your rental depends on size, location, and the number of days you need.</p>
    {base && pricing ? <>
      <div className="cx-price-list">
        {sizes.map(size => <article className="card" key={size.yards}>
          <h2>{size.yards}-yard · {size.name}</h2>
          <p className="cx-money">{formatUsd(base.prices[size.yards])}</p>
          <p>3 days included · {formatTons(pricing.sizes[size.yards].includedTons)} of disposal weight included</p>
          <Link href={"/plan?size=" + size.yards}>See my estimate →</Link>
        </article>)}
      </div>
      <div className="cx-note"><h2>Delivery by city or ZIP</h2><p>{Object.values(pricing.zones).sort((a,b)=>a.deliveryFee-b.deliveryFee).map(z=>z.label+": "+(z.deliveryFee===0?"included":formatUsd(z.deliveryFee))).join(" · ")}. Enter your city or ZIP below to check the delivery area.</p></div>
      <div className="cx-note"><h2>Extra disposal weight</h2><p>{pricing.overagePerTon ? "Current excess disposal-weight rate: "+formatUsd(pricing.overagePerTon)+" per ton above the included limit." : "Excess disposal weight may incur additional fees. Ask for the current overage rate."} Additional rental days have a separate price, which we’ll confirm before booking.</p></div>
    </> : <div className="notice"><h2>We can't verify base pricing right now</h2><p>We won't substitute guessed numbers. <a href={telHref}>Call {company.phoneDisplay}</a> or <a href={smsHref}>text us</a> to ask about current pricing.</p></div>}
    <h2>Need more days?</h2>
    <p>Rent for three days or choose up to 30 total days. Need longer? Contact us for a custom quote. We'll confirm the exact price and available dates before booking.</p>
    <p><Link href="/compare">See how we compare →</Link> · <Link href="/long-term-rental">Longer-term rental questions</Link></p>
  </div></section><section className="section section--surface"><div className="container"><DaysPlusPlanner basePrices={basePriceSnapshot(pricing)} daysPlusRates={pricing?.daysPlusRates ?? null} /></div></section></>;
}
