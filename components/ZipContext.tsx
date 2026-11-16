"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { bookingUrl } from "@/lib/company";
import type { SizeYards } from "@/lib/pricing";

// Remembers the visitor's last confirmed ZIP in this browser (sessionStorage),
// so every price card and Book button on the site carries it into booking and
// the customer sees their delivery fee before checkout, not at it.
// A 5-digit ZIP and its fee only. Nothing is sent anywhere from here.

export type SavedArea = { zip: string; label: string; deliveryFee: number };

const KEY = "lj_area";
const EVENT = "lj-area-change";

function read(): SavedArea | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && /^\d{5}$/.test(value.zip) && typeof value.deliveryFee === "number" ? value : null;
  } catch {
    return null;
  }
}

export function saveArea(area: SavedArea | null) {
  try {
    if (area) window.sessionStorage.setItem(KEY, JSON.stringify(area));
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Storage can be unavailable (private mode). The page still works without it.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

let snapshot: SavedArea | null = null;
let snapshotRaw: string | null = null;
function getSnapshot(): SavedArea | null {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = read();
  }
  return snapshot;
}

export function useSavedArea(): SavedArea | null {
  const area = useSyncExternalStore(subscribe, getSnapshot, () => null);
  // Avoid a hydration mismatch: report the saved area only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? area : null;
}

// Book button that adds the saved ZIP (and a size, when given) to the handoff.
export function BookLink({ size, className, children }: { size?: SizeYards; className?: string; children: React.ReactNode }) {
  const area = useSavedArea();
  return (
    <a className={className} href={bookingUrl({ size, zip: area?.zip })}>
      {children}
    </a>
  );
}

// One line under the price cards: the fee for the saved ZIP, or the generic note.
export function DeliveryLine({ fallback }: { fallback: string }) {
  const area = useSavedArea();
  if (!area) return <>{fallback}</>;
  return (
    <>
      <strong>
        Delivery to {area.label} ({area.zip}): {area.deliveryFee === 0 ? "free" : `+$${area.deliveryFee}`}.
      </strong>{" "}
      <button
        type="button"
        onClick={() => saveArea(null)}
        style={{ font: "inherit", background: "none", border: 0, padding: 0, textDecoration: "underline", cursor: "pointer", color: "inherit" }}
      >
        Change ZIP
      </button>
    </>
  );
}
