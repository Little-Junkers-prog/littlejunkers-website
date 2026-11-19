"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { company } from "@/lib/company";
import { createComparisonText, COMPARISON_EXIT_REASONS, type ExitReason } from "@/lib/comparison-exit";
import ComparisonTurnstile from "./ComparisonTurnstile";

export type CompetitorExitTarget = {
  providerId: string;
  name: string;
  website: string;
  destination: string;
};

export default function CompetitorExitDialog({
  target, onClose, onOutboundClick, size, days, location,
}: {
  target: CompetitorExitTarget | null;
  onClose: () => void;
  onOutboundClick: (providerId:string) => void;
  size: 11 | 16 | 21;
  days: number;
  location: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [firstName, setFirstName] = useState("");
  const [reason, setReason] = useState<ExitReason>("");
  const [callbackName,setCallbackName]=useState("");
  const [callbackPhone,setCallbackPhone]=useState("");
  const [callbackZip,setCallbackZip]=useState("");
  const [callbackEmail,setCallbackEmail]=useState("");
  const [token,setToken]=useState("");
  const [formStartedAt,setFormStartedAt]=useState(0);
  const [honey,setHoney]=useState("");
  const [isSubmitting,setSubmitting]=useState(false);
  const [saved,setSaved]=useState(false);
  const [error,setError]=useState("");
  const [callbackOpen,setCallbackOpen]=useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (target && !node.open) node.showModal();
    if (!target && node.open) node.close();
  }, [target]);
  useEffect(()=>{
    if (!target) return;
    setCallbackName("");setCallbackPhone("");setCallbackEmail("");
    setCallbackZip(/^\d{5}$/.test(location)?location:"");
    setToken("");setHoney("");setSaved(false);setError("");
    setCallbackOpen(false);setFormStartedAt(Date.now());
  },[target,location]);

  const textBody = useMemo(() => target
    ? createComparisonText(target.name, firstName, reason, { size, days, location })
    : "", [target, firstName, reason, size, days, location]);

  if (!target) return <dialog ref={dialog} className="comparison-exit" onClose={onClose} />;

  const smsLink = "sms:" + company.textE164 + "?body=" + encodeURIComponent(textBody);
  const emailLink = "mailto:" + company.email +
    "?subject=" + encodeURIComponent("Help comparing dumpster rentals") +
    "&body=" + encodeURIComponent(textBody);

  async function submitCallback(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!target || isSubmitting || saved) return;
    setSubmitting(true);setError("");
    try {
      const response=await fetch("/api/comparison/inquiry",{
        method:"POST",headers:{"Content-Type":"application/json"},
        credentials:"same-origin",cache:"no-store",
        body:JSON.stringify({
          providerId:target.providerId,size,days,
          name:callbackName,phone:callbackPhone,zip:callbackZip,
          email:callbackEmail,reason,turnstileToken:token,
          formStartedAt,callbackRequested:true,_honey:honey
        })
      });
      const data=await response.json() as {saved?:boolean;error?:string};
      if(!response.ok || data.saved!==true) throw new Error(data.error || "Callback unavailable");
      setSaved(true);
    }catch(e){
      setError(e instanceof Error?e.message:"We couldn't save your callback request.");
      setToken("");
    }finally{setSubmitting(false)}
  }

  const turnstileAvailable=!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <dialog ref={dialog} className="comparison-exit" aria-labelledby="comparison-exit-title"
      aria-describedby="comparison-exit-description" onClose={onClose}
      onCancel={onClose} onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
      <div className="comparison-exit__inner">
        <button className="comparison-exit__close" type="button" aria-label="Close and return to comparison"
          onClick={onClose}>×</button>
        <p className="eyebrow">Before you go</p>
        <h2 id="comparison-exit-title">Want a second opinion?</h2>
        <p id="comparison-exit-description">
          You&apos;re heading to {target.name}. Rental days, included weight and delivery
          charges can make published prices difficult to compare. We can help sort it out.
        </p>
        <div className="comparison-exit__form">
          <label htmlFor="comparison-exit-reason">What matters most to you? <span>(optional)</span></label>
          <select id="comparison-exit-reason" value={reason} onChange={(event) => setReason(event.target.value as ExitReason)}>
            <option value="">Choose one (optional)</option>
            {COMPARISON_EXIT_REASONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <label htmlFor="comparison-exit-first-name">First name <span>(optional for text)</span></label>
          <input id="comparison-exit-first-name" type="text" maxLength={40}
            autoComplete="given-name" placeholder="What should we call you?"
            value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <a className="btn btn--primary btn--block" href={smsLink}>Ask us by text</a>
          <p className="fine">
            Opens a text draft. Nothing is sent until you send it.
            We&apos;ll only reply about your request. <a href={emailLink}>Prefer email?</a>
          </p>
        </div>
        <details className="comparison-exit__callback" open={callbackOpen}
          onToggle={(event)=>setCallbackOpen(event.currentTarget.open)}>
          <summary>Prefer a callback? Leave your name and number</summary>
          {saved ? <p role="status">Thank you. Your request was saved for our team to follow up.</p> :
            <form onSubmit={submitCallback} className="comparison-exit__callback-form">
              <label htmlFor="comparison-callback-name">Name</label>
              <input id="comparison-callback-name" required maxLength={80} autoComplete="name"
                placeholder="Your name" value={callbackName}
                onChange={e=>setCallbackName(e.target.value)}/>
              <label htmlFor="comparison-callback-phone">Phone</label>
              <input id="comparison-callback-phone" required type="tel" autoComplete="tel"
                placeholder="(470) 555-0123" maxLength={40} value={callbackPhone}
                onChange={e=>setCallbackPhone(e.target.value)}/>
              <label htmlFor="comparison-callback-zip">Service ZIP</label>
              <input id="comparison-callback-zip" required type="text" inputMode="numeric"
                pattern="[0-9]{5}" maxLength={5} placeholder="ZIP code"
                value={callbackZip} onChange={e=>setCallbackZip(e.target.value)}/>
              <label htmlFor="comparison-callback-email">Email <span>(optional)</span></label>
              <input id="comparison-callback-email" type="email" autoComplete="email"
                placeholder="you@example.com" maxLength={320} value={callbackEmail}
                onChange={e=>setCallbackEmail(e.target.value)}/>
              <div className="comparison-exit__honeypot" aria-hidden="true">
                <label htmlFor="comparison-callback-company">Leave this field blank</label>
                <input id="comparison-callback-company" name="company_address" tabIndex={-1}
                  autoComplete="off" value={honey} onChange={e=>setHoney(e.target.value)}/>
              </div>
              {callbackOpen && <ComparisonTurnstile onToken={setToken}/>}
              <p className="fine">By submitting, you ask Little Junkers to contact you about
                this rental comparison. This is not a marketing subscription.</p>
              {error && <p role="alert" className="comparison-exit__error">{error}</p>}
              <button type="submit" className="btn btn--primary btn--block"
                disabled={isSubmitting || !turnstileAvailable || !token}>
                {isSubmitting?"Saving request…":"Request my callback"}
              </button>
            </form>}
        </details>
        <div className="comparison-exit__continue">
          <a className="btn btn--secondary btn--block" href={target.destination}
            target="_blank" rel="noopener noreferrer"
            onClick={() => { onOutboundClick(target.providerId); onClose(); }}>
            Continue to {target.name} <span aria-hidden="true">↗</span>
          </a>
          <p className="fine">No form or contact details are required to visit their website.
            Anonymous outbound clicks are counted to understand comparison interest.</p>
        </div>
      </div>
    </dialog>
  );
}
