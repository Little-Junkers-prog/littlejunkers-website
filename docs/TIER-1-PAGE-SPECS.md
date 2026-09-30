# Little Junkers V2 — Tier 1 Page Specifications

**Status:** Draft for owner review — pre-code  
**Date:** September 29, 2026  
**Repository:** `Little-Junkers-prog/littlejunkers-website`  
**Governing reference:** `STRATEGY-ARCHIVE.md`  
**Purpose:** Define the page-level build contract for the first V2 implementation wave before application code is written.

---

# 1. Shared Tier 1 Rules

These rules apply to every page in this document unless a page-specific rule overrides them.

## 1.1 Customer experience

- Mobile is the primary conversion-design target. Search Console shows roughly 74.5% of organic clicks are mobile.
- The public website and booking funnel must feel like one product.
- Do not ask for information again when the current customer-experience session already knows it.
- Primary customer journey: location -> price/serviceability -> size/recommendation -> booking.
- Keep copy short, specific, local, and operational.
- Do not expose implementation terminology, prompts, placeholders, or AI-generated scaffolding.
- No emojis in UI copy.
- Use current public phone: **470-548-4733**.
- Public owner names: **Marcus and Ivy Griffin**.

## 1.1A Human copy standard

Customer-facing copy must feel human, local, and conversational.

Rules:
- write like a knowledgeable local person, not a marketing department;
- favor short, concrete sentences;
- let photos, price, dimensions, and UI do the work;
- do not restate the same idea in the hero, tiles, cards, and FAQ;
- avoid generic AI/corporate phrases;
- use natural contractions when appropriate;
- remove copy that only explains what the design already makes obvious;
- prefer specific examples over abstract benefit language.

Review test:
- **Would Marcus or Ivy actually say this to a customer?**
- **Can 20–30% of the words be removed without losing meaning?**

If either answer indicates drift, rewrite before approval.

## 1.2 Indexing

Every route must be explicitly classified as **INDEX** or **NOINDEX**.

For INDEX pages:
- server-render meaningful visible content;
- self-referencing canonical;
- XML sitemap inclusion;
- unique title and meta description;
- valid structured data only where it matches visible content;
- English/Spanish `hreflang` pairing where applicable;
- no accidental `noindex`.

For NOINDEX pages:
- exclude from XML sitemap;
- use `noindex,follow` unless a later security/privacy requirement calls for stricter handling.

## 1.3 Canonical data

Do not independently hard-code dynamic business facts that already have or should have a canonical data source.

Canonical/public data dependencies may include:
- pricing;
- dumpster sizes and dimensions;
- included tonnage;
- rental duration;
- fees;
- service cities/ZIPs;
- public phone/company data;
- allowed/prohibited materials;
- active service settings.

If live pricing fails, do not silently fall back to stale rates.

## 1.4 Analytics

All pages emit `page_view`.

Do not send phone, email, street address, payment details, or free-form customer text into GA4/PostHog event properties.

Common events:
- `language_changed`
- `location_entered`
- `location_entry_method_selected`
- `location_permission_granted`
- `location_permission_denied`
- `serviceability_checked`
- `service_area_confirmed`
- `service_area_rejected`
- `pricing_viewed`
- `dumpster_size_viewed`
- `dumpster_size_selected`
- `recommendation_started`
- `recommendation_completed`
- `booking_started`
- `randy_opened`
- `form_started`
- `form_validation_error`
- `form_submitted`

## 1.5 Security

Pages that only read public content do not need human verification.

Any action that can create/update a business record must use the approved protected intake path:
- server-side validation;
- origin controls;
- rate limiting;
- bot/spam controls;
- managed human verification where appropriate;
- server-only privileged database writes;
- no direct anonymous pollution of canonical customer/lead data.

## 1.6 Spanish

Core Tier 1 customer journeys must have a real Spanish counterpart.

Requirements:
- natural U.S. Spanish;
- language persists across website, Randy, recommendation, and booking;
- no IP-forced redirect;
- reciprocal `hreflang`;
- language-correct metadata;
- Spanish validation/error states;
- Spanish transactional handoff.

## 1.7 Location and privacy controls

- City/ZIP entry is always available.
- Provide an explicit **Use My Location** option where location materially improves serviceability/pricing.
- Never request browser geolocation automatically on page load.
- Browser location permission is requested only after the customer opts in.
- Resolve an approved device location to city/ZIP/service area for customer experience and demand analytics.
- Do not send precise latitude/longitude to general analytics.
- The approved privacy-consent headline is **“We don't trash your privacy.”**
- Sitewide consent controls must include **Accept All**, **Reject Non-Essential**, and **Manage Preferences**.
- Non-essential analytics, marketing, preference storage, and session replay must respect the selected consent state.
- Privacy Policy and Cookie Policy must be accessible from the consent UI.

