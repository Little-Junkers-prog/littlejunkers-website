# Little Junkers Website V2 — Strategy Archive

**Status:** Active strategic reference  
**Created:** September 29, 2026  
**Repository:** `Little-Junkers-prog/littlejunkers-website`  
**Purpose:** Preserve the approved V2 website/customer-experience roadmap across chats, agents, sprints, and implementation sessions.

---

# MANDATORY SESSION-START DIRECTIVE

> **Before proposing, editing, generating, committing, or reviewing any Little Junkers public-website code, content, information architecture, SEO work, analytics, security rules, redirects, schema, pricing presentation, booking integration, Spanish localization, Randy integration, comparison features, or marketplace features, read this entire `STRATEGY-ARCHIVE.md` file first.**
>
> Treat this file as the current strategic baseline. Do not silently undo or replace an approved decision. If a requested change conflicts with this archive, identify the conflict explicitly before implementation and obtain a clear decision on which direction supersedes the existing roadmap.
>
> Also review any newer governing documents referenced from this file, including project scope, architecture decisions, migration matrix, security standards, analytics specification, and changelog when those files exist.
>
> **Do not begin implementation merely because a prior prototype or branch contains code.** Existing Odoo pages, old branches, and historical implementations are reference material unless this archive or a newer approved decision says otherwise.

---

# 1. Product Vision

Little Junkers V2 is **not** a visual recreation of the existing Odoo website.

The target is a **Customer Experience Platform** for a technology-driven dumpster-rental company.

The desired market position is:

> **Little Junkers is a tech company that rents dumpsters.**

The technology must make the customer experience materially easier:

- discover whether Little Junkers services the customer;
- see current pricing;
- understand dumpster sizes;
- get a recommendation;
- compare options;
- ask Randy for help;
- move into booking without re-entering known information;
- complete a rental;
- continue in English or Spanish;
- have the complete journey measurable from acquisition through rental completion.

The site should feel like one coordinated product, not an e-commerce template bolted to a separate booking system.

### V2 visual-foundation clarification

The V2 design direction uses the Brand Guide's exact color tokens but does **not** require every page hero to use the older dark-hero layout pattern. The shared V2 framing is a dark top/header and dark bottom/footer around a warm cream/off-white content field with restrained surface changes between sections. Page-specific dark heroes remain allowed where they serve the page, but a dark hero is no longer the default merely because the older Brand Guide layout pattern used one.

---

# 2. Approved Strategic Decisions

The owner approved the Section 30 direction from the V2 cutover plan.

The current strategic defaults are:

1. **Preserve `www.littlejunkersllc.com` as the canonical public host.**
2. **English stays at the root; Spanish uses `/es`.**
3. **Website and booking funnel remain separate repositories/projects but should become a seamless same-domain customer experience through Vercel path-based routing if implementation verification supports it.**
4. **Keep `book.littlejunkersllc.com` operational during transition for compatibility with existing SMS links, bookmarks, ads, and customer messages.**
5. **Keep Gandi as authoritative DNS unless a later approved decision changes that. Do not move nameservers merely because Vercel hosts the website.**
6. **Use GA4/GTM for marketing attribution and a product-analytics layer such as PostHog for behavioral funnels, paths, friction analysis, and privacy-controlled session replay.**
7. **Protect public record-creating actions with layered anti-bot controls, including Vercel protections and server-validated human verification such as managed Turnstile where appropriate.**
8. **Use a shared, canonical media strategy. The booking-funnel repository currently contains the seed media library.**
9. **The comparison tool and We Recommend marketplace are committed V2 product features, but they must not block a stable core booking launch if they need to remain feature-flagged temporarily.** The Residential Dumpster Rental page should expose **Compare Local Dumpster Prices** as a secondary link once `/compare` is live; comparison should support consideration, not compete with the primary booking CTA.
10. **Protect `main` and move to PR-based governance as part of Phase 0. Future implementation should not rely on unreviewed direct production changes.**
11. **Use one shared V2 visual foundation across public pages:** warm cream/off-white page fields using the approved Brand Guide neutrals; subtle tonal separation between sections; dark `#1E1C19` top/header and bottom/footer framing; restrained pink accent usage; and the approved Little Junkers logo assets rather than recreated or AI-generated logos.
12. **Hero headline brand cue:** when the copy reads naturally, emphasize the final word or short final phrase in the approved pink. On light/cream surfaces, use Pink Text `#C2587A`; on dark surfaces, use Signature Pink `#FFCEE4` when contrast is appropriate. Do not substitute brighter hot-pink/magenta mockup colors.
13. **Real local imagery is the default proof system.** Prefer first-party Little Junkers project and city photography over generic stock imagery. Priority city pages should use real city-specific photography before launch whenever suitable first-party images are available.
14. **Social presence is sitewide but conversion-safe.** Keep the primary header focused on navigation, phone, and booking. Put the full social set in the global footer, and give Blog/Events stronger contextual social treatment without turning every page into a social-link panel. Canonical profile URLs must come from one shared company-data source rather than page-level hardcoding.
15. **Current approved social profiles:** Facebook, Instagram, YouTube, Nextdoor, LinkedIn, Bluesky, and Alignable. Primary community/customer emphasis is Facebook, Instagram, YouTube, and Nextdoor; LinkedIn and Alignable support business/networking; Bluesky remains part of the full follow set.

---

# 3. Platform Ownership

## Customer Experience Platform

Customer-facing work belongs to the Customer Experience Platform:

- public website;
- pricing presentation;
- service-area lookup;
- recommendation tool;
- comparison tool;
- We Recommend marketplace;
- Randy customer interaction;
- booking funnel;
- checkout;
- customer-facing rental actions.

## Operations Platform

Employee-facing work belongs to Admin OS:

- pricing management;
- competitor-data management;
- recommended-provider management;
- dispatch;
- customer support;
- reporting;
- operational workflows.

## Supabase

Supabase is the shared system of record.

It stores approved business data and process outcomes, but business logic must not be duplicated across applications merely because both can access Supabase.

---

# 4. Current V2 Sitemap Architecture

This is the current working architecture. Exact legacy city slugs remain subject to the final Odoo/Search Console migration inventory so we do not throw away existing search equity unnecessarily.

## 4.1 Primary navigation

Keep the main navigation intentionally small:

- **Dumpsters**
- **Pricing**
- **Service Areas**
- **Compare**
- **We Recommend**
- **About**

Persistent customer actions:

- **Español**
- **Book a Dumpster**

On mobile, Call/Text should remain easy to reach, but online booking is the primary transaction path.

---

## 4.2 English sitemap

```text
/
│
├── /residential-dumpster-rental
│
├── /commercial-dumpster-rental
│
├── /pricing
│
├── Dumpster Sizes
│   ├── /11-yard-the-little-junker
│   ├── /16-yard-the-mighty-middler
│   └── /21-yard-the-big-junker
│
├── /dumpster-size-guide
│
├── /service-areas
│   ├── Newnan
│   ├── Peachtree City
│   ├── Fayetteville
│   ├── Senoia
│   ├── Tyrone
│   ├── Sharpsburg
│   └── Fairburn
│
├── /compare
│
├── /we-recommend
│   ├── /we-recommend/roofers
│   ├── /we-recommend/remodeling
│   ├── /we-recommend/deck-builders
│   ├── /we-recommend/landscaping
│   └── additional categories only when real providers are approved
│
├── Project Guides
│   ├── /roofing-dumpster-rental
│   ├── /home-cleanout-dumpster
│   ├── /remodeling-dumpster-rental
│   ├── /yard-waste-dumpster-rental
│   ├── /what-can-i-put-in-a-dumpster
│   └── /driveway-dumpster-placement
│
├── /bulk-pickup
│
├── /faq
├── /about-us
├── /contactus
├── /blog
│   └── /blog/[article]
├── /privacy
└── /legal

Customer transaction routes
└── /rent-a-dumpster/*
```

### URL-preservation rule

Do **not** rename an existing valuable indexed URL merely because a cleaner nested Next.js URL looks aesthetically better.

Existing useful URLs such as:

- `/11-yard-the-little-junker`
- `/16-yard-the-mighty-middler`
- `/21-yard-the-big-junker`
- `/residential-dumpster-rental`
- `/commercial-dumpster-rental`
- `/about-us`
- `/contactus`

should be candidates for rebuild-in-place.

For city pages, determine the exact final URL decision only after reviewing:

