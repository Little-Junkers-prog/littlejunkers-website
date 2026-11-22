import type { Metadata } from "next";
import Link from "next/link";
import {company,telHref,smsHref} from "@/lib/company";

export const metadata: Metadata = {
  title: "Long-Term Dumpster Rental Quotes",
  description: "Need a dumpster for more than 30 days? Call or text Little Junkers for a long-term rental quote.",
  alternates: {canonical:"/long-term-rental"}
};
export default function LongTermRental() {
  return <section className="section"><div className="container cx-reading">
    <p className="eyebrow">Long-term rentals</p>
    <h1>Need a dumpster for more than 30 days?</h1>
    <p className="lead">Some remodels and builds run for weeks or months. For anything over 30 days, we&apos;ll quote it based on what&apos;s going in the dumpster, the job site and our schedule.</p>
    <div className="cx-note"><h2>What we need to know</h2><p>Send us the job site ZIP, the size you want, what&apos;s going in it, when you need it, about how long you&apos;ll keep it, and whether you&apos;ll need it emptied or swapped along the way. We&apos;ll talk it through before we give you a price.</p></div>
    <p>Long-term rentals aren&apos;t booked online. Give us a call or send a text.</p>
    <div className="btn-row"><a className="btn btn--primary" href={telHref}>Call {company.phoneDisplay}</a><a className="btn btn--secondary" href={smsHref}>Text us about it</a><Link className="btn btn--secondary" href="/plan">Plan a shorter rental</Link></div>
  </div></section>;
}
