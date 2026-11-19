# ADR-CX-002 — Shopping-Hub Homepage and Supporting-Page Architecture

**Status:** OWNER APPROVED — November 18, 2026  
**Owner:** Marcus Griffin  
**Supersedes:** Any assumption that the interactive demo replaces dedicated website pages or that the sample copy is approved final copy.  
**Implementation status:** Phase 1 website-only branch authorized; backend / production changes remain gated.

## Context
An interactive first draft placed dumpster selection, comparison, how-it-works and Days Plus planning within one scrolling landing page. Marcus approved the direction but asked whether that meant reducing the number of SEO pages. The clarified and approved answer is: **fewer steps to purchase, not necessarily fewer pages**. The website needs both a rich storefront homepage and dedicated indexable intent pages.

## Decision
1. Make `/` the primary shopping hub: ZIP/serviceability, three dumpster sizes, concise comparison teaser, Days Plus entry point, how-it-works and first-party local trust. A visitor with sufficient intent can progress toward payment without being forced to visit several marketing pages.
2. Retain and improve distinct routes for `/pricing`, `/compare`, each dumpster size, city/service areas, residential/contractor, materials, FAQ, blog, and company information. Links from the homepage are not substitutes for indexable full pages.
3. Every secondary page has a **single clear job and contextual path into the same planner**. Persist only approved, non-sensitive context (validated ZIP, selected size, duration, preferred date, language and attribution where available). Do not prefill or retain personal information outside the approved customer workflow.
4. Comparison is optional. A concise preview on Home explains what can be compared; dedicated `/compare` manages sourced offers, qualifications and verification dates. No fabricated data or comparison score designed to favor Little Junkers.
5. Keep current V2 visual foundation and real photography. **Initial concept copy is a visual placeholder, not copy approval.** Every publishable page needs substantive, accurate local content and owner review.
6. Days Plus remains controlled by ADR-CX-001: **3–30 total days online**, **31+ human quote**; no invented additional-day prices or final totals. No unverified booking promises while Fleet is suspended.
7. Retain coherent navigation and crawlable internal links. SEO URL changes happen only with an audited migration map, redirects and approval.
8. Separate website-content implementation from backend financial/operational authorization. The first code slice may implement a no-payment planner and safe comparison shell; real booking and pricing modifications require their own approved scope and QA.

## Acceptance criteria for Slice A
- Home is usable without detouring through a dedicated size or comparison page.
- Price facts come from existing canonical read-only Supabase-fed website API; 3-day base only, no prepaid extra-day figure unless approved and provided by the new contract.
- Dedicated `/pricing` and `/compare` routes exist with substantive purpose, truthful empty states and direct plan transitions.
- 11/16/21-size and ZIP context carry to the planner from relevant pages; ZIP verified before claims about zone fees.
- 3 and 30 are selectable; 31+ is directed to the custom-quote lane. If data or availability is not supported, payment remains unavailable in this slice.
- New content and styles meet mobile and accessibility baseline and do not modify live booking, Supabase, Fleet, Stripe, DNS or production.
- Owner reviews the final copy separately before release.

## References
- [PROJECT-CHARTER.md](../../PROJECT-CHARTER.md)
- [STRATEGY-ARCHIVE.md](../../STRATEGY-ARCHIVE.md)
- [ADR-CX-001](ADR-CX-001-days-plus-experience.md)
- [Tier 1 Specs](../TIER-1-PAGE-SPECS.md)