## 1.8 Randy

Randy's visual identity is governed by `docs/RANDY-CHARACTER-SPEC.md`.

Homepage may use a larger Randy introduction. All other public pages use the persistent Randy chat bubble; opening it launches the dedicated chat modal experience.

Randy receives page context where useful:
- language;
- current route/page type;
- city/ZIP if known;
- dumpster size if known;
- project type if known;
- recommendation result if known.

Randy should not re-ask known information.

---

# 2. Tier 1 Page Matrix

| # | Page | Route | Migration | Index |
|---|---|---|---|---|
| 1 | Homepage | `/` | Keep + rebuild | INDEX |
| 2 | Pricing | `/pricing` | New | INDEX |
| 3 | 11-Yard | `/11-yard-the-little-junker` | Keep + rebuild | INDEX |
| 4 | 16-Yard | `/16-yard-the-mighty-middler` | Keep + rebuild | INDEX |
| 5 | 21-Yard | `/21-yard-the-big-junker` | Keep + rebuild | INDEX |
| 6 | Size Guide / Recommendation | `/dumpster-size-guide` | New | INDEX |
| 7 | Service Areas Hub | `/service-areas` | Keep + rebuild | INDEX |
| 8 | Newnan | `/dumpster-rental-newnan-little-junkers` | Keep + rebuild | INDEX |
| 9 | Sharpsburg | `/dumpster-rental-sharpsburg-little-junkers` | Keep + rebuild | INDEX |
| 10 | Senoia | `/dumpster-rental-senoia-little-junkers` | Keep + rebuild | INDEX |
| 11 | Peachtree City | `/dumpster-rental-peachtree-city-little-junkers` | Keep + rebuild | INDEX |
| 12 | Fayetteville | `/dumpster-rental-fayetteville-little-junkers` | Keep + rebuild | INDEX |
| 13 | Residential | `/residential-dumpster-rental` | Keep + rebuild | INDEX |
| 14 | Commercial / Contractors | `/commercial-dumpster-rental` | Keep + rebuild | INDEX |
| 15 | Materials | `/what-can-i-put-in-a-dumpster` | Keep + rebuild | INDEX |
| 16 | FAQ | `/faq` | Keep + rebuild | INDEX |
| 17 | Additional Services | `/additional-services` | Keep + rebuild | INDEX |
| 18 | About | `/about-us` | Keep + rebuild | INDEX |
| 19 | Contact | `/contactus` | Keep + rebuild | INDEX |
| 20 | Spanish Core Experience | `/es/*` | Rebuild/redirect legacy | INDEX by counterpart |
| 21 | Booking Integration | `/rent-a-dumpster/*` + booking routes | Cross-project integration | Mostly NOINDEX |

---

# 3. Homepage

## Route
`/`

## Search intent
- Little Junkers brand;
- dumpster rental;
- local dumpster rental;
- rent a dumpster near me;
- South Metro Atlanta local intent.

## Conversion purpose
Move a new visitor from uncertainty to:
1. serviceability;
2. live pricing;
3. size selection/recommendation;
4. booking.

## Primary visitor
Homeowners and small contractors who need a dumpster and may not yet know which size.

## Hero

Primary message should answer the job quickly rather than lead with company history.

Concept:

> **Need a dumpster?**  
> Enter your city or ZIP to see prices and availability.

Primary controls:
- City or ZIP input.
- CTA: **See Prices & Availability**
- Secondary location action: **Use My Location**

Location behavior:
- manual City/ZIP remains the default;
- **Use My Location** is opt-in and triggers the browser permission request only after the customer selects it;
- approved device location resolves to a service city/ZIP/zone;
- if permission is denied, the experience falls back cleanly to manual City/ZIP entry.

Secondary conversion actions:
- **Help Me Choose**
- phone/text access on mobile.

Hero must use approved dark offset-fade visual treatment and real Little Junkers imagery.

## Required sections

1. Location/serviceability hero.
2. Live 11/16/21 pricing cards after location is known.
3. Short “Not sure which size?” recommendation entry.
4. Three-dumpster lineup.
5. How it works — concise.
6. Why Little Junkers — driveway/property care, local ownership, online booking, transparent pricing.
7. Compact Marcus & Ivy owner/trust section with real photo and link to About.
8. Real local project photography.
9. Reviews/testimonials.
10. Service-area preview.
11. Randy entry.
12. Final booking CTA.

Do not overload the homepage with long SEO copy.

## Homepage owner/trust treatment

Retain the strongest trust element from the current site without repeating the full About page.

