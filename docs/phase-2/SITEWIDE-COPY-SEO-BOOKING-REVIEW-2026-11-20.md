# Sitewide Human-Prose, SEO and Booking-First Content Review

**Review date:** November 20, 2026
**Branch:** `feature/sitewide-copy-seo-review-20261120` (stacked from draft city PR #9)
**Scope:** Existing non-city marketing pages, three size-page content records, shared customer-facing components, ten migrated blog posts. Draft only. No production pricing, payment, booking, Fleet, database, DNS or Odoo changes.

## Primary editorial sources

- Little Junkers Brand Guide v1.0: locally owned, short, neighborly, confident, no corporate fluff or unverified delivery guarantees. **Historical names and delivery-zone amounts in that guide are stale**; current website-facing owners are **Marcus and Ivy**, with no last names, and pricing must come from the canonical API.
- Human Prose skill, including specific AI-writing patterns: generic uplift, claims that prove themselves, formulaic three-part marketing, decorative conclusions, unreferenced benchmarks, placeholder/instruction leakage, and negative-copy templates.
- Historical public Odoo homepage, FAQ, 11-yard page, materials, About and blog; original content and metadata preserved as evidence, not blindly copied.
- Existing Strategy Archive and Tier 1 SEO page specifications; V2 site router, canonical metadata, sitemap, company data, sizes, FAQ/pricing contract, brand image manifest and blog `legacyPath` map.
- [Existing V2 SEO audit](../phase-2/SEO-AI-SEARCH-CONTENT-AUDIT-2026-11-20.md) and [city preservation audit](../phase-2/CITY-PAGE-PRESERVATION-AUDIT-2026-11-20.md).

## Owner correction during this pass: booking, not estimates

See [ADR-CX-004](../decisions/ADR-CX-004-booking-first-website-2026-11-20.md).
- A customer must ultimately **book and reserve completely online**, from city/ZIP through verified dates and full total to Stripe payment and confirmed reservation, for 3–30-day rentals with eligible inventory.
- Marketing page CTAs say **Book Online**, **Start Online Booking** or **Start Booking**. Price-estimate wording is appropriate **inside** the still-incomplete price/configuration step, not as the end of the experience.
- **This V2 draft still cannot accept payment or issue a confirmed reservation.** The `/plan` page carries a preview-only notice when the site is intentionally noindex; this does not replace the missing real transaction system. User must not be sent into old 2/4/7-day packages as a silent substitute.
- A trustworthy end-to-end booking path requires the approved Days Plus rate and day counting, canonical server quote, full-duration Fleet authorization, secure hold, single customer details entry, embedded Stripe and webhook/finalizer, consent and confirmation. Public booking remains subject to the last-known Fleet suspension until verified reopened.
- This PR does **not** implement the missing transaction contracts and **must not** be treated as checkout activation.

## Pages and copy reviewed

| Surface | Customer intent | Main edits |
| --- | --- | --- |
| Home `/` | Find a dumpster and start online booking | City/ZIP-first local hook, accessible size/price options, concise how-it-works, no generic defensive price claims, booking-first call to action |
| About `/about-us` | Who runs Little Junkers | Restored Pink Bin origin from existing public content; removed visible internal editorial placeholder; first names only; corrected CTA |
| Service Areas `/service-areas` | Check ZIP and delivery fee | Local introduction, area FAQ, correctly anchored ZIP form, direct prices; dynamic zones still canonical |
| Pricing `/pricing` | Compare rental sizes and fees | Practical three-day baseline, conditional overage and delivery charges, clear explanation of longer rentals; no fabricated prepaid extra-day total |
| Three size URLs | Pick 11, 16 or 21 yards | Removed guaranteed driveway fit and one-size-fits-all roof claims; explained volume versus weight; estimate handoff is the start of booking |
| FAQ `/faq` and `lib/faqs.ts` | Find specific answers | Reduced unsupported scheduling promises, removed premature extra-day rate and "paid at checkout" claims; added clear booking steps |
| Materials `/what-can-i-put-in-a-dumpster` | Check allowed/conditional items | Direct headline and practical intro, navigable item list, booking-first CTA; source of allowed items still `lib/materials.ts` |
| Comparison `/compare` | Verify published local offers | Kept verified source/term disclosures, simpler intro and research-to-booking path; no comparator/source logic changed |
| Longer term `/long-term-rental` | 31+ days, custom quote | Short plain instructions, no invented availability; exception to online 3–30-day purchase |
| Blog index and individual articles | Education and search intent | Plain-language headlines/intros, no public migration placeholder, current internal link to start online booking |
| 10 migrated `content/blog/*.md` | Valuable legacy search assets | Removed out-of-date booking-subdomain calls to action, formulaic conclusions, unsupported pricing/permitting/gate/driveway claims and gratuitous claims of expertise. Preserved `legacyPath`, date and article slug. |

## Important content risk reductions

- Old consumer advice suggesting **guaranteed driveway protection**, **no permit needed on all private land**, **certain same-day availability** and **older price ranges** was removed or narrowed to verifiable guidance.
- A cost-guide article previously asserted an October 2026 $335–$675 market range without its underlying sources. Its introduction now teaches how to compare current source-backed offers and links to the independently sourced comparison tool.
- Roofing and heavy debris are no longer automatically matched to the biggest bin; we keep included weight separate from volume.
- The old dump-trailer post listed unverified general capital costs and offered a regulatory verdict; rewritten to focus on documented vehicle/trailer ratings, operating costs and checking Georgia DDS.
- A blog article gave arbitrary structural/electrical project quantities; it now notes permit and professional requirements instead of giving ungrounded building instructions.
- The owner-names-only privacy rule still applies throughout public-facing V2 text.

## SEO / AI-search inventory, not imaginary ranking results

What is preserved: canonical URLs (no slug rewrites), route-specific H1/title/description, internal links between home, sizes, service areas, materials, pricing, FAQ, blog and comparison, local imagery, factual company identity, real material/weight explanations and original blog `legacyPath` redirection map.

This is consistent with useful content principles: answer a real question directly, tie details to visible evidence, let HTML carry crawlable text, and do not add false FAQ/review/price schema just to pursue AI answers. AI search inclusion is **not guaranteed** by a writing style, a schema type, or any single optimization.

**Still unverified:** current Search Console indexed-pages and queries export; rendered metadata/OG/canonical and accessibility on authenticated protected preview; actual current rankings/impressions/clicks; pages omitted from V2 (residential/commercial/contact/etc.); Core Web Vitals and image/network performance; active booking and full-duration Fleet availability.

## Sequence and guardrails

1. Continue owner review of draft **PR #9** (city pages), unchanged by this stacked branch.
2. Review sitewide editorial branch after city review. No premature merge or main deployment authorized.
3. Build missing pages from the preserved Google audit as **the next planned page workstream**, not mixed into this copy-only branch.
4. **Before public cutover**, the full online booking-to-payment flow must function and pass transactional QA. Marketing CTA edits alone are not evidence of that integration.

Public `www.littlejunkersllc.com` remains Odoo. This branch only affects protected Vercel previews.
