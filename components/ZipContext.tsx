"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
        onClick={() => { saveArea(null); saveLocationQuery(null); }}
        style={{ font: "inherit", background: "none", border: 0, padding: 0, textDecoration: "underline", cursor: "pointer", color: "inherit" }}
      >
        Change ZIP
      </button>
    </>
  );
}

/* Retain the entered city/ZIP across pages without inventing a postal ZIP. */
const LOCATION_KEY = "lj_location_query";
let lastLocationRaw: string | null = null;
let lastLocationSnapshot: string | null = null;

function getLocationSnapshot(): string | null {
  let raw: string | null = null;
  try { raw = window.sessionStorage.getItem(LOCATION_KEY); } catch { /* optional */ }
  if (raw !== lastLocationRaw) {
    lastLocationRaw = raw;
    lastLocationSnapshot = raw && raw.trim().length > 0 && raw.length <= 60 ? raw.trim() : null;
  }
  return lastLocationSnapshot;
}
export function saveLocationQuery(query: string | null) {
  try {
    if (query && query.trim().length <= 60) window.sessionStorage.setItem(LOCATION_KEY, query.trim());
    else window.sessionStorage.removeItem(LOCATION_KEY);
  } catch { /* optional */ }
  window.dispatchEvent(new Event(EVENT));
}
export function useSavedLocationQuery(): string | null {
  const query = useSyncExternalStore(subscribe, getLocationSnapshot, () => null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? query : null;
}