Use:
- real Marcus and Ivy Griffin photo;
- short local-owner message;
- no more than one or two short supporting lines;
- CTA: **Meet Marcus & Ivy** -> `/about-us`.

The complete founder story belongs on the About page.

## Homepage map decision

Do **not** add a Google map to the homepage for SEO/ranking purposes.

Use the homepage service-area checker and local city links instead. If a map improves usability, place the primary coverage map on `/service-areas`, where it has a clear customer purpose.

## Data dependencies
- service areas / ZIP logic;
- live public pricing;
- dumpster size metadata;
- company facts;
- public reviews if sourced dynamically later.

## Schema
- Organization / LocalBusiness;
- WebSite;
- Service where appropriate;
- Breadcrumb not needed on root.

## Analytics
- `location_entered`
- `serviceability_checked`
- `service_area_confirmed`
- `service_area_rejected`
- `pricing_viewed`
- `recommendation_started`
- `dumpster_size_selected`
- `booking_started`
- `randy_opened`

## Randy context
Pass route, language, location if known, and any size selected.

## Internal links
Pricing, all 3 sizes, size guide, service areas, residential, commercial, materials, FAQ, About, Compare when available.

## Booking handoff
Location and selected size must carry into booking if already known.

## Mobile requirements
- location field and CTA above fold;
- no oversized nav;
- pricing cards readable without horizontal confusion;
- sticky Book action may be used if it does not obscure content.

## Acceptance criteria
- manual City/ZIP location check works;
- optional **Use My Location** works only after customer opt-in;
- denial of device location permission does not block the flow;
- general analytics stores resolved city/ZIP/service area rather than precise coordinates;
- sitewide privacy consent uses the approved **“We don't trash your privacy.”** headline and functional consent controls;
- current prices render server-side or immediately with approved safe fallback behavior;
- no stale hard-coded price;
- all key CTAs preserve context;
- Spanish switch available;
- mobile layout passes visual review;
- no page-level form creates canonical CRM data.

---

# 4. Pricing

## Route
`/pricing`

## Search intent
- dumpster rental prices;
- dumpster rental cost;
- price on dumpster in Fayette/Coweta/local market;
- commercial research before booking.

## Conversion purpose
Remove price uncertainty and turn a price shopper into a booking.

## Hero
> **Dumpster Rental Pricing**  
> Enter your city or ZIP to see the price for your location.

Primary CTA: **See My Price**

## Required sections

1. City/ZIP serviceability.
2. Current pricing cards for 11/16/21.
3. **Optional Weight Estimator** entry point.
4. Two-column pricing-detail area:
   - left: one cohesive **What's included and what can add to your total** section;
   - right: clear **Your Price Summary** card with the primary **Check Dates & Book** action.
5. Included tonnage and rental duration inside the pricing-detail area.
6. Relevant delivery/service-area fee logic.
7. Extra-day / overage and special-item explanation from canonical data.
8. FAQ focused on pricing.
9. Persistent Randy chat bubble.
10. Footer without a redundant **Choose Your Dumpster** CTA.

Do not add a separate Compare Sizes table on this page; the three pricing cards already perform that comparison.

Do not turn this into a dense fee schedule.

## Data dependencies
All pricing and commercial terms must come from approved canonical pricing/fee sources.

The Weight Estimator also depends on:
- included tonnage for the selected rental;
- current prepaid additional-tonnage price/rules;
- an AI-guided adaptive interview;
- material/project safety restrictions and special handling rules.

The estimator should **not** depend on a dedicated customer-facing/static weight table or require Little Junkers to maintain an exhaustive catalog of every possible object or debris type. The AI layer chooses follow-up questions based on the project and prior answers, then returns a structured advisory result such as:
- estimated weight range;
- confidence level;
- major weight drivers;
- whether included tonnage is likely sufficient;
- suggested prepaid-tonnage action.

Commercial values remain deterministic: the AI must not invent pricing, fee amounts, or available prepaid-tonnage increments. Those come from canonical pricing/booking data.

## Schema
Service + Offer where technically appropriate and matching visible current values.

## Analytics
- `location_entered`
- `pricing_viewed`
- `weight_estimator_opened`
- `weight_material_selected`
- `weight_estimate_completed`
- `weight_risk_detected`
- `prepaid_tonnage_recommended`
- `prepaid_tonnage_selected`
- `prepaid_tonnage_declined`
- `dumpster_size_selected`
- `booking_started`

## Optional Weight Estimator UX

The pricing page should include a low-friction expandable entry point such as:

> **Heavy stuff? Check the weight first.**  
> Furniture, roofing and debris can weigh more than they look.  
> **Estimate My Load**

The default pricing flow remains untouched unless the customer opens the tool.

Suggested interaction:

