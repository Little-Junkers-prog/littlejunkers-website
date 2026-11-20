# Comparison Exit Journey — Owner Direction, November 19, 2026

**Status:** PR #8 review-branch implementation. Neither customer contact records nor marketing messages are activated.

## Business goal

Customers researching dumpster rentals are often uncertain about size, disposal weight, duration, pricing, and availability. An outbound click signals interest, not a verified competitor booking. Provide value before departure and invite voluntary contact details without concealing the direct link to the vetted provider.

## Stage 1 — implemented on PR #8

- Normal competitor-website and published-offer clicks open a native accessible exit dialog.
- The heading is "Before you go — Want a second opinion?" It explains why published prices can differ.
- Interest selector options: price; weight/disposal; rental duration; dumpster size; availability/service area; still figuring it out. The answer and first name are optional.
- Primary CTA "Ask us by text" opens a user-composed SMS draft to the existing Little Junkers Twilio line. The draft includes provider name, selected size and duration, only validated service city/ZIP, and any chosen first name or reason.
- Optional "Prefer email?" uses a prefilled email draft. No messages are sent automatically; no phone or name is stored unless the customer chooses to send.
- Clearly available "Continue to [provider]" opens the exact original HTTPS destination in a new tab. Source offer links follow the same path. Modifier clicks and no-JS navigation retain ordinary link semantics.
- Native dialog provides Escape, focus trapping and keyboard return; responsive styles use the Brand Guide tokens.
- No analytics beacons, visitor fingerprinting, new lead records, automatic messages or production data writes were introduced.

## Stage 2 — true inline callback capture, not enabled

The owner suggested ZIP + phone as a minimal lead. The current production harmonized public-inquiry contract requires **name, 10-digit phone, five-digit ZIP, message of at least 10 characters, server-verified Turnstile and anti-abuse controls**. It creates canonical customer_inquiries and typed contact details, with contact conflict resolution. Existing booking-repo endpoint api/public-inquiry.js supports contact and bulk_pickup, and currently accepts only the production Little Junkers hostnames. It cannot be called directly from Vercel preview.

When authorized, integrate a concise "Prefer a callback?" extension to the existing canonical server-side public-inquiry boundary rather than making a new comparison lead master. Require a positive service-specific contact request and a separate unchecked marketing checkbox. Never infer marketing consent from filling a phone field or from competitor outbound clicks. Do not claim lead capture until the canonical server confirms it. Approved rate limiting, Turnstile, origin/hostname restrictions, privacy disclosure, and contact-staff follow-through must precede activation.

## Measurement still gated

Future report: eligible comparison views, competitor click attempts, consented exit dialogs, volunteered interest factors, inbound texts/emails, verified inquiries, verified paid Little Junkers rentals, self-reported competitor bookings, and unknown outcomes. An outbound click alone is never evidence the competitor won.

## Explicit boundaries

Draft PR #8 only. No production site merge, DNS, payment, public CRM writes, active marketing messages or analytics tracking. Owner must review copy and approve backend/consent release details before the future callback form is enabled.
