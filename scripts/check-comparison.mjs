import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selectOfferSnapshot, observationIsCurrent, rankComparisonCards } from "../lib/comparison-selection.ts";
import { validateComparisonMeasurement, classifyComparisonOutcome } from "../lib/comparison-measurement.ts";
import { createComparisonText } from "../lib/comparison-exit.ts";

function fact(attribute_name, value_numeric, variant_id = "3day", source_url = "https://example.com/offer", observed_at = "2026-11-19T12:00:00Z") {
  return { attribute_name, value_numeric, variant_id, source_url, observed_at };
}
const offers = [
  fact("price", 375), fact("duration_days", 3),
  fact("price", 425, "7day"), fact("duration_days", 7, "7day"),
  fact("included_tons", 2), fact("included_tons", 2, "7day")
];
assert.equal(selectOfferSnapshot(offers, 3)?.days, 3, "3-day selection must choose 3-day price");
assert.equal(selectOfferSnapshot(offers, 7)?.days, 7, "7-day selection must choose 7-day price");
assert.equal(selectOfferSnapshot(offers, 4)?.days, 7, "4-day selection must prefer covering 7-day offer");
assert.equal(selectOfferSnapshot(offers, 14)?.days, 7, "no covering term must choose closest shorter term");
assert.equal(selectOfferSnapshot(offers, 0), null, "invalid day count must not match");
assert.equal(selectOfferSnapshot([fact("price", 300)], 3), null, "missing duration is not a valid offer");
assert.equal(selectOfferSnapshot([fact("price", "0"), fact("duration_days", 3)], 3), null, "zero price cannot publish");
assert.equal(selectOfferSnapshot([fact("price", null), fact("duration_days", 3)], 3), null, "null price cannot publish");
assert.equal(selectOfferSnapshot([
  fact("price", 300, "3day", "https://example.com/offer", "2026-11-19T10:00:00Z"),
  fact("duration_days", 3, "3day", "https://example.com/offer", "2026-11-19T12:00:00Z")
], 3), null, "separate observations must not be combined into a false quote");
assert.equal(selectOfferSnapshot([
  fact("price", 300, "3day", "https://example.com/one"),
  fact("duration_days", 3, "3day", "https://example.com/two")
], 3), null, "different source URLs cannot combine into an offer");
assert.equal(selectOfferSnapshot([
  fact("price", 300, "3day"),
  fact("duration_days", 7, "7day")
], 3), null, "different variants cannot combine into an offer");
assert.equal(selectOfferSnapshot([
  fact("price", 325),
  fact("duration_days", 3),
  fact("duration_days", 7)
], 3), null, "ambiguous same-source rental durations must be rejected");
assert.equal(selectOfferSnapshot([
  fact("price", 325),
  fact("price", 400),
  fact("duration_days", 3)
], 3), null, "ambiguous same-source prices must be rejected");
const observation = {
  observed_at: "2026-11-19T10:00:00Z", valid_until: "2026-12-03T10:00:00Z",
  source_url: "https://www.example.com/price", verification_status: "confirmed_published",
  publication_status: "publishable", conflict_type: "no_conflict"
};
const now = new Date("2026-11-19T12:00:00Z");
assert.equal(observationIsCurrent(observation, now), true, "valid first-party observation should qualify");
assert.equal(observationIsCurrent({ ...observation, valid_until: "2026-10-31T00:00:00Z" }, now), false, "expired observations must not qualify");
assert.equal(observationIsCurrent({ ...observation, publication_status: "internal_only" }, now), false, "internal notes are never publishable");
assert.equal(observationIsCurrent({ ...observation, verification_status: "conflicting" }, now), false, "conflicts must not qualify");
assert.equal(observationIsCurrent({ ...observation, conflict_type: "cross_source_conflict" }, now), false, "a conflicting source must not qualify");
assert.equal(observationIsCurrent({ ...observation, observed_at: "2026-11-20T10:00:00Z" }, now), false, "future verification timestamps must not qualify");
assert.equal(observationIsCurrent({ ...observation, source_url: "http://www.example.com/price" }, now), false, "insecure source URLs must not qualify");
assert.equal(observationIsCurrent({ ...observation, source_url: "https://localhost/price" }, now), false, "local source URLs must not qualify");
// Measurement stays inert. Validate the shape and evidence classification
// without writing to comparison_events or creating visitor identifiers.
const sessionId = "11111111-1111-4111-8111-111111111111";
const providerId = "22222222-2222-4222-8222-222222222222";
const measurement = {
  event_name: "comparison_provider_outbound_clicked",
  session_id: sessionId, provider_id: providerId,
  market_city: "Peachtree City", market_zip: "30269",
  size_yards: 16, duration_days: 7, result_count: 2,
  email: "never-export@example.com", free_text: "not-for-analytics"
};
assert.equal(validateComparisonMeasurement(measurement, false), null, "deny when analytics consent is absent");
const safe = validateComparisonMeasurement(measurement, true);
assert.equal(safe?.event_name, "comparison_provider_outbound_clicked", "outbound event must use existing database name");
assert.equal("market_zip" in (safe?.event_context ?? {}), false, "browser ZIP must not be trusted as canonical location");
assert.equal(JSON.stringify(safe).includes("example.com"), false, "unlisted email must not survive sanitization");
assert.equal(validateComparisonMeasurement({ ...measurement, event_name: "paid_rental_verified" }, true), null, "paid rental cannot be reported by a client event");
assert.equal(validateComparisonMeasurement({ ...measurement, provider_id: null }, true), null, "outbound must name the provider");
assert.equal("market_zip" in (validateComparisonMeasurement({ ...measurement, market_zip: "30269-1234" }, true)?.event_context ?? {}), false, "unverified location must be dropped");
assert.equal("market_city" in (validateComparisonMeasurement({ ...measurement, market_city: "foo@bar.com" }, true)?.event_context ?? {}), false, "arbitrary city text must not be included");
assert.equal(validateComparisonMeasurement({ ...measurement, size_yards: 30 }, true), null, "unrelated container class rejected");
assert.equal(validateComparisonMeasurement({ ...measurement, duration_days: 31 }, true), null, "duration outside online rules rejected");
const emptyEvidence = {
  paidRentalConfirmed: false,
  attributionProven: false,
  competitorChoiceSelfReported: false,
  consentedReturnAfterOutbound: false,
  competitorOutboundClicked: false
};
assert.equal(classifyComparisonOutcome(emptyEvidence), "unknown", "unobserved outcome must stay unknown");
assert.equal(classifyComparisonOutcome({ ...emptyEvidence, competitorOutboundClicked: true }), "competitor_outbound_unknown", "a competitor click does not establish a booking");
assert.equal(classifyComparisonOutcome({ ...emptyEvidence, paidRentalConfirmed: true }), "unknown", "payment without proven comparison attribution is not a comparison win");
assert.equal(classifyComparisonOutcome({ ...emptyEvidence, paidRentalConfirmed: true, attributionProven: true }), "verified_lj_paid", "paid and attributed booking is a verified LJ win");
assert.equal(classifyComparisonOutcome({ ...emptyEvidence, competitorChoiceSelfReported: true }), "competitor_self_reported", "competitor win requires voluntary report");
assert.equal(classifyComparisonOutcome({ ...emptyEvidence, competitorOutboundClicked: true, consentedReturnAfterOutbound: true }), "returned_considering", "return requires consented identity linkage");
const draft = createComparisonText("Kraken Dumpsters", "Marcus", "price", {
  size: 16, days: 7, location: "Newnan"
});
assert.ok(draft.includes("Kraken Dumpsters"), "text draft should refer to selected company");
assert.ok(draft.includes("16-yard dumpster for 7 days around Newnan"), "text draft should carry the shopping context");
assert.ok(draft.includes("compare price"), "text draft should carry the chosen question");
assert.ok(draft.includes("I'm Marcus"), "text draft should include voluntary first name");
const emptyDraft = createComparisonText("EZ Disposal Roll Offs", "", "", {
  size: 11, days: 3, location: ""
});
assert.ok(emptyDraft.includes("differences between offers"), "optional reason should have a neutral default");
assert.equal(emptyDraft.includes("around "), false, "unknown location should not be invented");
assert.equal(emptyDraft.includes("I'm ."), false, "empty name should not be added");
const canonicalSnapshot = JSON.parse(readFileSync(new URL("../lib/comparison-snapshot.json", import.meta.url), "utf8"));
assert.equal(canonicalSnapshot.source, "Supabase canonical comparison tables", "snapshot is database-derived");
assert.ok(canonicalSnapshot.providers.length >= 2, "reference comparison needs at least two vetted providers");
assert.ok(canonicalSnapshot.observations.some(x => x.attribute_name === "price"), "snapshot must contain sourced offers");
assert.equal(canonicalSnapshot.providers.some(x => x.visibility_status !== "public"), false, "internal/suppressed providers never exported");
for (const selectedSize of [11, 16, 21]) {
  const providersForClass = new Set(canonicalSnapshot.products
    .filter(x => x.comparison_class_yards === selectedSize && x.is_active)
    .map(x => x.provider_id));
  assert.ok(providersForClass.size >= 2, selectedSize + "-yard needs at least two vetted reference providers");
}
const mock = [
  {providerId:"one",name:"Reference A",coverage:"unverified",priceStatus:"verified",priceDays:3,actualYards:15,price:275},
  {providerId:"two",name:"Local B",coverage:"verified",priceStatus:"verified",priceDays:3,actualYards:15,price:525},
  {providerId:"three",name:"Reference C",coverage:"unverified",priceStatus:"verified",priceDays:3,actualYards:15,price:100},
  {providerId:"one",name:"Reference A (alternate)",coverage:"unverified",priceStatus:"verified",priceDays:7,actualYards:15,price:200}
];
const ranked = rankComparisonCards(mock, 16, 3);
assert.equal(ranked[0].providerId, "two", "verified local provider ranks above regional references");
assert.equal(ranked.length, 3, "one product per provider");
assert.ok(ranked.slice(0,2).some(x => x.coverage === "unverified"), "short local coverage fills from regional defaults");
const allReference = rankComparisonCards(mock.map(x => ({...x,coverage:"unverified"})), 16, 3);
assert.equal(allReference.slice(0,2).length, 2, "uncovered city still gets two vetted reference options");
assert.equal(rankComparisonCards(mock,16,3)[0].price,525,"ranking cannot be engineered by price");
console.log("Comparison evidence, ranking, snapshot, exit and outcome assertions passed.");
