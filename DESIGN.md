# Little Junkers V2 — Experience Design Principles (draft)

**Status:** Draft for owner visual review. **Branch:** feature/experience-design-first-pass-20261120.
**Source:** Existing Brand Guide color tokens in app/globals.css and the previously approved V2 Strategy Archive §19 direction. This is not a replacement for the Brand Guide.

## Design intent

**Make renting a dumpster surprisingly enjoyable.** The site should feel unmistakably Little Junkers—bright pink bins, authentic local photos and warm, straightforward explanations—while helping visitors quickly choose, book and pay.

Experience is how confidently and comfortably a customer moves from curious visitor to paid reservation. It is **not** a mandate to add a hero to every page, or to animate every scroll.

### Five rules

1. **One signature opening, not ten cookie-cutter cards.** The homepage earns a dramatic photo-led entrance. SEO city pages remain text-first with price/ZIP/CTA near the top. Product pages show one authentic equipment photo and one clear action.
2. **Photographs do the talking.** Use only first-party images from lib/media.ts. Make the pink bins big enough to see. Let captions identify real locations without inventing jobs or customer quotes.
3. **A little depth goes a long way.** Photo framing, asymmetric layouts, typographic scale and restrained shadows. No extra color palette, random stock imagery, exaggerated parallax or expensive 3D bundles.
4. **Motion must explain a transition.** Subtle hero entrance, on-hover product focus, and scroll reveal for a couple of sections. Never animate the price after confirmation, shift button targets, delay interactive content or interfere with keyboard use. Respect prefers-reduced-motion and no-JavaScript rendering.
5. **Booking remains the primary journey.** Changes in this PR must not alter inventory, fees, consent, payment, booking business logic, checkout integration or redirect behavior. Full online checkout is a separate launch prerequisite; no CTA may falsely claim the site can now take payment.

### Approved existing tokens (do not modify)

- Signature pink `#FFCEE4`
- Dark hero/header/footer `#1E1C19`
- Warm page background `#EDEAE4`
- Warm surface `#FAF8F5`
- White cards `#FFFFFF`
- Large-accent pink text `#C2587A`

Keep smaller linked text in dark ink with a visible underline. Keep focus rings and contrast accessible.

## Prototype A — homepage

- Dramatic photographic top, with the real `hero-driveway` image substantially more visible on the right and a readable horizontal dark gradient behind copy.
- Stronger desktop/mobile typographic scale. Left-aligned ZIP starter remains accessible above the fold. Brand eyebrow and an unobtrusive location/equipment marker make the first view recognizable without fake rankings, urgency or testimonials.
- More interesting rhythm: offset four reasons, one overlapping photo detail in the how-it-works section and a photograph of Marcus and Ivy with respectful framing. No new media to download.
- Hover and keyboard-focus interactions on the three product cards communicate selection; the cards never block booking or hide factual pricing.
- Small scroll reveals only on a few supporting sections; server-rendered content and screen-reader reading order stay intact.

## Prototype B — three size pages

- Consistent product stage: one large first-party size photograph framed against the warm surface, a big yard-size graphic, size and price facts visible before deep scrolling, and clear action.
- No giant dark hero repeated across three size pages. No new unverified feature, price, safety or footprint claims.
- Other sections keep their HTML headings, FAQ, navigation, semantic price details and current product data.

## Measuring success

Owner review on desktop (1440px and 1024px) and mobile (375px); verify H1, ZIP input, three pricing cards, start CTA, no overlap or horizontal overflow.
Automated release checks: existing city/privacy/comparison suites, TypeScript, Next build. Manual checks: photo cropping and text contrast on actual Vercel preview, 200%-zoom readability, keyboard focus, reduce-motion, no-JS readable content, and Lighthouse/Core Web Vitals before merge.

**Do not merge this PR without owner review.** After design approval, adapt shared surfaces carefully. Do not re-style the seven preserved city pages into image-first doorway pages.

## Other outstanding branches

- `feature/sitewide-copy-seo-review-20261120` contains independent editorial and booking-first copy work that is not in main. It must be reconciled separately.
- Missing Search Console-preservation intent pages remain the next page-construction workstream; not in this visual prototype.
