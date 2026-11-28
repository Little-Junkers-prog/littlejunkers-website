# Little Junkers Website V2 — Change Log

Append a dated entry for every customer-experience/code/content change. Include before/after, rationale, files and routes, tests (with actual results or not run), unresolved dependencies and rollback/review gate. Older evidence remains in git history and dated docs; this log starts November 28, 2026 and does not claim to reconstruct earlier changes.

## 2026-11-28 — CX governance and checkout V1 design (review branch)

Base main: `377e57a7c1d1cd4b71721d050badaaa352c4acf9`. Owner direction from November 28 ZIP review and conversion recommendations; no merge/cutover authorized.

| File | Before → after | Reason |
| --- | --- | --- |
| PROJECT-CHARTER.md | Added §12 | Owner-endorsed trust/conversion direction and guarded design scope. |
| AGENTS.md | Added mandatory CX standard and change-log gate | Prevent future agent regressions. |
| DESIGN.md | Added CX acceptance requirements | Preserve existing brand/template/mobile rules while improving buying decisions. |
| STRATEGY-ARCHIVE.md | Added §30; retained historical decisions | Explicitly document new direction without silently overriding §20.7. |
| docs/TIER-1-PAGE-SPECS.md | Added cross-cutting route gate | Preserve existing SEO/page purpose and add trust acceptance criteria. |
| docs/design/BOOKING-FLOW-DESIGN-SPEC.md | Added cross-reference only | Preserve Rev 2 and separate draft Rev 3. |
| docs/CUSTOMER-EXPERIENCE-STANDARD.md | New | Five principles, route and checkout requirements, evidence, measurement, change control. |
| docs/design/CUSTOMER-CHECKOUT-V1.md | New | Candidate screen/copy contract, edge cases, decisions and release gates. |
| CHANGELOG.md | New | Append-only traceability. |

Validation: source charter, archive, ADRs and existing design inspected; this documentation commit has no transaction/data changes. Prototype and source page revisions tracked in subsequent entries. No local build yet. Rollback: revert this commit on review branch; no changes to main or live systems.


## 2026-11-28 — Core conversion revisions (review branch)

| File | Change / rationale |
| --- | --- |
| app/page.tsx | Outcome-led hero, low-commitment estimate, early authentic reviews link, qualified dates, secondary comparison. |
| app/[slug]/SizePage.tsx | Canonical three-day price on all three size pages, preserve selected size through fee lookup, explain extra charges. |
| components/ZipCheck.tsx | Preserve size and location; discard stale request responses and saved estimates when editing; truthful support promise. |
| app/service-areas/page.tsx | Explain split-city fees; preserve validated product size in server-rendered lookup fallback. |
| components/ZipContext.tsx | Clear saved area and saved query together on change ZIP. |
| app/pricing/page.tsx | Shared PlanLink retains location context rather than resetting it. |
| lib/faqs.ts | Canonical three-day FAQ pricing; no implied calendar/payment capability or automatic extension. |
| components/PriceTable.tsx | Article rate table uses canonical three-day price rather than presenting legacy tier menu. |
| scripts/check-experience.mjs | Regressions for canonical pricing, trust proof, stale responses and size handoff. |
| CHANGELOG.md | Append revision record. |

Validation: source-level changes; CI and browser verification pending; container git clone blocked by DNS. No production rates, reservations, payment, policy, URL or main-branch changes. Revert this commit to undo.


## 2026-11-28 — Remaining conversion surfaces and audit

| File | Change / rationale |
| --- | --- |
| components/PriceCards.tsx | Clarify conditional costs. |
| components/PinkBinExperience.tsx | Set estimate expectations, explain weight vs volume and distinguish excess weight. |
| app/about-us/page.tsx | Genuine reviews link, human help, no claim of active online booking. |
| app/faq/page.tsx | Truthful in-site estimate CTA while payment is not enabled. |
| app/blog/page.tsx | Truthful in-site estimate CTA while payment is not enabled. |
| app/blog/[slug]/page.tsx | Truthful in-site estimate CTA while payment is not enabled. |
| app/what-can-i-put-in-a-dumpster/page.tsx | Retain material and safety rules; remove implication of verified dates. |
| app/compare/page.tsx | Emphasize comparable inclusions and evidence. |
| components/ComparisonTool.tsx | Optional comparison retains customer selections and estimates. |
| app/[slug]/CityPage.tsx | Explain inclusions and estimate status across seven city pages; preserve URLs, local proof, schema. |
| app/plan/page.tsx | Truthful metadata; 31+ days go to existing manual quote lane rather than clamping. |
| app/not-found.tsx | Clear recovery without unsupported popularity claim. |
| docs/phase-2/CX-CONVERSION-AUDIT-2026-11-28.md | Route-by-route audit with findings, disposition, deferred work and verification limitations. |
| CHANGELOG.md | Append revision record. |

Scope: shared templates only; retain seven city URLs, legal text, navigation and transaction contracts. Source-level review; build/CI/browser pending. No production changes. Revert commit to undo.


## 2026-11-28 — Customer checkout V1 interactive design candidate

| File | Change / rationale |
| --- | --- |
| docs/design/checkout-v1/index.html | Interactive, isolated guided/quick size, schedule, details, review/payment simulation and confirmation; responsive sticky summary. |
| docs/design/checkout-v1/model.js | Explicit example prices/ZIPs/dates, fail-closed missing rates and unverified dates; no network. |
| docs/design/checkout-v1/styles.css | Brand-led responsive layout, visible focus, reduced motion, desktop/mobile summaries. |
| docs/design/checkout-v1/README.md | Local review and test instructions; mock data boundary. |
| scripts/check-checkout-v1.mjs | Model edge cases, script parsing, no network/real submission checks. |
| .github/workflows/experience-check.yml | Run new fixture checks alongside existing gates. |
| CHANGELOG.md | Append revision record. |

Verification: Local JavaScript fixture smoke checks and inline script parsing passed; full Node test/CI/browser pending. Owner review required; no live route, backend or payment changes; preserve PR #14. Revert commit to undo.
