# Comparison Intelligence Capture — Implementation and Release Handoff

**Date:** November 19, 2026
**Branch:** feature/comparison-tool-review-20261119 (draft PR #8)
**Status:** Database contracts installed and transaction-tested; V2 review code built; runtime write activation not yet confirmed.
**Scope:** Only the interactive competitor comparison tool. No merge, promotional messaging, payment or DNS changes.

## Objective

When a visitor selects one of the vetted competitors:
1. Count **initial interest** in that company when the visit link opens the exit offer.
2. Independently count the **actual outbound** visit when the visitor continues to the external website.
3. Allow the visitor to continue without giving contact information.
4. Offer a **voluntary callback request**, which creates a canonical contact/inquiry and an operational action item.
5. Enable competitor-level six-month analysis without inventing lost-booking outcomes or persistent visitor identities.

## Database changes — already applied via authorized Supabase SQL

No new customer master or competitor source-of-truth was introduced.

- Existing public.comparison_sessions and public.comparison_events are reused.
- **record_comparison_provider_action(provider UUID, size, days, action)** is a SECURITY INVOKER RPC restricted to service_role. Action is detail or outbound; event names map to the existing allowed comparison_provider_detail_viewed and comparison_provider_outbound_clicked. The RPC checks active, public vetted providers and inserts one anonymous one-event session per click.
- There is no stored browser or visitor ID, phone, name, user agent, IP, click destination, cookie or fingerprint in the comparison event. **Counts measure click actions, not unique humans**. No tracked user-to-booking correlation is implied.
- New public.comparison_inquiry_details is a *typed* one-to-one extension of the existing canonical customer_inquiries record, with provider_id, size, duration and optional reason. RLS enabled; no direct public access.
- **create_comparison_inquiry** RPC (service_role only) validates context, calls the existing create_public_inquiry canonical contact matcher, saves typed comparison details in the same database transaction, and returns the canonical inquiry ID. The canonical function also inserts the existing business_action_items follow-up.
- Internal service-role-only views:
  - **public.comparison_competitor_click_daily**: date, provider ID/name, size, duration, interest_clicks, outbound_clicks.
  - **public.comparison_callback_followups**: inquiry ID, submitted date/status, contact details, provider, size/days and reason.
- Full DDL audit/replay script: scripts/sql/comparison-intelligence-contract.sql. Applied code remains in Supabase, not served from the browser.

### Verification completed

Executed under SET LOCAL ROLE service_role and rolled back one test interest click, one outbound click and one test inquiry, verifying 1/1/1 inside transaction. After ROLLBACK: zero comparison_events, zero comparison_sessions and zero comparison_inquiry_details remain. Public anon cannot execute either RPC or read the internal callback view; service_role can. The Supabase security advisor reports RLS enabled without a public policy for these private tables, as intended. No fake lead/traffic remained.

## Website review-branch code

- POST /api/comparison/click: same-origin JSON request, validates provider UUID / size / days / action, uses server-side key and the restricted RPC. Non-blocking fire-and-forget from an actual user click; the navigation still succeeds if measurement cannot.
- First click opens voluntary exit dialog and records **interest**; clicking Continue records **outbound**. Modified or middle-click navigation records outbound without showing the dialog. One click is not a competitor win.
- POST /api/comparison/inquiry: same-origin POST with server-only key, validates explicit callback request, name, 10-digit phone, ZIP, provider, size, days, optional email/reason, form timing, honeypot and a server-verified Cloudflare Turnstile token with hostname match.
- Supabase canonical inquiry via new wrapper preserves existing identity matching, submitted snapshots and the action-item workflow. No SMS or marketing campaign is sent on submission. Form says contact is limited to the requested comparison service.
- Exit modal retains user-initiated SMS/email draft and clear Continue option. A short expandable "Prefer a callback?" form lets visitors intentionally submit their details. It shows success **only after** canonical inquiry creation returns an inquiry ID.
- Privacy Policy updated to disclose anonymous click counting and separately submitted callback information.
- New regression checks cover click payloads, invalid provider IDs, callback opt-in, phone/ZIP, bot timing, honeypot, no PII in click requests, and exit-flow separation.

## Reporting SQL

Run in the internal Supabase SQL editor or later surface through the authenticated Admin OS:

```sql
SELECT provider_name,
       sum(interest_clicks) AS company_interest_clicks,
       sum(outbound_clicks) AS actual_outbound_clicks
FROM public.comparison_competitor_click_daily
WHERE click_date >= current_date - interval '180 days'
GROUP BY provider_name
ORDER BY actual_outbound_clicks DESC;
```

```sql
SELECT submitted_at, compared_provider, selected_size_yards, rental_days,
       interest_reason, status, name_snapshot, phone_normalized, zip_code
FROM public.comparison_callback_followups
ORDER BY submitted_at DESC
LIMIT 50;
```

The Admin app's existing inquiry queue reads customer_inquiries and contact_request_details; the stored source_page ("Website V2 Comparison Exit") and detailed service message make the request recognizable there. The typed comparison view provides the analytical breakdown. This does not add a new Admin dashboard UI or change any other repo.

## Deployment prerequisites — not yet satisfied or independently verified

The Vercel project environment API returns 403 Forbidden, so server-only credentials cannot be listed/changed via this tool connection. These **must** be provided through authorized Vercel configuration (never committed or pasted into public GitHub):
- SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL for the URL alone).
- SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY — **server only**, never NEXT_PUBLIC.
- TURNSTILE_SECRET_KEY (or CLOUDFLARE_TURNSTILE_SECRET_KEY) — **server only**.
- NEXT_PUBLIC_TURNSTILE_SITE_KEY — public widget key. Cloudflare must authorize the specific protected preview hostname for a valid challenge.

No runtime write call should be described as live until those variables are present, the protected preview is authenticated and tests confirm:
1. Initial competitor selection increments interest count by 1.
2. Continue-to-provider increments outbound count by 1, without requiring name or phone.
3. A real Turnstile-verified test callback yields exactly one canonical inquiry, one typed detail, and a follow-up action item.
4. Invalid/bot/unsolicited requests fail without creating a contact or marketing consent.
5. Source dates, competitors and no-JS/modified click semantics remain correct.
6. Preview test records are removed or clearly labeled so production intelligence is not polluted.

Do **not** merge PR #8 until the owner reviews the results. The production Odoo www domain remains separate.

## Operational limitations / future governance

- Raw anonymous click rows have no identifier linking one visit to another and cannot prove unique customers, competitor bookings or Little Junkers conversions.
- Network blockers/ad blockers, skipped JavaScript, and rate-limiting / bots may distort raw counts. Before publication of management dashboards, establish bot filtering, review cadence, an agreed retention period (proposal: 13 months for six-month trends) and identity/consent rules for any richer analytics.
- No marketing opt-in is inferred from callback submission. Verified paid bookings require the booking application's payment finalizer and separately proven attribution.
