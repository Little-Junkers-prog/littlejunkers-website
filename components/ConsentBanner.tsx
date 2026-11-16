"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Privacy choices. Analytics and advertising storage stay denied until the
// visitor says otherwise (Consent Mode defaults are set in the layout head).
// The choice is kept in this browser and can be reopened any time from the
// "Privacy choices" link in the footer, which is the opt-out path.

type Choice = { analytics: boolean; marketing: boolean; at: string };

const KEY = "lj_consent";
export const OPEN_EVENT = "lj-open-consent";

function apply(choice: Choice) {
  // gtag() is defined with the Consent Mode defaults in the layout head.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.marketing ? "granted" : "denied",
    ad_user_data: choice.marketing ? "granted" : "denied",
    ad_personalization: choice.marketing ? "granted" : "denied",
  });
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let saved: Choice | null = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
    } catch {
      saved = null;
    }
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
      apply(saved);
    } else {
      setOpen(true);
    }
    const reopen = () => {
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function save(next: { analytics: boolean; marketing: boolean }) {
    const choice: Choice = { ...next, at: new Date().toISOString() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(choice));
    } catch {
      // Without storage the choice applies to this page view only.
    }
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    apply(choice);
    setOpen(false);
    setManage(false);
  }

  if (!open) return null;

  return (
    <section className="consent" role="region" aria-label="Privacy choices">
      <div className="consent__inner">
        <h2 className="consent__title">We don&apos;t trash your privacy.</h2>
        <p>
          We use cookies that keep the site working. With your OK, we also use analytics and advertising cookies to see what&apos;s
          working. <Link href="/cookie-policy">Cookie Policy</Link> · <Link href="/privacy">Privacy Policy</Link>
        </p>

        {manage ? (
          <fieldset className="consent__options">
            <legend className="visually-hidden">Cookie categories</legend>
            <label>
              <input type="checkbox" checked disabled /> Essential (always on)
            </label>
            <label>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> Analytics
            </label>
            <label>
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /> Advertising
            </label>
          </fieldset>
        ) : null}

        <div className="consent__actions">
          {manage ? (
            <button className="btn btn--primary" type="button" onClick={() => save({ analytics, marketing })}>
              Save My Choices
            </button>
          ) : (
            <button className="btn btn--primary" type="button" onClick={() => save({ analytics: true, marketing: true })}>
              Accept All
            </button>
          )}
          <button className="btn btn--secondary" type="button" onClick={() => save({ analytics: false, marketing: false })}>
            Reject Non-Essential
          </button>
          {!manage ? (
            <button className="btn btn--secondary" type="button" onClick={() => setManage(true)}>
              Manage Preferences
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function PrivacyChoicesLink() {
  return (
    <button className="linklike" type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Privacy choices
    </button>
  );
}
