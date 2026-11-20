# V2 SEO, AI Search & City Content Audit
**Review date:** November 20, 2026
**Review branch:** `feature/city-pages-preserve-seo-20261120` / PR #9
**Status:** Review-only; no public cutover, indexability activation or checkout changes authorized.

## Sources actually inspected

1. V2 Next.js source: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, city router and template, `lib/cities.ts`, city/size/pricing/compare/home/service-area/plan pages, header/footer, canonical `lib/pricing.ts`, booking-context links, and `next.config.ts`.
2. All seven legacy Odoo city pages (public site, live scrape on November 20): `/dumpster-rental-{newnan,sharpsburg,senoia,peachtree-city,fayetteville,tyrone,fairburn}-little-junkers`. Newnan and `/service-areas` were inspected more deeply, including HTML head fields.
3. `PROJECT-CHARTER.md`, `STRATEGY-ARCHIVE.md` §4.2/§19/§21–24 and `docs/TIER-1-PAGE-SPECS.md` §2/§9A–14.
4. Public Google documentation:
   - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
   - https://developers.google.com/search/docs/appearance/ai-features
   - https://developers.google.com/search/docs/appearance/title-link

A protected Vercel preview serves a login screen to an unauthenticated crawler. **The audit therefore verifies V2 source code and deployment checks, not live rendered V2 HTML, CWV measurements, current rankings, or actual index state.** A raw Google Search Console export was not found in the V2 repository. Source-backed historical GSC conclusions exist in the strategy/page specs; these must not be confused with today's metrics.

## Key findings and actions (priority ordered)

### P0. Preserve all valuable legacy intent pages before cutover
**Confirmed from repository:** All seven city slugs, three size slugs, service-areas hub, pricing, blog, comparison and the core educational pages have routes. The approved Tier 1 matrix also lists `/residential-dumpster-rental`, `/commercial-dumpster-rental`, `/contactus`, `/dumpster-size-guide` and a dedicated bulk pickup page, but those routes are not implemented in the current V2 `app/` tree. Spanish equivalents are a separate planned slice.

**Impact:** If cutover occurs before these content/route decisions are resolved, previously useful Odoo pages may 404 or lose their search-specific landing content. These are concrete cutover blockers, not reasons to generate generic content immediately.

**Action:** Create a verified page-to-page migration matrix from a current Google Search Console indexed URLs/pages export, public Odoo URLs, and known backlinks, then build/review missing intent pages with truthful service status or approved one-hop redirects. Do not treat V2's existing `sitemap.ts` as proof that omitted legacy URLs have been handled.

### P1. Human editorial pass on city pages, preserving original SEO substance
**Observed:** Legacy city pages contain a clear renting sequence, Pink Bin explanation, residential hook-lift/driveway relevance, project fit, size links and page-specific meta tags. The initial PR #9 copy added source-justification sentences like "our completed rental records" and "not stock photos" in customer-facing copy, giving the impression of a model proving its work rather than helping a renter.

**Change in PR #9:** Apply the installed Human Prose editing rules, rewrite all seven intros, proof captions, local placement notes, size/delivery FAQs and descriptions in plain homeowner language. Restore a concise rental explanation. Keep verified real project photos in the body rather than duplicating a large photo hero atop every city page. Keep Newnan, Sharpsburg, Senoia, PTC, Fayetteville, Tyrone, Fairburn distinct by supported facts. No invented neighborhoods or testimonials.

**Not carried forward from Odoo without validation:** "best prices", "same-day / next-day", "HOA friendly", "driveway safe" as a guarantee, outdated starting prices, automatic booking success or alleged local job types without source proof.

### P1. Fix meta title branding and distinguish landing-page intent
**Observed:** The V2 root layout already applies `%s | Little Junkers`. Several routes (About, Blog, Compare, long-term, planner) were supplying an additional `| Little Junkers`, resulting in duplicative final title text when rendered. City titles were generic even where local metadata was available.

