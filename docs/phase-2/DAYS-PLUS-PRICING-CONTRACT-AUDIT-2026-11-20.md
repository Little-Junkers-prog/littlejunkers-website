# Days Plus pricing connection — audit and release gate

**Date:** November 20, 2026
**PR:** #10 (preview-only)
**Mode:** Read-only Supabase audit and website implementation; **no production pricing, schema, Fleet, payment, booking hold or DNS edits**.

## User-reported issue

At 5 selected rental days the preview displayed **$325** for an 11-yard rental in Peachtree City. That amount was only the existing three-day base; the two extra days had no approved prepaid rate and were omitted. It was therefore misleading to present $325 as a five-day total.

## Authoritative facts actually verified

A read-only audit of the canonical Supabase `public.pricing` table on November 20 found:
- Active `3day`: $325 / $375 / $425 for 11 / 16 / 21 yards.
- Separate active legacy `5day`: $399 / $449 / $499.
- Separate active legacy `7day`: $449 / $499 / $549.
- All three rows have `daily_overage = 30`; this is a **legacy extension/overage value**, **not an approved prepaid Days Plus per-day rate**.
- The `business_rules` table did not contain a Days Plus prepaid rate approval, and the schema does not yet contain a dedicated Days Plus rate table.
- ADR-CX-001 (owner approved Nov 18) approves **3 days included + 0–27 prepaid additional days, for 3–30 total days**, but says the per-day rate and day-counting convention **remain unapproved**.
- The website pricing adapter reads the existing live booking `/api/get-pricing` API. Its legacy 3/5/7-day tier data must not silently become a new 3–30-day pricing schedule.

## Website-side calculation now implemented

`lib/days-plus.ts` supplies a pure read-only display engine. For each valid size and 3–30-day duration it computes:
- Three-day base from the canonical API
- Number of extra days: `days - 3`
- Approved prepaid rate by size, if provided
- Extra-days amount: `extraDays × approvedRate[size]`
- Known delivery fee for a confirmed ZIP or unambiguous zone
- **Known subtotal** for already priced components, and an **estimated rental subtotal** only if base, size, duration, delivery fee, and applicable extra-days price are all known

Values use integer cents to avoid floating-point currency errors. None of these display amounts is a checkout-authoritative quote or Stripe charge. Other taxes/fees, promos, Fleet availability, checkout approval and finalization still require the separate BOOK-001 work.

`lib/pricing.ts` accepts a **new optional** `daysPlusContract` object from the canonical pricing API only with explicit approval, approved effective date and all three size rates. The exact proposed future response segment is:

```json
{
  "daysPlusContract": {
    "status": "approved",
    "approvalId": "OWNER-APPROVED-CONTRACT-ID",
    "effectiveFrom": "YYYY-MM-DD",
    "effectiveTo": null,
    "baseDays": 3,
    "maxDays": 30,
    "ratePerExtraDay": {
      "11": null,
      "16": null,
      "21": null
    }
  }
}
```

**The null rates above are placeholders, NOT approved values**. This payload is a proposed integration contract and **is not currently emitted by the live pricing API**. When the rate contract is absent or invalid, the site intentionally cannot produce a 4–30-day full amount.

All existing `DaysPlusPlanner` entries (home, pricing, `/plan`) and the first-party row on `/compare` share `estimateDaysPlus()`; no second independently calculated total. The live Supabase tables remain untouched.

## Customer-facing behavior and acceptance

- At **3 days**, show the canonical base and available delivery fee; if delivery location isn't confirmed, say so. Never label the known amount as final/payment-ready.
- At **5 days**, **without an approved rate**, show that the full price is pending, with separate three-day base, two unpriced days and known delivery; do **not** display the three-day figure as a five-day total.
- At **5 days**, **if an approved canonical rate becomes available**, the additional-day line and estimated subtotal update automatically; it is still a non-binding estimate until the server quote/Fleet validation is implemented.
- At **30 days**, calculate 27 additional days only when rates are approved.
- At **31+ days**, route to a custom quote; never silently calculate 31 days or round it down to 30 for payment.
- A missing ZIP, split zone, API failure or invalid contract cannot silently become a zero-delivery-price or a fake total.
- Tests in `scripts/check-days-plus.mjs` use **clearly synthetic rates** to exercise calculation boundaries. Those numbers are test fixtures only and must never be presented to renters.

## Remaining release blockers

1. Owner explicitly approves prepaid per-additional-day amount for each size or one common rate, any volume tiers/discounts, and effective date. Capture as an approval record.
2. Owner explicitly approves whether delivery day counts as Day 1, exact pickup-time rules and blackout/non-service-day handling.
3. Canonical server pricing API exposes the approved Days Plus contract; pricing-admin controls and persisted Supabase source are implemented through a separate reviewed migration/API change. No legacy tier reinterpretation.
4. Implement server-authoritative full quote, fees/discounts/taxes, fleet interval availability/hold, embedded Stripe, idempotent finalization, customer consent, real confirmation and reopening control.
5. QA with live canonical API and preview for 3/4/5/7/30/31-day boundaries, ZIP zones, size switching, money rounding and invalidation after edits. No public checkout until all gates pass.

## Mobile comparison discovery

On mobile, the Little Junkers card fills much of the first viewport. PR #10 now displays a small **results-ready** callout with a tappable, gently moving down-arrow when verified comparison candidates exist. The first competitor card carries the anchor target; a second hint appears between Little Junkers and the competitors. On desktop the three-card comparison grid remains unchanged. Arrow movement is disabled for reduced-motion users and nothing appears when the comparison request fails or there are no candidates.