- current Odoo URLs;
- Search Console indexed URLs;
- organic landing-page value;
- backlinks where known;
- redirect risk.

---

## 4.3 Spanish sitemap

Spanish is a full customer journey, not an English website with translated static pages.

```text
/es/
│
├── /es/alquiler-de-contenedores
├── /es/alquiler-de-contenedores-residencial
├── /es/alquiler-de-contenedores-para-contratistas
├── /es/precios
│
├── Spanish dumpster-size pages
│   ├── 11-yard
│   ├── 16-yard
│   └── 21-yard
│
├── /es/guia-de-tamanos
├── /es/areas-de-servicio
│   ├── Newnan
│   ├── Peachtree City
│   ├── Fayetteville
│   ├── Senoia
│   ├── Tyrone
│   ├── Sharpsburg
│   └── Fairburn
│
├── /es/comparar
├── /es/recomendamos
├── Spanish project guides
├── /es/recoleccion-de-articulos
├── /es/preguntas-frecuentes
├── /es/sobre-nosotros
├── /es/contacto
└── Spanish booking experience
```

Final Spanish slugs should be reviewed for natural U.S. Spanish rather than translated mechanically.

Spanish requirements:

- translated primary content;
- translated navigation;
- translated validation/errors;
- translated Randy experience;
- translated recommendation flow;
- translated booking flow;
- language persistence across website/booking;
- self-referencing canonical;
- reciprocal `hreflang`;
- language-correct metadata and structured content;
- no forced IP-based language redirect.

---

# 5. Prioritized Build Tiers

## Tier 1 — Conversion foundation

These are the highest-priority customer and search surfaces.

```text
/
pricing
11-yard page
16-yard page
21-yard page
dumpster size guide
service areas
Newnan
Peachtree City
Fayetteville
residential
commercial/contractor
materials
FAQ
About
Contact
Spanish equivalents
booking integration
```

### Why Tier 1

These pages either:

- sit directly on the conversion path;
- address high-intent search demand;
- remove booking objections;
- establish trust;
- or are necessary for the bilingual/local promise.

---

## Tier 2 — Market expansion

```text
Senoia
Tyrone
Sharpsburg
Fairburn
roofing dumpster rental
home cleanout dumpster
remodeling dumpster rental
yard waste dumpster rental
bulk pickup
```

These pages expand local and project-specific intent without creating thin city × keyword sprawl.

---

## Tier 3 — Product differentiation

```text
Compare
We Recommend
deeper Randy integration
```

These are committed V2 product features.

They should be designed as real customer tools, not decorative SEO pages.

If data quality or feature maturity is not sufficient by DNS cutover, they may remain behind feature flags rather than degrade the core rental experience.

---

# 6. Google Business Profile Evidence — April–September 2026

Owner-supplied Google Business Profile performance snapshot:

## Business Profile interactions

**334 total interactions**

| Month | Interactions |
| --- | ---: |
| April 2026 | 68 |
| May 2026 | 47 |
| June 2026 | 56 |
| July 2026 | 73 |
| August 2026 | 63 |
| September 2026 | 27 |

Google-reported interaction breakdown supplied by owner:

- **279 website clicks**
- **49 calls**
- **6 chat clicks**

These sum to the 334 reported interactions.

Approximate shares:

- Website clicks: **83.5%**
- Calls: **14.7%**
- Chat clicks: **1.8%**

### Strategic implication

The Business Profile is already sending the overwhelming majority of actionable users to the website.

The website is therefore not simply an informational brochure. It is the primary conversion surface for Google Business Profile traffic.

The central unanswered question in the current architecture is:

> **What happened after those 279 website clicks?**

V2 analytics must close that gap.

---

# 7. Google Discovery/Search Signals

Owner supplied the following Google Business Profile search-query data.

Largest visible terms:

1. **dumpster rental newnan ga — 114**
2. **dumpster rental near me — 55**
3. **16 yard dumpster — 16**
4. 5 yard dumpster rental — <15
5. can i rent a roll off flatbed truck — <15
6. cheap dumpster rental under $100 — <15
7. dump truck companies senoia ga — <15
8. dumpster — <15
9. dumpster delivery today — <15
10. dumpster for rent — <15
11. dumpster in fayetteville ga — <15
12. dumpster near me — <15
13. dumpster rental — <15
14. dumpster rental fairburn ga — <15
15. dumpster rental fayetteville ga — <15
16. dumpster rental in newnan, ga — <15
17. dumpster rental near forest park, ga — <15
18. dumpster rental peachtree city — <15
19. dumpster rental senoia ga — <15
20. dumpster rentals — <15
21. dumpster rentals near me — <15
22. dumpsters for rent near me — <15
23. dumpsters near cordele georgia — <15
24. junk removal near me — <15
25. junk removal newnan ga — <15
26. junk removal peachtree city ga — <15
27. little junkers — <15
28. pink dumpster rental — <15
29. price on dumpster in fayette county — <15
30. rent a dumpster — <15
31. rent a dumpster near me — <15
32. residential trash service jonesboro ga — <15
33. roll off dumpster rental near tyrone ga 30290 — <15
34. roll off newnan georgia — <15
35. sharpsburg county trash palmetto tyrone rd — <15
36. small dumpster rental prices delivery today — <15
37. sumpster rental near me — <15
38. the cheapest place to rent a dumpster in heard county georgia — <15

## Strategic implications

### Newnan is a first-tier market page

The visible query count for **“dumpster rental newnan ga” (114)** is substantially larger than any other named query supplied.

Newnan should therefore be treated as a priority local page, supported by real Newnan photography and real service information.

The Newnan page should focus on usefulness rather than keyword repetition:

- current pricing;
- available dumpster sizes;
- local project examples;
- service-zone/location information;
- driveway examples;
- direct booking;
- first-party Newnan imagery.

### The 16-yard page is a priority

Google is already showing the Business Profile for **“16 yard dumpster.”**

The 16-yard Mighty Middler page should quickly answer:

- dimensions;
- what fits;
- included tonnage;
- live price by service area;
- driveway fit;
- when 11-yard is better;
- when 21-yard is better;
- direct booking.

Do not claim it is the “most popular” size unless actual rental data supports that claim.

### “Near me” should be solved through local architecture, not a spam page

Do **not** create a thin `/dumpster-rental-near-me` page.

Serve “near me” intent through:

- strong Business Profile signals;
- homepage location entry;
- service-area hub;
- real city pages;
- consistent entity/company facts;
- local photos;
- structured data;
- reviews;
- local internal linking;
- crawlable city/ZIP coverage.

### Do not chase irrelevant or unsupported terms

Examples:

- **5 yard dumpster:** Little Junkers does not offer one. A size guide may naturally explain that the 11-yard is the smallest roll-off.
- **cheap dumpster under $100:** do not optimize toward a price Little Junkers cannot honestly offer.
- **roll off flatbed truck / dump truck companies:** wrong service intent; no dedicated page.
- **junk removal:** may become legitimately relevant through the separate bulk-pickup product, but Little Junkers should not misrepresent scheduled curbside/bulk pickup as traditional full-service junk removal.

---

# 8. Conversion Architecture

The V2 homepage and priority landing pages should actively move customers toward a rental.

The homepage should answer the first two commercial questions quickly:

1. **Do you service my location?**
2. **What will it cost?**

Preferred conceptual flow:

```text
Need a dumpster?

City or ZIP
[________________]

[ See Prices & Availability ]

11 • 16 • 21 Yard Dumpsters
Locally owned. Easy online booking.
```

After serviceability:

```text
Great — we deliver to Newnan.

11 Yard      $LIVE
16 Yard      $LIVE
21 Yard      $LIVE

Not sure which one?
[ Help Me Choose ]

Know what you need?
[ Choose Your Dumpster ]
```

The website is part of the transaction path, not merely an advertisement for the booking funnel.

---

# 9. Live Pricing Requirements

Live pricing is a launch requirement.

Rules:

- customer-visible pricing originates from canonical Supabase business data;
- do not hard-code current prices independently into page copy;
- render pricing server-side so search crawlers and AI retrieval systems can discover it;
- final booking/checkout remains the transaction authority and validates price again;
- if pricing cannot be retrieved, do **not** silently fall back to stale hard-coded numbers;
- show a safe unavailable message and surface an operational alert;
- website and booking should share one explicit pricing contract rather than duplicate pricing interpretation.

