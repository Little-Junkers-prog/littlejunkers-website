# City-page preservation and build audit — November 20, 2026

**Scope:** V2 city/service-area SEO pages only. **Review branch:** `feature/city-pages-preserve-seo-20261120`. No merge, DNS cutover, production booking, pricing, or database writes are included.

## Source hierarchy and what was actually found

The repository does **not** contain a separately named Google Page Audit or a raw Google Search Console pages CSV. Its historical Search Console analysis is summarized in:
- [Tier 1 Page Specifications](../TIER-1-PAGE-SPECS.md), **§2** page preservation matrix and **§9A–§14** city-page contract;
- [Strategy Archive](../../STRATEGY-ARCHIVE.md), **§4.2**, **§19.6–§19.8**, and **§24**;
- the current V2 source `lib/cities.ts`, `app/[slug]/page.tsx`, `app/sitemap.ts`, and `next.config.ts`.

Those documents are the **preservation decision record**, but they are **not a fresh Search Console export**. They establish the URL decisions below; they do not prove today's Google index state, current clicks or backlink counts. Do not invent those metrics.

## Preserve these seven existing root-level city URLs

| City | Canonical V2 URL (path) | Prior preservation authority | Verified active service ZIPs (Nov 20) | Local proof |
| --- | --- | --- | --- | --- |
| Newnan | `/dumpster-rental-newnan-little-junkers` | Tier 1 #8 **Keep + rebuild / INDEX**; strongest named local GSC signal (spec §10) | 30263, 30265 (Zone A) | First-party 11- and 16-yard photos; returned rentals of 11/16/21 |
| Sharpsburg | `/dumpster-rental-sharpsburg-little-junkers` | Tier 1 #9 **Keep + rebuild / INDEX**; meaningful existing clicks (spec §11) | 30277 (Zone A) | Returned rentals of 11/16/21; **no verified Sharpsburg photo in repository** |
| Senoia | `/dumpster-rental-senoia-little-junkers` | Tier 1 #10 **Keep + rebuild / INDEX**; meaningful query visibility (spec §12) | 30276 (Zone A) | First-party level-loaded 11-yard photo; returned rentals of 11/16/21 |
| Peachtree City | `/dumpster-rental-peachtree-city-little-junkers` | Tier 1 #11 **Keep + rebuild / INDEX**; home-market impressions (spec §13) | 30269 (Zone A) | First-party 21-yard local photo; returned rentals of 11/16/21 |
| Fayetteville | `/dumpster-rental-fayetteville-little-junkers` | Tier 1 #12 **Keep + rebuild / INDEX** (spec §14) | 30214, 30215 (Zone A) | First-party 11/16/21 photos; returned rentals of 11/16/21 |
| Tyrone | `/dumpster-rental-tyrone-little-junkers` | Strategy Archive §19.6–19.8 priority city list; not separately in Tier 1 matrix | 30290 (Zone A) | First-party 11-yard Tyrone photo. A returned-rental count was **not** established by address match; avoid invented size history. |
| Fairburn | `/dumpster-rental-fairburn-little-junkers` | Strategy Archive §19.6–19.8 priority city list; not separately in Tier 1 matrix | 30213 (Zone A) | First-party 21-yard photo; returned rentals of 11/21 |

**Active ZIP/zone source:** read-only `public.zip_codes` (Nov 20, 2026). ZIPs/fees on rendered pages continue to come **dynamically** from the canonical `/api/get-pricing` contract, not from this audit. City names in ZIP records have forms including `Newnan area`, `Sharpsburg, GA` and `Peachtree City area`; `cityKey()` normalizes them.

**Proof source:** read-only aggregate `public.rentals` where `status='returned'`, grouped by city tokens found in `delivery_address` and `size_yards`, combined with first-party photo filenames and existing `lib/media.ts` captions. Aggregates exclude personal identity but address-string matching can miss records and should **not** be interpreted as all historical bookings. Photo filenames establish city/size only, not a customer name or project type.

## What the V2 build preserves and improves

- All seven canonical paths remain **unchanged** and are generated from `cities` by `app/[slug]/page.tsx`, with canonical metadata and `app/sitemap.ts` entries.
- The approved Newnan visual grammar stays: city hero, canonical ZIP/fee evidence, three size/pricing cards, first-party proof, practical placement information, FAQ, nearby page links and persistent Randy bubble.
- Unique copy explains documented city proof, access concerns and local use cases. No city-history filler, unsubstantiated reviews, invented neighborhoods, or guaranteed availability.
- The unapproved `{ needed: ... }` photo slots were removed from city content. Sharpsburg uses actual Little Junkers equipment photography **clearly labeled nonlocal**, plus completed rental history as local proof.
- `PlanLink` and `PriceCards` now preserve the selected city for multi-ZIP markets (e.g. Newnan and Fayetteville) instead of silently substituting a previously saved browser location or choosing a random ZIP.
- Page-level Service structured data points to the existing LocalBusiness `@id` and is emitted only when canonical active service ZIPs are available. No unsupported address, star rating, offer or FAQ rich-result guarantee.
- The materials teaser links to the existing material checker. All price and service facts still derive from the canonical API.
- The existing public-owner privacy rule remains in effect: **Marcus and Ivy**, no surname anywhere on customer-facing site text or metadata.

## Critical pre-cutover validation still needed

1. Obtain the actual Google Search Console Pages/Search Results export for the public Odoo site and verify these seven exact indexed URLs, any old route variants, impressions/clicks and external link targets. **No raw export was found in this repository.**
2. Check production Odoo page URLs and backlinks before publishing any old-to-new 301 rules. Do not redirect valuable exact slugs merely to improve URL aesthetics.
3. Sharpsburg: replace the disclosed general-equipment hero with a verified first-party Sharpsburg job image when one is available; do not label a Newnan image as Sharpsburg.
4. Manually review responsive page renders and live city/ZIP/fee details after the preview build, including the city-to-planner location handoff.
5. Verify current fleet booking availability before enabling actual booking promises and keep `SITE_INDEXABLE`/DNS unchanged until the complete cutover gate.

## Outside this workstream

The Tier 1 matrix separately requires preservation/rebuilding of the **Service Areas hub**, three size pages, homepage, residential, commercial/contractor, materials, FAQ, About, Contact and other assets. This PR changes only the **seven** charter-named city pages and their shared navigation/estimate/test contracts. It does not create unsupported city doorway pages (for example Union City only because it is in Zone A).