1. Customer selects a project type or briefly describes the job.
2. AI renders only the follow-up selections relevant to that project.
3. Follow-up questions use simple customer language and quantities the customer can reasonably answer.
4. AI returns an estimated weight **range**, confidence level, and key weight drivers.
5. Compare the range with the included tonnage of the currently selected dumpster.
6. If risk is low, reassure and return to booking.
7. If the range may exceed included tonnage, recommend optional prepaid additional tonnage.
8. Let the customer accept, decline, refine the estimate, or ask Randy.

Example:
- **Kitchen renovation** may branch into cabinets, countertops, flooring, drywall, appliances, and approximate room size.
- **Roofing** may branch into roof size, number of layers, and shingle/material type.
- **Household cleanout** may branch into furniture, appliances, boxed household goods, and amount/room count.

The goal is not to create a miniature chatbot. It should feel like a fast adaptive calculator whose questions change intelligently. It must also handle uncommon descriptions gracefully—for example, furniture or equipment that would never reasonably appear in a manually maintained weight table—by reasoning to a conservative estimate and asking a small number of clarifying questions only when needed.

Important UX language:

- “Estimated weight” rather than “Your load weighs”.
- “You may want to prepay…” rather than “You will owe…”.
- Explain that the final disposal weight is determined by the actual scale ticket.
- Near any prepaid-tonnage recommendation, display:

  > **Weight estimates are just that—estimates.** Your actual disposal weight is determined by the scale ticket. Prepaid extra tonnage is optional, and unused prepaid tonnage is not refundable.

- If the customer selects prepaid tonnage, require a concise acknowledgement at that point:

  > **I understand the estimate isn't a guarantee and unused prepaid tonnage is non-refundable.**

The acknowledgement must not be shown as a blocking checkbox to customers who only use the estimator or continue without prepaid tonnage.

The estimator must not turn into a long questionnaire. Prefer progressive disclosure and a small number of useful customer-friendly material categories.

## Internal links
3 product pages, size guide, materials, service areas.

## Acceptance criteria
- same commercial inputs produce the same underlying price logic as booking;
- crawlable current pricing exists in rendered HTML when feasible;
- stale fallback values are prohibited;
- location context passes to booking;
- Weight Estimator is optional and never blocks the normal conversion path;
- estimator distinguishes weight from dumpster volume;
- estimator returns a range/advisory result rather than false precision;
- AI follow-up questions adapt to the project instead of forcing every customer through the same questionnaire;
- AI response is structured and bounded; it cannot invent commercial prices or tonnage products;
- prepaid tonnage suggestion uses current canonical pricing;
- selected prepaid tonnage carries into booking and is revalidated by the booking transaction layer;
- prepaid-tonnage purchase requires acknowledgement that the estimate is not guaranteed and unused prepaid tonnage is non-refundable;
- included items and potential additional costs are visually grouped into one coherent section;
- order/price summary is positioned clearly to the right on desktop and stacks appropriately on mobile;
- no duplicate Compare Sizes section;
- pricing page uses the persistent Randy chat bubble rather than an in-page Randy promotional panel;
- footer does not repeat a Choose Your Dumpster CTA;
- do not show unsupported popularity badges such as **Most Popular** unless backed by an approved business/data rule;
- do not use claims such as **No junk fees** that conflict with disclosed weight, extra-day, service-area, or special-item charges.

---

# 5. Dumpster Product Page Template — Approved

The **11-Yard Little Junker** design is the canonical template for all three dumpster product pages.

Routes:
- `/11-yard-the-little-junker`
- `/16-yard-the-mighty-middler`
- `/21-yard-the-big-junker`

## Shared page structure

1. **Hero**
   - real size-specific Little Junkers photo;
   - product name;
   - one short human fit line;
   - live location-aware price;
   - included duration + tonnage;
   - primary **Check Dates & Book** action;
   - location/change-location control.

2. **A great fit for**
   - exactly four concise project-fit tiles;
   - do not repeat the same list in hero copy.

3. **Adjacent-size guidance**
   - one card beside the fit tiles;
   - 11-yard: point up to 16 when more room is likely needed;
   - 16-yard: point down/up depending on project;
   - 21-yard: point down to 16 when the larger size is unnecessary;
   - language should help, not pressure.

4. **What fits**
   - practical capacity visual/equivalent;
   - short list of representative materials/projects;
   - no dimension diagram in this block.

5. **Estimate My Load**
   - optional AI-guided weight estimator;
   - compact entry point adjacent to What Fits;
   - never required for booking.

6. **Dumpster size & footprint**
   - dedicated dimension diagram;
   - simple driveway/placement context;
   - no duplicate lifestyle photo required if the dimension graphic already carries the section.

