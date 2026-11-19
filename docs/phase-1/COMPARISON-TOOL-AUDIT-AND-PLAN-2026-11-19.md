# Comparison Tool — November 19, 2026 Audit and Review-Branch Plan

**Status:** Implementation review only. No production data modifications, active event writes, marketing messages, payment changes, or main merge.
**Branch:** feature/comparison-tool-review-20261119; stacked on draft PR #7 at c946be3.
**Governing:** PROJECT-CHARTER, STRATEGY-ARCHIVE §§12,16, ADR-CX-001/002/003, Nov 19 comparison handoff.

## Data audit (read-only, November 19)

- Supabase fobkdakjawryhzkcdbbo ACTIVE_HEALTHY.
- 12 comparison_providers, 29 products, 14 variants, 151 immutable normalized observations.
- All 151 normalized observations observed September 15; all expired October 31. Zero observations valid today. Publication flag does **not** defeat expiration.
- 29 price observations previously marked confirmed/publishable; none eligible for a current price.
- 36 legacy competitor_comparison rows last verified October 5; do not use as authoritative live prices. Legacy contains duplicate representation and quote-only statuses.
- comparison_provider_coverage empty (0). Older per-observation serviceability evidence was collected in September and is expired.
- comparison_sessions/events both empty; funnel_events has 880 unrelated existing booking-flow events. No comparison sessions yet.
- One governance rule explicitly mandates a single canonical competitor dataset and a restricted customer-safe projection.
- Provider A&S Rolloff has visibility_status=suppressed: must never surface.
- Data-quality anomaly: BM 20-yard product maps to comparison class 16. Review product mappings before eligible publication. Kraken has two 20-yard products (trailer versus roll-off), requiring explicit variant/product differentiation.
- Selected former published source example (not current approved price): Kraken 15-yard $325/3 days, 1 ton; EZ 15-yard $375/3 days, 2 tons. All recorded September 15 and expired. Do not reuse without fresh verification.
- Comparison table RLS enabled. No anonymous SELECT privilege; no direct public RLS policies. No comparison RPCs/views. Internal observations and notes cannot be queried by browser.
- Vercel project environment metadata read returned 403 forbidden; actual environment variable availability is **unverified**. Preview must degrade without secret config.
- Site is not the public www host; website stays noindex until approved cutover.

## Phase A — shipped on review branch

1. Replace explanatory /compare placeholder with above-the-fold location (city or ZIP), 11/16/21-yard and 3–30-day filters.
2. Client re-fetches after user edits, uses accessible labels and responsive cards.
3. /api/comparison returns a strictly selected public response; its Supabase access remains server-only via SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY). Never expose secret keys in NEXT_PUBLIC_ variables or browser.
4. Provider read requires is_active=true, visibility_status=public, HTTPS destination, and active product in requested class with actual size.
5. Published price requires confirmed_published, publishable, no_conflict, HTTPS source, observed date not in future, unexpired valid_until, explicit price and matching duration; applicable provider coverage requires active/confirmed, correct state, recorded city or ZIP, and recent verification. No inferred rate for different rental durations.
6. One selected product per provider, sorted on evidence and proximity to requested size, not on price or friendliness to LJ.
7. Little Junkers base price comes only from existing server pricing API, with its included tonnage and provisional city/ZIP delivery fee; additional days remain unpriced and booking is still gated.
8. Missing comparison secrets, source service downtime, zero coverage, and missing observations display honest unavailable states. Links use provider URLs (not arbitrary redirect query strings). No event ingestion and no capture fields yet.

**Caveat:** Coverage freshness uses a **temporary conservative review rule** of 30 days from last_verified. That is a design assumption, not an approved Admin policy; owner must approve cadence before enabling current-offer publication.

## Phase B — source and coverage work (not performed)

