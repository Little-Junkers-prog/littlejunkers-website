import type { Metadata } from "next";
import DaysPlusPlanner from "@/components/DaysPlusPlanner";
import type { SizeYards } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Plan a Dumpster Rental | Little Junkers",
  description: "Plan a 3 to 30 day dumpster rental. Live pricing, availability and payment are not enabled in this preview.",
  robots: { index: false, follow: false }
};
type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
export default async function PlanPage({searchParams}:{searchParams:Promise<Params>}) {
  const params = await searchParams;
  const rawSize = Number(first(params.size));
  const size: SizeYards | undefined = rawSize === 11 || rawSize === 16 || rawSize === 21 ? rawSize : undefined;
  const rawDays = Number(first(params.days) ?? 3);
  const days = Number.isInteger(rawDays) ? Math.max(3, Math.min(30,rawDays)) : 3;
  const rawZip = first(params.zip) ?? "";
  const zip = /^\d{5}$/.test(rawZip) ? rawZip : undefined;
  return <section className="section"><div className="container">
    <div className="section-head"><p className="eyebrow">Days Plus planning preview</p><h1>Plan your dumpster rental</h1><p>Pick your size, location and rental length. Actual availability and final charges will be confirmed before real booking is enabled.</p></div>
    <DaysPlusPlanner initialSize={size} initialDays={days} initialZip={zip} />
  </div></section>;
}
