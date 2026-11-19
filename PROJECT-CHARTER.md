# Little Junkers Website V2 — Project Charter

**Owner:** Marcus Griffin, Little Junkers LLC  
**Status:** Owner-approved strategy / phased implementation authorized — November 18, 2026  
**Scope:** Customer-facing marketing, education, local search, shopping, rental planning and booking handoff  
**Governing documents:** [STRATEGY-ARCHIVE.md](STRATEGY-ARCHIVE.md) · [ADR-CX-001](docs/decisions/ADR-CX-001-days-plus-experience.md) · [ADR-CX-002](docs/decisions/ADR-CX-002-shopping-hub-architecture.md) · [Tier 1 Page Specifications](docs/TIER-1-PAGE-SPECS.md)  
**Implementation working PR:** #7; separate feature PRs may be stacked for release safety.

## 1. Mission and success definition
Build Little Junkers as a mobile-first, bilingual **Customer Experience Platform**, not a replacement brochure for Odoo. Customers may arrive with a general intent ("I need a dumpster") or a precise intent ("16-yard in Newnan"). In either case, they should be able to find relevant information, understand accurate prices and disposal limits, and reach a real reservation with the fewest necessary decisions and without repeating validated details.

**Core experience principle:** **Fewer steps to purchase; not necessarily fewer SEO pages.** The homepage must provide an end-to-end shopping journey for ordinary customers, while dedicated pages continue to answer deeper intent, support discoverability, and route into the same transaction system.

Success requires truthful, accessible pricing and availability, no unauthorized charges, local-search preservation, usable mobile interaction, and measurable attribution from research through completed paid rental. Treat conversion as a measurable outcome, not an unverified claim.

## 2. Experience topology
- **Homepage shopping hub (`/`):** location/serviceability -> 11/16/21-yard shopping -> optional concise local comparison -> Days Plus configuration -> verified book/checkout handoff -> trust and local support.
- **Dedicated research surfaces:** `/pricing` for detailed canonical charges, `/compare` for dated evidence-based competitor comparisons, and `/dumpster-size-guide` plus project pages when independently useful. Research is always optional once the customer chooses Book.
- **Dedicated intent/SEO pages:** three dumpster-size pages, city/service-area pages, residential and commercial/contractor pages, materials, FAQ, Blog, About, legal, contact. Keep purposeful pages. No mechanical consolidation or blanket redirects for the sake of reducing page count.
- **One transaction system:** use common pricing, ZIP/zone, Fleet availability and unified-checkout contracts. Maintain separate repos where appropriate; same-domain routing is a target after technical verification, not a reason to duplicate backend logic.
- **Customer context:** pass validated ZIP, size, delivery-date preference, total rental length, approved language and campaign context from every entry. Empty or unverified fields remain editable. Do not silently mark availability verified.
- **Assistance:** Randy, Call/Text and accessible inline help should support decisions, not obscure payment.

## 3. Days Plus — owner-approved duration limits
The base rental covers **three (3) calendar rental days** as an interface concept; the exact day counting/pickup scheduling convention remains unresolved and must not be invented. Customers may select **0–27 additional days**, totaling **3–30 days online** after real Fleet validation. **31+ days go to a specific human quote**, with no fabricated price or instant availability promise.

The current Supabase `daily_overage` is legacy data and is **not** the new prepaid extra-day rate. Three-day base prices and per-day rate must receive separate sign-off; delivery zones, included weight and conditional disposal charges must derive from approved canonical records.

## 4. Information architecture contract
Home is a destination and a storefront; supporting pages are deliberate acquisition and education assets. Link them **both ways**. A shopper landing on a city or size page must be able to enter rental configuration with relevant context intact. A shopper on Home may browse details but must not need to visit an intermediary page to book.

Canonical URLs, article migration decisions, useful local content, structured data, indexing rules, bilingual equivalents and legacy redirect map remain governed by the archive and page specs. Distinct pages may share reusable components, but must not become keyword-stuffed thin copies.

## 5. Design and editorial quality
Follow Brand Guide colors and authorized logo/real-job photography. Approved dark header/footer around cream/off-white content remains; pink is a restrained focus accent. Mobile-first responsive design, accessible labeled inputs, visible errors, keyboard usability, and reduced-motion behaviors are release criteria.

