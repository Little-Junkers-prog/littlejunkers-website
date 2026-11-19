"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: {
        sitekey: string; action?: string; callback: (token:string)=>void;
        "expired-callback"?: ()=>void; "error-callback"?: ()=>void;
      }) => string;
      remove: (id:string)=>void;
    };
  }
}

// A real Cloudflare verification token is required before any CRM inquiry is
// submitted. Missing site key deliberately disables the callback form.
export default function ComparisonTurnstile({onToken}: {onToken:(value:string)=>void}) {
  const [scriptReady,setScriptReady]=useState(false);
  const container=useRef<HTMLDivElement>(null);
  const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  useEffect(()=>{
    if (!siteKey || !scriptReady || !container.current || !window.turnstile) return;
    onToken("");
    const widget=window.turnstile.render(container.current,{
      sitekey:siteKey,action:"comparison_callback",
      callback:onToken,
      "expired-callback":()=>onToken(""),
      "error-callback":()=>onToken("")
    });
    return ()=>{ try{window.turnstile?.remove(widget)}catch{} };
  },[siteKey,scriptReady,onToken]);
  if (!siteKey) return <p className="fine" role="status">
    Callback verification is not connected on this preview. Please use the text option.
  </p>;
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive" onReady={()=>setScriptReady(true)}/>
    <div ref={container} aria-label="Verify your callback request"/>
  </>;
}