Pricing must be usable by:

- homepage;
- pricing page;
- dumpster-size pages;
- recommendation tool;
- Randy;
- comparison tool where Little Junkers pricing appears;
- booking funnel.

---

# 9.1 Weight Estimator Strategy

The pricing and booking experience should include an **optional Weight Estimator** to reduce surprise overage charges.

Purpose:

- help customers understand that dumpster volume and disposal weight are different;
- identify dense/heavy material before checkout;
- estimate whether the selected dumpster's included tonnage is likely to be sufficient;
- offer prepaid additional tonnage when appropriate;
- reduce avoidable post-rental overage frustration.

The estimator must be **optional** and must not become a mandatory step in the standard booking flow.

Recommended customer interaction:

```text
Worried about weight?
[ Estimate My Load ]

What are you throwing away?
[ Furniture ] [ Household Junk ] [ Roofing ] [ Wood ]
[ Drywall ] [ Flooring ] [ Concrete/Brick ] [ Yard Debris ] [ Other ]

Approximate amount / quantity
        ↓
Estimated weight range
        ↓
Included tonnage for selected dumpster
        ↓
Recommendation
```

If the estimated range suggests the load may exceed included tonnage, show a clear optional recommendation such as:

> **You may want to prepay for additional tonnage.**  
> Based on what you selected, your load could exceed the weight included with this dumpster.

Then allow:

- **Add prepaid tonnage**
- **Keep my current rental**
- **Ask Randy**

Display a short expectation-setting disclaimer near the recommendation:

> **Weight estimates are just that—estimates.** Your actual disposal weight is determined by the scale ticket. Prepaid extra tonnage is optional, and unused prepaid tonnage is not refundable.

If the customer chooses prepaid tonnage, require a concise acknowledgement before adding it:

> **I understand the estimate isn't a guarantee and unused prepaid tonnage is non-refundable.**

The acknowledgement belongs at the paid add-on decision point, not as a blocking step for customers who only use the estimator.

Rules:

- use weight **ranges**, not false precision;
- clearly state that the result is an estimate, not a guaranteed scale weight;
- distinguish dense materials from bulky/light materials;
- never imply that choosing a larger dumpster automatically solves a weight issue;
- current included tonnage and prepaid-tonnage pricing must come from canonical pricing/business data;
- do not hard-code tonnage pricing into the estimator;
- the estimator should use an AI-guided adaptive interview rather than depend on a customer-facing/static material-weight lookup table;
- AI should choose the next useful question based on the project and prior answers, then return a conservative estimated weight range, confidence level, and recommended prepaid-tonnage action;
- AI output must use a structured schema and remain advisory; it must not invent commercial prices, fees, or available tonnage increments;
- the final prepaid-tonnage options and prices must come from canonical booking/pricing rules;
- the tool should not create a lead or customer record;
- estimator results may be carried into the customer-experience session and booking context;
- if prepaid tonnage is selected, the booking system remains the transaction authority and validates the add-on before payment.

Suggested analytics:

- `weight_estimator_opened`
- `weight_material_selected`
- `weight_estimate_completed`
- `weight_risk_detected`
- `prepaid_tonnage_recommended`
- `prepaid_tonnage_selected`
- `prepaid_tonnage_declined`

The Weight Estimator should also be available contextually from:
- Pricing;
- product/size pages;
- Materials page;
- Randy;
- booking before checkout.

---

# 10. Size Guide + Recommendation Tool

The crawlable size guide and interactive recommendation tool are complementary, not duplicates.

## Size guide

Search/indexable editorial content describing:

- 11-yard;
- 16-yard;
- 21-yard;
- representative projects;
- relative fit/capacity;
- loading considerations;
- links to each size.

## Recommendation tool

Interactive customer decision support.

Example:

```text
What are you working on?

[ Home cleanout ]
[ Remodel ]
[ Roofing ]
[ Deck ]
[ Yard cleanup ]
[ Other ]

...

We recommend:
16 Yard Mighty Middler

[ See Price for My ZIP ]
```

Static content supports discoverability.

Interactive tooling supports conversion.

---

# 11. Project-Page Strategy

Launch with a deliberately limited number of useful project-intent pages:

- roofing dumpster rental;
- home cleanout dumpster;
- remodeling dumpster rental;
- yard waste dumpster rental.

Do not immediately mass-produce thin pages for every possible project such as:

- bathroom remodel;
- kitchen remodel;
- garage cleanout;
- basement cleanout;
- moving;
- estate cleanup;
- spring cleaning;
- etc.

Add pages later when Search Console/customer data demonstrates actual demand or when Little Junkers has meaningful first-party expertise/content to contribute.

---

# 12. Comparison Tool Strategy

`/compare` is a first-class product surface.

Conceptual input:

- city/ZIP;
- size;
- optionally rental duration.

Potential output:

- Little Junkers live price;
- competitor observed price;
- rental duration;
- included tonnage;
- delivery fee;
- overage;
- material restrictions/important conditions;
- last verified date;
- evidence/source.

Integrity rules:

- competitor data must be sourced and dated;
- missing data is shown as unavailable, not guessed;
- do not create a scoring model engineered so Little Junkers always wins;
- Admin OS should eventually own competitor data maintenance;
- Supabase stores verified observations;
- website displays customer-safe comparison data.

---

# 13. We Recommend Marketplace Strategy

`/we-recommend` is a curated local ecosystem, not a generic directory.

Initial category concepts:

- roofers;
- remodelers;
- deck builders;
- landscaping;
- flooring;
- cleanout/property services;
- related local project services.

Provider profiles may include:

- business;
- category;
- service cities;
- logo/photo;
- description;
- website/contact action;
- relationship or verification basis;
- last verified date.

Integrity rules:

- no fake star ratings;
- no paid placement disguised as editorial recommendation;
- define what “We Recommend” means;
- only create categories when real approved providers exist.

---

# 14. Bulk Pickup Architecture

Bulk pickup is a distinct service path, not a subsection of dumpster rental.

Public entry:

- `/bulk-pickup`
- Spanish equivalent

The already-approved pilot concept includes:

- City or ZIP entry;
- curbside item pickup vs dumpster bag as exclusive paths;
- scheduled city/day availability;
- item counting;
- prohibited-material acknowledgment;
- Stripe checkout;
- separate service rules.

Do not confuse bulk pickup with traditional crew-based full-service junk removal.

---

# 15. Randy Strategy

Randy is the native Little Junkers digital rental assistant.

Do not replace it with a generic third-party chatbot widget.

Randy should understand customer context such as:

- current language;
- current page;
- ZIP/city already supplied;
- size being viewed;
- project/recommendation result;
- current published pricing;
- serviceability;
- booking context.

Do not make the customer repeat information Randy already captured.

Randy must remain protected by:

- abuse limits;
- prompt-injection guardrails;
- server-only privileged actions;
- logging;
- action authorization;
- bot/spam protections.

Spanish Randy is part of the required bilingual experience.

---

# 16. Analytics / Conversion Intelligence

The owner has explicitly stated that visitor tracking is paramount.

V2 must be able to answer:

- where a visitor came from;
- landing page;
- pages viewed;
- tools used;
- pricing viewed;
- size considered;
- language selected;
- where booking started;
- where the visitor abandoned;
- validation errors/friction;
- whether the journey became a paid rental.

## Analytics layers

### GA4 / GTM

Use for:

- Google Ads;
- campaign attribution;
- marketing conversion reporting;
- standard acquisition metrics.

### Product analytics (proposed PostHog)

Use for:

- funnels;
- page paths;
- drop-off analysis;
- tool usage;
- privacy-controlled session replay;
- friction investigation.

### Vercel observability

Use for:

- performance;
- route health;
- runtime/API failures;
- Core Web Vitals.

### Supabase/Admin

Use for the actual business outcome:

- lead/customer/rental/payment lifecycle.

## Core event language

At minimum plan for events such as:

```text
page_view
language_changed

location_entered
serviceability_checked
service_area_confirmed
service_area_rejected

project_selected

recommendation_started
recommendation_completed
recommended_size_viewed

dumpster_size_viewed
dumpster_size_selected

pricing_viewed

comparison_started
comparison_completed
competitor_viewed

marketplace_category_viewed
provider_viewed
provider_outbound_clicked

randy_opened
randy_engaged
randy_recommendation_created
randy_booking_handoff

booking_started
rental_option_selected
delivery_date_selected

customer_info_started
customer_info_completed

checkout_started
payment_completed

form_started
form_validation_error
form_submitted

error_experienced
```

