# Copy and voice audit — November 22, 2026

**Branch:** `copy/humanize-voice-pass-20261122`, stacked on PR #10 (`feature/experience-design-first-pass-20261120`), which is the current review preview.
**Status:** Copy only. No change to pricing logic, ZIP/zone lookup, Fleet, Stripe, consent wording, schema, redirects or indexability. Not merged, not deployed.
**Standard applied:** STRATEGY-ARCHIVE §19 and §19.2 (Human Copy Standard), TIER-1 §1.1A, ADR-CX-003 §1 and §6, plus the humanizer pattern list (staging, filler, method notes, dashes).

## What was wrong

The copy problems fell into five groups. The first two are the ones a customer would notice.

**1. Internal notes showing on the page.** These read like instructions to a developer or reviewer.

- About: "Slot for the fuller story: how the name came about… It links here once 'The Little Junkers Story' is written and published on the blog." (visible paragraph)
- Planner: "Additional-day pricing hasn't been approved yet." and "We won't guess the additional-day charge."
- Pricing: "We won't substitute guessed numbers."
- Blog index fallback: "Draft note: the existing blog articles have not been migrated into this build yet."
- Compare: "vetted providers", "Regional reference comparisons", "coverage unverified", "our vetted, dated comparison records (last exported …)"
- Homepage: "Local competitor prices will only appear when the source and date have been verified."

**2. A price contradiction.** The FAQ said "Extra days are $X each" using the legacy `daily_overage` value, while the planner and compare tool say extra days aren't priced yet. ADR-CX-001 says that legacy value is not the Days Plus rate. Both FAQ answers now say extra days are priced separately and confirmed first.

**3. Defensive or "proving it" lines.** "Compare the included days, weight and delivery fees—not just the starting price", "Know what you're paying for", "Real Little Junkers equipment", "Price before any ZIP-based delivery fee or extra charges".

**4. Slogans and filler.** "Local owners. Real service. Cleaner neighborhoods.", "Clear pricing information", "A different kind of dumpster company", "Your project doesn't have to fit a fixed package", About chips that repeated themselves ("Locally owned in Peachtree City" and "Real local owners").

**5. Overly technical wording.** "excess disposal-weight rate", "3-day base", "anticipate additional pickups or swaps", "Capacity shown is an approximate volume comparison", "Published N-day offer; delivery fee unconfirmed".

## Before and after (selected)

| Where | Before | After |
| --- | --- | --- |
| Home hero | Check your delivery area and see dumpster prices. Enter a city or ZIP. | Type your city or ZIP to see prices and your delivery fee. |
| Home, compare block | Know what you're paying for / See how rental prices compare. | Shopping around? / See how we compare. |
| Home, Days Plus | Your project doesn't have to fit a fixed package. | Pick how many days you need. |
| Pink Bin selector | Still comparing rental companies? Compare the included days, weight and delivery fees—not just the starting price. | Shopping around? See how our 16-yard compares. |
| Planner | Additional-day pricing hasn't been approved yet. | We can't price extra days online yet. Call or text us and we'll give you the full price. |
| Planner | This is an estimate, not a confirmed quote. Final fees and delivery availability must be verified before payment. | This is an estimate. We confirm your final price and delivery date before you pay. |
| Pricing | Current excess disposal-weight rate: $X per ton above the included limit. | Your load gets weighed at the landfill after we pick it up. If it's over the weight included with your size, it's $X for each ton over. |
| Long-term | There is no automatic extended-rental price, reservation or payment on this page. | Long-term rentals aren't booked online. Give us a call or send a text. |
| About H1 | Local owners. Real service. Cleaner neighborhoods. | Your neighbors with the pink dumpsters. |
| About | Care for your property (repeat of the homepage truck line) | Careful with your driveway: …we'll lay down boards to protect your driveway if you ask. |
| Compare card | Regional reference · coverage unverified | Nearby · may not deliver to you |
| Compare footer | Competitor examples are from our vetted, dated comparison records (last exported …) | We last checked other companies' prices on …. They may have changed since. |

## Kept on purpose

- Honest-price labels the checks pin ("Full rental price pending", "Full price pending", "Rate not yet confirmed"). They're plain enough and protect against showing a fake total.
- Competitor disclaimer: shortened, but every element stays (public source, not affiliated/endorsed/agent, prices vary, confirm with each company).
- Click-counting disclosure on the exit dialog: reworded, same meaning.
- Callback consent sentence, cookie banner, texting/privacy/terms pages: not touched. Legal and consent wording needs attorney review, not a voice pass.
- "We're a dumpster rental company, not a junk-removal crew." The contrast answers a real customer mix-up.

## Not done in this pass

- **Blog posts (10).** About 31 AI tells across the migrated articles. An unmerged branch, `feature/sitewide-copy-seo-review-20261120`, already has a full blog edit. Reconcile that branch first instead of rewriting the posts twice.
- **Spanish.** Not started; English copy should settle first.
- **Randy's replies.** They come from the booking app, not this repo.

## Guardrail added

`npm run check:content` now fails on customer-facing page/component lines that contain build notes ("won't guess", "draft note", "slot for the", "prototype", "vetted", "regional reference"), process language ("hasn't been approved", "Fleet-confirmed", "Build my rental"), stock filler ("seamless", "stress-free", "hassle-free", "peace of mind") or an em dash. Run against the old copy, it flags 12 lines; the new copy passes. Blog Markdown is excluded until its own pass.

## Checks run

`tsc --noEmit`, `check:content`, `check:readability`, `check:owner-names`, `check:city-pages`, `check:experience`, `check:days-plus`, `check:comparison` and `next build` all pass.

## Reading level (owner decision, Nov 22)

Marcus set the target: copy should be easy to understand without being technical. Agreed approach:

- Booking pages (home, size, city, planner, pricing, compare): aim for 6th–7th grade, never above 8th–9th. Unbounce's 2024 benchmark (57M conversions) found pages at a 5th–7th grade level convert nearly twice as often as pages at a professional level, and difficult words hurt most. That's a correlation, not proof, so it's a target, not a promise.
- Blog and guides: 8th–9th is fine.
- Legal, consent and the competitor disclaimer: exempt; keep short and below the buttons.
- Needed industry words ("included weight", "delivery fee") stay but are explained once in plain words.

Second pass on Pricing, Compare and the planner: "disposal weight" became "weight included" with one plain explanation of how overweight is billed (load weighed at the landfill after pickup); compare price notes and the competitor disclaimer were broken into short sentences without changing what they say.

New check: `npm run check:readability` scores booking-page sentences with an approximate Flesch-Kincaid grade and fails above 8. Same scorer, before and after this work:

| Page group | PR #10 | Now |
| --- | --- | --- |
| Home | ~4.7 | ~2.4 |
| Planner | ~5.8 | ~3.2 |
| Pricing | ~10.1 | ~2.6 |
| Compare | ~6.9 | ~3.4 |
| Size pages | ~3.6 | ~3.6 |
| City pages | ~5.3 | ~5.2 |

The syllable count is a simple rule, so these read low compared with commercial tools. Use them to spot drift, not as exact grades.

## Questions for Marcus

1. About page says "Pick a size and dates online, any time." That's true at launch, not in the preview. Keep it?
2. FAQ "How soon can I get a dumpster?" points to "the booking calendar", which is the old funnel. Rewrite once the new booking flow is decided.