**Owner feedback, November 18:** initial concept copy was intentionally a sample and is **not approved final site copy**. Page-by-page work must strengthen information substance, local evidence, plain-language explanations, brand character and practical customer help. Avoid generic promises ("best price", "no surprises") and unverified popularity, delivery-speed or service claims. Explicit editorial review is required before a public launch.

## 6. System ownership
- **Customer Experience (website + booking app):** visitor research, ZIP checking, shopping, referral/context, configuration and payment/confirmation surfaces.
- **Supabase:** canonical business and pricing facts plus transaction records, with server-owned quote/calculation contract.
- **Fleet:** full-interval inventory and delivery-window authorization, including blackout/return rules.
- **Admin OS and CSR:** configure prices, policy, long-term quote workflows, operational overrides and customer-service bookings.
- **Randy and analytics:** use the same canonical price/availability rules and consent-respecting journey events.
- **Comparison:** dated/sourced third-party offer observations via Admin/Supabase, honest website display; missing data labelled.

## 7. Implementation sequencing
**Slice A — Now, review-only website implementation:** formalize charter and ADR, build a connected homepage shopping hub, `/pricing`, `/compare` discovery page, context-aware planner shell, and 31+ contact lane. Use existing read-only canonical 3-day prices only; no false final totals. Preserve other routes and existing production.

**Slice B — Backend decision/contract:** approve new pricing amounts and day/pickup rules; implement and test canonical quote contract and Fleet availability for 3–30 days with idempotent holds and server repricing.

**Slice C — Transaction/Admin:** build integrated Days Plus booking, CSR/Admin pricing workflows, custom quote intake, Randy consistency, Stripe review, consent, and finalization through existing safeguards.

**Slice D — Quality and cutover:** mobile/desktop and accessibility, English/Spanish parity, source-proofed comparison data, canonical SEO, ads/analytics, checkout edge cases and operations reopening. Only then request go-live/merge/cutover authorization.

A completed Slice A is **not** a functioning public booking release. Features that lack a verified backend must say so clearly or be feature gated.

## 8. Non-negotiable release gates
- No changes to live Supabase pricing/schema, payment, Fleet, CRM, admin, DNS or production deployment solely because this charter is approved.
- No paid booking if Fleet has suspended public inventory or no full-duration confirmation is possible. Last reported suspension was November 9, 2026; verify reopening.
- Use PR review, safe preview and evidence-based QA; protect main. Preserve `unified-checkout-v1`, embedded Stripe Payment Element, webhook/finalizer, separate service and marketing SMS consent and customer details once.
- Do not display fake competitor prices or approved prepaid total until the canonical engines support them.
- Final owner sign-off for actual pricing, content/claims, legal and production launch.

## 9. Traceability
- Decision authority: Marcus Griffin, November 18, 2026.
- Architecture: [ADR-CX-002](docs/decisions/ADR-CX-002-shopping-hub-architecture.md).
- Duration and integration: [ADR-CX-001](docs/decisions/ADR-CX-001-days-plus-experience.md).
- Open work: [PROJECT-PARKING-LOT.md](PROJECT-PARKING-LOT.md).
- This charter supersedes any *interpretation* of the first interactive demo that suggests removing most dedicated pages or approving its sample copy.


## 10. Customer Copy and Progressive Price Estimates — Owner Feedback, November 19, 2026

The owner requires conversational, factual customer copy without defensive comparison framing or internal model/development notes. Replace "Build my rental" with a customer goal such as "See my estimate"; "See how we compare" is preferred to price-defensive slogans. All location-entry points must accept **city or ZIP**, not ZIP alone. Display the known, canonically priced three-day base *as an estimate* from the beginning, then refine when size and service area are chosen; keep unpriced Days Plus extras, fees and date-specific charges plainly excluded until authoritative data is available. A **confirmed price** requires server-issued all-in calculation plus availability verification, never merely completion of form fields. See [ADR-CX-003](docs/decisions/ADR-CX-003-progressive-estimates-city-zip-copy.md).
