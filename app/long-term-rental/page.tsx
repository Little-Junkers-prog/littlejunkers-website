import type { Metadata } from "next";
import Link from "next/link";
import {company,telHref,smsHref} from "@/lib/company";

export const metadata: Metadata = {
  title: "Long-Term Dumpster Rental Quotes",
  description: "Need a dumpster for longer than 30 days in Fayette or Coweta County? Ask Little Junkers about a custom rental period, deliveries and swaps.",
  alternates: {canonical:"/long-term-rental"}
};
export default function LongTermRental() {
  return <section className="section"><div className="container cx-reading">
    <p className="eyebrow">Longer rentals</p>
    <h1>Need a dumpster for more than 30 days?</h1>
    <p className="lead">Some projects take longer than a month. Tell us what you’re working on, where the dumpster would go and how long you expect to need it. We’ll put together a quote based on your job.</p>
    <div className="cx-note"><h2>Before you call</h2><p>It helps to have your ZIP code, preferred dumpster size, materials, start date and estimated rental length. If you’ll need the dumpster emptied and returned during the job, mention that too.</p></div>
    <p>Longer rentals are quoted individually. We’ll confirm the price and schedule with you before anything is reserved.</p>
    <div className="btn-row"><a className="btn btn--primary" href={telHref}>Call {company.phoneDisplay}</a><a className="btn btn--secondary" href={smsHref}>Text about an extended rental</a><Link className="btn btn--secondary" href="/plan">Plan a shorter rental</Link></div>
  </div></section>;
}
