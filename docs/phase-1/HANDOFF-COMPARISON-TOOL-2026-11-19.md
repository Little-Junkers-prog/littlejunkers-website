# Little Junkers V2 — Comparison Tool Development Handoff

**Date:** November 19, 2026  
**Owner:** Marcus Griffin  
**Status:** Requirements handoff / analysis only. **Do not interpret this as authorization to publish competitor pricing, activate marketing, merge PRs, or modify production.**  
**Next workstream:** Build a truly interactive, sourced competitor comparison and an ethical first-party measurement loop.

## 1. Owner's intended product

The existing `/compare` route is mostly explanatory prose. This is **not** the intended end state. The intended experience is an actual comparison tool, opening immediately with filters and matching cards:

- The customer enters **city or ZIP** (not ZIP-only), selects a Little Junkers size (11/16/21-yard comparison class), and optionally chooses rental duration.
- Display **Little Junkers plus two relevant competitor cards by default** (three cards total). The owner used Kraken Dumpsters and “Easy Dump” as an example. `comparison_providers` contains **Kraken Dumpsters** and **EZ Disposal Roll Offs**; confirm whether EZ Disposal is the intended provider before labeling it “Easy Dump.”
- Show real published prices and terms wherever fresh, verified data exists. Show the provider's **actual container size** as well as the equivalent comparison class; do not imply that a 15-yard competitor can and a 16-yard Little Junkers can are identical.
- Show rental term, included weight, delivery fee, overage, restrictions, source URL and last verification date. If a field is unknown or the observation expired, show the uncertainty rather than inventing the price.
- Link directly and prominently to each competitor's own website, as well as to Little Junkers' contextual price/booking path. This is intentionally transparent; the comparison needs to build trust.
- Let the customer change filters and immediately see the cards update. No long intro or excessive generic educational cards above the tool.
- Keep the homepage comparison module concise and link into the full standalone `/compare` experience.

**Business objective:** Make the tool genuinely useful to shoppers and also help Little Junkers understand consideration, competitor outbound traffic, return traffic and attributable paid conversions. **An outbound click does not prove that a competitor got a booking.**

## 2. Verified governing specification

