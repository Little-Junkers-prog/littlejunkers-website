# Project Parking Lot

Sprint 1 is complete. The following items are intentionally parked for future sprints so we can keep technical debt and pending work visible across chat sessions.

## Parked Items

- **Media Integration:** Upload final photography to the Supabase marketing-media bucket and replace all placeholder images.
- **Global Company Data:** Create a Supabase table for global company information (EIN, phone, service addresses) to dynamically feed the footer and contact sections.
- **Chatbot Integration:** Replace the dummy chatbot script in `app/layout.tsx` with the live provider script.
- **Legal Pages:** Build out the `/privacy-policy` and `/terms-of-service` routes with compliant copy.
- **Google Merchant Center Cleanup:** Review the existing Merchant Center account/feed, determine what Odoo or other source is publishing rental products, document the active errors, and remove/disable inappropriate product feeds if confirmed. Dumpster rentals and bulk-pickup services are not being treated as a V2 launch dependency. Revisit after the website migration unless an active Google Ads dependency is discovered.

### [WEB-CONTENT] Create pinned blog article — The Little Junkers Story
- **Origin:** About Us V3 content review, October 2026.
- **Purpose:** Give the About page a personal destination for the fuller company story instead of stuffing the About page with generic copy.
- **Status:** Planned content action; not yet drafted or published.
- **Required story beats:**
  - how the name Little Junkers came about;
  - why the dumpsters are pink;
  - why the original dumpster is blue and its connection to Marcus's mother's favorite color;
  - how Marcus and Ivy started the business in 2024;
  - lessons from the first truck, first dumpsters, and early jobs;
  - the long-term end goal for Little Junkers;
  - how technology, online booking, transparent pricing, and local service fit the company vision.
- **Publishing:** Pin or feature the article in the Blog index and feature it on /about-us as **Read the Little Junkers Story**.
- **SEO/AIO:** Write as a factual founder/company story with clear entities, dates, locations, services, and internal links. Avoid generic founder-brand filler.
- **Media:** Use real Marcus/Ivy, truck, original blue dumpster, pink dumpsters, and early-business photos where available.

## Open Action Items — October 2026 Backend / Website Migration

### [BACKEND-001] Resolve rejected booking-hold event telemetry
- **Origin:** Backend health audit, October 2, 2026.
- **Status:** Open.
- **Issue:** Production rejected `booking_hold_created` and `booking_hold_updated` inserts because those values are not allowed by `events_event_type_check`.
- **Current impact:** The booking hold itself succeeds, but the event row is lost and production logs record database errors.
- **Known code state:** Current funnel `api/create-booking-hold.js` still attempts `booking_hold_created`; the unified checkout update path has already stopped writing `booking_hold_updated`.
- **Next discussion/action:** Confirm that no downstream consumer needs `booking_hold_created`; if none does, remove the orphan event write rather than expanding the canonical event taxonomy. Verify production logs afterward.
- **Scope guard:** Do not reopen checkout architecture or redesign the booking flow.

### [BACKEND-002] Stabilize Stripe sync worker
- **Origin:** Backend health audit, October 2, 2026.
- **Status:** Open.
- **Issue:** The production `stripe-worker` hit repeated CPU-limit failures and generated a large burst of Stripe rate-limit exceptions during a full synchronization run.
- **Observed recovery:** The run ultimately completed all Stripe object work, with no open or failed sync runs afterward.
- **Risk:** The worker is operational but brittle; a future larger sync could fail or create avoidable database/error noise.
- **Next discussion/action:** Review worker concurrency, rate-limit settings, execution-window behavior, and the deployed Stripe sync dependency. Determine whether tuning is sufficient or whether migration to Stripe's current sync engine should be planned.
- **Scope guard:** Treat this as backend reliability work, not a checkout redesign.

### [ADMIN-MEDIA-001] Redesign Admin Media Library / upload tool
- **Origin:** Website migration prerequisite review, October 2, 2026.
- **Status:** Parked for design discussion before V2 implementation.
- **Current backend:** Supabase `marketing-media` bucket exists and is public; `media_library` exists as the canonical metadata table. Both are currently empty.
- **Current application gap:** Current Admin `main` has no working `marketing-media` / Media Library implementation.
- **Direction to evaluate:** Prefer a server-owned Admin Media Library workflow: authenticated Admin UI -> server API -> Supabase Storage -> `media_library` metadata record. Include upload, metadata/tags, replace, archive/delete behavior, and website-safe asset selection.
- **Brand/media sources:** Use the approved Little Junkers Brand Guide and official logo/media assets from the connected Google Drive as authoritative sources.
- **Scope:** New Admin capability supporting the public website migration. Do not mix this into booking/CSR architecture.