- Admin verification workflow: assign reviewer; save URL, actual current price and term, included tons, extra-day/overage terms, location scope, date, expiration and evidence. New observations append without altering history; older observations remain historical. Price/terms should be verified at same source and variant.
- Populate the existing comparison_provider_coverage with documented city/ZIP coverage, not extrapolated from corporate headquarters or a generic service radius. County/radius requires an explicit evaluated geographic boundary before eligibility can be automatic.
- Resolve variant ambiguity, BM mapping, suppressed providers, and duplicate observation conflicts.
- Define authoritative freshness policy: proposed revisit every 14 days for online booking prices; max public age 30 days or earlier source expiration; pricing changes invalidate prior published observation immediately. These timings are **proposals**, not approved policy.
- Require at least 2 eligible competitors per location/size for the desired three-card default; if insufficient, show what is known rather than inventing two.
- Finalize competitor labels: owner said "Easy Dump"; canonical provider is EZ Disposal Roll Offs. Do not silently rename without confirmation.
- Confirm ranking logic includes real eligibility and completeness; never rank or score to engineer LJ victory.

## Phase C — analytics, returning visitors and ethical marketing intelligence (design only)

### Event taxonomy
- comparison_started: initial meaningful interaction, location/size state.
- comparison_completed/offers_rendered: server response result count, evidence status, size, generalized city/ZIP.
- competitor_viewed: provider card visibly displayed (avoid counting hidden results).
- competitor_outbound_clicked: provider UUID, source observation/offer UUID if permitted, target host, location and size; first-party observed click only.
- comparison_returned: subsequent valid visit within a consented, stable first-party session/visitor scope.
- lj_estimate_clicked and booking_started: preserve campaign/size/days/area context without PII.
- paid_rental_verified: **server-sourced** paid booking/rental/payment linkage, never browser click alone.
- competitor_chosen_self_reported: opt-in survey only; explicitly labeled self-reported.
- unknown_outcome: derived classification for no confirmed evidence, not a fabricated competitor win.

### Implementation contract (approval required before writes)
Use existing comparison_sessions and append-only comparison_events as the comparison domain ledger. Use existing funnel_events as booking-funnel activity, not duplicate the same event as both canonical measurements. Add bounded, authenticated or anti-abuse-protected server API actions, allowlisted event names, per-event props validation, explicit server timestamps, duplicate-event idempotency, rate limits and a retention policy. No browser writes directly to RLS-blocked tables.

Join journeys by an explicitly consented pseudonymous visitor/session identifier that can be handed to the booking app and mapped to existing funnel_events.session_id/visitor_id or hold_id. The existing comparison_sessions.id (UUID) is not automatically equal to funnel_events.session_id (text). Never assume a matching string alone is proof of identity. Server payment reconciliation should verify successful payment through canonical payment/rental status and join via an explicit accepted hold/rental reference. Pre-existing paid rentals must not be retrospectively attributed without support.

Current ConsentBanner persists analytics and marketing preferences in localStorage (lj_consent) and sends Google Consent Mode updates. Before enabling analytics, enforce the same preferences on first-party product analytics and any cookies/IDs. Consent revocation must stop optional tracking and delete/expire the optional ID per policy. Revisit policy disclosure, replay masking, and retention. Retain only city/ZIP/area, never exact device coordinates in event props, and no name/phone/email/customer notes in general analytics.

An outbound competitor click must open the correct provider domain even if telemetry fails. Prefer direct HTTPS links and navigator.sendBeacon/fetch keepalive to a fixed internal event endpoint once approved; no open redirect, no tracking token as a condition of navigation. Previews should not pollute production analytics.

### Attribution and KPI dashboard
Aggregate by day/week, location, size class, duration:
- valid tool sessions, complete result renders, distinct provider impressions
- outbound competitor clicks, unique clickers, return visits
- verified LJ paid bookings and revenue with attributable session/hold linkage
- volunteered competitor choices (self-reported only)
- unresolved/unknown outcomes and their proportion, without implying loss
- stale price ratio, verified coverage % by market/size and data review backlog
- funnel error/drop-off, estimate-to-booking and session-to-verified-payment conversion

