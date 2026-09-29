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
9. **The comparison tool and We Recommend marketplace are committed V2 product features, but they must not block a stable core booking launch if they need to remain feature-flagged temporarily.**
10. **Protect `main` and move to PR-based governance as part of Phase 0. Future implementation should not rely on unreviewed direct production changes.**

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

# 20. Blog Strategy

Keep `/blog`, but stop treating it as a generic AI SEO-content factory.

Prefer first-party operational articles such as:

- a real Newnan project using 21-yard then 11-yard dumpsters;
- what an overloaded 16-yard looks like;
- real Fayette County driveway placements;
- how roofing debris affects weight;
- actual loading examples;
- local project lessons.

First-hand operational evidence is more valuable than interchangeable listicles.

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

## 20.4 Blog performance standard

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

# 24. Current Next Planning Step

Before application-page coding begins, the next strategic artifact is the **page-by-page migration matrix**.

It should map every current Odoo/public URL to its V2 decision and include:

- Keep / Rebuild / Consolidate / Redirect / Remove;
- V2 English URL;
- V2 Spanish URL;
- search intent;
- conversion role;
- canonical data dependencies;
- schema;
- analytics events;
- media needs;
- internal-link relationships;
- final CTA;
- redirect rule;
- QA status.

Exact city-page URLs should not be locked until the current Odoo/Search Console URL inventory is reviewed.

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
