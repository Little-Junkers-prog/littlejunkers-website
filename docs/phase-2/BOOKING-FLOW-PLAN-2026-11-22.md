# In-Site Booking Flow — Plan for Owner Review

**Date:** November 22, 2026
**Status:** Plan only. No booking code, hold, payment, Supabase or booking-app change is authorized by this document.
**Governs:** ADR-CX-004 (booking inside the website), STRATEGY-ARCHIVE §20.7 (locked checkout journey and backend contracts), ADR-CX-001/003 (Days Plus, progressive estimates), D-007 (lanes and entry points).

## 1. What the data says

Booking-app `funnel_events`, October 23 – November 22, 2026. Test rows excluded (ids 114–120, 264–276; `pr56test`/`cookietest`).

| Step | Oct 23 – Nov 8 | Nov 9 – Nov 22 |
| --- | --- | --- |
| Opened the booking page | 55 | 38 |
| Picked a size | 25 | 26 |
| Reached the date step | 24 | 26 |
| **Picked a date** | **13** | **0** |
| Hold created | 12 | 0 |
| Details saved | 11 | 0 |
| Payment form shown | 6 | 0 |
| Paid | 5 | 0 |

Sessions, not people. Small numbers, so read direction, not percentages.

- **Since November 9, nobody could pick a date.** 26 shoppers reached the date step and stopped. That lines up with the fleet dropping to one owned dumpster, which stays rented. The funnel isn't broken; there's nothing to book. But those 26 people left with nothing captured: no name, no number, no "tell me when one's free."
- **Before that, the date step was still the biggest drop** (24 → 13). Some of that is real unavailability; some is likely the date/time-block picker itself.
- **Details → payment lost about half** (11 → 6). Worth watching in the new flow: that's the long form.
- **Payment form → paid was strong** (6 → 5). The embedded Stripe step works; keep it.

**Design:** the screens, copy, upsells and mobile/desktop behavior are specified in [`../design/BOOKING-FLOW-DESIGN-SPEC.md`](../design/BOOKING-FLOW-DESIGN-SPEC.md), with a clickable preview. Build to that spec.

## 2. The journey stays the one already approved

STRATEGY-ARCHIVE §20.7 locked the checkout architecture on October 1. The in-site flow keeps it and moves it into the website's look:

1. **Where and what:** city or ZIP, then size. Price shows right away (ADR-CX-003).
2. **When and how long:** drop-off date and time block from Fleet, rental length (3–30 days once Days Plus pricing exists).
3. **Your details, once:** customer type (Home, Business, Contractor), service address, contact, two separate text consents.
4. **Review and pay:** everything on one page with Edit links, embedded Stripe Payment Element, one Pay button.
5. **Confirmation:** "You're booked," what happens next, then the rental details.

Entry points skip what's already known: a size page passes the size, a city page passes the city, a CSR or Randy link passes a hold and lands on step 3.

## 3. Backend: reuse, don't copy

Every step calls the booking app's existing APIs. Nothing below gets rebuilt in the website.

| Step | Booking-app API | Notes |
| --- | --- | --- |
| Price | `GET /api/get-pricing` | Already used by the website (server side). |
| Service area | `GET /api/check-service-zip` | Website also has its own read-only `/api/service-area` lookup on the same data. |
| Dates | `POST /api/availability` | Fleet availability and delivery time blocks. |
| Hold | `POST /api/create-booking-hold`, `GET /api/get-booking-hold`, `POST /api/update-booking-hold` | `unified-checkout-v1`; update re-checks service ZIP and reprices. |
| Pay | `POST /api/create-payment-intent` | Returns the Stripe client secret for the Payment Element. |
| Finish | `POST /api/finalize-paid-booking`, `api/stripe-webhook` | Webhook stays in the booking app. |
| Tracking | `POST /api/track` | Same frozen event names (D-003 A1), with `page` set to the website step so the baseline stays comparable. |
| No dates / out of area | `POST /api/public-inquiry` | Turnstile-protected lead intake. |

**How the website talks to it (recommended):** thin server-side routes in the website (`/api/booking/*`) that pass requests straight through to the booking app. Why:

- The browser only ever talks to the website, so there's no cross-site setup and the booking app's address never shows.
- It works on Vercel preview links, which the booking app's origin allow-list blocks today.
- The website routes add their own same-site check and rate limit. They hold no pricing, hold or payment logic.

**Stripe:** the website loads the Payment Element with the publishable key and the client secret from `create-payment-intent`. `return_url` points back to the website's confirmation step. The booking app keeps the secret key and the webhook.

## 4. What has to change outside the website

| Item | Where | Blocks |
| --- | --- | --- |
| **Days Plus pricing.** Holds are priced by `tierKey` (3/5/7-day tiers). 3–30 days needs the new Supabase pricing and a booking-API change to accept a day count. | Admin app (Marcus's pricing PR), then booking app | Step 2 length picker and launch |
| Accept the website's confirmation `return_url` and preview origins | Booking app | Step 4 testing |
| Randy and CSR booking links point to the website's booking page | Booking app | Funnel retirement |
| Redirect `book.littlejunkersllc.com/rent-a-dumpster` and `/complete-booking` to the website | Booking app, at cutover | Funnel retirement |
| Inventory to sell | Fleet | Any real booking |

## 5. Build order (each a separate PR, each stops for review)

1. **Booking shell, read-only.** One booking page with steps 1–2: city/ZIP, size, live price, real Fleet dates and time blocks. No holds. Every booking button on the site lands here. Includes the "no dates open" lead capture.
2. **Holds and details.** Create and update holds, the one-time details form with the three customer lanes, consent choices. Runs only against a test setup (see decision 4).
3. **Review, pay, confirm.** Embedded Stripe in test mode, confirmation page, tracking events end to end.
4. **Booking-app changes** from section 4, in that repo, as their own PR.
5. **Days Plus** once Marcus's pricing restructure lands.
6. **QA and cutover:** mobile, accessibility, Spanish, real paid test booking, redirects, retire the funnel.

## 6. Decisions for Marcus

1. **Booking page address.** Recommend `/book` (plain, matches the button) with `/plan` redirecting to it. Alternative: keep `/plan`.
2. **Page or popup.** Recommend a page. It survives the back button and a refresh, works with Stripe's redirects for Apple Pay, Klarna and Affirm, and is easier to measure. A popup can come later for quick bookings from the homepage.
3. **When no dates are open.** Recommend a short "Text me when one's free" form (name, mobile, size, area, dates wanted) that goes through `public-inquiry` and lands with the turnaways you're already logging. Right now those shoppers leave with nothing.
4. **How to test holds and payments.** Recommend a Supabase branch plus Stripe test mode for preview builds, so test bookings never touch real holds, Fleet or Stripe. The other option is test cards against production data, which leaves test holds in your real tables.
5. **Days Plus timing.** Recommend building steps 1, 3, 4 and 5 now on the current pricing, and dropping in the 3–30 day picker when your pricing PR ships. The other option is waiting for Days Plus before starting.
