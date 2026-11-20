import { NextRequest, NextResponse } from "next/server";
import { parseClickPayload, isSameOriginPost } from "@/lib/comparison-intake";
import { comparisonRest, comparisonWriteConfigured } from "@/lib/comparison-supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const headers = { "Cache-Control":"no-store" };

// This records a countable outbound click, NOT an identified visitor.
// The canonical Supabase RPC creates an anonymous, one-event session, with
// no cookies, IP, user agent, phone, contact or visitor ID stored by this app.
export async function POST(request: NextRequest) {
  if (!isSameOriginPost(request.headers.get("origin"),request.url,request.headers.get("sec-fetch-site")))
    return NextResponse.json({error:"Origin rejected"},{status:403,headers});
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json"))
    return NextResponse.json({error:"Expected JSON"},{status:415,headers});
  if (Number(request.headers.get("content-length")??0)>1024)
    return NextResponse.json({error:"Payload too large"},{status:413,headers});
  const raw: unknown = await request.json().catch(()=>null);
  const click = parseClickPayload(raw);
  const action = raw && typeof raw === "object" && !Array.isArray(raw) &&
    "action" in raw ? (raw as {action:unknown}).action : null;
  if (!click || (action !== "detail" && action !== "outbound")) return NextResponse.json({error:"Invalid selection"},{status:400,headers});
  if (!comparisonWriteConfigured())
    return NextResponse.json({error:"Measurement connection pending"},{status:503,headers});
  try {
    await comparisonRest<number>("rpc/record_comparison_provider_action","POST",{
      p_provider_id:click.providerId, p_size_yards:click.size,p_duration_days:click.days,p_action:action
    });
    return NextResponse.json({recorded:true},{headers});
  } catch (error) {
    console.error("[comparison-click]",error instanceof Error?error.message:"unknown error");
    return NextResponse.json({error:"Measurement unavailable"},{status:503,headers});
  }
}