Do not send customer PII such as phone, email, street address, payment details, or free-form message content into general analytics event properties.

Session replay must mask sensitive form inputs.

---


# 16.1 Location, Privacy Consent, and Returning Junker Direction

## Opt-in location

Serviceability must never depend on silent device geolocation.

The preferred customer experience is:

```text
City or ZIP
[________________]   [ Use My Location ]
```

Rules:

- City or ZIP entry always remains available.
- **Use My Location** is an explicit opt-in action.
- The browser/device permission prompt appears only after the customer chooses that action.
- Approved location data is used to resolve the customer to a service city/ZIP/zone and current pricing context.
- For general analytics and demand reporting, retain the **resolved city, ZIP, or service area**, not precise latitude/longitude.
- Do not persist exact coordinates unless a later feature has a specific operational need, the privacy notice clearly explains it, and the user has given appropriate consent.
- A returning visitor may optionally have their last approved service area remembered as a preference, subject to consent settings.

Suggested analytics events:

- `location_entry_method_selected` with method = manual or device;
- `location_permission_granted`;
- `location_permission_denied`;
- `serviceability_checked`;
- `service_area_confirmed`;
- `service_area_rejected`.

Do not put precise coordinates into general analytics event properties.

## Privacy / cookie consent

The approved brand headline is:

> **We don't trash your privacy.**

The consent interface should remain fun in tone but unambiguous in choices.

Minimum controls:

- **Accept All**
- **Reject Non-Essential**
- **Manage Preferences**

Consent categories should distinguish at least:

- Necessary;
- Analytics;
- Marketing;
- Preferences;
- Session replay, either as its own category or explicitly disclosed under Analytics.

Non-essential analytics/marketing behavior must respect the selected consent state. The implementation must wire the consent choice into Google Consent Mode and any product-analytics/session-replay tooling rather than merely displaying a cosmetic banner.

Privacy Policy and Cookie Policy links must be available directly from the consent interface.

## Returning customer login

**Returning customer login** is the working name for the future repeat-customer account experience.

Purpose:

- give repeat customers a lightweight login;
- remember basic customer preferences;
- reduce repeated data entry;
- make repeat rentals easier.

Initial concept may include:

- first name;
- verified phone and/or email login;
- preferred language;
- saved service location(s) or city/ZIP;
- rental history or recent dumpster size where appropriate;
- saved customer preferences that are safe and useful.

The final authentication method and exact data model are not locked yet.

Guidelines:

- keep the account lightweight;
- do not require account creation to browse pricing or complete a first rental unless a later approved business rule says otherwise;
- avoid collecting data merely because it could be collected;
- marketing consent remains separate from login/account creation;
- saved location/preferences must follow the privacy-consent rules above.

Returning customer login is a future customer-experience feature and should be considered when designing session/context handoff, but it is not required to block the initial V2 public-site launch unless later promoted into launch scope.

---

# 17. Security Requirements

Bot/spam protection is required **from day one** because Little Junkers previously suffered large-scale garbage lead creation through the Odoo website.

The V2 public intake architecture should be layered:

```text
Internet
   ↓
Vercel DDoS / Firewall / Bot protections
   ↓
Route-specific rate limiting
   ↓
Human verification for record-creating actions
   ↓
Strict server-side validation
   ↓
Spam / velocity / duplicate checks
   ↓
Intake / quarantine decision
   ↓
Canonical Supabase business records
```

Rules:

- all public customer/contact intake must follow the production `harmonized_intake_contract`: one canonical `contacts` master, one preserved `customer_inquiries` event per submission, and a typed one-to-one detail table for service-specific fields;
- the V2 Contact form must submit through the canonical server-side public inquiry boundary (`/api/public-inquiry`, with `/api/contact-form` treated only as the compatibility alias) and must not insert directly from the browser into Supabase;
- the server-owned intake path calls `public.create_public_inquiry(jsonb)` using privileged server credentials; public/anonymous clients do not receive write access to `contacts`, `customer_inquiries`, or `contact_request_details`;
- contact submissions preserve the submitted identity snapshot and resolve against the canonical contact by exact normalized phone/email rules; existing contact values are never silently overwritten when submitted values conflict;
- ambiguous, possible-duplicate, or phone/email-conflict submissions remain reviewable and receive elevated Admin attention rather than being auto-merged;
- every legitimate Contact submission creates its inquiry record plus `contact_request_details` and a related `business_action_items` entry so the request appears in the Admin Inquiries workflow;
- no unaudited wildcard CORS on public write endpoints;
- no public browser access to privileged Supabase credentials;
- strict request schemas and maximum lengths;
- honeypots where useful;
- rate limiting;
- bot-risk logging;
- RLS on exposed Supabase data;
- suspicious submissions should not immediately contaminate canonical customer/lead data;
- WAF/bot rules should be tuned log-first so verified search/AI crawlers and legitimate customers are not accidentally blocked.

---

# 18. Media Strategy

The booking-funnel repository `Little-Junkers-prog/littlejunkers-messenger-bot` currently has a `public/` media library with approximately:

- **50 image assets**
- roughly **68.8 MB**
- 46 JPEGs
- 4 PNGs

It includes:

- 11-yard imagery;
- 16-yard imagery;
- 21-yard imagery;
- Peachtree City;
- Fayetteville;
- Newnan;
- Senoia;
- Tyrone;
- Fairburn;
- loaded/overloaded examples;
- truck/delivery photos;
- Little Junkers logo;
- Marcus and Ivy photography.

The V2 media plan should:

- preserve original first-party assets;
- normalize filenames;
- maintain meaningful metadata/alt text;
- optimize through Next.js;
- avoid hotlinking production website content to raw GitHub assets;
- adopt the approved shared media source-of-truth decision during foundation work.

---

# 18.1 Homepage owner story and map guidance

## Marcus and Ivy story

The full founder/owner story belongs on `/about-us`, where it can be told properly without slowing the homepage conversion flow.

The homepage should still retain a compact trust section with:
- a real Marcus and Ivy photo;
- a short statement that Little Junkers is locally owned by Marcus and Ivy Griffin;
- one or two human lines about why they started Little Junkers / how they approach customers;
- a **Meet Marcus & Ivy** link to `/about-us`.

Do not duplicate the full About page story on the homepage.

## Map guidance

Do not add a Google Maps embed solely as a local-ranking tactic.

Current Google Business Profile guidance identifies local ranking primarily through **relevance, distance, and prominence**. The roadmap should therefore prioritize accurate Business Profile data, service-area relevance, reviews, links/mentions, strong local pages, and consistent entity information.

A map may be used when it improves the customer experience:
- preferably on `/service-areas`;
- potentially on Contact if it helps explain coverage;
- city/service-area visuals may show coverage without implying an office/customer-facing location that is not public.

Do not place a map on the homepage unless later usability testing shows it materially helps customers.

---

# 19. Content Standard

The existing Odoo copy is **reference material**, not approved V2 copy.

Problems already identified:

- generic AI phrasing;
- overtechnical language;
- awkward word order;
- confusing sentences;
- repetitive marketing claims;
- old unsupported claims;
- implementation/background instructions appearing publicly;
- placeholder content;
- inconsistent business facts.

V2 copy should be:

- short;
- clear;
- local;
- useful;
- direct;
- human;
- specific.

Avoid:

- keyword stuffing;
- generic corporate filler;
- prompt/instruction leakage;
- unsupported superlatives;
- implementation jargon;
- excessive adjectives.

Real Little Junkers operations and photography should provide first-party content instead of mass-generated generic SEO copy.

---

# 19.1 Randy Character Identity

The canonical Randy visual specification is maintained in:

- `docs/RANDY-CHARACTER-SPEC.md`

Locked direction:
- Randy is a Black adult male cartoon character;
- black Little Junkers work/polo shirt;
- black cap using the approved Little Junkers **raccoon logo**, never `LJ` lettering;
- illustration and surrounding UI must use the exact brand-guide palette and the site's system font stack;
- homepage may introduce Randy with a larger character treatment;
- all other public pages use the persistent Randy chat bubble, which opens the dedicated chat modal experience.

Future Randy artwork must be derived from one master character reference rather than independently regenerated with drifting facial features, skin tone, clothing, or logo treatment.

---

# 19.2 Human Copy Standard

