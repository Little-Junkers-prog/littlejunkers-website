# ADR-CX-003 — Progressive Price Estimates, City/ZIP Search and Customer Copy

**Owner direction:** November 19, 2026  
**Status:** Approved design/experience requirements; website preview changes authorized; confirmed quote/payment integrations pending separate implementation  
**Applies to:** standalone experience preview, Next.js homepage, size/price cards, /pricing, /compare, shared rental planner, city/ZIP lookup, later booking/CSR/Randy

## Problem
The first prototypes contained generic or defensive marketing language, implementation comments in customer-visible text, and an unnecessary ZIP-only field. The displayed price either stayed blank ("final amount pending") or was presented as a static card. The owner wants a **price estimate visible early that becomes more accurate as customers choose their size, location, date and length**, with an explicitly confirmed/locked final quote only after sufficient information and authoritative system verification.

## Owner decisions
1. **Write for customers, not reviewers or agents.** Delete phrases such as "lowest sticker price isn't always the best deal", "start with the amount of stuff, not a confusing set of packages", "If you chose a size above, we've kept it", "Final site will show...", "canonical", "Fleet-confirmed" and "this prototype doesn't..." from everyday copy. Keep a short, visually separate review-only disclaimer while the site is non-transactional. Favor direct language, facts and useful comparisons.
2. **Primary location input is "City or ZIP" everywhere.** Both homeowners and contractors should be able to begin with a city. Use the already available /api/service-area contract backed by canonical ZIP/zone tables. If a city maps to one common delivery zone, show the current fee *as a provisional location estimate*, but do not invent an exact ZIP or verified jobsite address. If city ZIPs span multiple fee zones, state that the fee depends on the specific address/ZIP, and leave it unpriced. Unknown lookup stays uncertain, not "not served".
3. **Progressive estimate:** Before size, show a "Starting at" based on the lowest actual live three-day base price. On size selection, switch to that size's three-day base. When city/ZIP resolves to an unambiguous zone, add that known delivery fee to the *estimated subtotal* and disclose what remains unpriced. Date and duration choices update the estimate's components and remaining contingencies; no invented rates. For 4–30 days, if no approved prepaid extra-day rate is available, keep the known subtotal visible and explicitly show extra-day pricing as pending, **never suggest it is the final total**.
4. **Confirmed price:** Only a server-issued authoritative quote, including approved 3-day base, optional day 4–30 charges, address/zone, delivery/pickup windows, applicable fees/taxes/discounts, inventory reservation validation, and an expiration/hold contract if appropriate, may be labeled "Your confirmed price". Date or customer field changes must revalidate and reprice. **No client-side "locked/loaded" state** from completing fields alone. Existing unified-checkout-v1 and Stripe finalization safeguards remain mandatory.
5. **CTA language:** use "Check prices", "See my estimate", "See how we compare", "Choose a dumpster", "Review my estimate" in context. Do not use "Build my rental" (the customer is renting, not building). Use "Book" only where the action really enters an available transaction.
6. **Copy process:** the initial design copy is unapproved; update preview language now, then complete a substantive SEO/operational copy pass page-by-page before release. Customer-visible preview must not leak developer to-dos, internal system names or approval process.

## Implementation boundaries
Website UI and read-only published price snapshot/API may be changed on a draft branch. No database migration, fee/rate change, inventory mutation, paid checkout, main merge or cutover is authorized here. Live pricing data failure means an honest unavailable state rather than fabricated price, consistent with the strategy archive.

## Acceptance tests
- City `Newnan` and a service ZIP such as `30269` work in homepage and planner; multi-zone cities do not display a precise fee.
- Size change changes the estimated base; resolved zone change changes the known-delivery component; selecting 4/30 days leaves the unapproved extra-day component pending.
- 3, 4, 30 and 31+ day boundaries remain safe; long-term goes to human quote.
- No customer-facing internal comments. No checkout button falsely indicates a locked price.
- Real price shows only from canonical 3-day tier; no hardcoded duplicate product pricing in integrated site. Date/time cannot imply real Fleet availability.
- Keyboard, responsive and no-JS fallback (for the original homepage location search) remain testable.

**See also:** [ADR-CX-001](ADR-CX-001-days-plus-experience.md), [ADR-CX-002](ADR-CX-002-shopping-hub-architecture.md), [Project Charter](../../PROJECT-CHARTER.md).