## Action Log Review Rule
- Review this file at the start and close of each meaningful website migration phase or page batch.
- Pull relevant Open/Parked items into active scope when they become dependencies.
- Update each item's **Status** when work starts, is blocked, is completed, or is intentionally deferred.
- Do not silently remove completed items; mark them **Closed** with the closing date and reference the PR/migration/deployment where applicable.

### [BRAND-001] Reconcile Brand Guide v1.0 with approved V2 and canonical business data
- **Origin:** Mobile design audit, October 2026.
- **Status:** Open — review during page-by-page mobile audit; color palette is explicitly excluded from review.
- **Purpose:** Track non-color Brand Guide content or implementation guidance that is stale or conflicts with the approved V2 website system or live canonical business data.
- **Known conflicts identified so far:**
  - public owner name still appears as **Ivette Griffin**; approved public-facing name is **Ivy Griffin**;
  - pricing table is obsolete relative to canonical Supabase pricing;
  - Zone B / Zone C delivery-fee amounts are obsolete relative to canonical Supabase service-area fees;
  - mattress/tire surcharge guidance conflicts with current active canonical fees;
  - Odoo 18 / inline-style / every-page dark-hero implementation guidance is obsolete for the Next.js V2 architecture; retain brand/layout principles but update implementation-specific language;
  - Brand Guide uses a **Most Popular** featured-card example, while V2 prohibits unsupported popularity claims. Only use an approved/canonical badge such as the current **Preferred** pricing-tier tag when supported by live data.
- **Currently aligned / do not change based on this audit:** approved color palette; system font stack; included tonnage values; no active fuel surcharge.
- **Process:** Add newly discovered non-color conflicts during each page review. Prepare a consolidated Brand Guide v1.1 update after the mobile audit rather than editing the guide piecemeal.


## Status updates — November 16, 2026 (English first-draft PR, branch `v2/english-first-draft`)

- **Media Integration:** In progress. Temporary image folder `public/images/` + manifest `lib/media.ts` (owner decision Nov 16). 35 real photos resized from the booking repo's first-party media. Swap to Supabase `media_library` when the uploader (D-008) ships. Photo slots still needed are listed in the PR.
- **Global Company Data:** Interim. Public company facts now live in one file, `lib/company.ts`. Supabase table still parked.
- **Chatbot Integration:** Dummy chatbot script removed with the Sprint 1 scaffold. Randy bubble not yet built.
- **[WEB-CONTENT] The Little Junkers Story:** Still not drafted. `/about-us` carries a labeled slot for the link.

### [WEB-DATA-001] Canonical dumpster dimensions (AR-8)
- **Status:** Resolved on the website Nov 16 from Marcus's E-Pak order specs: all sizes 12 ft × 8 ft; walls 3 / 4.5 / 6 ft. Remaining admin action: `dumpster_sizes.height_ft` says 3.5 for the 11-yard (spec says 36 in), and the table has no length/width columns. The old size diagrams in the booking repo show 7.5 ft widths and a 5 ft 16-yard and should not be reused.

### [WEB-DATA-002] Mattress / tire / appliance rule
- **Status:** Resolved Nov 16. Owner rule: accepted, with an extra per-item disposal charge. The page says so and prints no amounts.

### [WEB-CONTENT-002] Blog migration (25 EN posts)
- **Status:** Blocked in this session (live subpages could not be read). Templates, `/blog/[slug]` routing and `legacyPath` 301 support are built; no posts migrated.

### Parked from this PR (not built, by design)
- Use My Location (needs a reverse-geocoding decision), Weight Estimator, ZIP-boundary coverage map, Randy bubble, consent banner + GTM/Consent Mode, `lj_ft` cookie and call/text tap events, Español switch, Pricing / Size Guide / Residential / Commercial / Contact / legal pages.

## Blog migration (Nov 16, 2026)

