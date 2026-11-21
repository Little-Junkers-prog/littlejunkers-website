import type { Metadata } from "next";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing } from "@/lib/pricing";
import { basePriceSnapshot } from "@/lib/days-plus";
import type { SizeYards } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Book a Dumpster Online",
  description: "Choose a Little Junkers Pink Bin, check your delivery area, and select rental dates. Start a dumpster booking online.",
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
    <div className="section-head"><p className="eyebrow">Online dumpster rental</p><h1>Pick your Pink Bin and rental dates</h1><p>Tell us what size you need, where to deliver it, and how long you want it. You’ll see the rental charges and any details we still need to confirm.</p></div>
    <DaysPlusPlanner initialSize={size} initialDays={days} initialZip={zip} initialLocation={location} basePrices={basePriceSnapshot(pricing)} daysPlusRates={pricing?.daysPlusRates ?? null} />
  </div></section>;
}
