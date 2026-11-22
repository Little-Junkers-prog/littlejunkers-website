# Little Junkers V2 — Peer Site UX Pattern Review
**Date:** November 20, 2026
**Related PR:** #10 / experience-design-first-pass
**Method:** Reviewed current public site content, navigable product catalogs and visible brand/typography metadata; evaluated the user's Nov 20 Peachtree City Maps screenshots. Firecrawl captured competitor screenshots, but the remote visual-browser sessions timed out and the screenshots were not viewable in this review. **Do not represent this as a pixel-level or conversion-rate audit.** No competitor purchase was made, no form submitted, no analytics accessed.

## Decision

Study useful *interaction patterns and service explanations*, not source code, design assets, phrases or proprietary branding. We can make the Little Junkers experience more enjoyable by being **visually distinctive AND unusually easy to compare, understand and book**.

| Competitor | Verified published element | We should borrow | Avoid |
| --- | --- | --- | --- |
| **Moreira's Service** — https://www.moreirasservice.com/dumpster-rental-peachtree-city-ga/ | Location landing page has a rental catalog with product images, dimensions, duration, included tonnage, additional-day rates, price and Add to Cart | Keep selectable containers close to real terms and booking; combine product details and action in one clear visual unit | Do not copy extensive generic local-landmarks SEO filler, source styles or text; don't inherit their 10-day packages |
| **EZ Disposal** — https://ezdisposalrolloffs.com/ | 15/20/30-yard products present specific 3/7/14-day prices, included weight, extra-day and extra-weight terms, plus Book Now | Make rental length, included weight and location fee legible during the decision, not buried in legal copy | Avoid repeated promotional headings or showing a price that lacks the customer's required delivery fees |
| **Bin There Dump That** — https://www.bintheredumpthat.com/atlanta-dumpster-rentals/service-areas/peachtree-city/ | Size choice explains dimensions, projects, and residential concerns; clearly positions driveway care and easy loading as differentiators | Show real Little Junkers bin in a real driveway with footprint and hook-lift access explanation, supported by first-party photos; demonstrate what different sizes actually mean | Do not inherit their specific 100% driveway-protection, walk-in door, cleanup or same-day claims without corresponding verified Little Junkers practices |
| **Haul Away** — https://www.haulawayrolloffs.com/ | Product catalog has distinct 3- and 7-day products, tonnage, extra-day rates and price with cart actions | Keep terms near the price and offer an obvious click path toward booking; plain-language size examples | Our 3–30-day Days Plus plan should avoid their many nearly duplicate size/duration product entries |
| **Dumpsters4Less** — https://www.dumpsters4les.com/ | Product offer emphasizes up-front flat-fee wording and clear 3/5/7-day rental products with rates/weight terms | Replace vague “transparent pricing” promises with a legible line-item price summary before payment | “Flat fee/no surprises” is misleading unless all conditional fees and delivery/overage are described honestly |
| **Frank's Roll Off** — https://www.franksrolloffdumpsters.com/ | Customer testimonials and local-service narrative prominently visible | Lead with authentic, consent-safe customer feedback and service proof, with source attribution | Avoid generic claims of reliability without operational proof |

## What the provided Google local-results screenshots support

Screenshot sequence: search `dumpster rental peachtree city` on November 20. A **sponsored** section appears at the top with Moreira's and Dumpsters4Less. Below that, an unpaid Maps-style local business list is scrolled. Little Junkers is **visible with 5.0 rating and 36 reviews in that capture**; some competitors appear earlier and have substantially more reviews. The screenshot is **not** a fixed local rank, an SEO leaderboard or a PPC campaign report. Query terms, location, device, ads and map position can change ordering. Do not use the counts as durable marketing copy unless a properly sourced, refreshed integration is approved.

A separate local visibility/GBP task should check profile category, primary website URL, booking link and business hours for accuracy; do not change Google Business Profile under this PR. The screenshot says Little Junkers is “Open 24 hours,” which **might reflect online booking rather than staffed phone hours** and should be separately verified.

## Recommended UX changes to evaluate after the PR #10 visual prototype

1. **Bring service proof closer to the top of the homepage** without delaying city/ZIP entry: one real-job photo and an attributed review link (not invented review totals). Use current data and owner-approved attribution.
2. **Make the three Pink Bin cards feel like a choice, not a static price list.** Retain a large first-party container photo, size/footprint, concise typical use, canonical price + rental days + included weight, any delivery fee, and one prominent Start Booking action.
3. **Make duration changes intuitive.** In the shared Days Plus journey, selecting 3–30 days should update the available price breakdown immediately **only when the canonical rate contract is implemented**, without sending shoppers through separate duplicate size/duration catalog pages.
4. **Explain why residential customers choose the Pink Bins.** One illustrated section with actual Little Junkers truck and bin, realistic truck access/driveway placement constraints and included loading rules. Verify operating claims; no blanket “driveway-safe” guarantee.
5. **Use interaction for useful feedback.** Responsive hover/focus on product choice; a short progress indicator once the booking app is integrated; animated delivery/pickup sequence only if it does not delay page content or compromise keyboard/reduced-motion behavior.
6. **Show real social proof, not badges of superiority.** Google reviews, job photography and accurate service ZIPs, with attribution and consent. The comparison tool remains a separate dedicated research path.

## Design / SEO guardrails

- Preserve clean, text-first seven city intros, canonicals, existing URL mapping and current Search Console preservation work; avoid city-name-swapped generic copy.
- Preserve accessible headings, crawlable price and factual service content, image alt text, source dates and contact/booking paths.
- Don't copy competitors' logos, photography, creative layouts, wording or source code. Borrow principles, not expression.
- Don't change Stripe, Fleet, Supabase, rates, consent, checkout, redirects, Google Business Profile or production DNS without a separate approval.
- PR #10 remains a **draft**. The sitewide editorial/booking-first branch is separate and not automatically included.
- Actual booking completion (availability → full quote → hold → Stripe → webhook confirmation) is still required for launch, regardless of how enjoyable the front end looks.

## Confidence
**High** on described public page content, catalog fields, CTAs and screenshot labels; **not established** on pixels, mobile crop/scroll behavior, conversion rates, checkout completion rates, real Google rank or site speed.
