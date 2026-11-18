import type { Metadata } from "next";
import Link from "next/link";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing, formatUsd, formatTons } from "@/lib/pricing";
import { threeDayTier } from "@/lib/days-plus";
import { sizes } from "@/lib/sizes";
import { smsHref,telHref,company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Dumpster Rental Pricing in Fayette & Coweta County",
  description: "Understand Little Junkers dumpster base prices, included weight, delivery fees and the upcoming Days Plus rental experience.",
  alternates: { canonical: "/pricing" }
};
export default async function PricingPage() {
  const pricing = await getPricing();
  const base = pricing ? threeDayTier(pricing) : null;
  return <><section className="section"><div className="container cx-reading">
    <p className="eyebrow">Local dumpster pricing</p>
    <h1>What goes into the rental price?</h1>
    <p className="lead">A dumpster quote should tell you more than the size and a dollar figure. Look at the included rental days, the disposal weight allowance, the service ZIP and any charges for going over the included tonnage.</p>
    {base && pricing ? <>
      <div className="cx-price-list">
        {sizes.map(size => <article className="card" key={size.yards}>
          <h2>{size.yards}-yard · {size.name}</h2>
          <p className="cx-money">{formatUsd(base.prices[size.yards])}</p>
          <p>3-day base · {formatTons(pricing.sizes[size.yards].includedTons)} of disposal weight included</p>
          <Link href={"/plan?size=" + size.yards}>Plan this dumpster →</Link>
        </article>)}
      </div>
      <div className="cx-note"><h2>Delivery depends on the ZIP</h2><p>{Object.values(pricing.zones).sort((a,b)=>a.deliveryFee-b.deliveryFee).map(z=>z.label+": "+(z.deliveryFee===0?"included":formatUsd(z.deliveryFee))).join(" · ")}. Confirm your exact ZIP before assuming a zone or fee.</p></div>
      <div className="cx-note"><h2>Weight can change the cost</h2><p>{pricing.overagePerTon ? "Current excess disposal-weight rate: "+formatUsd(pricing.overagePerTon)+" per ton above the included limit." : "Excess disposal weight may incur additional fees. Ask for the current overage rate."} This is not the same as the prepaid Days Plus additional-day price.</p></div>
    </> : <div className="notice"><h2>We can't verify base pricing right now</h2><p>We won't substitute guessed numbers. <a href={telHref}>Call {company.phoneDisplay}</a> or <a href={smsHref}>text us</a> to ask about current pricing.</p></div>}
    <h2>How Days Plus is planned to work</h2>
    <p>A three-day base, plus zero to 27 extra days. The online range is three to 30 total days. Beyond 30 days, we'll discuss a custom quote. The prepaid extra-day rates, complete server-calculated total, available dates and payment step are not enabled in this website preview.</p>
    <p><Link href="/compare">See what to compare when shopping around →</Link> · <Link href="/long-term-rental">Longer-term rental questions</Link></p>
  </div></section><section className="section section--surface"><div className="container"><DaysPlusPlanner /></div></section></>;
}
