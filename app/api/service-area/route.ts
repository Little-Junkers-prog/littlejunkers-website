import { NextResponse } from "next/server";
import { getPricing, lookupArea } from "@/lib/pricing";

// Read-only serviceability lookup against canonical ZIP rows. It creates no
// lead or record, and an unknown ZIP is answered with "call or text", never
// "not served".
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (!q || q.length > 60) {
    return NextResponse.json({ error: "Enter a city or 5-digit ZIP." }, { status: 400 });
  }

  const pricing = await getPricing();
  if (!pricing) {
    return NextResponse.json({ error: "Lookup unavailable." }, { status: 503 });
  }

  return NextResponse.json(lookupArea(pricing, q), {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
