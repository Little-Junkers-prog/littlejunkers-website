import assert from "node:assert/strict";
import { selectOfferSnapshot } from "../lib/comparison-selection.ts";

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
console.log("Comparison offer-selection checks passed (11 assertions).");