All V2 customer-facing copy should sound like a real Little Junkers owner/employee talking to a local customer, not like generated marketing prose.

Use:
- short sentences;
- concrete words;
- plain language;
- real project examples;
- direct answers;
- local references only when they are genuinely useful;
- natural contractions;
- restrained personality.

Avoid:
- generic benefit stacking;
- phrases that sound like ad-agency copy;
- overexplaining obvious UI;
- repetitive claims across adjacent sections;
- abstract language such as “seamless experience,” “tailored solution,” “stress-free journey,” “designed with you in mind,” or similar AI/corporate filler;
- unnecessary adjectives;
- writing every section as a headline + subtitle + explanatory paragraph when the visual already communicates the point.

A useful test:

> **Would Marcus or Ivy actually say this to a customer?**

If not, rewrite it.

Another test:

> **Can we remove 20–30% of the words without losing meaning?**

If yes, remove them.

Real Little Junkers photos, jobs, customer questions, and operating experience should carry more of the page than explanatory copy.

# 19.19 Contact Page Final Visual Approval

**Contact V1 desktop and mobile designs are visually approved — October 1, 2026.**

Locked direction:
- shared V2 cream/off-white visual foundation with dark header/footer framing;
- human Randy persistent chat bubble;
- hero with Call, Text, and Book a Dumpster actions;
- clear split between new-rental/bulk-pickup questions and existing-customer support;
- short harmonized Contact form using the canonical public-inquiry/Supabase contract;
- service-area checker/supporting local proof;
- mobile layout approved as part of this design pass;
- exact Brand Guide pink/neutral tokens and official Little Junkers logo assets are required in implementation.

# 19.18 About Us V3 Final Visual Approval

**About Us V3 is visually approved — October 1, 2026.**

Final approval includes the shared V2 visual foundation, official Little Junkers source-logo usage, real local photography direction, the pink final-word/phrase hero accent where natural, and the locked human Randy assistant.

Locked corrections:
- Little Junkers is a dumpster rental company, not a junk-removal company;
- Bulk Pickup is a limited pilot and remains secondary;
- copy should be shorter, more personal, and more factual;
- Marcus and Ivy Griffin are the owner story;
- visible city links remain Peachtree City, Fayetteville, and Newnan, plus View All Service Areas;
- product/service references link internally;
- Randy persistent chat bubble is required;
- the About page introduces the company story but does not try to tell the entire story;
- the richer founder/origin narrative belongs in a pinned blog article: **The Little Junkers Story**.

Brand-guide colors remain authoritative over mockup colors.
# 19.17 Bulk Pickup Consolidated Funnel Architecture Approval

The Bulk Pickup V2 landing page and its **How It Works** section are approved against the consolidated four-stage customer journey:

1. **Build Your Pickup**
   - location / ZIP eligibility;
   - item and dumpster-bag selection;
   - server-calculated quote;
   - available route-date selection.

2. **Add Your Details**
   - shared customer-details shell;
   - contact information;
   - service address;
   - placement instructions;
   - consent handling.

3. **Review Your Order**
   - item summary;
   - pickup date and address;
   - exact total;
   - outside-only and material rules;
   - cancellation / no-access terms.

4. **Pay Online**
   - shared embedded Stripe Payment Element.

Confirmation follows payment as a state, not a separate funnel decision step.

Do not revert the Bulk Pickup UX to the earlier six-screen Location → Items → Date → Details → Review → Payment model unless the owner explicitly changes direction.

# 19.16 Bulk Pickup Landing Page Visual Approval

The revised Bulk Pickup landing page is approved.

Locked visual decisions:
- Bulk Pickup is the dominant page purpose;
- Dumpster Rental is a smaller alternative path, not an equal sibling card;
- hero leads with **Curbside pickup from $79.99**;
- primary CTA is **Check Availability & Book**;
- standard-item and dumpster-bag pricing are both visible;
- literal item-count examples are shown;
- service rules and pilot route schedule are visible but compact;
- mobile uses collapsed/progressive sections;
- Randy persistent chat bubble is present;
- production pink usage stays restrained and uses exact Brand Guide values.

# 19.15 Bulk Pickup V1.9 Website Dependency

Bulk Pickup Version 1.9 is the approved implementation-planning scope.

Important distinction:
- the **approved future pricing model** is first standard item **$79.99**, each additional standard item **$19.99**, first dumpster bag **$125.00**, additional bag **$85.00**;
- production Supabase still contains the legacy item-specific `curbside_items` pricing model by design;
- no production bulk-pickup pricing/schema conversion has been applied yet.

The public website must not treat the legacy item-specific catalog as the source for the new customer experience.

**Scope update — October 1, 2026:** Little Junkers is dropping the separate Additional Services hub. Outside of dumpster rental, the only approved additional service is the limited **Bulk Pickup curbside pilot**. `/bulk-pickup` is the sole additional-service landing page and is published/converted only after the production bulk-pickup funnel is verified.

Website route ownership:
- `/bulk-pickup` = the only approved additional-service landing page;
- `/additional-services` = retired from V2 scope; if the legacy route remains publicly reachable, redirect it to `/bulk-pickup`;
- every Bulk Pickup booking CTA points to `https://book.littlejunkersllc.com/bulk-pickup` once the verified production funnel exists;
- do not create placeholder pages or navigation for speculative future services unless a later approved scope explicitly adds them.

Website-facing locked rules:
- outside-only pickup;
- exact prepaid pricing before checkout;
- pilot ZIP/day schedule only;
- 10-stop route-date capacity;
- 200 lb / one-person-with-dolly standard-item rule;
- literal physical-item counting;
- mixed-order formula where first bag is the base;
- no separate pilot surcharge for tires, mattresses/box springs, refrigerators, or ordinary appliances;
- no indoor removal;
- no onsite additions/substitutions;
- $35 late-cancellation fee inside 24 hours;
- $35 no-access/driver-run fee;
- persistent mobile Check Availability CTA;
- primary bulk CTA starts at location eligibility;
- dumpster alternative remains visible for larger piles, construction debris, or ineligible bulk ZIPs.

Do not publish broad South Atlanta bulk-pickup availability until ZIP coverage is actually enabled.

# 19.14 FAQ Page Visual Approval

The revised FAQ page is approved.

Do not reopen these decisions without an explicit owner change:
- restrained, professional visual treatment;
- pink remains an accent color, not a dominant surface color;
- FAQ search hero;
- category shortcuts;
- Top 5 Questions;
- topic-based accordions;
- compact support CTA;
- mobile collapsed/expandable treatment;
- Randy bubble only.

Brand-guide design tokens remain authoritative over mockup-generated colors.

# 19.13 Materials Page Visual Approval

The revised Materials / What Can I Put in a Dumpster page is approved.

Do not reopen these decisions without an explicit owner change:
- item-search hero;
- real-item imagery;
- allowed / accepted-with-instructions / prohibited rule framing;
- 4 + **See all** pattern for allowed and prohibited lists;
- infographic-style HTML expansion for full lists;
- compact Heavy Project callout;
- larger Accepted with Instructions treatment;
- removal of Common Projects image carousel;
- capped FAQ;
- Randy bubble only;
- mobile progressive disclosure.

Brand-guide design tokens remain authoritative over mockup-generated colors.

# 19.12 Mobile Design Gate

Mobile is the primary conversion-design target and requires its own review pass after the initial desktop/concept page set is approved.

Before final implementation, every Tier 1 page gets a dedicated mobile scan focused on:
- scroll depth;
- stacked-card length;
- image density;
- CTA reachability;
- progressive disclosure;
- tap-to-expand behavior;
- carousel vs stacked-gallery choices;
- full-screen mobile sheets/modals for dense secondary information;
- Randy, privacy controls, and sticky/fixed UI collision;
- preservation of required pricing, safety, consent, and transaction information.

Preferred mobile principle:

> **Show the answer first. Let the customer tap for detail.**

Approved reusable patterns include:
- short preview lists + **See all**;
- accordions;
- bottom sheets/full-screen modals;
- compact carousels;
- collapsed FAQs;
- focused helper-tool screens.

Desktop approval alone does not make a page implementation-ready. Mobile decisions must also be recorded.

# 19.11 Dumpster Materials Page Rules

The Materials page uses a visual, real-item-photo approach and must distinguish:

- **Allowed**
- **Accepted with instructions**
- **Not accepted**

