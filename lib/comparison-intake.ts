// Validation shared by the review-only server endpoints and regression tests.
// No user identifiers are created for anonymous competitor click counting.
export const VALID_REASONS = ["price","weight","duration","size","availability","unsure",""] as const;
export type InterestReason = typeof VALID_REASONS[number];

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type ClickPayload = { providerId: string; size: 11 | 16 | 21; days: number };
export type InquiryPayload = ClickPayload & {
  name: string; phone: string; zip: string; email: string | null;
  reason: InterestReason; turnstileToken: string; formStartedAt: number;
};
function isObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}
export function parseClickPayload(raw: unknown): ClickPayload | null {
  if (!isObject(raw) || typeof raw.providerId !== "string" ||
      !uuid.test(raw.providerId) ||
      typeof raw.size !== "number" || ![11, 16, 21].includes(raw.size) ||
      typeof raw.days !== "number" || !Number.isInteger(raw.days) || Number(raw.days) < 3 || Number(raw.days) > 30)
    return null;
  return { providerId: raw.providerId, size: raw.size as 11 | 16 | 21, days: raw.days as number };
}
export function normalizeUsPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 && /^[2-9]\d{2}[2-9]\d{6}$/.test(digits)
    ? "+1" + digits : null;
}
export function parseInquiryPayload(raw: unknown, now: number): InquiryPayload | null {
  const core = parseClickPayload(raw);
  if (!core || !isObject(raw)) return null;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phone = typeof raw.phone === "string" ? normalizeUsPhone(raw.phone) : null;
  const zip = typeof raw.zip === "string" ? raw.zip.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const reason = typeof raw.reason === "string" ? raw.reason : "";
  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : "";
  const started = Number(raw.formStartedAt);
  if (!name || name.length > 80 || /[<>\r\n]/.test(name) ||
      !phone || !/^\d{5}$/.test(zip) || email.length > 320 ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
      !VALID_REASONS.includes(reason as InterestReason) ||
      token.length < 10 || token.length > 4096 ||
      !Number.isFinite(started) || now - started < 3000 ||
      now - started > 12*60*60*1000 ||
      (typeof raw._honey === "string" && raw._honey.trim().length > 0) ||
      raw.callbackRequested !== true) return null;
  return { ...core, name, phone, zip, email: email || null,
    reason: reason as InterestReason, turnstileToken: token, formStartedAt: started };
}
export function isSameOriginPost(requestOrigin: string | null, requestUrl: string, site: string | null): boolean {
  try {
    const expected = new URL(requestUrl).origin;
    return requestOrigin === expected && (!site || site === "same-origin" || site === "none");
  } catch { return false; }
}