**Dashboard proposal:** Admin-only report read from a reviewed derived projection over comparison_events, comparison_sessions, funnel_events and canonical paid rental/payment state; no new competitor-price truth table.

### Voluntary lead capture (separate approval)
Offer optional "Email me this comparison" or "Get help with my rental" after results remain openly accessible. Contact address/phone is only for the specifically requested follow-up; marketing consent separate, unchecked, purpose-specific, with recorded notice and timestamp. No competitor-click-triggered SMS/email or "we saw you chose Kraken" claims. Honor opt-out, quiet hours and frequency controls.

## Open owner decisions
1. Confirm three cards by default and whether "Easy Dump" means EZ Disposal Roll Offs.
2. Approve the geography source-of-truth and 14-day review / 30-day maximum age proposal.
3. Approve comparison variant and size-class matching rule (BM 20→16 needs correction).
4. Approve measurement event taxonomy, lawful basis/consent gating, join contract and retention before any writes.
5. Select optional consent-based lead-capture experience and message policy separately.

## Validation gates

- Newnan, Peachtree City and ZIP 30269; unknown/multi-zone location states.
- 11,16,21-yard; Kraken 20-yard trailer vs roll-off; BM suspicious class.
- 3,4,30 days; 31+ human-quote route; never extrapolate a competitor amount.
- Expired/conflicted/internal/suppressed observation and no-coverage behavior.
- Missing secrets, blocked Supabase reads, missing canonical pricing.
- Keyboard/screen reader labels, responsive mobile and external links.
- No comparison data writes; no paid transactions; no marketing events; no main merge.
- Vercel preview build and screenshot review, owner approval before merging.

## Existing blocked connections unrelated to this feature
Randy site token/Twilio, full Days Plus backend price and Fleet contracts, production checkout, final editorial and cutover were already open in the prior handoff. They remain **out of scope**; do not treat those as comparison blockers except where the tool correctly hides unavailable prices or booking.


## November 19 execution addendum — owner-authorized intel refresh and PR governance

- PR #7 was squash-merged into main after Vercel success and confirmation that the Vercel website project serves only littlejunkers-website.vercel.app, not the live Odoo www domain. Merge commit ba41ec3791e4688b03ee2ccc0fa7a4ab51a570c2.
- PR #8 now targets main and its branch ancestry was rebuilt into one focused comparison commit on the new main. No merge of PR #8 is authorized.
- The owner clarified voice dictation "Easy Disposal" refers to existing Supabase provider **EZ Disposal Roll Offs**. Provider identity and name derive from the vetted database, not from statements in chat.
- First-party websites were fetched live using Firecrawl (maxAge 0). Only existing canonical comparison providers were researched; no Facebook sellers were silently added.
- Owner explicitly authorized competitive-intelligence database refresh. Inserted 98 append-only observations across 20 offers, with prices, rental terms, included tons, optional extra-day charges and weight charges. Each record has a source URL, observed date 2026-11-19, and a conservative 14-day expiration. Earlier 151 observations remain unchanged.
- Added 23 city-level coverage records for Newnan, Peachtree City, Fayetteville, Sharpsburg and Senoia where each first-party provider site expressly advertises that location. City-level coverage does not verify every street address, delivery fee or live inventory.
- Added existing-provider Dumpsters 4 Less 15-yard product, and corrected existing BM Dumpster Rentals 20-yard product comparison class from 16 to 21.
- Confirmed EZ Disposal 15-yard $375/3 days/2 tons and $5/day extra (earlier $15/day was wrong); Kraken 15-yard $325/3 days/1 ton, $20/day extra and $0.05/lb excess weight; Moreira 15-yard $365/10 days/2 tons as starting plus delivery; BM 14-yard $400/7 days/2 tons and 20-yard $500/7 days/3 tons; Haul Away 15-yard $375/3 days/1.5 tons; Frank's 15-yard $375/3 days/2 tons; Dumpsters 4 Less 15-yard $375/3 days/1 ton and $0.06/lb excess weight.
- Official source URLs:
  - https://krakendumpsters.com/
  - https://ezdisposalrolloffs.com/rent-a-dumpster-2/
  - https://www.bmdumpsterrentals.com/pricing
  - https://www.moreirasservice.com/items/15_yard_dumpster
  - https://www.haulawayrolloffs.com/items/15_yard_dumpster_3_day/
  - https://www.franksrolloffdumpsters.com/items/15-yard-dumpster-3-day-rental
  - https://www.dumpsters4les.com/items/3_day_15_yard_dumpster-_flat_fee_(no_surprises)