Locked operational rules:
- paint is accepted if dried out or securely sealed; wet/open/leaking paint is not accepted;
- lithium batteries and car batteries may be coordinated for recycling but must **not** be placed inside the dumpster; set them at the front/outside and/or notify Little Junkers;
- motor oil may be coordinated for recycling up to **10 quarts**, sealed and kept outside the dumpster; over 10 quarts is not accepted through normal dumpster rental;
- compressed cylinders, including helium tanks and fire extinguishers, are prohibited;
- dirt and concrete are prohibited;
- roofing shingles are allowed subject to weight limits;
- do not present item-specific disposal fees as checkout add-ons unless checkout actually supports and verifies those charges.

The current Supabase schema does not have a dedicated dumpster-material-rules table; `curbside_items` must not be reused as a substitute. A canonical dumpster-material-rule source should be established during implementation so the Materials page, FAQ, Randy, Weight Estimator, and booking remain consistent.

Roofing Weight Estimator logic must ask for **roofing squares** and **number of layers**, with material type as needed, before generating an approximate load-weight recommendation.

Materials mobile density rule:
- remove the Common Projects image section;
- common allowed items show 4 + **See all**;
- prohibited items show 4 + **See all**;
- full allowed/prohibited guides expand into accessible infographic-style HTML UI rather than static images;
- shrink the Heavy Project callout and give Accepted with Instructions more room.

# 19.10 Commercial / Contractor Page Visual Approval

The Commercial / Contractor Dumpster Rental page mockup is approved.

Do not reopen these decisions without an explicit owner change:
- contractor-first hero and location entry;
- project-type choices;
- simple three-size contractor selection;
- prominent Weight Estimator placement;
- jobsite-detail trust section;
- real contractor-project carousel;
- three-step booking/fulfillment flow;
- secondary comparison-tool link;
- compact helper-tool links;
- capped FAQ;
- Randy bubble only.

Brand-guide design tokens remain authoritative over mockup-generated colors.

# 19.9 Residential Page Visual Approval

The Residential Dumpster Rental page mockup is approved.

Do not reopen these decisions without an explicit owner change:
- homeowner-first hero and location entry;
- four project categories;
- simple three-size selection;
- driveway/property-care emphasis;
- three-step delivery flow;
- combined materials + Weight Estimator help;
- real residential-project carousel;
- pricing reassurance with secondary comparison-tool link;
- capped FAQ;
- Randy bubble only.

Brand-guide design tokens remain authoritative over mockup-generated colors.

# 19.8 Newnan V2 City-Page Visual Approval

The Newnan V2 mockup is approved as the canonical visual template for priority city pages.

Reuse its page grammar for Sharpsburg, Senoia, Peachtree City, Fayetteville, Tyrone, and Fairburn where those pages are in scope.

Do not reopen the following without an explicit owner change:
- local hero structure;
- local grounding line;
- pricing-card placement;
- call/text secondary CTA;
- first-party project proof block;
- compact service-area graphic;
- compact materials section;
- capped FAQ;
- nearby-city links;
- persistent Randy bubble only.

Brand-guide design tokens remain authoritative over mockup-generated color values.

# 19.7 City Page Local Authority Standard

City pages must earn local relevance through **first-party evidence**, not keyword expansion.

Preferred evidence:
- canonical city/ZIP/zone/fee data;
- county/geographic context;
- real Little Junkers project photos from that market;
- real project types and dumpster sizes;
- locally relevant placement or permitting guidance from authoritative local sources;
- nearby-city internal links;
- real approved customer comments when available.

Avoid:
- generic city history;
- neighborhood-name stuffing;
- fabricated testimonials;
- unsupported permit statements;
- publishing ZIPs that are not in the current service-area source;
- repeating the full Service Areas map on every city page.

For Newnan specifically, current canonical service ZIPs are **30263 and 30265**, Zone A has a **$0 delivery fee**, and the page should identify **Coweta County** naturally.

A larger Randy promotional panel is not part of the city-page template; use the persistent Randy chat bubble only.

# 19.6 City Page Internal Linking and Template Rule

Service-area city names should link to their dedicated city page whenever a substantial city page exists.

Planned city pages:
- Peachtree City;
- Newnan;
- Fayetteville;
- Sharpsburg;
- Senoia;
- Tyrone;
- Fairburn.

Do not create thin doorway pages solely to make every service-area city label clickable. Cities without a dedicated page remain plain text until there is enough real content/evidence to justify a page.

All priority city pages use the shared city-page template in `docs/TIER-1-PAGE-SPECS.md`, but must include city-specific first-party evidence so the pages do not become city-name substitutions.

# 19.5 Service Areas Page Rules

The Service Areas hub is a serviceability/coverage tool, not another general marketing page.

Locked rules:
- delivery fee is a **separate line item** from base dumpster pricing;
- Zone A displays **Free delivery / $0**;
- Zone B displays the current **+$59 delivery fee**;
- Zone C displays the current **+$99 delivery fee**;
- current Supabase delivery fees are Zone A **$0.00**, Zone B **$59.00**, Zone C **$99.00**;
- fees remain canonical-data driven even when these current values are displayed in the UI;
- map coverage must be driven by active `public.zip_codes` zone assignments, not manually-maintained city assumptions;
- current active ZIP counts are Zone A **12**, Zone B **30**, Zone C **88**;
- city labels are only presentation helpers because some city labels span more than one zone (Atlanta currently appears in both Zone B and Zone C);
- Supabase-verified Zone A city labels are **Brooks, Fairburn, Fayetteville, Newnan, Palmetto, Peachtree City, Senoia, Sharpsburg, Tyrone, and Union City**;
- Sharpsburg and Union City belong in the free-delivery/core area;
- the coverage map must visibly represent all three areas, including the extended zone;
- the map legend carries the zone-fee explanation, so do not add a separate duplicate **Why Location Matters** block;
- place **Don't see your city?** directly with the map/core service-area content;
- remove large in-page Randy treatment; use the standard persistent chat bubble only;
- operational availability, including **Next day delivery available**, is shown only when current data supports the claim.

# 19.4 Size Guide Visual Rule

The Dumpster Size Guide / Recommendation page should not stack multiple sections that look like repeated product galleries.

Use two distinct visual languages:

- **Size reference:** clean product/diagram-style visuals with very short labels.
- **Real-world proof:** actual Little Junkers field photography in a carousel.

The helper page is an approved exception to the ordinary interior-page Randy treatment: Randy may be larger inside the recommendation tool to reinforce the assisted-selection experience. The persistent chat bubble remains available elsewhere on the page.

# 19.3 Dumpster Product Page Template

The approved **11-Yard Little Junker** page structure is the canonical template for all three dumpster product pages.

Apply the same page grammar to:
- `/11-yard-the-little-junker`
- `/16-yard-the-mighty-middler`
- `/21-yard-the-big-junker`

Shared structure:
1. concise photo-led hero with live location-aware price;
2. four project-fit examples;
3. one adjacent size-guidance card (upsell or downsell as appropriate);
4. **What fits** section with practical capacity examples;
5. optional **Estimate My Load** entry point;
6. dedicated **Dumpster size & footprint** dimension block;
7. clear price summary / booking action;
8. compact materials guidance;
9. **Junker in the wild** real-project carousel;
10. capped size-specific FAQ;
11. standard footer plus persistent Randy chat bubble.

Do not redesign each size page independently.

What changes by size:
- hero copy;
- real dumpster photography;
- dimensions;
- live price / included tonnage / duration;
- project-fit examples;
- capacity examples;
- heavy-material cautions;
- adjacent-size recommendation;
- real project carousel content;
- FAQ answers.

Copy must follow the Human Copy Standard and should become **shorter**, not more elaborate, when the same information is already communicated visually.

# 20. Blog Strategy

Keep `/blog`, but stop treating it as a generic AI SEO-content factory.

Prefer first-party operational articles such as:

- a real Newnan project using 21-yard then 11-yard dumpsters;
- what an overloaded 16-yard looks like;
- real Fayette County driveway placements;
- how roofing debris affects weight;
- actual loading examples;
- local project lessons.

Also treat **Events** as a first-class blog/content section for genuine Little Junkers community activity, such as:
- neighborhood or community cleanup events;
- cleanup events with local real estate agents or other approved partners;
- Touch a Truck events;
- local sponsorship/community appearances;
- post-event recaps with first-party photos.

