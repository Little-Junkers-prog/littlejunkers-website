import { PlanLink } from "@/components/PlanLink";
import type { Metadata } from "next";
import Link from "next/link";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing, formatUsd, formatTons } from "@/lib/pricing";
import { threeDayTier, basePriceSnapshot } from "@/lib/days-plus";
import { sizes } from "@/lib/sizes";
import { smsHref,telHref,company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Dumpster Rental Pricing in Fayette & Coweta County",
  description: "Little Junkers dumpster prices for 11, 16 and 21 yards. See what each size costs, how much weight is included and what delivery costs in your ZIP.",
  alternates: { canonical: "/pricing" }
};
export default async function PricingPage() {
  const pricing = await getPricing();
  const base = pricing ? threeDayTier(pricing) : null;
  return <><section className="section"><div className="container cx-reading">
    <p className="eyebrow">Local dumpster pricing</p>
    <h1>Dumpster rental prices</h1>
    <p className="lead">Here&apos;s what each size costs for 3 days. Your total depends on the size, your ZIP and how many days you keep it.</p>
    {base && pricing ? <>
      <div className="cx-price-list">
        {sizes.map(size => <article className="card" key={size.yards}>
          <h2>{size.yards}-yard · {size.name}</h2>
          <p className="cx-money">{formatUsd(base.prices[size.yards])}</p>
          <p>3 days · up to {formatTons(pricing.sizes[size.yards].includedTons)} of weight included</p>
          <PlanLink size={size.yards}>See my estimate →</PlanLink>
        </article>)}
      </div>
      <div className="cx-note"><h2>Delivery fee</h2><p>{Object.values(pricing.zones).sort((a,b)=>a.deliveryFee-b.deliveryFee).map(z=>z.label+": "+(z.deliveryFee===0?"included":formatUsd(z.deliveryFee))).join(" · ")}. Type your city or ZIP below to see yours.</p></div>
      <div className="cx-note"><h2>Going over the weight limit</h2><p>Your load gets weighed at the landfill after we pick it up. {pricing.overagePerTon ? "If it's over the weight included with your size, it's "+formatUsd(pricing.overagePerTon)+" for each ton over." : "If it's over the weight included with your size, there's an extra charge. Ask us for the rate."}</p><p>Extra days cost extra too. We&apos;ll tell you that price before you book.</p></div>
    </> : <div className="notice"><h2>Prices aren't loading right now</h2><p><a href={telHref}>Call {company.phoneDisplay}</a> or <a href={smsHref}>text us</a> for today's prices.</p></div>}
    <h2>Need more days?</h2>
    <p>Keep it 3 days or up to 30. Longer than that, call us for a quote. We confirm the exact price and dates before you book.</p>
    <p><Link href="/compare">See how we compare →</Link> · <Link href="/long-term-rental">Renting longer than 30 days?</Link></p>
  </div></section><section className="section section--surface"><div className="container"><DaysPlusPlanner basePrices={basePriceSnapshot(pricing)} daysPlusRates={pricing?.daysPlusRates ?? null} /></div></section></>;
}
