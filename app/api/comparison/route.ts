import { NextRequest, NextResponse } from "next/server";
import { getPricing, lookupArea } from "@/lib/pricing";
import { getComparisonCandidates } from "@/lib/comparison";

export const dynamic = "force-dynamic";

const responseHeaders = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const location = (request.nextUrl.searchParams.get("location") ?? "").trim();
  const size = Number(request.nextUrl.searchParams.get("size"));
  const days = Number(request.nextUrl.searchParams.get("days") ?? "3");
  if (!location || location.length > 60 || ![11, 16, 21].includes(size) ||
      !Number.isInteger(days) || days < 3 || days > 30) {
    return NextResponse.json({ error: "Choose a city or ZIP, dumpster size and 3–30 days." },
      { status: 400, headers: responseHeaders });
  }
  const pricing = await getPricing();
  if (!pricing) {
    return NextResponse.json({ error: "Prices and delivery areas aren't available right now." },
      { status: 503, headers: responseHeaders });
  }
  const area = lookupArea(pricing, location);
  const comparison = await getComparisonCandidates(size as 11 | 16 | 21, area);
  const tier = pricing.tiers.find((row) => row.days === 3);
  const base = tier?.prices[size as 11 | 16 | 21] ?? null;
  // A zone fee can be estimated only when the input is unambiguous.
  const deliveryFee = area.status === "served" ? area.zone.deliveryFee : null;
  return NextResponse.json({
    location: area,
    size, days,
    littleJunkers: {
      base, baseDays: 3, includedTons: pricing.sizes[size as 11 | 16 | 21].includedTons,
      overagePerTon: pricing.overagePerTon, deliveryFee,
      knownSubtotal: base !== null ? base + (deliveryFee ?? 0) : null,
      additionalDaysPriced: days === 3,
      confirmedQuote: false,
    },
    comparison,
    disclosure: "Competitor prices are sourced offers for the stated rental terms, not guaranteed checkout quotes."
  }, { headers: responseHeaders });
}