7. **Price summary**
   - current location;
   - selected size;
   - rental period;
   - included tonnage;
   - live price;
   - **Check Dates & Book**;
   - optional Weight Estimator link.

8. **Materials guidance**
   - short common-material guidance;
   - heavy-load caution;
   - links to Materials page / Weight Estimator;
   - do not duplicate the full materials page.

9. **Junker in the wild**
   - real Little Junkers jobs;
   - carousel rather than multiple full-width side-by-side galleries;
   - city + short project label only.

10. **FAQ**
   - cap at four high-value size-specific questions on-page;
   - link outward for broader FAQ coverage if needed.

11. **Randy + footer**
   - persistent Randy bubble only;
   - standard footer;
   - no redundant generic booking CTA in footer.

## Shared acceptance rules

- product pages answer **“Is this the right dumpster?”**, not simply repeat the Pricing page;
- no duplicated three-size comparison table;
- no unsupported popularity claims;
- price and commercial terms come from canonical data;
- copy follows the Human Copy Standard;
- real first-party Little Junkers imagery replaces placeholders before launch;
- layout/component system is shared across all three product pages.

---

# 6. 11-Yard — The Little Junker

## Route
`/11-yard-the-little-junker`

## Product-specific direction

Hero fit line:

> **Great for smaller cleanouts, remodels, and tight driveways.**

Project-fit examples should focus on smaller residential work such as:
- garage cleanout;
- small kitchen/bath remodel;
- decluttering / household junk;
- allowed yard cleanup.

Adjacent-size card:
- **Need more room? See the 16-Yard.**

Capacity, dimensions, included tonnage, duration, and price must come from current approved sources.

Weight guidance should make clear that dense material can reach weight limits before the dumpster looks full.

---

# 7. 16-Yard — The Mighty Middler

## Route
`/16-yard-the-mighty-middler`

## Product-specific direction

Use the approved product template, not a separate layout.

Primary intent:
- medium remodels;
- deck work;
- larger cleanouts;
- mixed residential/contractor projects.

Hero copy should remain short and human.

Adjacent-size guidance may offer both directions where useful:
- 11-yard if the job is genuinely small;
- 21-yard if volume is clearly larger.

Avoid unsupported **Most Popular** language.

Search intent around **16 yard dumpster** remains a priority, so title, H1, metadata, visible copy, and real project evidence should clearly support that topic without keyword stuffing.

---

# 8. 21-Yard — The Big Junker

## Route
`/21-yard-the-big-junker`

## Product-specific direction

Use the approved product template, not a separate layout.

Primary intent:
- large cleanouts;
- major remodels;
- roofing / contractor work where operationally appropriate;
- higher-volume projects.

Adjacent-size card should help the customer avoid overbuying:
- **You may only need the 16-Yard** when the project volume does not justify the largest container.

Weight guidance is especially important:
- clearly distinguish volume capacity from disposal weight;
- do not imply that choosing the largest dumpster makes dense/heavy material limits irrelevant.

---

# 8. Dumpster Size Guide + Recommendation

## Route
`/dumpster-size-guide`

## Search intent
What size dumpster do I need; dumpster size comparison; 11 vs 16 vs 21.

## Conversion purpose
Turn uncertainty into a confident size selection.

## Page architecture

Two layers on the same page:

### Crawlable guide
Use a visually distinct **quick size guide**, not another photo-heavy product-card section.

- show 11/16/21 with clean product/diagram-style visuals, silhouettes, or standardized side profiles;
- keep copy compact: size name, simple job scale, one or two use examples, link to product page;
- do not repeat the same lifestyle photography used elsewhere on the page;
- dimensions and deeper detail belong on the individual product pages.

### Interactive recommendation
Ask only useful questions, such as:
- project type;
- approximate volume;
- specific material concerns;
- location if needed for price/serviceability.

Return:
- recommended size;
- why;
- alternatives when close;
- live price after location;
- booking CTA.

## Data dependencies
Size metadata, recommendation rules, service area, live pricing.

Recommendation rules must have a clear owner and tests; do not hide inconsistent business logic in page components.

## Analytics
- `recommendation_started`
- `project_selected`
- `recommendation_completed`
- `recommended_size_viewed`
- `dumpster_size_selected`
- `booking_started`

## Randy context
Randy can receive recommendation outcome and explain it further.

## Visual separation

The page must clearly distinguish **product reference** from **real-world proof**:

- **Quick size guide:** clean product/diagram-style visuals with minimal copy.
- **Real jobs:** actual Little Junkers field photography shown in a carousel, including visible project/location context where available.

Do not stack two sections of nearly identical dumpster photography.

