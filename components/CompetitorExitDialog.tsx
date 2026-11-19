"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { company } from "@/lib/company";
import { createComparisonText, COMPARISON_EXIT_REASONS, type ExitReason } from "@/lib/comparison-exit";

export type CompetitorExitTarget = {
  providerId: string;
  name: string;
  website: string;
  destination: string;
};

export default function CompetitorExitDialog({
  target, onClose, size, days, location,
}: {
  target: CompetitorExitTarget | null;
  onClose: () => void;
  size: 11 | 16 | 21;
  days: number;
  location: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [firstName, setFirstName] = useState("");
  const [reason, setReason] = useState<ExitReason>("");

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (target && !node.open) node.showModal();
    if (!target && node.open) node.close();
    // Native dialog handles Escape, keyboard focus containment and focus return.
  }, [target]);

  const textBody = useMemo(() => target
    ? createComparisonText(target.name, firstName, reason, { size, days, location })
    : "", [target, firstName, reason, size, days, location]);

  if (!target) return <dialog ref={dialog} className="comparison-exit" onClose={onClose} />;

  const smsLink = "sms:" + company.textE164 + "?body=" + encodeURIComponent(textBody);
  const emailLink = "mailto:" + company.email +
    "?subject=" + encodeURIComponent("Help comparing dumpster rentals") +
    "&body=" + encodeURIComponent(textBody);

  return (
    <dialog ref={dialog} className="comparison-exit" aria-labelledby="comparison-exit-title"
      aria-describedby="comparison-exit-description" onClose={onClose}
      onCancel={onClose}
      onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
      <div className="comparison-exit__inner">
        <button className="comparison-exit__close" type="button" aria-label="Close and return to comparison"
          onClick={onClose}>×</button>
        <p className="eyebrow">Before you go</p>
        <h2 id="comparison-exit-title">Want a second opinion?</h2>
        <p id="comparison-exit-description">
          You&apos;re heading to {target.name}. Comparing dumpster prices can be tricky
          when rental days, included weight, and delivery charges are different.
          We can help you sort it out.
        </p>
        <div className="comparison-exit__form">
          <label htmlFor="comparison-exit-reason">What matters most to you? <span>(optional)</span></label>
          <select id="comparison-exit-reason" value={reason} onChange={(event) => setReason(event.target.value as ExitReason)}>
            <option value="">Choose one (optional)</option>
            {COMPARISON_EXIT_REASONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <label htmlFor="comparison-exit-first-name">First name <span>(optional)</span></label>
          <input id="comparison-exit-first-name" type="text" maxLength={40}
            autoComplete="given-name" placeholder="What should we call you?"
            value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <a className="btn btn--primary btn--block" href={smsLink}
            onClick={() => { /* User confirms the SMS in their own app. No automatic send. */ }}>
            Ask us by text
          </a>
          <p className="fine">
            This opens your text app with a draft. Nothing is sent until you send it.
            We&apos;ll only reply about your request. <a href={emailLink}>Prefer email?</a>
          </p>
        </div>
        <div className="comparison-exit__continue">
          <a className="btn btn--secondary btn--block" href={target.destination}
            target="_blank" rel="noopener noreferrer" onClick={onClose}>
            Continue to {target.name} <span aria-hidden="true">↗</span>
          </a>
          <p className="fine">No form or contact details required to visit their website.</p>
        </div>
      </div>
    </dialog>
  );
}
