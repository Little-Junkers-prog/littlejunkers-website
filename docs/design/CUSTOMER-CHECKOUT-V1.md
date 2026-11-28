# Customer Checkout V1 — design candidate

**Date:** November 28, 2026. **Status:** Review-only, separate candidate from booking-flow Rev 2 and draft PR #14 Rev 3. Not an authorization to change the approved transaction architecture. The working prototype is [checkout-v1/index.html](checkout-v1/index.html); it uses only local illustrative fixtures and must not be published as a transaction page. This candidate preserves L1–L5 where compatible with the new proposal; changes to locked visual behavior await owner review.

## Screen and interaction contract

| Stage | Screen | Customer-facing copy and behavior |
| --- | --- | --- |
| Entry | Marketing context or existing /plan | "See your price" until real Fleet is integrated; then "See prices & availability". City or ZIP, no contact details. Carry validated context including selected size, duration, date preference, attribution and language. Resolve actual jobsite ZIP before payment. |
| 1 Size | Guided or quick choice | "What are you working on?" / "Already know your size? Choose a dumpster." Real photo, project fit, volume, dimensions, included weight, early estimate. Optional advice explains the recommendation; heavy material needs weight/safety guidance. |
| 1 Size | Contextual upgrade | "Need a little more room?" Show canonical price difference and capacity/weight difference, both sizes with honest decline. No fear or default paid extras. |
| 2 Schedule | Duration, delivery day, time | "When do you need your dumpster?" Allow 3–30 days after pricing exists; 31+ quote. Display compatible days and full-interval availability only after real Fleet response. Alternative dates/size or request assistance if unavailable. Early delivery only with actual slots and approved fee/time; switching date invalidates prior option. |
| 2 Schedule | Relevant extras | Optional disclosure for additional disposal allowance and supported special items. Validate equipment payload and material rules. Do not preselect a paid option. Show charges before commitment and unused weight acknowledgement. |
| 3 Checkout | Unified details | "Where are we delivering?" Structured GA jobsite address, Home/Business/Contractor; name, mobile, email once; conditional company/billing info; optional placement note. Explain use. Separate service and marketing texts. No forced account. Review next. |
| 3 Checkout | Review and pay | Editable size/schedule/extras/address/contact. Server-authoritative total including applicable taxes/fees; cancellation/terms. Embedded Stripe Payment Element (eligible methods only); one Pay $[total] action. Client cannot declare a hold or payment verified. Preserve approved contract and existing API finalization. |
| Complete | Confirmation | "You're booked" only after verified finalization. Show reference/receipt/next steps/help; show text sent only if verified; optionally manage rental via authorized link. No immediate sales pressure. |

A sticky desktop summary, and mobile running-price + next action with expandable breakdown, persist across all steps. Move focus to the next heading on progression; errors are inline and announced, preserve entered information when correcting; support back/edit without duplicate fields. A short, separate prototype indicator is allowed on review builds, not customer-facing launch copy. English and Spanish require parity before release.

## Example copy library (review)

- Hero: "Big projects. Little hassle." Supporting: "Dumpster rentals for cleanouts, remodels and more. Enter your city or ZIP to see delivery fees and rental prices."
- Guidance: "Between two sizes? Text us a photo of the pile and we'll help you choose." Do not promise a particular response time.
- Pricing: "Your rental includes the services listed here. Extra days, extra weight or certain materials may add a charge. We'll show applicable charges before you pay."
- Unknown: "We couldn't confirm that location. Check the ZIP or call or text us." Split: "We deliver in [city]. The delivery fee depends on your jobsite ZIP."
- Unavailable: "That date isn't available for this rental. Try another date or size, or ask us for help."
- Resume: "Still deciding? Save your selection and come back when you're ready." Only implement consent-appropriate persistence; no unsolicited contact.
- Review: "Check your rental before you pay." Confirmation: "Here's what happens next." Do not promise exact dates/windows or messaging until supported.

## Source and business rules

The November 28 ZIP was reviewed as a design reference, not production code. Its illustrative 3-day prices $325/$375/$425, included 1/1.5/2 tons and $0/$59/$99 delivery zones are copied into this isolated example only, not approved for live charges. No extra-day rate, morning/same-day fee or time, exact pickup convention, taxes, fuel surcharge, availability, card data, operational policies or new fees are assumed. Optional upsell presentation is demonstrated without enabling a real charge. Production uses existing read-only pricing/service area and booking-app APIs defined in the November 22 plan, no replacement backend.

## Edge-case acceptance

- Blank or unknown location never becomes Peachtree City/free delivery; multi-zone city has unknown fee until actual jobsite ZIP; out-of-area cannot pay.
- Size, dates, duration, address or add-on change invalidates prior validation and requires a new server quote and full-interval check; stale holds and failed payment never show confirmed.
- Strict valid calendar date, approved counting convention, no unavailable or out-of-range selection. 3/4/30/31 boundary, change to size unavailable on date, split zone, rate missing, quote expiry, cancellation policy, fees/taxes, simultaneous last-slot selection, payment retry and duplicate finalization covered.
- Preserve a residential simple form plus business/contractor separate billing/jobsite, existing CSR smart links, contact resolution and separate consent. No real data submission in design candidate. No marketing activation.
- 375/390/768/1024/1440 viewport; 200% zoom; keyboard, visible focus, readable contrast, labeled controls, errors, reduced motion; sticky CTA no overlap or horizontal scroll. Tests on actual browser and Stripe test setup are required before implementation sign-off.
- Confirm source pricing, safe payload, approved fees, Fleet reopening and service days/time windows, day-count/pickup convention, policies, reviews, payment methods and Spanish. Use existing test environment, never production test holds.

## Decisions requested

1. Approve contextual extras and 3-stage progress grouping with separate Details and Review/Pay screens, or retain mandatory extras stage as Rev 3.
2. Approve exact 3-day price, incremental daily rate, pickup convention, cutoff, inventory and zones through Admin pricing/Fleet separately.
3. Approve which optional weight/material/schedule charges are supported and safe; specify prepay increments and truck limits, boards/placement policy, early/same-day operational terms.
4. Confirm customer-facing cancellation/refund/extension terms and actual payment methods. Confirm no-date inquiry and secure manage/resume scope.
5. Confirm actual Google reviews for display and copy/Spanish approval; choose /plan vs /book routing only in implementation PR.

## Release

Design only; no public route, no payment API, no holds, no production data, no analytics or message writes. Prototype tests are not real transaction tests. Do not merge without owner review; no live checkout until all charter gates pass. Record future revisions in CHANGELOG and this specification.