- Review UI updates disclose starting price plus delivery and per-pound excess weight, without invented equivalency. Corrected same-day city coverage validation date handling.
- The 14-day expiry and existing 30-day city coverage threshold are conservative provisional review policies; they require business approval as permanent data management rules.

### Trust/source policy proposed for approval

**Tier 1 — public comparison:** vetted existing provider, identifiable first-party website, product and clearly published terms, current documented price and city/ZIP coverage. Show accurate duration, yardage, missing fees and verification date. Do not imply that the published base is an all-in address-specific quote.

**Tier 2 — internal monitoring:** Facebook marketplace/group sellers, brokers, businesses without independently verified websites or incomplete offers. Some may be legitimate. Verify seller identity, service geography, equipment, operational responsibility, price and cancellation/refund policy before promoting to public comparison.

**Tier 3 — exclude from public comparison:** unsubstantiated identity, suspicious listings, untraceable prices, likely impersonation. Keep intelligence evidence without stating fraud is proved.

Facebook presence is not a disqualifier. Brokerage alone is not illegitimate. Quality of corroboration decides whether an offer qualifies.

### Remaining validation gates
- Live preview API verification after Vercel server-only Supabase secret config. Env metadata read previously returned 403; connection remains unverified.
- Published term-mismatch tests for 3/7/10-day offers; per-pound versus per-ton; correct provider source URLs and price qualifiers.
- Geographic wording: city advertised by provider does not mean confirmed specific street or checkout eligibility.
- Approve price/coverage verification ownership and cadence, privacy analytics and opt-in tracking before rollout.


## November 19 follow-on QA slice — PR #8

### Code changes (review branch only)
- Added isolated offer snapshot selection in lib/comparison-selection.ts. Pair price and duration only when the provider product/variant, exact source URL and observed timestamp agree. Prefer an exact term; otherwise the shortest published term that covers the requested duration; only fall back to a shorter published term with a conspicuous warning. Do not invent extended-day totals.
- Added a pure current-publication gate for HTTPS source, approved publication status, confirmed verification, no conflicts, nonfuture observation, and unexpired valid_until.
- The actual comparison API passes the selected duration to the matcher. A missing area fee no longer produces a misleading numerical known-subtotal.
- Provider cards now require independently documented local service-area coverage, not just an active provider record. Unknown coverage yields an honest empty state.
- The customer form accepts all 3–30-day lengths. It differentiates current offered price from shorter-term *reference* price, spells out unknown delivery fees, displays ton versus pound properly, and converts internal roll_off/dump_trailer codes into customer words.
- The response echoes requested city/ZIP to prevent stale results during quick location changes, including normalized inputs such as city with ZIP.

