# Handoff: Booking checkout, conversion and recommendation logic

**Date:** Nov 27, 2026
**Branch / PR:** `design/booking-flow-review-rev3`, PR #14 (open, design review only, no booking code)
**Next conversation picks up:** (1) checkout design for conversion, (2) the logic behind the weight and extra-days recommendations, grounded in research and our own data.

## Read these first

1. [`docs/design/BOOKING-FLOW-DESIGN-SPEC.md`](../design/BOOKING-FLOW-DESIGN-SPEC.md), rev 5. Locked items L1–L18, build needs, open items.
2. Clickable preview: https://claude.ai/artifact/Qf1YZuYMYtZvsdyHKEgZeR (source in `docs/design/booking-flow-preview/Main.dc.html`). Before editing, check the artifact's files against the repo copy in case Marcus changed something.
3. [`BOOKING-FLOW-PLAN-2026-11-22.md`](BOOKING-FLOW-PLAN-2026-11-22.md) and [ADR-CX-004](../decisions/ADR-CX-004-in-site-booking.md) (booking lives in the site).
4. `AGENTS.md`, `PROJECT-CHARTER.md`, `STRATEGY-ARCHIVE.md` as always.

## Where things stand

The flow is home → size → dates → extras → your info → review and pay → confirmed, all on `littlejunkersllc.com/book/*`. Five review rounds so far (Nov 22–25). Key locks:

- Phone bottom bar with running total (L3); desktop summary pinned (L2).
- Days first, then drop-off date; typed or stepped day count (L6, L7).
- Compact date field with a calendar on demand, 90 days out, closed days just gray with no reason given (L8).
- Availability comes only from the admin app's engine, open 7 days (L16). The website never computes it.
- Early drop-off (limited morning slots, L5) and same-day drop-off (premium, L17), both [PRICE].
- Extras: mattresses / tires / appliances, then extra weight with a suggestion drawn from the job they already picked. No new questions (L9, L15).
- Roofing moves to a contractor flow, linked from residential (L14). Contractor flow is the next preview after residential is settled.
- Review is one photo card with Edit on every row (L11). One-line header with tappable steps (L12).
- Exit dialog with optional reasons; its × fades in after 1 second and goes home (L13).
- Returning customers pick up where they left off, if they accepted cookies (L18).

## Marcus's direction for the next session (Nov 27)

> "I want to pick up on talking about the checkout flow, making sure that we are designing it for conversion. And I want to make sure that our logic around things that trigger the heavy recommendation or the additional time recommendation are kind of based in logic. What I would expect is for the new discussion to do a search, not just rely on my memory. Let's do some research."

Constraint from the Nov 25 round: every gate between the customer and Pay costs bookings. The old funnel lost people and nobody knew where. Helpful beats thorough; no new form steps just to sell an upsell.

## Agenda

### 1. Checkout for conversion (research, then critique the preview)

Research questions:
- What makes checkout abandon? Current published research on checkout usability, form fields, guest checkout, express pay, trust signals, progress indicators, price surprises at the last step. Start with Baymard Institute's checkout research and Nielsen Norman Group; cite what's found.
- Booking-style checkouts (rentals, home services) vs. retail: what changes when a date and an address are part of the order?
- Upsell placement: before payment vs. after (post-purchase add-ons), and the effect on completion rate.
- Exit-intent and save-your-cart patterns: what works without feeling pushy.
- How 3–5 local and national dumpster sites run their online checkout (step count, what's asked, when price is shown). Facts only from their live pages, never invented.

Then score the rev 5 preview against what was found: step count, fields asked, where total cost first appears, every place a customer could stall. Propose cuts. Candidates to test:
- Merge "Your info" into the review step.
- Ask for the address earlier (it's needed for delivery fee and serviceability anyway).
- Put express pay (Apple Pay / Google Pay) above the card form.

### 2. Recommendation logic that holds up

**Extra weight (heavy).** The preview's rules are placeholders marked [ASSUMPTION] in spec section 5:
- kitchen/bath remodel → +1 ton
- shed or deck tear-out → +1 ton
- 2+ appliances → +1 ton

Replace them with rules backed by evidence:
- **Our own data first.** In Supabase (`fobkdakjawryhzkcdbbo`, read-only), find how often rentals went over included tons, by size and by project type if it's recorded, and the typical overage. Check what landfill weight data exists (tickets, `weight_overage_disposal` charges). That's the strongest basis there is.
- **Published weight references.** Look for material weight-per-cubic-yard tables (e.g. EPA volume-to-weight conversion factors) and dumpster industry weight guides for common residential debris: drywall, tile, plaster, lumber, furniture, sofa beds, appliances, carpet. Use them to estimate when a job in each size likely passes 1 / 1.5 / 2 tons.
- Output: a small rule table (job + item counts → suggested tons) with the source for each row, ready for the admin-editable table in spec section 5.

**Extra days (additional time).** This is new, and nothing recommends extra days yet. Research:
- How long typical residential jobs keep a dumpster (remodel, cleanout, estate, shed/deck), from our own rental history first: actual lengths vs. booked, early pickups, extensions.
- Whether suggesting a longer rental up front beats selling extensions later, for the customer and for Fleet availability. Longer holds block units. Weigh this against the L16 engine.
- Where a days suggestion would show (the "How long do you need it?" step) without adding a question.

**Rules for this work.**
- Never present a guess as fact. Mark anything unverified [ASSUMPTION] with the data that would confirm it.
- Recommendations are suggested, never pre-selected.
- Every number shown to customers comes from Supabase.

### 3. Then update the preview and spec

Same routine as every round: update the preview, the spec (locked items, build needs, revision history), push to PR #14, copy the spec to the project. Merge only when Marcus says so.

## Still open (carry forward)

- Prices: early drop-off fee and time, same-day fee and cutoff, Days Plus extra-day rate (Marcus's admin-app pricing PR).
- Draft expiry (14 days is a placeholder); whether the site has a cookie banner with a preferences category.
- Heavy items Marcus may not accept, which is why the copy leaves them out: wet carpet and pad, cast-iron tubs, pavers or rock, pianos, bulk books or paper. He needs to confirm which are accepted.
- Roofing package idea (11-yard up to 20 squares for about $500). Test it against past roofing tonnage before deciding.
- Plan decisions not yet answered:
  - `/book` vs `/plan`
  - page vs modal
  - lead capture when no dates are open
  - Supabase branch + Stripe test mode
  - build now vs wait for Days Plus
- Spanish booking screens; recommended badge on home size cards; leave-reason wording.

## Useful facts already established

- Funnel, Oct 23 – Nov 22: 24 reached the date step, 13 picked a date, 5 paid. From Nov 9: 26 reached the date step and 0 picked a date, because only one dumpster was available. Source: `funnel_events`.
- Live prices (`get-pricing`, Nov 22): 3-day $325 / $375 / $425; included 1 / 1.5 / 2 tons; prepaid weight $79/ton; overage $99/ton; mattress $35, tire $35, appliance $45; delivery zones Free / $59 / $99.
- Ticket target about $400.