**Change in PR #9:** Remove duplicate branding from affected static page metadata; add individually checked titles, descriptions and OG photo metadata to seven city pages, using an absolute title to avoid double suffix. Preserve legacy canonical paths. Titles use accurate city/company terms without unverified superlatives.

**Verify:** On the protected preview, inspect the final `<title>`, meta description, canonical, robots, OpenGraph and a single visible H1 on every template after authenticating. Do not infer correct rendered tags solely from TypeScript.

### P1. Give local visitors a direct path and optional competitor research
**Observed:** The old Odoo pages clearly explained a 4-step rental process and CTA; the V2 city pages had a local price module and planner handoff but no contextual comparison path or short rental explanation.

**Change in PR #9:** Text-first city header with `See my estimate` taking the city into `/plan?location=...`, in-page size/pricing cards and a contextual `/compare?location=...` link. Size pages link into `/compare?size=...`. Shared three-step rental explanation reinstated. The comparison tool stays on its dedicated page, so it can maintain verified data, disclosures, consent and outbound-click measurement in one place.

**Checkout decision (not implemented in this PR):** Keep one shared quote/availability/checkout contract. The current `/plan` is a read-only estimate shell and explicitly cannot reserve anything. After the approved quote and Fleet validation are connected, all home/city/size entrances should converge into one verified transaction path using existing booking/Stripe safeguards. No embedded Stripe checkout clones on city pages and no "Book now" claim while bookings remain blocked.

### P2. Keep a clean city header without sacrificing imagery
**Decision under review:** A text-first city header presents location, ZIP/fees, headline and action immediately. Original job photos remain in a substantial proof section; Sharpsburg's general equipment image is labeled as non-Sharpsburg. The homepage can retain its brand-oriented photo hero and the dedicated comparison page its branded banner. There is no proven conversion benefit of a large hero on every city page, so test layout with real visitors post-cutover rather than claiming one format ranks better.

### P2. SEO and AI answer discoverability share the fundamentals
**Source:** Google's AI Features & Your Website guidance states no separate schema, `llms.txt` requirement, or special AI technique is needed to appear in AI Overviews/AI Mode; conventional crawlability, useful visible text, internal links, page experience, images and structured data aligned with displayed facts apply.

**Already present in V2:** page-level H1, canonical, static city route list, sitemap generator, valid LocalBusiness identity with owner first names only, location-aware Service structured data, active service-ZIP lookup, city-to-city and home-to-city links, accessible photo alt text, real images and pricing from one canonical read-only API. Avoid fabricated `FAQPage` rich-result expectations or "AI SEO" fluff.

**Must still verify:** live server-rendered pricing availability/failure state; exact Search Console indexed routes/backlinks; external internal-link 404s; canonical selected by Google; GBP details; photo weight and Core Web Vitals; actual indexability and snippet visibility after cutover.

### P0. Preview noindex is deliberate, not an SEO defect
`lib/indexing.ts` sets `indexable` only when `SITE_INDEXABLE=true`; `app/robots.ts` disallows all preview crawling otherwise, and root metadata adds NOINDEX/NOFOLLOW. This protects the live Odoo site from duplicate V2 content. Enabling indexability or changing the public www domain is a separate owner-approved cutover gate.

## Next release checklist

1. Owner approves the revised seven city page copy, clean image placement, comparison link and planner CTA in the protected preview.
2. Compare rendered preview metadata and main content with source after authenticated access, on mobile and desktop, including page speed.
3. Obtain current Search Console URL/index/queries export and update the migration matrix, especially omitted Tier 1 routes; verify legacy redirects and missing pages.
4. Test canonical service ZIP, price validity, internal links and city-to-planner preservation without placing a booking.
5. Keep `SITE_INDEXABLE` false, leave www on Odoo, do not merge PR #9 until owner signs off.

## Boundaries

These are source-backed technical and editorial findings, not ranking measurements. No promise of stronger Google positions, AI citations, better conversion rate, availability or sales can be inferred from making the changes. Use Search Console and analytics after cutover to test outcomes.
