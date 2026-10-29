# Post-checkout confirmation — V2 design concept

Status: **feature branch, review only**. Not wired to payment or live booking. No change to Stripe, holds, rental finalization, analytics or confirmation delivery.

Route: /post-checkout-preview (NOINDEX, visibly labelled DESIGN PREVIEW).

Source inspiration: uploaded Rolling Operations post-checkout example. The Little Junkers version intentionally uses original pink-bin artwork, approved color variables and copy, not competitor artwork or copy.

## Content and structure

- Explicit confirmed-booking headline, compact original pink dumpster illustration.
- Three prominent reminders: materials, fill height/weight, and access.
- What happens next: confirmation message, delivery timing, on-the-way update.
- Compact, optional server-derived rental summary and official phone 470-548-4733.
- Mobile-friendly stacking; reminder cards are actual HTML, not inaccessible text embedded in an image.
- Do not show or infer customer names, addresses, payment, prices or booking identifiers in demo.
- The materials card is a short reminder, not an exhaustive list. The live materials policy must remain authoritative.

## Integration gate (separate booking app scope)

Actual paid checkout currently lives in Little-Junkers-prog/littlejunkers-messenger-bot. This website preview is *not* wired into that application's post-payment flow. Do not change that project while its checkout remediation is in progress.

When approved:
1. Confirm the verified paid/finalized booking record and whether booking confirmation belongs in the booking app or V2 unified host. Prefer reusing this presentation with the booking app's canonical state, not redirecting merely on a Stripe return URL.
2. Display booking data only after server-side verification and authorization; never trust URL parameters to claim payment success.
3. Confirm updated materials restrictions against current operations policy and implement final copy review.
4. Ensure actual transactional email/SMS status is reflected accurately. Do not claim email/SMS was sent until confirmed. Avoid exposing booking/customer PII in analytics.
5. Keep any existing post-checkout attribution question downstream of the practical reminder/recap; do not reintroduce removed NPS/project-type survey.
6. Add English/Spanish variants to match approved V2 language coverage, capture mobile/desktop screenshots, run full build and booking regression checks on a test environment.
7. Owner approval is required before production merge or changing live success routes.

No approval or production merge implied by this concept PR.