Event content remains under the same clean article URL system: `/blog/[slug]`. Do not create a separate `/events` silo unless future content volume and navigation needs justify it.

Upcoming event posts should clearly show the event date, location/area, participation details, and any partner attribution that is approved for public use. Past events may remain as recaps when they provide durable local/community value.

Event posts still require the normal INDEX/NOINDEX decision. A one-time announcement does not automatically deserve permanent search indexing; a substantive local recap with original photos, partners, and community value may.

First-hand operational and community evidence is more valuable than interchangeable listicles.

## 20.1 Blog publishing architecture — authoring method TBD

The final authoring method is intentionally **not locked yet**. It may ultimately be:

- a lightweight CMS;
- an Admin OS publishing screen;
- a Git/MDX workflow;
- or another controlled content system.

Do not choose an authoring system merely because it is convenient for developers. The publishing workflow must be simple enough for Little Junkers to create and maintain useful content without editing application code for every article.

Regardless of the authoring system selected, every article record must support at least:

- title;
- slug;
- language;
- status: draft / published / archived;
- publish date;
- author;
- summary/excerpt;
- hero/media;
- article body;
- related dumpster size, project type, and/or service area where relevant;
- canonical URL;
- SEO title and description;
- structured-data fields required by the article template;
- internal-link targets;
- **indexing decision: INDEX or NOINDEX**.

## 20.2 INDEX vs. NOINDEX is a mandatory publishing decision

Every new blog post must receive an explicit indexing decision before publication.

**Do not silently default every published post to INDEX.**

The publishing workflow must visibly flag and require one of:

### INDEX

Use when the article has durable search/customer value, meaningful original content, and deserves its own Google-search entry point.

Examples:

- how much roofing debris fits in a dumpster;
- a real Newnan project case study;
- choosing between 11-, 16-, and 21-yard dumpsters;
- driveway-placement lessons;
- real loading/weight guidance.

An INDEX article should:

- be crawlable;
- use a self-referencing canonical;
- be eligible for the XML sitemap;
- have unique metadata;
- use appropriate Article/BlogPosting structured data;
- contain useful internal links to relevant commercial pages;
- have a clear conversion path such as size selection, pricing, serviceability, or booking;
- have a Spanish counterpart when the content is selected for bilingual publication.

### NOINDEX

Use when the content is useful to customers or distribution channels but does not deserve a permanent search-result page.

Examples:

- short-term promotions;
- temporary announcements;
- event notices;
- thin updates;
- duplicate/supporting campaign content;
- content created primarily as a destination for a Google Business Profile or social post when it lacks durable standalone search value.

A NOINDEX article/page should:

- use `noindex,follow` unless a later technical requirement says otherwise;
- be excluded from the XML sitemap;
- remain accessible through direct links where useful;
- not be treated as SEO inventory.

### Drafts

Draft content must never be indexable or included in the sitemap.

## 20.3 Blog-to-distribution workflow

A strong first-party article can become the permanent source asset for multiple channels:

```text
Real Little Junkers project / customer question
        ↓
Permanent website article
        ↓
Google Business Profile post
Facebook / Instagram post
Email or customer education
        ↓
Link back to the article or the most relevant conversion page
```

Google Business Profile posts and social posts are distribution channels; the website article is the durable content asset when the subject merits one.

Do not create a new indexable blog URL merely because a Google Business Profile post is being published.

## 20.4A Blog final design approval

**Blog/Junker Journal index and article templates are visually approved — October 1, 2026.**

The approved system is intentionally data-driven so operational facts can flow into publishing without custom page coding.

Core product principle:

```text
Confirmed rental/job data from Supabase
+ first-party job-site photos
+ short owner/driver notes or anecdotes
        ->
agent-generated draft package
        ->
human review/approval
        ->
published article + approved distribution derivatives
```

Architecture boundary:
- Supabase remains the source of truth for rentals, service location, named dumpster assignment, dates, and other confirmed operational facts;
- the operator adds only the context the system cannot already know, such as the anecdote, project lesson, partner-safe context, photo selection, or noteworthy detail;
- GitHub governs website code, templates, schemas, and publishing integration logic;
- published article records/media should flow through the approved content/data layer and should not require editing application code for each post;
- Vercel/Next.js renders the approved content into the shared Blog/article templates;
- an agent may compose from confirmed system data but may not replace or contradict those facts.

This architecture is intended to make the transition from field operation to public content feel like one continuous Little Junkers workflow.

## 20.4 Agent-assisted field publishing

The Blog architecture must support an owner/driver workflow that begins at the job site, not at a desktop CMS.

Target workflow:

```text
Phone from the truck
    ->
upload 3-4 real job-site photos
    ->
select/confirm structured job facts
    ->
agent drafts article package
    ->
human review/edit
    ->
publish or save draft
```

Minimum structured inputs should include:
- city/service area;
- job/project type;
- physical dumpster **unit name** as the primary operator-facing identifier;
- dumpster size/capacity derived from the canonical inventory/unit record rather than guessed by the agent;
- optional customer-safe project notes;
- optional partner/contractor attribution when approved;
- optional before/after or sequence designation for photos;
- explicit permission/visibility flags where customer/property privacy requires them.

Little Junkers names its individual cans. The publishing UI should preserve that personality: operators select the named unit they actually used. The system may derive the corresponding size/capacity and product-page link from canonical inventory data.

The agent may draft:
- headline/title options;
- clean slug;
- short excerpt;
- article body;
- image captions/alt-text suggestions;
- context tags;
- internal-link suggestions;
- social/GBP derivative copy;
- SEO title/description;
- INDEX/NOINDEX recommendation with rationale.

The agent must **not** autonomously invent customer facts, job scope, weights, pricing, partner names, dates, locations, or operational outcomes. Structured facts are authoritative; image interpretation may assist drafting but never replace explicit job metadata for business facts.

Initial publishing should remain human-approved. Agent-created content enters `draft` status by default. Fully autonomous publication is a later governance decision and is not implied by agent-assisted drafting.

The article template and Blog index must therefore be data-driven enough that an approved draft can populate the existing Real Jobs, Helpful Guides, Events, and Around Our Neighborhoods presentation without custom page coding.

## 20.5 Blog performance standard

Blogging is intended to improve website performance through:

- additional relevant search entry points;
- first-party expertise and local evidence;
- stronger internal linking to size, city, project, pricing, and booking pages;
- customer education that removes objections before checkout;
- content that can be reused in Google Business Profile and social channels;
- measurable assisted conversions.

Measure articles by more than pageviews. Track:

- organic impressions and clicks;
- query relevance;
- engaged visits;
- clicks to pricing/product/service-area pages;
- recommendation-tool starts;
- booking starts;
- assisted paid rentals.

Do not use publishing frequency or raw article count as a success metric.

---

# 20.6 Spanish Core Experience Final Visual Approval

**Spanish V2 desktop and mobile experience approved — October 1, 2026.**

Locked direction:
- Spanish uses the same shared V2 visual foundation as English;
- natural U.S. Spanish localization, not literal machine translation;
- English business intent/rules remain the source reference while canonical pricing, service areas, fees, sizes, and operating rules come from the same shared data sources as English;
- critical transactional copy receives an additional language-quality check before launch;
- language selection persists across website, Randy, recommendation, and booking;
- Spanish pages use natural Spanish slugs under `/es`;
- Randy remains a discreet persistent bottom chat bubble and must not appear as a dedicated mid-page section unless a later page-specific approval explicitly requires it;
- Spanish Blog/article presentation follows the approved Blog templates and clean URL rules;
- desktop/mobile layouts are approved as the representative Spanish design pattern for the broader core journey.

# 20.7 Dumpster Checkout Remediation — Approved Architecture

**Approved October 1, 2026. Status updated October 2, 2026: the emergency checkout remediation is complete and closed. Preserve the architecture below as the settled reference; do not reopen it unless a new production defect or explicit new requirement appears. Active website work returns to the Tier 1 public-site migration and full mobile-scan gate.**

The current self-serve/CSR checkout journey is fragmented and must be repaired before the broader V2 website rollout. Preserve the existing transaction authority and operational contracts; replace the customer-facing duplication and hosted-checkout fragmentation.

## Locked customer journey

```text
Choose dumpster
    ->
Choose rental length + drop-off date
    ->
Unified Customer Details
    ->
Review & Pay (embedded Stripe)
    ->
Booking Confirmation
```

Do not add another customer-information form anywhere in this path.