- Website repo: `Little-Junkers-prog/littlejunkers-website`.
- Current review branch: `feature/cx-days-plus-first-draft-20261118`, draft PR [#7](https://github.com/Little-Junkers-prog/littlejunkers-website/pull/7). Do not merge or change production without review.
- [STRATEGY-ARCHIVE.md §12](../../STRATEGY-ARCHIVE.md) already declares `/compare` a first-class product surface with input city/ZIP, size and optional duration, output competitor observed prices, actual included tonnage, delivery, overage, restrictions, source and verification dates, with no invented or biased results.
- Archive §16 already lists `comparison_started`, `comparison_completed` and `competitor_viewed` as planned analytics event names, as well as `provider_outbound_clicked` for the marketplace. The comparison event taxonomy can be extended and should be reconciled with existing funnel events.
- [Tier 1 specs](../TIER-1-PAGE-SPECS.md) reference comparison navigation/CTAs but do **not** prescribe a finished three-card interactive interface.
- [Project Charter](../../PROJECT-CHARTER.md) and ADR-CX-001/002/003 require city-or-ZIP, live sourced prices, a direct path to booking, a progressive estimate, mobile-first UX and no internal developer text in customer-facing copy.
- The current `app/compare/page.tsx` is an informational placeholder. It uses live Little Junkers three-day base rates, but does not query competitor tables.

## 3. Verified Supabase state — read-only inspection on November 19, 2026

Project: `fobkdakjawryhzkcdbbo`.

| Table | Row count | Current purpose |
| --- | ---: | --- |
| `comparison_providers` | 12 | Provider names, external URL, active and visibility flags |
| `comparison_products` | 29 | Container products, actual yardage, 11/16/21 comparison class |
| `comparison_variants` | 14 | Product-specific variants |
| `comparison_observations` | 151 | Immutable sourced facts with verification/publication statuses and expiration |
| `competitor_comparison` | 36 | Earlier flattened public comparison data |
| `comparison_provider_coverage` | 0 | Planned location eligibility/coverage matrix, currently empty |
| `comparison_sessions` | 0 | Server-owned comparison journeys; schema includes location, size, lead_id, unlocked_at |
| `comparison_events` | 0 | Append-only comparison interactions, linked to a session/provider |
| `funnel_events` | 880 | Broader funnel event data, to inspect before integration |
| `link_tracking` | 512 | Existing redirected-link tracking for other workflows; suitability to compare must be audited |

**Critical data quality gate:** All 151 normalized observations were observed on **2026-09-15**, and each has `valid_until = 2026-10-31`, now expired. Although some rows retain `publication_status=publishable` and `verification_status=confirmed_published`, that must **not** override `valid_until`. The older `competitor_comparison` records were last verified October 5 and also need freshness review.

Representative providers include Kraken Dumpsters, EZ Disposal Roll Offs, BM Dumpster Rentals, Frank's Roll Off Dumpsters, Moreira's Service, Haul Away and others. One provider is currently marked suppressed; honor this and other publication safeguards. There are 29 `price` observations marked publishable/confirmed, but **none** are still within their valid-until window as of this handoff.

Known product-class examples:
- Kraken: 15-yard roll-off maps to Little Junkers' 16-yard comparison class; two distinct 20-yard products map to 21-yard class.
- EZ Disposal: 15-yard maps to 16 class; 20-yard maps to 21 class; 30-yard is not a direct 11/16/21 class.
- Providers may lack offers in a selected class or location. Do not silently substitute an unrelated product.

Do not conflate verification history with **live current public prices**. A re-verification/content workflow is mandatory before showing competitor offers as current.

## 4. Proposed experience design — to validate before coding

**Primary surface, above the fold:** heading “See how we compare”; city-or-ZIP entry; 11 / 16 / 21-yard choice; optional duration; comparison cards appear without long introductory explanations.

**Card set:** Little Junkers + two relevant competitors, with “See more companies” for additional eligible results if meaningful. Order and selection must be based on transparent rules (relevance to location, comparable product, verification freshness, completeness) and must not cherry-pick weak competitors. Retain source dates, link to original offer, and show “not verified” where necessary.

**Pricing:** Little Junkers pricing comes from its canonical read-only quote/three-day base API, with a progressive estimate as size/location/days are selected. The extra-day price for Days Plus 4–30 is still unapproved. Competitor prices remain historical observed offers, not guaranteed checkout quotes. Normalization should not mathematically invent matching-day prices when terms differ.

**Soft gate:** Show enough actual comparison information to be useful for free. Offer optional “Save this comparison,” “Email my estimate,” or “Get a follow-up quote” to motivate **voluntary** identification. Do not require a name, phone, or marketing opt-in to see competitor sites. Keep transactional messaging separate from optional marketing consent.

**Outbound links:** A clear “Visit Kraken Dumpsters” link can record a first-party, consent-compliant click event and open the exact provider-approved URL. Never create a public open-redirect or silently substitute a destination; make external destination clear.

## 5. Measurement and marketing intelligence

Proposed first-party event flow:
`comparison_started` -> `location_selected` -> `size_selected` -> `offers_rendered` -> `competitor_viewed` -> `competitor_outbound_clicked` -> optional `return_visit` -> `booking_started` -> **verified** `paid_rental`.

Track only permissible data for which the appropriate analytics consent/legal basis exists. A comparison session can be pseudonymous and must not force lead creation. Build an explicit joining strategy for existing `comparison_sessions`, `comparison_events`, `funnel_events`, paid rentals and first-touch attribution. Verify session retention, privacy and deletion behavior with current policies.

Attribution categories for reporting:
- **Verified LJ win:** paid booking in Little Junkers records with supportable attribution.
- **Comparison-to-competitor outbound:** observed provider click, **booking outcome unknown**.
- **Returned / still considering:** visitor returns after an outbound click; only if permitted and reliably correlated.
- **Competitor won (self-reported):** shopper voluntarily tells us which company they chose.
- **Unattributed / unknown:** no supported outcome evidence.

Do **not** label an anonymous departure a competitor booking or automatically send “we noticed you booked Kraken.” No email/SMS remarketing merely because somebody clicked an outbound link. Message follow-up is a separate, purpose-specific permission/opt-in process with opt-outs, quiet hours and frequency limits. A voluntary post-comparison survey (“What matters most?” or “What would help you decide?”) can supply better loss reasons than click inference.

A useful internal dashboard would show location/size demand, competitor card impressions, outbound click-throughs, verified Little Junkers paid conversion, self-reported competitor choices, data freshness and unknown outcomes.

## 6. Implementation and safety boundaries

Next chat should **audit first, then propose/build** on the existing branch or a separate approved comparison feature branch:

1. Inspect all comparison table column semantics, RLS, existing functions/views/API paths, and Admin ownership. Distinguish normalized historical observations from flattened legacy public rows. Inspect possible overlapping analytics schemas before adding migrations.
2. Design a **public, server-filtered comparison response** that honors active/public flags, conflict/verification states, the provider's real product class, city/ZIP coverage evidence and observation expiry. No unrestricted direct access to internal observations or notes.
3. Build actual `/compare` responsive card UI and size/location filters; connect to read-only backend. Feature-flag competitor prices until re-verification. Correctly handle no comparable, no service-area evidence and stale data.
4. Build consent-aware, secured event capture and safe outbound navigation; link to existing attribution/booking data. Validate data minimization, opt-in, privacy disclosures, and security protections.
5. Prototype *optional* soft capture/quote-saving and the market-intelligence dashboard; get owner approval for copy, follow-up cadence and audiences before activating campaigns.
6. Test Newnan and Peachtree City/other market searches, 11/16/21 class mismatches, same-size competitor variants, stale offers, pricing differentiation, session return, opt-out and mobile layout.
7. Present a Vercel preview, test results, DB read-only verification, and proposed release gates. **Do not** write Supabase production tables, expose expired data as current, send marketing messages, merge into main or change production checkout without explicit approval.

## 7. Open decisions to settle with Marcus

- Is the default layout always **three total cards (Little Junkers + two competitors)**, with more expandable?
- Does “Easy Dump” mean **EZ Disposal Roll Offs**, the provider currently in Supabase?
- Is competitor selection automatic by ZIP, and what minimum evidence establishes local delivery eligibility while `comparison_provider_coverage` is empty?
- What is the accepted refresh cadence and expiration policy for public rates? Who verifies prices and source URLs in Admin?
- What optional save/email/follow-up offer is sufficiently valuable without hiding results? What opt-ins and retention rules should apply?
- Which measurement dashboard is expected: sessions, click-throughs, paid LJ wins, self-reported competitor wins, and unknowns?

## Suggested prompt for the next chat

> Continue Little Junkers Website V2 from `docs/phase-1/HANDOFF-COMPARISON-TOOL-2026-11-19.md`. Build the real source-backed, interactive competitor comparison tool, not another explanatory page. Start by inspecting the existing STRATEGY-ARCHIVE §12, website PR #7, Supabase comparison_* tables, older competitor_comparison table, and event/consent/attribution contracts. The starting target is city or ZIP + size + optional duration, displaying Little Junkers plus two verified relevant competitors as three comparison cards, with real offer terms, source/verification dates, external links and a clear route to LJ's estimate/booking. Keep the 151 expired observations out of current-price claims until reverified, do not infer competitor purchases from clicks, and design optional capture/consent-based follow-ups. Preserve Pages Plus/Days Plus 3–30 rule (Days Plus), 31+ human quote, mobile UX and checkout safety. Deliver a build plan, then a reviewed Vercel preview; do not merge or mutate live systems without separate approval.
