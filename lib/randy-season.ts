// Which Randy to show today (holiday guide: docs/RANDY-CHARACTER-SPEC.md §14).
// Dates are in Eastern Time. The first matching rule wins, so short, specific
// holidays are listed before longer seasons. Art lives in
// public/images/brand/randy/<variant>.svg and is built by scripts/randy.

export type RandyVariant =
  | "default"
  | "new-year"
  | "valentines"
  | "st-patricks"
  | "memorial-day"
  | "independence-day"
  | "halloween"
  | "veterans-day"
  | "thanksgiving"
  | "christmas";

type Day = { y: number; m: number; d: number }; // m is 1-12

// nth weekday of a month (weekday 0 = Sunday); n = -1 means the last one.
function nthWeekday(y: number, m: number, weekday: number, n: number): number {
  if (n > 0) {
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
  }
  const lastDate = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lastDay = new Date(Date.UTC(y, m - 1, lastDate)).getUTCDay();
  return lastDate - ((lastDay - weekday + 7) % 7);
}

const inRange = (t: Day, m: number, from: number, to: number) => t.m === m && t.d >= from && t.d <= to;

export function randyVariantFor(t: Day): RandyVariant {
  const memorialMonday = nthWeekday(t.y, 5, 1, -1);
  const thanksgiving = nthWeekday(t.y, 11, 4, 4);

  if ((t.m === 12 && t.d === 31) || inRange(t, 1, 1, 2)) return "new-year";
  if (inRange(t, 2, 12, 14)) return "valentines";
  if (inRange(t, 3, 16, 17)) return "st-patricks";
  if (inRange(t, 5, memorialMonday - 2, memorialMonday)) return "memorial-day"; // Sat–Mon
  if (inRange(t, 7, 1, 5)) return "independence-day";
  if (inRange(t, 10, 25, 31)) return "halloween";
  if (inRange(t, 11, 11, 11)) return "veterans-day";
  if (inRange(t, 11, thanksgiving - 3, thanksgiving + 1)) return "thanksgiving"; // Mon–Fri
  if (inRange(t, 12, 1, 26)) return "christmas";
  return "default";
}

export const VARIANTS: RandyVariant[] = [
  "default", "new-year", "valentines", "st-patricks", "memorial-day",
  "independence-day", "halloween", "veterans-day", "thanksgiving", "christmas",
];

export function todayInEastern(now = new Date()): Day {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export const randyAvatarSrc = (variant: RandyVariant) => `/images/brand/randy/${variant}.svg`;