- WEB-CONTENT-002: **Done in draft.** Owner decision: new clean URLs at `/blog/<slug>`, migrate only posts that perform or add SEO value, drop date-specific posts. 10 of 25 posts migrated with single-hop 301s from the old English and Spanish URLs. 15 retired posts redirect to the closest page (size page, merged guide or `/blog`). Odoo tag, page and archive URLs redirect to `/blog`.
- Copy in migrated posts was corrected to current facts (no hard-coded prices, no 10/30/40-yard sizes, no dumpster bags or portable storage, no unverified customer quotes, concrete is not accepted, hours). Owner review needed before cutover.
- Spanish blog: old `/es/blog/viaje-1/*` URLs point at the English posts until the Spanish blog exists (D-004).

## Randy and legal (Nov 16, 2026)

- RANDY-ART-001: Randy redrawn Nov 16 (professional style, warm smile) from one master generator (`scripts/randy/`). Holiday hats per spec §14 (owner direction). Approved by Marcus as the master reference (Nov 16).
- RANDY-ENV-001: `RANDY_SITE_TOKEN` must be set on the Vercel website project (Preview + Production). Claude was not permitted to set it. Until it is, the live Randy backend rejects website chats and the site shows the call/text fallback.
- LEGAL-001: Privacy, terms, cookie and texting pages rewritten to current facts. Owner confirmed Nov 16: customer_service@littlejunkersllc.com is the contact address (sitewide), the 24-hour change/cancellation rule stands, free driveway boards on request are accurate. Remaining: attorney review before launch.


## Approved V2 Experience Redirection — November 18, 2026

**Status:** Design approved, implementation and release pending. Canonical decision: [ADR-CX-001](docs/decisions/ADR-CX-001-days-plus-experience.md).

- **[CX-001] P0:** Design research-to-booking experience, mobile-first prototype, validated context handoff from homepage/size/city/compare/Randy.
- **[PRC-001] P0:** Supabase shared Days Plus pricing model: 3-day base, 0–27 prepaid extra days, total 3–30; new quote API and migration/compatibility; obtain additional-day rate approval.
- **[FLEET-001] P0:** Arbitrary-duration 3–30-day Fleet capacity/return schedule; no double booking; operational blackout and pickup rules.
- **[BOOK-001] P0:** Booking configurator and >30-day custom-quote route, retain embedded Stripe and unified-checkout-v1 integrity.
- **[ADM-001] P0:** Admin Days Plus pricing editor and quote rules.
- **[CSR-001] P0:** CSR/manual booking and payment links support Days Plus and 31+ quoted cases.
- **[CMP-001] P1:** Competitor offer observation and verification data in Supabase, Admin management, customer /compare UX.
- **[SITE-001] P1:** Update website /pricing, price cards, city/size pages, callouts, structured offers, FAQs and long-rental branch.
- **[RANDY-001] P1:** Rework Randy for approved 3–30 calculation and 31+ quote intake; preserve consent.
- **[MEAS-001] P1:** Journey analytics across comparison, configuration, checkout and verified paid rental.
- **[QA-001] P0:** Validate 3/4/30/31-day, timezone, date math, zone, hold expiry, inventory and payment scenarios before activation.

Owner decision: no rentals over 30 days may be self-serve purchased. Last reported operational suspension remains a release gate. No schema, prices, production checkout, DNS, or main merge authorized by this documentation alone.


### [CX-IA-001] Approved homepage shopping hub + supporting-page retention (2026-11-18)

- **Status:** Implementation started on review-only website branch; not merged.
- **Governing docs:** [PROJECT-CHARTER.md](PROJECT-CHARTER.md), [ADR-CX-002](docs/decisions/ADR-CX-002-shopping-hub-architecture.md).
- **Work:** Integrate homepage ZIP/size/optional compare/Days Plus planning; add `/pricing` and `/compare`, preserve city, size, SEO and all existing routes. Handle known-context handoff from secondary pages. No server pricing, payment, Fleet or CSR edits in website Slice A.
- **Acceptance:** No false availability or final-price claims; desktop/mobile/keyboard QA; owner reviews copy and experience separately.

### [CX-COPY-001] Substantive editorial pass and page-by-page owner approval

- **Status:** Open. Owner explicitly stated that initial November 18 prototype wording is weak and illustrative only. The final site must use verified operational facts, meaningful decision support, local specificity and first-party proof. No auto-approval of copy because a layout passes.
