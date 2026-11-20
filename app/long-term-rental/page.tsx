import type { Metadata } from "next";
import Link from "next/link";
import {company,telHref,smsHref} from "@/lib/company";

export const metadata: Metadata = {
  title: "Long-Term Dumpster Rental Quotes",
  description: "Need a dumpster for longer than 30 days? Discuss a personal quote with Little Junkers instead of an automated long-term checkout.",
  alternates: {canonical:"/long-term-rental"}
};
export default function LongTermRental() {
  return <section className="section"><div className="container cx-reading">
    <p className="eyebrow">Longer projects · human quotes</p>
    <h1>Need a dumpster for more than 30 days?</h1>
    <p className="lead">A renovation or construction project may last weeks or months. Rentals beyond 30 days need a custom quote based on the materials, jobsite and equipment schedule.</p>
    <div className="cx-note"><h2>What we need to know</h2><p>Tell us your jobsite ZIP, dumpster size, materials, preferred delivery date, expected length and whether you anticipate additional pickups or swaps. We will discuss your needs before quoting terms.</p></div>
    <p>There is no automatic extended-rental price, reservation or payment on this page.</p>
    <div className="btn-row"><a className="btn btn--primary" href={telHref}>Call {company.phoneDisplay}</a><a className="btn btn--secondary" href={smsHref}>Text about an extended rental</a><Link className="btn btn--secondary" href="/plan">Plan a shorter rental</Link></div>
  </div></section>;
}