### 1. Choose dumpster
Current funnel behavior remains unchanged for the immediate patch.

### 2. Choose rental length + drop-off date
Current funnel behavior remains unchanged for the immediate patch.

### 3. Unified Customer Details
This is the **only customer-information entry page**.

Self-serve entry:
- size/rental/date are already known;
- customer/contact/address fields begin blank unless valid session/customer context already exists;
- customer enters the remaining information once.

CSR/manual-link entry:
- the same page must accept a hold/link with **as little as only the selected size and drop-off/rental date**;
- any customer fields not supplied by CSR remain blank for the customer to complete;
- any fields supplied by CSR are prefilled;
- a rebook flow may prefill name, email, phone, customer type, billing/contact address, service address, business fields, and any other approved reusable booking data;
- customer may review/correct prefilled information before continuing;
- no field may be required merely because CSR did not supply it earlier if the customer can complete it on this page.

Customer type:
- Home / Residential;
- Business;
- Contractor.

Address and serviceability:
- use structured address fields: street, city, state, ZIP;
- for a Home/Residential booking where the entered address is the service address, service state is fixed to Georgia (GA) and displayed read-only/disabled;
- billing/contact addresses for Business/Contractor customers may be located in any state and must not be used to determine serviceability;
- ZIP on the **service/jobsite address** is the required commercial input;
- when the service ZIP is entered or changed, the system must resolve the canonical service area and applicable delivery fee before Review & Pay;
- if the service ZIP is not in an approved service area, the customer must be blocked from continuing to payment and shown a clear out-of-area message;
- out-of-area attempts should follow the approved lead/alert handling instead of allowing payment and requiring a later refund;
- Business/Contractor flows may use a separate structured service/jobsite address from billing/contact address; service/jobsite state is fixed to GA and service ZIP alone drives serviceability and delivery-fee logic;
- Review & Pay must display the resolved delivery fee and service address produced by this validation.


Contractor/business handling:
- support billing/contact address separately from service/jobsite address;
- contractor can use a different service/jobsite address from their own billing/contact address;
- project type is **not required for the immediate remediation** and should not be added unless there is a defined operational use.

Consent:
- service/rental update texts and marketing texts remain distinct choices;
- explain clearly why there are two choices;
- service/rental-update consent may follow the approved current default behavior;
- marketing remains optional and separate.

### 4. Review & Pay
This is the **single payment page**.

Requirements:
- no customer-information re-entry;
- show rental, delivery/service, contact/customer-type, and pricing summary;
- provide obvious **Edit** actions beside editable sections;
- embedded Stripe Payment Element remains inside the Little Junkers page;
- support Stripe-eligible methods dynamically, including Card, Link, Apple Pay, Google Pay, Cash App, Klarna, Affirm, and other enabled/eligible methods;
- selected alternate payment methods may transition/morph into the Stripe-supported flow as required;
- one final payment action executes the actual payment;
- no intermediary "Proceed to secure checkout" redirect to a separate hosted Stripe Checkout page;
- do not show disabled-promotion-engine implementation language; promo UI is shown only when customer-usable promotions are active.

### 5. Booking Confirmation
After successful payment:
1. clearly state that the customer is booked;
2. state that the confirmation text has been sent;
3. put **What happens next** before the detailed rental recap;
4. explain delivery-window confirmation, on-the-way/ETA messaging, and Call/Text support;
5. show compact rental details for reference;
6. optional post-booking survey is limited to **How did you hear about us?** for the immediate patch;
7. remove the post-booking project-type question;
8. remove the immediate "Would you recommend us?" question because recommendation/review belongs to the post-rental review flow;
9. survey interaction must have an explicit saved/submitted confirmation state.

## Preserve these backend contracts
Do not redesign or bypass:
- Supabase pricing authority;
- availability;
- canonical booking holds / `unified-checkout-v1`;
- CSR smart-booking-link creation;
- service-area validation and repricing;
- canonical customer/contact resolution;
- separate service vs marketing consent records;
- Stripe payment verification/webhook behavior;
- paid-booking finalizer;
- rental creation;
- booking-confirmation messaging.

## Immediate visual scope
For the remediation release, **do not restyle Steps 1–2 or the pre-existing funnel shell**. The new Unified Customer Details, Review & Pay, and Booking Confirmation pages should visually align with the current production funnel so the patch can ship quickly and safely.

## Deferred V2 visual treatment
The richer V2 Review & Pay and Booking Confirmation concepts approved in October 2026 are retained as the future visual direction. They are intentionally deferred until after the urgent checkout remediation ships. When the V2 website is ready, apply the shared V2 visual system to the entire booking journey without changing the approved checkout architecture above.

# 21. SEO / AIO Principles

Do not use gimmicky “AI SEO.”

Build for:

- crawlability;
- indexability;
- server-rendered useful information;
- consistent entity/business facts;
- strong internal linking;
- local evidence;
- structured data matching visible content;
- direct answers;
- original photos;
- first-party operational expertise.

Every indexable page should be reviewed for:

- title;
- description;
- canonical;
- `hreflang` where applicable;
- one intended H1;
- semantic headings;
- internal links;
- schema where appropriate;
- sitemap inclusion;
- optimized images;
- useful visible text.

Do not create hundreds of thin city × service pages.

---

# 22. Migration / Cutover Principles

Odoo remains live while V2 is built and tested.

The migration is not:

```text
Odoo → visually copy every page
```

It is:

```text
Little Junkers customer/business needs
+ conversion
+ SEO/AIO
+ bilingual UX
+ canonical data
+ analytics
→ V2 architecture
→ map useful Odoo URLs/content into it
```

Before redirect implementation, create an exact URL migration matrix covering:

- current URL;
- current/indexed value;
- V2 destination;
- keep/rebuild/consolidate/redirect/remove decision;
- English/Spanish pairing;
- canonical;
- schema;
- conversion role;
- data dependencies;
- redirect rule.

Do not mass-redirect unrelated dead pages to the homepage.

---

# 23. Governance Roadmap

Future Phase 0 governance should add/maintain:

```text
AGENTS.md
CLAUDE.md
PROJECT-CONTEXT.md
CHANGELOG.md

docs/
  V2-SCOPE.md
  PLATFORM-ARCHITECTURE.md
  SECURITY-STANDARD.md
  CONTENT-STANDARD.md
  ANALYTICS-SPEC.md
  SEO-AIO-STANDARD.md
  MIGRATION-MATRIX.md
  CUTOVER-RUNBOOK.md
  decisions/
      ADR-001-...
```

Future agents must read the governing documents before implementation.

Architectural decisions belong in Git so they have:

- history;
- diffs;
- review;
- rollback;
- association with code changes.

Dynamic business facts belong in their approved canonical business-data source.

---

# 24. Current Planning Status

The Search Console performance/indexing review and migration-routing analysis are complete enough to support the V2 sitemap and Tier 1 page architecture.

The active page-level build contract is now:

- `docs/TIER-1-PAGE-SPECS.md`

That document defines the pre-code specifications for the homepage, pricing, dumpster-size pages, size guide/recommendation, service-area hub and priority city pages, residential, contractor/commercial, materials, FAQ, the limited Bulk Pickup curbside pilot, About, Contact, Spanish core experience, and booking handoff.

Before application-page coding begins, the owner should review and approve or revise the page-level decisions in that document.

After page-spec approval, the next implementation stage is **Phase 0 / platform foundation and governance**, not ad-hoc page coding.

---

# 25. Change Control

This file is intended to preserve strategy, not freeze Little Junkers permanently.

When an approved decision changes:

1. update this archive or explicitly supersede it with an ADR/governing document;
2. document what changed;
3. document why it changed;
4. update affected sitemap/build priorities/technical requirements;
5. update the changelog;
6. do not leave contradictory active instructions in different files.

If newer approved documentation conflicts with this archive, the newer explicit decision controls **only when the supersession is documented clearly**.

---

# Owner-Approved Direction Summary

The current roadmap is built around these principles:

> **Conversion first.**

> **English and Spanish end to end.**

> **Live, crawlable pricing from canonical data.**

> **Secure every public data-write path from day one.**

> **Website and booking should feel like one product.**

> **Track the full visitor journey and friction, not just pageviews.**

> **Use real Little Junkers photos and real operating experience.**

> **Do not let future AI agents silently undo approved decisions.**

> **Build Little Junkers like a technology company that rents dumpsters.**
