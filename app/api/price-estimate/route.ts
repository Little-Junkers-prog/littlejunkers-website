import { NextResponse } from "next/server";
import { getPricing } from "@/lib/pricing";
import { basePriceSnapshot } from "@/lib/days-plus";

// Public READ-ONLY price snapshot for the isolated design preview.
// Final pricing, fees and availability remain the server-owned booking contract.
// Intentionally expose only the 3-day base prices, not a misleading day 4-30 rate.
export async function GET() {
  const prices = basePriceSnapshot(await getPricing());
  if (!prices) {
    return NextResponse.json(
      { success: false, error: "Prices temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(
    { success: true, baseDays: 3, prices },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } }
  );
}
