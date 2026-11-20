import type { Metadata } from "next";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import { getPricing } from "@/lib/pricing";
import { basePriceSnapshot } from "@/lib/days-plus";
import type { SizeYards } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "See Your Dumpster Rental Estimate",
  description: "Plan an 11-, 16- or 21-yard Little Junkers rental. Enter your city or ZIP, choose a rental period and review the current base rate and delivery fee.",
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
    <div className="section-head"><p className="eyebrow">Your rental estimate</p><h1>Check your dumpster price</h1><p>Choose a dumpster, city or ZIP, and dates to see an estimate. We'll confirm the exact price and availability before booking.</p></div>
    <DaysPlusPlanner initialSize={size} initialDays={days} initialZip={zip} initialLocation={location} basePrices={basePriceSnapshot(pricing)} />
  </div></section>;
}