Because this is a helper/recommendation page, Randy may appear larger inside the recommendation area than on ordinary interior pages. Outside that helper panel, the normal persistent Randy chat-bubble rule still applies.

## Acceptance criteria
- usable without JavaScript for the editorial guide;
- interactive tool does not create a lead;
- result context carries into booking;
- recommendation rationale is understandable;
- no fake precision;
- quick size guide and real-job carousel are visually distinct;
- real-job imagery uses actual field photos rather than repeated product shots;
- Randy's larger helper-page treatment remains consistent with the canonical Randy character spec.

---

# 9. Service Areas Hub

## Route
`/service-areas`

## Search intent
Where Little Junkers delivers; dumpster rental near me; local availability.

## Conversion purpose
Confirm serviceability and route the customer to the strongest local page or booking flow.

## Hero
> **Do we deliver to you?**  
> Enter your city or ZIP.

## Required sections

1. City/ZIP checker.
2. Optional visual service-area map **only if it helps customers understand coverage**; do not add it as a claimed ranking tactic and do not expose a non-public/home address.
3. Primary service cities.
3. ZIP/service-zone information from canonical data.
4. Links to real city pages.
5. What happens outside the current service area.
6. Booking CTA for supported locations.
7. Bulk-pickup distinction only where current and relevant.

## Data dependencies
Canonical service area, ZIP, zone/fee data.

## Schema
Service / areaServed only where accurate.

## Analytics
Serviceability events and city-page clicks.

## Acceptance criteria
No manually maintained conflicting city list; out-of-area result is clear; current zone fee data is not duplicated in prose.

---

# 10. Newnan City Page

## Route
`/dumpster-rental-newnan-little-junkers`

## Why Tier 1
Strongest named local signal in owner-provided Google data and strongest city landing page in Search Console.

## Search intent
Dumpster rental Newnan GA; roll-off Newnan; local pricing.

## Conversion purpose
Turn a Newnan searcher directly into a rental.

## Hero
> **Dumpster Rental in Newnan, GA**

Use real Newnan imagery.

Primary CTA:
- **See Newnan Prices & Availability**
or direct live pricing if serviceability is already certain from the route.

## Required sections

1. Live Newnan pricing for 11/16/21.
2. Size selection.
3. Real Newnan project examples/photos.
4. Local placement/driveway context.
5. How delivery works.
6. Materials/weight guidance.
7. Local FAQ.
8. Booking CTA.

Avoid generic city-history filler.

## Data dependencies
Newnan serviceability, zone/fee, live pricing, size metadata.

## Schema
LocalBusiness/Service with accurate areaServed; BreadcrumbList.

## Analytics
City page view, pricing view, size selection, booking start.

## Acceptance criteria
First-party Newnan evidence; no templated city paragraph swaps; current pricing; direct booking context includes Newnan.

---

# 11. Sharpsburg City Page

## Route
`/dumpster-rental-sharpsburg-little-junkers`

## Why Tier 1
Search Console shows meaningful existing clicks; stronger current organic performance than originally assumed.

## Required structure
Use the same functional pattern as Newnan but with Sharpsburg-specific:
- photos if available;
- service details;
- project examples;
- local FAQ;
- pricing/zone output.

Do not clone Newnan copy with the city name replaced.

## Acceptance criteria
At least one meaningful Sharpsburg-specific content element beyond service-area data before publication.

---

# 12. Senoia City Page

## Route
`/dumpster-rental-senoia-little-junkers`

## Why Tier 1
Existing query visibility is strong and should be protected.

## Required structure
Same city-page framework, with real Senoia imagery/project evidence where available.

Remove outdated Odoo claims such as unsupported same-day promises or “best prices.”

## Acceptance criteria
No legacy dynamic-snippet placeholder; live pricing; route preserved.

---

# 13. Peachtree City City Page

## Route
`/dumpster-rental-peachtree-city-little-junkers`

## Why Tier 1
Home market and substantial current impressions, but poor current click/ranking efficiency.

## Search intent
Dumpster rental Peachtree City GA.

## Special SEO requirement
Make geographic entity signals unambiguous:
- Peachtree **City**, GA;
- Fayette County;
- 30269 where relevant;
- South Metro Atlanta context.

Avoid vague use of “Peachtree” that can be confused with Peachtree Corners.

## Content
- real local photography;
- locally owned/home-market positioning;
- live pricing;
- size selection;
- local project examples;
- booking.

## Acceptance criteria
No confusing Peachtree Corners signals; exact business entity/location consistency.

---

# 14. Fayetteville City Page

## Route
`/dumpster-rental-fayetteville-little-junkers`

## Search intent
Dumpster rental Fayetteville GA.

