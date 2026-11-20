import { NextRequest, NextResponse } from "next/server";
import { isSameOriginPost, parseInquiryPayload, VALID_REASONS } from "@/lib/comparison-intake";
import { comparisonRest, comparisonWriteConfigured } from "@/lib/comparison-supabase";

export const dynamic="force-dynamic";
export const runtime="nodejs";
const headers={"Cache-Control":"no-store"};
type Provider = {id:string;name:string;is_active:boolean;visibility_status:string};
type InquiryResult = {inquiry_id:string;contact_id:string|null;action_item_id:string|null};
const reasonText:Record<(typeof VALID_REASONS)[number],string> = {
  price:"Price",weight:"Included disposal weight or overage",
  duration:"Rental length",size:"Container size",
  availability:"Availability or service area",unsure:"General rental questions",
  "":"General rental questions"
};

export async function POST(request:NextRequest) {
  if (!isSameOriginPost(request.headers.get("origin"),request.url,request.headers.get("sec-fetch-site")))
    return NextResponse.json({error:"Origin rejected"},{status:403,headers});
  if (!(request.headers.get("content-type")??"").startsWith("application/json"))
    return NextResponse.json({error:"Expected JSON"},{status:415,headers});
  if (Number(request.headers.get("content-length")??0)>8192)
    return NextResponse.json({error:"Payload too large"},{status:413,headers});
  const raw:unknown=await request.json().catch(()=>null);
  const data=parseInquiryPayload(raw,Date.now());
  if (!data) return NextResponse.json({error:"Enter your name, phone and ZIP, and complete verification."},{status:400,headers});
  const secret=process.env.TURNSTILE_SECRET_KEY??process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!comparisonWriteConfigured() || !secret)
    return NextResponse.json({error:"Callback requests are not connected in this preview."},{status:503,headers});
  try {
    const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({secret,response:data.turnstileToken}),
      cache:"no-store",signal:AbortSignal.timeout(7000)
    });
    if(!verification.ok) throw new Error("Turnstile verification returned "+verification.status);
    const proof:unknown=await verification.json();
    if (!proof || typeof proof!=="object") throw new Error("Invalid verification response");
    const p=proof as {success?:boolean;hostname?:string};
    if (p.success!==true || p.hostname!==request.nextUrl.hostname)
      return NextResponse.json({error:"Verification failed. Please try again."},{status:403,headers});

    const params=new URLSearchParams({
      select:"id,name,is_active,visibility_status",id:"eq."+data.providerId,
      is_active:"eq.true",visibility_status:"eq.public",limit:"1"
    });
    const providers=await comparisonRest<Provider[]>("comparison_providers?"+params,"GET");
    if (providers.length!==1) return NextResponse.json({error:"The selected company could not be verified."},{status:400,headers});

    const provider=providers[0];
    const message="Callback requested via website comparison tool. Customer reviewed "+
      provider.name+" for a "+data.size+"-yard dumpster, "+data.days+
      " rental days, ZIP "+data.zip+". Main question: "+reasonText[data.reason]+
      ". Contact requested about this rental inquiry only.";
    const result=await comparisonRest<InquiryResult>("rpc/create_comparison_inquiry","POST",{
      p_payload:{
        inquiry_type:"contact",name:data.name,phone:data.phone,
        email:data.email,zip_code:data.zip,
        source_page:"Website V2 Comparison Exit",
        service_needed:"Dumpster rental comparison",
        message
      },
      p_provider_id: data.providerId,
      p_size_yards: data.size,
      p_duration_days: data.days,
      p_interest_reason: data.reason
    });
    if(!result?.inquiry_id) throw new Error("Canonical intake did not return an inquiry ID");
    return NextResponse.json({saved:true,inquiryId:result.inquiry_id},{status:201,headers});
  } catch(error) {
    console.error("[comparison-inquiry]",error instanceof Error?error.message:"unknown error");
    return NextResponse.json({error:"We couldn't save your request. Please use the text option."},
      {status:503,headers});
  }
}
