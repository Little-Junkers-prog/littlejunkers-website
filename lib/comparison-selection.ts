// Pure comparison-offer selection, separately testable without Supabase access.
// Same product + variant + source URL + observation timestamp is one evidence snapshot.
// Never combine a price from one scrape with the duration from another scrape.
export type OfferFact = {
  attribute_name: string;
  value_numeric: number | string | null;
  variant_id: string | null;
  source_url: string;
  observed_at: string;
};

export type OfferSnapshot<T extends OfferFact> = {
  price: T;
  duration: T;
  facts: T[];
  days: number;
};

function positiveNumber(value: number | string | null): number | null {
  if (value === null || value === "" || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function distanceToRequestedTerm(term: number, requestedDays: number): number {
  // Exact term first, then the shortest published offer that covers the
  // request. A shorter offer is shown only when nothing covers the request.
  return term >= requestedDays ? term - requestedDays : 1000 + (requestedDays - term);
}

export function selectOfferSnapshot<T extends OfferFact>(
  observations: T[],
  requestedDays: number
): OfferSnapshot<T> | null {
  if (!Number.isInteger(requestedDays) || requestedDays < 1) return null;

  const snapshots: OfferSnapshot<T>[] = [];
  for (const price of observations) {
    if (price.attribute_name !== "price" || positiveNumber(price.value_numeric) === null) continue;
    const facts = observations.filter((observation) =>
      observation.variant_id === price.variant_id &&
      observation.source_url === price.source_url &&
      observation.observed_at === price.observed_at
    );
    const prices = facts.filter((fact) => fact.attribute_name === "price");
    const durations = facts.filter((fact) =>
      fact.attribute_name === "duration_days" &&
      positiveNumber(fact.value_numeric) !== null &&
      Number.isInteger(Number(fact.value_numeric))
    );
    // Multiple durations or prices for the same product/variant/source/time
    // are ambiguous. Require separate variants or separately timestamped
    // evidence rather than pairing arbitrary amounts with arbitrary terms.
    if (prices.length !== 1 || durations.length !== 1) continue;
    const duration = durations[0];
    snapshots.push({ price, duration, facts, days: Number(duration.value_numeric) });
  }
  snapshots.sort((a, b) =>
    distanceToRequestedTerm(a.days, requestedDays) - distanceToRequestedTerm(b.days, requestedDays) ||
    b.price.observed_at.localeCompare(a.price.observed_at) ||
    a.price.source_url.localeCompare(b.price.source_url)
  );
  return snapshots[0] ?? null;
}

export type PublishedObservation = {
  observed_at: string;
  valid_until: string | null;
  verification_status: string;
  publication_status: string;
  conflict_type: string;
  source_url: string;
};

export function observationIsCurrent(observation: PublishedObservation, now: Date): boolean {
  if (observation.verification_status !== "confirmed_published" ||
      observation.publication_status !== "publishable" ||
      observation.conflict_type !== "no_conflict" ||
      !observation.valid_until) return false;
  try {
    const url = new URL(observation.source_url);
    if (url.protocol !== "https:" || !url.hostname.includes(".") ||
        ["localhost", "127.0.0.1"].includes(url.hostname)) return false;
  } catch { return false; }
  const observed = Date.parse(observation.observed_at);
  const expires = Date.parse(observation.valid_until);
  return Number.isFinite(observed) && Number.isFinite(expires) &&
    observed <= now.getTime() && expires > now.getTime();
}
