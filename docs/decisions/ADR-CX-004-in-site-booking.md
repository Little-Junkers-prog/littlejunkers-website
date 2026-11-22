# ADR-CX-004 — Booking Happens Inside the Website; the Separate Funnel Retires

**Status:** OWNER APPROVED — November 22, 2026
**Owner:** Marcus Griffin
**Builds on:** D-007 (booking rebuilt inside v2), ADR-CX-001 (Days Plus), ADR-CX-002 (shopping hub), ADR-CX-003 (progressive estimates)
**Supersedes:** D-007's interim plan to keep `book.littlejunkersllc.com` as a fallback that v2 pages link to; any v2 CTA that hands customers to the booking app.

## Context
The website is meant to be an experience, not a brochure in front of a separate checkout. Sending customers from the site to `book.littlejunkersllc.com` changes the look partway through and adds screens between "I want this" and "I paid". On November 22 the v2 preview still had five buttons (About, FAQ, Materials, Blog index, blog posts) that linked to the old funnel, while the header and planner stayed in the site.

## Decision
1. **Every booking call to action stays inside the website.** "Book", "Start Booking", "Rent a Dumpster", "Book now" and similar buttons go to one dedicated in-site booking destination, or open an in-site modal that completes the booking. They never link to the booking app.
2. **One booking destination.** Today that is `/plan`. Whether it becomes `/book` or a modal is a design choice for the booking-flow plan; either way, all entry points (home, size, city, pricing, compare, Randy, FAQ, blog) feed the same flow with known context (size, city/ZIP, days, date, language, attribution) carried in.
3. **The booking app's customer funnel retires.** Once in-site checkout is live and verified, the funnel pages at `book.littlejunkersllc.com/rent-a-dumpster` and `/complete-booking` are retired and their URLs redirect into the website.
4. **Server contracts are reused, not copied** (charter guardrail, D-007). Pricing, ZIP/zone, Fleet availability, holds, Stripe payment intent/finalizer/webhook, promotions, consent and inquiry stay the transaction authority behind the new UI. Moving that server code is a separate decision, not part of this one.
5. **Supabase is the source of truth for all pricing.** Days Plus rates come from Supabase through the canonical pricing contract. Supabase still holds the 3/5/7-day tier structure; Marcus will restructure it for Days Plus in a separate admin-app PR. The website reads the approved contract when it exists (`lib/pricing.ts`, `daysPlusContract`) and never types in or infers a rate.

## Consequences
- **In-site checkout is now a v2 launch gate.** Because v2 pages no longer fall back to the funnel, the site can't go public until the in-site flow takes real, Fleet-verified, paid bookings through the existing contracts.
- **Still pointing at the funnel (to fix in their own work):** links inside the 10 migrated blog posts (separate blog PR), booking links Randy sends by text (booking app), and the live Odoo site until cutover.
- **Guardrail:** `npm run check:content` fails if page or component code links a CTA to `bookingUrl(` or `book.littlejunkersllc.com/rent-a-dumpster`. Blog Markdown is checked once the blog PR lands.

## Implemented in this change
- About, FAQ, Materials, Blog index and blog post CTAs now go to `/plan`.
- Removed the unused `bookingUrl()` and `BookLink` helpers; `bookingOrigin` stays only for server API calls (pricing, Randy).

## References
- [PROJECT-CHARTER.md](../../PROJECT-CHARTER.md) §11
- [STRATEGY-ARCHIVE.md](../../STRATEGY-ARCHIVE.md) §29
- [DESIGN.md](../../DESIGN.md) principle 5
