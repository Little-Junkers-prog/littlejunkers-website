import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = (name) => readFileSync(name, "utf8");
const source = read("lib/days-plus.ts");
// Execute the actual pure TS calculator without calling the API or database.
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
const mod = { exports: {} };
vm.runInNewContext(compiled, { module: mod, exports: mod.exports });
const { estimateDaysPlus } = mod.exports;
const basePrices = { 11: 325, 16: 375, 21: 425 };
const approvedRates = {
  baseDays: 3, maxDays: 30, approvalId: "synthetic-approved-test-fixture",
  ratePerExtraDay: { 11: 12.25, 16: 16.5, 21: 19.99 }
};
const run = (size, days, deliveryFee, rates = null) =>
  estimateDaysPlus({ basePrices, size, days, deliveryFee, rates });

let e = run(11, 3, 0);
assert.equal(e.estimatedRentalSubtotal, 325);
assert.equal(e.extraDaysCharge, 0);
assert.deepEqual([...e.missing], []);

e = run(11, 5, 0); // Live configuration as of 2026-11-20.
assert.equal(e.knownSubtotal, 325, "known 3-day base is not lost");
assert.equal(e.estimatedRentalSubtotal, null, "5-day total cannot be invented");
assert.equal(e.extraDaysCharge, null);
assert.ok(e.missing.includes("extra_day_rate"));

e = run(11, 5, 0, approvedRates);
assert.equal(e.extraDaysCharge, 24.5, "approved rate multiplies by extra days");
assert.equal(e.knownSubtotal, 349.5);
assert.equal(e.estimatedRentalSubtotal, 349.5);
assert.deepEqual([...e.missing], []);

e = run(16, 4, 49, approvedRates);
assert.equal(e.estimatedRentalSubtotal, 440.5, "zone fee is added once");

e = run(21, 30, 79, approvedRates);
assert.equal(e.extraDays, 27);
assert.equal(e.extraDaysCharge, 539.73, "cents never drift");
assert.equal(e.estimatedRentalSubtotal, 1043.73);

e = run(11, 5, null, approvedRates);
assert.equal(e.estimatedRentalSubtotal, null, "missing delivery fee blocks apparent total");
assert.equal(e.knownSubtotal, 349.5);
assert.ok(e.missing.includes("delivery"));

e = run(undefined, 5, 0, approvedRates);
assert.equal(e.knownSubtotal, null, "missing size cannot produce a fake price");
assert.ok(e.missing.includes("size"));

e = run(11, 31, 0, approvedRates);
assert.equal(e.estimatedRentalSubtotal, null, "31 days is custom quote");
assert.ok(e.missing.includes("duration"));

const noApproval = { ...approvedRates, approvalId: "" };
e = run(11, 5, 0, noApproval);
assert.equal(e.estimatedRentalSubtotal, null, "unapproved rate cannot be used");

const pricing = read("lib/pricing.ts");
assert.ok(pricing.includes('proposed?.status === "approved"'), "canonical API must affirm approval");
assert.ok(pricing.includes('typeof proposed.effectiveFrom === "string"'), "approved rate must be effective");
assert.ok(!pricing.includes("\\\\d{4}"), "date regex must not be double-escaped, or an approved contract can never be accepted");
assert.ok(pricing.includes('proposed?.maxDays === 30'), "approved contract must cover 3-30 days");
assert.ok(!pricing.includes("ratePerExtraDay: tier.extraDay"), "never use legacy overage");
const planner = read("components/DaysPlusPlanner.tsx");
assert.ok(planner.includes("estimateDaysPlus({"), "planner must use shared engine");
assert.ok(planner.includes("extraDaysCharge"), "planner shows extra day amount when verified");
assert.ok(planner.includes("Full rental price pending"), "unpriced days are not an apparent total");
assert.ok(planner.includes("Tell us what you need."), "natural customer-facing copy");
const api = read("app/api/comparison/route.ts");
assert.ok(api.includes("estimateDaysPlus({"), "comparison uses shared engine");
const comparison = read("components/ComparisonTool.tsx");
assert.ok(comparison.includes('href="#comparison-competitors"'), "mobile results hint is clickable");
assert.ok(comparison.includes('id={index === 0 ? "comparison-competitors"'), "hint has a valid destination");
assert.ok(comparison.includes("Full price pending"), "comparison does not misrepresent a 5-day total");
const css = read("app/globals.css");
assert.ok(css.includes("@keyframes comparison-arrow-point"), "mobile arrow gives directional feedback");
assert.ok(css.includes("prefers-reduced-motion: reduce"), "animation respects accessibility setting");

console.log("Days Plus quote-readiness and mobile comparison behavior checks passed.");
