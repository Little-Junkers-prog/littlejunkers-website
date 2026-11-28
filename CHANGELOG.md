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
