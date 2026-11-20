# ADR-CX-004: Online booking is the primary website outcome

**Owner direction:** November 20, 2026
**Status:** Owner clarification of the destination experience; customer-facing copy on review-only branch, no backend deployment authorized
**Applies to:** all V2 entry pages, header/footer, pricing, product pages, city pages, comparison and conversion funnel

## Decision

**Little Junkers V2 is a self-service booking website.** An eligible customer who selects a standard 3–30-day rental must be able to complete the entire transaction online, including:

1. Choose a dumpster and enter delivery city/ZIP/address.
2. Choose an available delivery window and rental duration.
3. See an authoritative, complete itemized price (including any approved extra-day, delivery, disposal, tax and other fees).
4. Enter customer/consent details once and pay in the approved embedded Stripe checkout.
5. Receive a verified reservation and confirmation after payment finalization.

No staff call, manual quote or disconnected system is required for an otherwise eligible standard booking. The already-approved exception is **31+ days**, which require a custom quote. Operational suspension, an unavailable time slot or a genuine exception must receive an honest unavailability/assistance response, not a fake payment or booking promise.

## Wording hierarchy

- **Primary marketing CTA:** "Book Online", "Book a Dumpster", "Start Booking" or "Reserve a Dumpster" (the latter only when the action actually reaches a reservation-capable flow). These describe the business goal, not just the first price calculation.
- **Within the transaction:** show a progressive **estimate** until the customer supplies enough information for a server-issued quote. Once available dates/inventory and all fees are verified, show the **complete confirmed price**, then actual pay/confirm steps.
- **Price-first/educational links:** "Check prices", "See sizes", "Compare" remain appropriate as secondary actions.
- **Avoid:** treating "See my estimate" as the primary conversion outcome on every marketing page. An estimate is an intermediate state, not the end of the customer journey.

The owner explicitly corrected the previous tendency to call the whole site an estimate/planner site. This decision **supersedes ADR-CX-003's default CTA recommendations for marketing pages**, while retaining ADR-CX-003's pricing honesty, early estimate and quote-confirmation guardrails.

## Implementation reality (do not conceal)

As of this review, Next.js `/plan` is **only a read-only, partial-estimate shell**. It has no authoritative 3–30-day full quote, actual Fleet interval availability, server hold, embedded Stripe payment or finalizer. The existing booking application remains the transaction authority but its old package flow is **not** equivalent to the new approved Days Plus contract. Last owner-reported public rental suspension also remains a launch blocker unless formally reopened.

Copy and labels in an authenticated Vercel draft are **design targets**, not proof that online checkout works. Before deploying marketing buttons publicly or merging this as a usable booking site, implement and validate the real booking path, including PRC-001, FLEET-001, BOOK-001, webhook/payment reconciliation, cancellation/expiry and date boundary tests. Do not redirect a Days Plus choice into the old package flow silently. Do not permit payment if Fleet is suspended.

## Immediate copy branch

`feature/sitewide-copy-seo-review-20261120` is a *stacked review branch* based on draft PR #9, not a separate production release. It:
- strengthens existing non-city copy and SEO,
- changes entry-level CTAs from estimate-first to booking-first,
- retains honest price-estimate wording **inside** the incomplete planner,
- changes no live Supabase, Fleet, Stripe, booking APIs or domains.

The **missing-pages PR remains a separate next workstream**, per owner direction. Actual online checkout implementation is a non-negotiable launch dependency, not a reason to start duplicating transaction logic on each SEO page.
