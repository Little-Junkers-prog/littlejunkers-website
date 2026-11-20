# Comparison Market Intelligence — Event Contract and Activation Gates

**Status:** Draft architecture on PR #8. All code in this document is **inactive**. No tracking requests, visitor identifiers, cookies, consent capture, lead creation, competitor outreach, SMS, or analytics writes are authorized by this PR.
**Date:** November 19, 2026
**Sources:** STRATEGY-ARCHIVE §12 and §16, PROJECT-CHARTER, Comparison Tool Nov 19 handoff, Supabase public.comparison_sessions / public.comparison_events / public.funnel_events (read-only schema audit).

## Evidence established directly from the database

- comparison_sessions.id: UUID PK. Fields include location_input, market_city/state/zip, selected_size_yards, lead_id, started_at, last_event_at.
- comparison_events.id: bigint generated identity; session_id UUID FK; event_name TEXT constrained by CHECK; provider_id UUID FK; event_context JSONB; created_at timestamp.
- Allowed event names:
  - comparison_started
  - comparison_location_resolved
  - comparison_size_selected
  - comparison_preview_viewed
  - comparison_unlocked (legacy soft-gate event, not used in the current freely accessible tool)
  - comparison_provider_detail_viewed
  - comparison_provider_outbound_clicked
  - comparison_lj_booking_clicked
- Existing funnel_events is a *different* transaction-domain event stream: session_id TEXT, visitor_id TEXT, hold_id UUID, source, page, event, props, utm, timestamps.
- No public RLS policies for comparison_sessions/events. Never grant browser access to internal tables or run browser-side service role keys.
- No durable comparison-session-to-booking-session join currently established; UUID session_id and funnel_events text session_id are **not** an automatically provable link. No reliable paid attribution or return visitor metric should be claimed yet.

## Events: canonical names and true interpretations

| Trigger | Actual database event | What it proves |
| --- | --- | --- |
| First meaningful compare interaction | comparison_started | A consented visitor started comparing |
| Location resolved by canonical server lookup | comparison_location_resolved | A known city/ZIP was checked |
| Size selection | comparison_size_selected | A size class was considered |
| Eligible results rendered | comparison_preview_viewed | A comparison result set was displayed |
| Customer actively expands company details | comparison_provider_detail_viewed | A company's offer details were intentionally inspected |
| Customer clicks a direct provider HTTPS link | comparison_provider_outbound_clicked | An outbound **click only**; outcome unknown |
| Customer clicks "See my estimate" | comparison_lj_booking_clicked | A Little Junkers CTA click only; not an initiated or paid booking |

Do not silently add event names that violate the existing database CHECK constraint; any future name must receive schema and governance review. Deduplicate comparable semantic events between comparison_events and funnel_events.

## Consent and identity design

- Existing components/ConsentBanner.tsx uses localStorage lj_consent with analytics and marketing booleans and Google Consent Mode. Denial is default.
- Analytics and marketing consent are separate: advertising consent cannot imply analytics consent and vice versa.
- No event beacon, persistence of a comparison-specific visitor identifier or cross-session linkage until analytics consent, a documented notice/retention rule and an approved server ingestion path are all present.
- The review branch contains a **pure validation and classification module** (lib/comparison-measurement.ts) that performs no network/storage operations. It rejects non-consented events and allows only schema-defined event names/size/duration/optional bounded event metadata; it cannot log a paid booking.
- Source of market_city and market_zip must be the server-validated comparison session / canonical ZIP mapping. The intake should **not** trust a browser-supplied free-form city, ZIP or street address as canonical measurement data.
- Do not use fingerprinting, IP address matching, browser fingerprint hints or precise coordinates to identify returning shoppers.
- Future revocation must stop optional storage/beacons and clear any consent-dependent identifier; opt-out must be available through the footer and privacy notice.

## Proposed first-party event ingestion: separate review and approval

1. Server endpoint with **default-deny feature flag** and test environment isolation. Do not enable until approved.
2. Validate analytics consent server-side as far as possible (client state alone is not proof), with documented legal controls and a way to revoke.
3. Allowlist event names and bounded properties; verify provider ID against active/public canonical providers. Resolve city/ZIP server-side, not from uncontrolled client strings.
4. Use opaque server-owned session IDs and an idempotent event identifier; define retention and deletion. Existing comparison_events does not have a unique event_id column, so idempotency requires a reviewed implementation.
5. Rate-limit / detect automated abuse and bot traffic with production-grade controls before any privileged insert; retain minimal logs, no sensitive query params.
6. Append comparison_sessions / comparison_events using a privileged server client, never directly from the browser. Insert only after schema constraints and independent integration tests pass.
7. Test both consent-off and consent-on, revocation, double-clicks, refresh, long sessions, and multiple tabs. Ensure preview analytics cannot pollute customer-facing production reporting.

### Direct outgoing links are independent of telemetry

Link to provider.website_url (canonical vetted provider destination) with HTTPS, target=_blank and rel=noopener noreferrer. Later event delivery must be best-effort and must not block navigation. No tracking redirect or open redirect is needed.

## Return, booking and unknown-outcome classification

Use the pure classifyComparisonOutcome helper as a proposed interpretation rule:

- **verified_lj_paid**: verified paid rental **and** proven linkage to the comparison journey from an explicit accepted identifier/hold reference. The server payment/finalizer is authoritative, not a browser success event.
- **competitor_self_reported**: customer voluntarily reports choosing a competitor; labeled self-reported, not verified competing transaction.
- **returned_considering**: genuine cross-session return supported by appropriately consented, non-fingerprinted correlation.
- **competitor_outbound_unknown**: competitor website clicked, with no supported outcome evidence.
- **unknown**: none of the above proven. Unknown never means a competitor win.

Outcome classification is deterministic but the inputs must be derived from defensible evidence. Contradictory or overlapping outcomes should be reviewed before executive reporting.

## Admin-only dashboard candidate measures (not implemented)

Daily and weekly: comparison starts, completed previews, source-labeled eligible companies, specific card interactions, outbound clicks, consented return rate, LJ CTA starts, verified paid rentals and attributed revenue, voluntary competitor choices and unknown outcomes. Split by server-resolved city/ZIP, size class and days. Monitor source freshness, broken provider links, incomplete coverage and stale offers separately from demand.

## Required owner decisions before activation

1. Approve analytics purpose/notice, retention window, and whether to persist a returning-visitor pseudonym.
2. Approve scope and messaging of optional *separate* email/quote lead capture. Never require identity to see competitor information; marketing opt-in must be explicit and optional.
3. Decide if checkout will accept an opt-in comparison reference and store it securely with the hold/rental; do not embed unvalidated provider IDs in transaction fields.
4. Approve event-ingestion anti-abuse and deduplication design, plus an Admin dashboard owner and policy for resolving discrepancies.
5. Verify preview access and server-only Supabase environment before testing the eventual event intake.

**Explicit boundary:** PR #8 implements comparison experience, evidence checks, and an inert measurement validator. It does not create, track or send real visitor events. No production data writes in this pass.
