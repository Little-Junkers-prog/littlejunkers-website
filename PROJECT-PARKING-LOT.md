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

