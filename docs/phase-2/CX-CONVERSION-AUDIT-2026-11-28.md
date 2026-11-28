# V2 customer experience conversion audit — 2026-11-28

Scope: source-level audit of main at 377e57a7c1d1cd4b71721d050badaaa352c4acf9. Review branch only. Public legacy/Odoo site, browser rendering, current production inventory and live pricing were not verified. Preserve URL, schema, approved policy, city layout and transaction contracts.

| Surface | Finding | Revision or disposition |
| --- | --- | --- |
| Home | Question-led hero; reviews lower on page; competing comparison CTA | Outcome-led copy, early Google reviews link, no contact gate, comparison secondary, qualified date promise. |
| Three size pages | First pricing tier might not be 3 days; ZIP check could drop size | Use canonical 3-day tier, selected size retained, conditional weight/date cost. |
| Pricing | Location lost by direct CTA | Shared PlanLink preserves context; existing authoritative base and zone rates retained. |
| Seven cities: Newnan, Peachtree City, Fayetteville, Senoia, Sharpsburg, Tyrone, Fairburn | Estimate and weight inclusions could be clearer | Shared explanatory copy; retain local evidence, URL, canonical and approved layout. |
| Service areas | Split-city ambiguity; no-script handoff lost size | Exact ZIP explanation and context-preserving result. |
| Compare | Need clear evidence and truthful booking CTA | Show source/date/inclusions; estimate CTA; no change to competitor data. |
| FAQ | First-tier mismatch; live calendar and automatic extension implied | Canonical 3-day prices and qualified scheduling/extension language. |
| About | Implied live booking | Genuine Google reviews link, owner proof and accurate estimate copy. |
| Materials | Live dates implied | Estimate CTA; all accepted/prohibited materials and weight guidance intact. |
| Blog index and 10 article routes | Live booking CTA and old tier menu | Shared CTA and canonical rate table revised. Article-by-article editorial and fact verification remains separate. |
| Planner | Metadata described booking; 31+ clamped | Honest estimate metadata and existing manual quote lane. |
| Long-term rentals | Existing quote lane | Retain; no new intake or rate. |
| Four legal routes | Approved legal/consent wording | Retain; owner/legal approval required for changes. |
| Header/footer/mobile bar/nav/Randy | Approved shared shell | Preserve locked navigation and call/text; header remains Start Booking per prior guard. Verify Randy link destinations during transactional integration. |
| Not-found | Unverified popularity and ZIP-only recovery | Clear city/ZIP, sizes and call recovery. |
| Planned but absent routes | Residential/commercial, size guide/contact, project pages and Spanish not fully built | Existing roadmap gaps; not speculative new pages in this pass. |

## Files and traceability

Core pricing, ZIP and homepage revisions are logged in CHANGELOG.md (commit eb97ef1). This pass:

| File | Change |
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

## Release gates

- Owner-approved exact Google reviews before publishing excerpts, ratings or counts. Only official review destination used now.
- Verify Fleet, canonical pricing and Stripe in safe environment before real availability or payment. Do not guess additional-day rates, pickup timing, special fees or safe payload.
- Confirm cancellation/refunds, early pickup, extensions, waitlist, delivery windows and rental management policies.
- Mobile/desktop browser, keyboard, screen-reader and performance verification; separate article editorial pass and Spanish parity before launch.
- Direct container git clone blocked by DNS; source audit is not a Next build or runtime test. CI, preview and owner acceptance required. No live edits.