## Content
Same high-quality city pattern:
- live pricing;
- first-party Fayetteville photos/projects;
- local service information;
- size guide;
- booking CTA.

## Acceptance criteria
Distinct content and media; no city-name template swap.

---

# 15. Residential Dumpster Rental

## Route
`/residential-dumpster-rental`

## Search intent
Homeowner dumpster rental; cleanout/remodel/yard-project rental.

## Conversion purpose
Help a homeowner understand the process and choose a size without jargon.

## Hero
> **A dumpster for the project at home.**

Primary CTA: **See Prices for My Address/ZIP**

## Required sections

1. Common homeowner projects.
2. 11/16/21 quick choice.
3. Driveway/property care.
4. What can go in the dumpster.
5. How delivery/pickup works.
6. Transparent pricing.
7. Real residential project gallery.
8. Recommendation CTA.
9. FAQ.
10. Booking CTA.

## Analytics
Project selection, recommendation start, size selection, booking start.

## Acceptance criteria
Simple homeowner language; no contractor-centric jargon; real photos.

---

# 16. Commercial / Contractor Dumpster Rental

## Route
`/commercial-dumpster-rental`

## Search intent
Contractor dumpster; roofing/remodeling dumpster; recurring project rental.

## Primary visitor
Small contractors, roofers, remodelers, deck builders.

## Conversion purpose
Demonstrate reliability, clear pricing, easy repeat booking, and suitable sizes.

## Hero
> **Dumpsters that keep the job moving.**

Primary CTA: **See Contractor Pricing & Availability**

## Required sections

1. Project types.
2. Size selection.
3. Roofing/heavy-material considerations.
4. Delivery/placement workflow.
5. Online booking.
6. Repeat-rental convenience without promising unbuilt account features.
7. Real contractor/project photos.
8. Comparison/recommendation links.
9. Booking CTA.

## Acceptance criteria
No enterprise procurement language; designed for small local contractors; claims must reflect actual operations.

---

# 17. What Can I Put in a Dumpster?

## Route
`/what-can-i-put-in-a-dumpster`

## Search intent
Allowed/prohibited dumpster materials.

## Conversion purpose
Remove uncertainty and prevent prohibited-material problems before booking.

## Page structure

Use clear visual groups:

### YES
Common approved materials.

### ASK US FIRST
Materials requiring context, weight review, or special handling.

### NO
Prohibited materials.

Do not rely on prose paragraphs for the core rules.

## Data dependencies
Canonical prohibited/allowed-material business rules.

If the operational prohibited list becomes table-driven for Bulk Pickup or dumpster rules, the website should consume the appropriate approved public version rather than maintain an independent list.

## Required content
- liquid paint rule;
- lithium battery rule where applicable;
- oils and other nuanced rules only if current for dumpster rental;
- heavy materials;
- mattresses/tires/fees only from current canonical fee data.

## Analytics
Materials category interaction, booking continuation.

## Acceptance criteria
No conflicting material guidance across FAQ, booking, and this page.

---

# 18. FAQ

## Route
`/faq`

## Why Tier 1
Search Console shows substantial impressions and strong current average position, despite poor click-through.

## Purpose
Answer real booking objections concisely and create useful search entry points.

## Content model
Questions should be grouped by customer task:
- pricing;
- sizes;
- delivery;
- timing;
- materials;
- driveway/property;
- weight;
- service area;
- payment/booking.

Answers should be short and link to the authoritative deeper page.

## Schema
FAQ structured data only if current Google eligibility/usefulness and visible content justify it; do not assume schema guarantees a rich result.

## Analytics
FAQ expand/click-to-deeper-page where useful; booking CTA.

## Acceptance criteria
No duplicated/conflicting business rules; no JS-only inaccessible accordion; visible crawlable answer text.

---

# 19. Additional Services

## Route
`/additional-services`

## Why Tier 1
Existing Search Console visibility is strong enough that the URL should be preserved and rebuilt intentionally.

## Purpose
Serve as the durable hub for services beyond standard dumpster rental without becoming a miscellaneous dumping ground.

## Launch content
- Bulk Pickup / Dumpster Bag when active;
- links to any other genuinely active additional service;
- clear distinction from dumpster rental.

## Primary CTA
Route into the correct service flow.

## Acceptance criteria
No stale service cards; no old unsupported pricing; active/inactive services controlled by approved data/configuration.

---

# 20. About Us

## Route
`/about-us`

## Search intent
Brand trust, owners, local-company verification.

## Purpose
Help customers verify that Little Junkers is a real local business run by real people.

## Required sections

1. Marcus and Ivy Griffin.
2. Founded 2024.
3. Why Little Junkers exists.
4. Local operating area.
5. Real owners/truck/dumpster imagery.
6. Service philosophy: simple booking, transparent pricing, care for property.
7. CTA to check pricing/book.

