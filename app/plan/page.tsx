import type { Metadata } from "next";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing } from "@/lib/pricing";
import { basePriceSnapshot } from "@/lib/days-plus";
import type { SizeYards } from "@/lib/pricing";
import { indexable } from "@/lib/indexing";

export const metadata: Metadata = {
  title: "Book a Dumpster Online",
  description: "Start your Little Junkers dumpster booking. Choose an 11-, 16- or 21-yard Pink Bin, enter your city or ZIP, and select your rental dates.",
  robots: { index: false, follow: false }
};
type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
export default async function PlanPage({searchParams}:{searchParams:Promise<Params>}) {
  const params = await searchParams;
  const pricing = await getPricing();
  const rawSize = Number(first(params.size));
  const size: SizeYards | undefined = rawSize === 11 || rawSize === 16 || rawSize === 21 ? rawSize : undefined;
  const rawDays = Number(first(params.days) ?? 3);
  const days = Number.isInteger(rawDays) ? Math.max(3, Math.min(30,rawDays)) : 3;
  const rawZip = first(params.zip) ?? "";
  const zip = /^\d{5}$/.test(rawZip) ? rawZip : undefined;
  const location = first(params.location)?.trim().slice(0, 60) || undefined;
  return <section className="section"><div className="container">
    <div className="section-head"><p className="eyebrow">Online dumpster rental</p><h1>Book your Pink Bin</h1><p>Choose your dumpster size, delivery location and rental dates. We'll show the price as you go. Your booking is complete only when payment is accepted and you receive a confirmation.</p></div>
    {!indexable ? (
      <div className="notice" role="note">
        <p><strong>Website preview:</strong> Online payment and reservations are not connected in this version. No booking is created here.</p>
      </div>
    ) : null}
    <DaysPlusPlanner initialSize={size} initialDays={days} initialZip={zip} initialLocation={location} basePrices={basePriceSnapshot(pricing)} />
  </div></section>;
}
