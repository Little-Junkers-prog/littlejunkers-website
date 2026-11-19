// Pure, intentionally inert measurement contract.
// The comparison experience does NOT send or store analytics until an approved
// server-side ingestion boundary, consent rules and anti-abuse controls exist.
// This contract only validates the proposed client-to-server event shape.

export const COMPARISON_EVENT_NAMES = [
  "comparison_started",
  "comparison_location_resolved",
  "comparison_size_selected",
  "comparison_preview_viewed",
  "comparison_provider_detail_viewed",
  "comparison_provider_outbound_clicked",
  "comparison_lj_booking_clicked",
] as const;

export type ComparisonEventName = (typeof COMPARISON_EVENT_NAMES)[number];
export type OutcomeBucket =
  | "verified_lj_paid"
  | "competitor_self_reported"
  | "returned_considering"
  | "competitor_outbound_unknown"
  | "unknown";

export type OutcomeEvidence = {
  // These two facts must come from a verified server-side canonical join.
  paidRentalConfirmed: boolean;
  attributionProven: boolean;
  // An explicit voluntary report, never inferred from link clicks.
  competitorChoiceSelfReported: boolean;
  // Must be supported by consented cross-session linkage, not IP matching.
  consentedReturnAfterOutbound: boolean;
  competitorOutboundClicked: boolean;
};

export function classifyComparisonOutcome(evidence: OutcomeEvidence): OutcomeBucket {
  if (evidence.paidRentalConfirmed && evidence.attributionProven) return "verified_lj_paid";
  if (evidence.competitorChoiceSelfReported) return "competitor_self_reported";
  if (evidence.consentedReturnAfterOutbound) return "returned_considering";
  if (evidence.competitorOutboundClicked) return "competitor_outbound_unknown";
  return "unknown";
}

export type RawMeasurement = {
  event_name: string;
  session_id: string;
  provider_id?: string | null;
  market_city?: string | null;
  market_zip?: string | null;
  size_yards: number;
  duration_days: number;
  result_count?: number | null;
};
export type SafeMeasurement = {
  event_name: ComparisonEventName;
  session_id: string;
  provider_id: string | null;
  event_context: {
    market_city?: string;
    market_zip?: string;
    size_yards: 11 | 16 | 21;
    duration_days: number;
    result_count?: number;
  };
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ZIP = /^\d{5}$/;
const CITY = /^[a-z][a-z .'-]{1,49}$/i;
const ALLOWED = new Set<string>(COMPARISON_EVENT_NAMES);
const PROVIDER_EVENTS = new Set<string>([
  "comparison_provider_detail_viewed",
  "comparison_provider_outbound_clicked"
]);

export function validateComparisonMeasurement(
  input: RawMeasurement,
  analyticsConsent: boolean
): SafeMeasurement | null {
  if (!analyticsConsent || !ALLOWED.has(input.event_name) ||
      !UUID.test(input.session_id) || ![11, 16, 21].includes(input.size_yards) ||
      !Number.isInteger(input.duration_days) || input.duration_days < 3 || input.duration_days > 30) return null;

  const provider = input.provider_id ?? null;
  if ((provider !== null && !UUID.test(provider)) ||
      (PROVIDER_EVENTS.has(input.event_name) && !provider) ||
      (!PROVIDER_EVENTS.has(input.event_name) && provider)) return null;

  const city = input.market_city?.trim() ?? null;
  const zip = input.market_zip?.trim() ?? null;
  if (city && !CITY.test(city)) return null;
  if (zip && !ZIP.test(zip)) return null;
  if (input.result_count != null &&
      (!Number.isInteger(input.result_count) || input.result_count < 0 || input.result_count > 50)) return null;

  // Whitelist known primitives only; do not forward arbitrary input,
  // names, addresses, customer identifiers, free text or attribution claims.
  return {
    event_name: input.event_name as ComparisonEventName,
    session_id: input.session_id.toLowerCase(),
    provider_id: provider?.toLowerCase() ?? null,
    event_context: {
      ...(city ? { market_city: city } : {}),
      ...(zip ? { market_zip: zip } : {}),
      size_yards: input.size_yards as 11 | 16 | 21,
      duration_days: input.duration_days,
      ...(input.result_count != null ? { result_count: input.result_count } : {})
    }
  };
}
