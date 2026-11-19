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
    const duration = facts.find((fact) =>
      fact.attribute_name === "duration_days" &&
      positiveNumber(fact.value_numeric) !== null &&
      Number.isInteger(Number(fact.value_numeric))
    );
    if (!duration) continue;
    snapshots.push({ price, duration, facts, days: Number(duration.value_numeric) });
  }
  snapshots.sort((a, b) =>
    distanceToRequestedTerm(a.days, requestedDays) - distanceToRequestedTerm(b.days, requestedDays) ||
    b.price.observed_at.localeCompare(a.price.observed_at) ||
    a.price.source_url.localeCompare(b.price.source_url)
  );
  return snapshots[0] ?? null;
}