Do not over-write the founder story.

## Schema
Organization / LocalBusiness / Person only where accurate and supported by visible content.

## Acceptance criteria
Never use retired owner name “Ivette Griffin.”

---

# 21. Contact

## Route
`/contactus`

## Search intent
Little Junkers phone/contact/support.

## Purpose
Provide human escalation without creating another spam vector.

## Required sections

1. Call/text: 470-548-4733.
2. Response expectation only if current/approved.
3. Short protected contact form.
4. Service-area reminder.
5. Existing customer vs new rental guidance.
6. Randy entry where helpful.
7. Booking CTA.

## Security
Contact form is a protected data-write surface:
- honeypot;
- strict field limits;
- human verification;
- rate limit;
- server-side validation;
- quarantine/risk logic;
- no direct browser insert into canonical leads.

## Analytics
- `form_started`
- `form_validation_error`
- `form_submitted`
- call/text click
- booking click

## Acceptance criteria
No Odoo placeholder contact data; spam simulation rejected; legitimate test submission flows correctly.

---

# 22. Spanish Core Experience

## Purpose
Spanish is not a secondary translation project. It is a parallel customer path.

## Tier 1 Spanish counterparts

At minimum:
- Spanish homepage;
- pricing;
- 11/16/21 pages;
- size guide/recommendation;
- service-area hub;
- Newnan;
- Sharpsburg;
- Senoia;
- Peachtree City;
- Fayetteville;
- residential;
- commercial/contractor;
- materials;
- FAQ;
- About;
- Contact;
- booking path.

## Content standard
- natural U.S. Spanish;
- preserve Little Junkers tone;
- do not publish raw machine translation without review;
- public business names remain proper names;
- prices/business rules come from same canonical sources as English.

## URL strategy
English root + `/es` hierarchy.

Final Spanish slugs require language review before publication.

## Analytics
Same event names as English with language property; do not create a separate incompatible event taxonomy.

## Acceptance criteria
A visitor can enter through a Spanish page and complete the customer journey without being unexpectedly dropped into English.

---

# 23. Booking Integration / Handoff

## Ownership
Booking funnel remains transaction authority.

## Public-domain goal
Present booking under the same customer-facing domain/path if Vercel multi-project routing verification supports the approved architecture.

Keep `book.littlejunkersllc.com` functional during transition.

## Context handoff

Website may pass approved non-sensitive context such as:
- language;
- city/ZIP;
- selected size;
- project type;
- recommendation result;
- campaign/referral attribution;
- Randy session reference.

Avoid uncontrolled query-string proliferation. Prefer a defined session/context contract.

## Indexing
Generally NOINDEX:
- customer details;
- booking continuation;
- payment;
- confirmation;
- tokenized customer routes.

Decision/marketing pages remain indexable.

## Visual requirements
Shared:
- brand tokens;
- typography;
- buttons;
- spacing;
- header behavior;
- progress style;
- responsive behavior.

The transition should not look like leaving Little Junkers for a different website.

## Analytics
Attribution/session continuity must survive the project boundary:
- `booking_started`
- `rental_option_selected`
- `delivery_date_selected`
- `customer_info_started`
- `customer_info_completed`
- `checkout_started`
- `payment_completed`

## Acceptance criteria
- selected size/location/language survive handoff;
- GA4 attribution survives;
- product-analytics journey survives;
- no duplicate pageview inflation from routing;
- no sensitive data in analytics;
- old `book.` links remain valid during transition.

---

# 24. Cross-Page Internal Linking Rules

Every Tier 1 page should have an intentional next step.

Examples:

- City page -> pricing, sizes, materials, booking.
- Size page -> compare sizes, service area, booking.
- Pricing -> size pages, booking.
- Materials -> product/booking.
- FAQ -> authoritative detail page, not duplicated long answers.
- Residential -> size guide/recommendation.
- Commercial -> roofing guide when available, sizes, booking.
- About -> booking/pricing, not a dead-end biography.

Avoid giant keyword-heavy footer link farms.

---

# 25. Pre-Code Acceptance Gate

Before page implementation begins, owner review should explicitly approve or revise:

1. homepage conversion sequence;
2. pricing presentation principles;
3. product-page structure;
4. recommendation-tool question/result philosophy;
5. city-page content standard;
6. residential vs contractor positioning;
7. materials information architecture;
8. FAQ structure;
9. Additional Services hub role;
10. Contact-form security posture;
11. Spanish publication standard;
12. booking-context handoff requirements.

After approval, these specs become the build contract. Code changes that materially diverge from them require a documented decision/change rather than silent implementation drift.