### Verification
- Added scripts/check-comparison.mjs and npm run check:comparison, with 19 assertions for exact and fallback terms, conflicting sources/snapshots/variants, null/zero prices, unexpired versus historical observations, hidden/conflicted facts, future observation and invalid/insecure links.
- Tested equivalent pure matching/gating logic locally under Node 22 with all 19 assertions passing; Vercel build status READY for commits through ea64856. The locked-down Vercel preview requires authenticated deployment access; the client page and API are **not yet end-to-end verified** in the protected runtime.
- Independently read canonical booking /api/get-pricing (HTTP 200) on November 19: price contract exposes 3-day base of 11-yard $325, 16-yard $375, 21-yard $425; 5-day and 7-day tiers also exist, but Days Plus prepaid-extra prices remain separately gated by the charter. Current verified zone-A city/ZIP data includes Peachtree City 30269, Newnan 30263/30265, Fayetteville 30214/30215, Sharpsburg 30277, Tyrone 30290. This confirms reference data only; not the preview function environment.
- Supabase read-only acceptance matrix confirms fresh, publication-eligible, source-coherent offers for Newnan (all 3 size classes) and Peachtree City (16 and 21), including exact 3-day and published 7/10-day examples. No confirmed 16-yard competitor for Tyrone in the refreshed coverage table yet. This is a **data gap**, not proof of no service.
- Vercel project deploymentProtection is enabled for preview, and env-variable metadata access previously returned 403. Runtime Supabase secret configuration and authenticated API test are outstanding. Keep preview protected; do not disable auth or commit credentials.

### Final gates before owner approval
1. Authenticated preview /compare and /api/comparison smoke tests with valid server-only secret: Newnan and 30269, 11/16/21, 3/7/30 days, invalid input and expired/suppressed facts.
2. Accessibility/mobile screenshot QA on protected preview, with normal and reduced-motion settings.
3. Confirm customer-safe caveats and placement for shorter-term reference prices, starting-plus-delivery prices and city-only delivery coverage.
4. Approve duration/freshness/city-coverage policy and event attribution/consent contract before any measurement writes or future merge.

## November 19 customer-preview repair — two default reference providers and branded hero

Owner direction: when a city lacks two documented local providers, show two vetted competitors as clearly labeled regional references. Preserve the exit-dialog opportunity, and place a real Little Junkers hero photograph above the tool. Do not suggest an out-of-area provider delivers locally.

**Diagnosis:** The screenshot showed canonical Little Junkers pricing but a competitor data-source error. Read-only SQL confirms 20 current publishable competitor price offers, 23 confirmed coverage rows, and six or more vetted providers in each 11/16/21-yard size class. The database is not empty. Vercel's environment variable listing returns 403, so its server-only Supabase credentials are still not verified. A missing or inaccessible competitor connection is the likely root cause.

**Review-branch implementation:**
- Exported a read-only and redacted November 19 snapshot from the canonical Supabase comparison tables into lib/comparison-snapshot.json: 11 vetted public providers, 30 active products, 23 confirmed coverage records, and 98 current public evidence facts. No internal notes, suppressed providers, customer information, or credentials included.
- The website prefers live Supabase when server-side credentials are available. If absent or if the Data API returns a configuration/permission (4xx) error, the review preview uses the dated vetted snapshot. Actual source outages, network failures, and 5xx errors keep the honest unavailable state.
- Each snapshot observation is checked against its original validity and publication rules at runtime. On expiration (current offers expire December 3, 2026), amounts stop appearing as verified prices; provider/reference cards can still show without prices. Snapshot refresh or authenticated live source is required for current amounts after expiration.
- New candidate logic selects city-verified providers first, then fills any missing top-two slots using different vetted regional providers from the same size class. Never rank by lowest price or fabricate a delivery quote.
- Douglasville has no documented comparison city coverage: show two labeled regional reference providers, without claims they deliver there. Newnan has seven providers with recorded coverage; Peachtree City has six. Product class provider totals: 11-yard six, 16-yard seven, 21-yard seven.
- The page hero now uses real Little Junkers photography from /images/jobs/hero-driveway.jpg with a dark accessible overlay.
- Existing outbound second-opinion exit modal remains in place. No actual leads, marketing messages, or analytics writes are triggered by this repair.
- Tests cover eligible product class counts, snapshot hygiene, unique provider selection, regional fallback ranking, and non-price-biased display. Vercel and GitHub Actions builds are release checks.

**Remaining before cutover:** Set up and verify the server-only Vercel Supabase credentials through an authorized account connection, then run a fully authenticated preview API/UI smoke test. The deployment remains protected. This snapshot bridge must not be mistaken for a verified live Supabase connection. No production data/permissions, checkout, DNS, or main merge were changed.
