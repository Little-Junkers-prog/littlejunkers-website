# ADR-CX-001 — Research-to-Purchase Experience and Days Plus
Status: **OWNER APPROVED — DIRECTION** (November 18, 2026)
Owner: Marcus Griffin, Little Junkers LLC
Applies to: website V2, booking/funnel, Admin OS/CSR, shared Supabase pricing/Fleet, Randy, marketing analytics and comparison
Implementation status: **PHASED WEBSITE IMPLEMENTATION AUTHORIZED (Nov 18)**; no pricing/schema/payment/availability changes approved by this ADR alone.

## Decision and rationale
Design the full customer decision-to-transaction arc, rather than designing sequential checkout screens in isolation. The website earns intent and trust through local serviceability, transparent pricing, real Little Junkers proof, guidance and an evidence-based competitor comparison. Once the customer chooses Book, move them to configuration and purchase **without re-asking known details or re-selling the product**. Mobile first; desktop also polished.

The 2026-10-01/02 unified-checkout remediation remains valid for *one customer-details entry*, embedded Stripe Payment Element, canonical server-priced holds, server verification, paid-booking finalizer/webhook, separate SMS consent, and confirmation. The old 2/3/5/7-day package-selection UX and any documentation that requires it are superseded by the duration rule below. This is a new owner requirement, not a reversal of the closed emergency checkout fix.

## Owner-confirmed rental duration
- The **base rental is exactly three (3) days**.
- The customer can add zero to **27 additional days**, for **3–30 total rental days** bookable online, subject to real availability and pricing.
- **31+ total days** are **custom quote only**: capture needed business and scheduling context, route to a human quote and provide Call/Text options. No automatic price, availability promise or payment for an unapproved long-term rental.
- Customer may also ask for 3 months, 5 months or another extended period; handle in this custom-quote lane.
- The per-additional-day price, base amounts, calendar/pickup counting convention, deposit/weight policy and long-term approval process are **not approved in this decision**. The current `daily_overage` database value is not authorization to reuse it as the prepaid Days Plus rate.
- Any price illustrated in a design-only prototype must be labeled as nonbinding; no hardcoded price may become a live charge.

## Customer experience contract
1. **Research and trust:** landing page, ZIP/city serviceability, canonical current pricing, appropriate dumpster-size help, objective local competitor comparison, first-party jobs/reviews, Randy. Comparison is optional, never required to purchase.
2. **Book intent:** preserve approved context (location/ZIP, selected size, desired delivery date, duration, campaign and language), including from city/size/compare/Randy paths; ask for only what is missing.
3. **Configure:** confirm service ZIP and actual service/jobsite address, size, available delivery date/block and 3–30-day length. Determine the pickup/return date using approved business-day rules. Re-evaluate Fleet capacity **for the entire requested interval** and at payment.
4. **Price trust:** show server-authoritative all-in prepaid total and itemized fees before asking for payment, with clear included weight, extra-weight conditions and material rules. Any edits that affect dates/fees must revalidate availability and reprice.
5. **Purchase:** single customer-details entry with residential/business/contractor branches and separate service vs marketing consent; embedded Stripe; no account creation requirement; no duplicate data fields or unsupported checkout claims.
6. **Confirm:** only declare a reservation confirmed after backend payment verification and finalization; supply reference, rental details and next steps.
7. **Unavailable/suspended:** no paid checkout or unverified delivery promise when Fleet/operational booking is blocked. Offer documented quote/contact or an honest unavailable state.

## Comparison-tool decision
The website includes first-class `/compare` and `/pricing` surfaces. Comparison information must use dated, linkable and appropriately normalized third-party observations; show missing data explicitly; never invent competitor offers, hide unfavorable results, or imply a guaranteed competitor price. Supabase stores observations; Admin manages verification. Do not require comparison to book and do not delay core checkout release solely for the tool.

## System impact register (work required before operational release)
- CX-001 — Design and prototype the shared mobile-first shopping -> configure -> pay journey across entry paths.
- PRC-001 — Supabase pricing model: canonical 3-day bases, additive 4–30-day quote, effective dates, fee/discount ordering, server-verified snapshot, migration/backward compatibility.
- FLEET-001 — Availability/return-date and delivery-block logic for arbitrary 3–30-day intervals and blackout/non-service days; retain safe no-overbooking behavior.
- BOOK-001 — New booking configuration UX and 31+ quote lane; reuse unified-checkout-v1 and transactional finalizer.
- ADM-001 — Admin pricing/rules editor for Days Plus and 31+ quote governance.
- CSR-001 — CSR booking flow and paid/manual links reflecting Days Plus, server quote, return-date, and change-order handling.
- CMP-001 — Competitor-data verification/admin workflow and customer-safe comparison surface.
- SITE-001 — Website homepage/size/city/pricing/FAQ/JSON-LD/copy and navigation revisions; context handoff and noindex prelaunch.
- RANDY-001 — Randy recommendation/quote/text flow consistent with new pricing and rental limits.
- MEAS-001 — consent-respecting measurement from landing, research and comparison through paid rental; don't confuse suppressed booking availability with abandonment.
- QA-001 — mobile/desktop, accessibility, Spanish-language parity, 3/4/30/31-day boundaries, timezone/date math, price drift, promo, hold expiry, payment and inventory edge cases.

## Dependencies / open questions
- Approve actual 3-day base and **prepaid** additional-day rate per size, including whether rates vary by size.
- Approve day-count definition (delivery date counted as Day 1?), pickup scheduling when no pickups on a day, and availability lookahead across 30 days.
- Determine quote workflow and accountable CSR/ops ownership for 31+ day requests.
- Confirm rental reopening and real available fleet before enabling paid public transactions. Nov 9 suspension is the last owner-reported status; do not assume resolved.
- Decide final same-domain routing after technical security/compatibility testing; preserve existing booking subdomain links.
- Set consumer disclosure details, refund/early-return and long-rental rules before legal review.

## Implementation and release guardrails
This ADR authorizes design and documentation. A preview can demonstrate navigation and interface behavior with clearly marked *non-transactional* data. **No production price/schema edits, live payment, Fleet changes, DNS changes, or main-branch merge without separate owner sign-off.** Keep current Odoo live until cutover and keep V2 preview noindex.

## Supersession statement
This ADR overrides older V2 sections **only** where they presume selectable 2/3/5/7-day rental packages, imply the customer must traverse a fixed funnel regardless of prior context, or deny the 31+ custom-quote branch. All other decisions remain in effect, including the shared visual language, pricing authority, existing checkout safety contract, legal/consent rules, full English/Spanish journey, privacy, and owner-controlled PR approval.


## Owner authorization update — November 18, 2026

Marcus approved implementation of the clarified customer experience topology in [ADR-CX-002](ADR-CX-002-shopping-hub-architecture.md). This authorizes **website-only** implementation in reviewed preview branches, with existing canonical facts and a non-transactional Days Plus demonstration pending pricing/Fleet contracts. It **does not** authorize production pricing or schema changes, real rental holds/payment, restoration of suspended rentals, a main merge, or DNS cutover. Prototype copy is unapproved and must be rewritten with substantive, accurate content during page reviews.
