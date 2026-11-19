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
