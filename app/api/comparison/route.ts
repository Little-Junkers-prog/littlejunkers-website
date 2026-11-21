import { NextRequest, NextResponse } from "next/server";
import { getPricing, lookupArea } from "@/lib/pricing";
import { getComparisonCandidates } from "@/lib/comparison";
import { basePriceSnapshot, estimateDaysPlus } from "@/lib/days-plus";

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
  const comparison = await getComparisonCandidates(size as 11 | 16 | 21, area, days);
  // Prepaid Days Plus uses only a separately approved canonical rate.
  // Never infer it from 5-/7-day packages or legacy dailyOverage.
  const deliveryFee = area.status === "served" ? area.zone.deliveryFee : null;
  const daysQuote = estimateDaysPlus({
    basePrices: basePriceSnapshot(pricing), rates: pricing.daysPlusRates,
    size: size as 11 | 16 | 21, days, deliveryFee,
  });
  return NextResponse.json({
    request: { location, size, days },
    location: area,
    size, days,
    littleJunkers: {
      base: daysQuote.base, baseDays: 3, includedTons: pricing.sizes[size as 11 | 16 | 21].includedTons,
      overagePerTon: pricing.overagePerTon, deliveryFee,
      knownSubtotal: daysQuote.knownSubtotal,
      additionalDaysPriced: daysQuote.extraDaysCharge !== null,
      extraDaysCharge: daysQuote.extraDaysCharge,
      perExtraDay: daysQuote.perExtraDay,
      estimatedRentalSubtotal: daysQuote.estimatedRentalSubtotal,
      confirmedQuote: false,
    },
    comparison,
    disclosure: "Competitor prices are sourced offers for the stated rental terms, not guaranteed checkout quotes."
  }, { headers: responseHeaders });
}
