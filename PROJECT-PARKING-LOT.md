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
- **Status:** Open. Size pages show length/width read from the existing size diagrams (11: 12 × 7.5 ft, 16: 12 × 7.5 ft, 21: 12 × 8 ft) and height from `dumpster_sizes`. The 16-yard diagram says 5 ft high; `dumpster_sizes.height_ft` says 4.5. Marcus to confirm, then add length/width to `dumpster_sizes`.

### [WEB-DATA-002] Mattress / tire / appliance rule
- **Status:** Open. `fees` has active per-item rows keyed `prohibited_*`; the spec forbids presenting item fees. Materials page currently says "text us first" and shows no fee. Marcus to confirm the rule.

### [WEB-CONTENT-002] Blog migration (25 EN posts)
- **Status:** Blocked in this session (live subpages could not be read). Templates, `/blog/[slug]` routing and `legacyPath` 301 support are built; no posts migrated.

### Parked from this PR (not built, by design)
- Use My Location (needs a reverse-geocoding decision), Weight Estimator, ZIP-boundary coverage map, Randy bubble, consent banner + GTM/Consent Mode, `lj_ft` cookie and call/text tap events, Español switch, Pricing / Size Guide / Residential / Commercial / Contact / legal pages.
