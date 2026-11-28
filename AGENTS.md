# Little Junkers Website — Agent Start Instructions

## Mandatory first step

Before proposing, editing, generating, committing, reviewing, or refactoring any code, content, routes, SEO, analytics, security, pricing presentation, Spanish localization, Randy integration, comparison features, marketplace features, redirects, schema, or deployment configuration in this repository:

1. Read `PROJECT-CHARTER.md` and `STRATEGY-ARCHIVE.md` in full.
2. Treat it as the active strategic baseline unless a newer explicitly approved governing document supersedes a specific decision.
3. Review any newer project scope, architecture decisions, migration matrix, security standard, analytics specification, and changelog referenced there.
4. Do not silently undo an approved decision.
5. If a requested change conflicts with the strategy archive, identify the conflict before implementation and obtain a clear decision on which direction supersedes the existing roadmap.

Existing Odoo pages, prototypes, old branches, and historical code are reference material only unless current approved documentation says otherwise.

The strategic objective is to build Little Junkers as a secure, bilingual, conversion-first Customer Experience Platform — not to recreate the Odoo website.

## Booking lives in the website

See [ADR-CX-004](docs/decisions/ADR-CX-004-in-site-booking.md): every booking CTA stays in the site. Never link customers to the booking app; reuse its server contracts instead of copying them.

## Current approved shopping architecture

See [ADR-CX-002](docs/decisions/ADR-CX-002-shopping-hub-architecture.md): homepage shopping hub plus **retained dedicated SEO/intent pages**. Concept copy is not final. Days Plus 3–30 total days; 31+ human quote. Phase 1 website branch must not create real holds or charges before pricing/Fleet/CSR/checkout integration is separately approved and verified.

## Mandatory customer experience / conversion gate (November 28, 2026)

After the charter/archive, read [docs/CUSTOMER-EXPERIENCE-STANDARD.md](docs/CUSTOMER-EXPERIENCE-STANDARD.md), [DESIGN.md](DESIGN.md), and the relevant page spec. For checkout work also read [docs/design/CUSTOMER-CHECKOUT-V1.md](docs/design/CUSTOMER-CHECKOUT-V1.md) and the existing booking-flow spec; V1 is a review candidate, not a silent override of prior locks or production authorization. Apply the five principles and page-level acceptance criteria. Use verified data, retain direct/contextual booking and optional guidance, and do not invent reviews, rates, slots, policies or conversion lift. No user-facing developer notes beyond a separate preview indicator. Never create a parallel transaction engine. Preserve all existing checks; add focused checks for changed contracts. Every PR must append an entry to CHANGELOG.md with each changed file, before/after and reason, scope/guardrails, checks run/not run, open questions and rollback/approval gate. Do not merge or cut over without explicit owner approval.
