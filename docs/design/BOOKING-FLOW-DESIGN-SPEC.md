# Booking Flow Design Spec

**Status:** In owner review. Revision 6 on PR #14 (rev 2 merged via #13). Items marked **Locked** were approved by Marcus in review. Rev 6 changes are in section 2a as **Proposed** until he approves them; the preview already shows them.
**Evidence for rev 6:** [`../phase-2/CHECKOUT-AND-RECOMMENDATIONS-RESEARCH-2026-11-27.md`](../phase-2/CHECKOUT-AND-RECOMMENDATIONS-RESEARCH-2026-11-27.md)
**Live preview (clickable):** https://claude.ai/artifact/Qf1YZuYMYtZvsdyHKEgZeR (desktop and phone frames; press Play)
**Preview source in this repo:** [`booking-flow-preview/`](booking-flow-preview/) (see its README)
**Plan this belongs to:** [`../phase-2/BOOKING-FLOW-PLAN-2026-11-22.md`](../phase-2/BOOKING-FLOW-PLAN-2026-11-22.md) · Decision: [ADR-CX-004](../decisions/ADR-CX-004-in-site-booking.md)

Update this file every time a review round changes the design. The preview and this spec must match before any booking code is written.

## 1. Why

Today the customer goes from the Odoo site to `book.littlejunkersllc.com`, then to checkout, then to a confirmation page, and each one looks different and shows a different address. At a $300–$500 purchase that erodes trust. The goal is the feel of buying a car online from Tesla or Rivian: one place, one look, build your order, see the price, pay.

Second goal: raise the average ticket to about **$400** through honest upsells and recommendations. The current funnel keeps people at the base price.

## 2. Locked in review

| # | Decision | Date |
| --- | --- | --- |
| L1 | **One look, one address.** Home, booking, payment and confirmation all use the site's header, colors, photos and footer, and stay on `littlejunkersllc.com` (`/book/size`, `/book/dates`, `/book/extras`, `/book/details`, `/book/pay`, `/book/confirmed`). The design matches the brand. | Nov 22 |
| L2 | **Desktop: rental summary pinned on the right.** Photo of the chosen bin, line items, running total. Stays in view while scrolling. | Nov 22 |
| L3 | **Phone: running-total bar pinned to the bottom** on every booking step. Bin photo, short summary (e.g. "16-yard · 3 days · +1 ton"), total; "View" opens the full line-item list; a short flash shows each add ("Added 1 ton of weight +$79") so the total visibly changes. Marcus: "pretty freaking perfect." | Nov 22 |
| L4 | **Options lead with the customer benefit**, not the feature. | Nov 22 |
| L5 | **Early drop-off is a limited upgrade.** It shows how many morning slots are left that day ("Limited: 2 morning slots left", "Only 1 morning slot left") and grays out, can't be selected and says "Full on [day]" when that day's slots are gone. Switching to a full day drops the choice back to Standard. The site never overbooks or overpromises. | Nov 22 |
| L6 | **Days first, then the drop-off date.** The customer picks how many days (3–30) before picking a date, because length changes what's open: a 3-day rental may fit before an existing booking when a 14-day one won't. Only dates where the chosen size is free for the whole rental can be picked; the rest are grayed out and can't be tapped. Changing the length re-checks the date; if it no longer fits, the date clears and the customer picks again. *(Rev 4 change: no "Booked" label and no reason given. Why a day is closed is ours to manage, not the customer's.)* | Nov 24, updated Nov 25 |
| L7 | **Days are typed or stepped.** A number box the customer can type into, − and + buttons, and quick picks (3 days, 1 week, 2 weeks, 30 days), so nobody taps + eleven times for 14 days. Out-of-range entries snap to 3–30. | Nov 24 |
| L8 | **Compact date field, calendar on demand.** The drop-off day is one field: type it (MM/DD) or tap the calendar button (caret) to open a month calendar with ‹ › to move between months. Customers can book up to **90 days** out (people do book ahead). Picking a day closes the calendar. A typed day that isn't open gets "[Day] isn't open for N days" plus a one-tap **Use [closest open day]**. Never says why a day is closed. | Nov 25 |
| L9 | **Extras order: items first, then weight.** Mattresses / tires / appliances come before extra weight. The weight card recommends a ton amount from what the customer already told us, marked **"Our pick for your job."** Recommended, never pre-selected. *(Rev 5: the "Heavy stuff going in?" question was dropped; see L15.)* | Nov 25, updated Nov 25 |
| L10 | **"Your info" step, plain copy.** No "Who's it for? / You'll only fill this out once." Heading "Your info", "Where it's going and how to reach you." Consent footnote is just "Reply STOP to any text to opt out." The two checkboxes and their wording are unchanged. | Nov 25 |
| L11 | **Review is one card with the dumpster photo.** Photo, size and name, included weight; then drop-off (date + time slot), pickup (date + length), extras (row hidden when there are none), delivery address (with placement note and boards), contact (name, company if any, mobile, email). Every row has Edit. | Nov 25 |
| L12 | **Header stays one line.** No wrapping step pills. Desktop: logo + one row of step pills. Phone: "[Step name] · Step N of 5" over a 5-segment progress bar. Steps already reached are tappable and jump straight back **with everything kept**; steps not reached yet are locked. | Nov 25 |
| L13 | **A way out, and we ask why.** An × in the booking header opens "Before you go": optional one-tap reasons (Just checking prices · I need different dates · Not sure which size · It costs more than I expected · I'd rather call or text · Something else, with a text box), call/text links, **Keep booking** (main button), and **Send and leave** once a reason is picked. The modal's own × fades in after **1 second**; tapping it leaves without answering and goes to the home page. The reason is logged; leaving never requires an answer. *(Rev 5: delayed ×; the "saved on this device" line is gone.)* | Nov 25, updated Nov 25 |
| L14 | **Roofing goes to the contractor flow.** Residential has no roofing option. A link under the job chips, "Roofing job? Book through our contractor page →", hands off to the contractor flow, which asks for squares and prices the weight from that. The two flows cross-link. | Nov 25 |
| L15 | **No extra questions for weight.** The weight suggestion comes only from what the customer already told us (the job they picked, item counts). The weight card names common heavy household items in one line (sofa beds, solid wood furniture, tile, plaster). Nothing new stands between the customer and checkout. | Nov 25 |
| L16 | **Availability comes from the admin app's engine.** The website never computes availability. It asks the existing engine (Supabase, admin app), which already accounts for unit count, units on rent, empty vs. full units, rental length and cutoffs (e.g. after a set time Saturday, Sunday drop-off closes because a unit can't be emptied in time; same-day closes when no unit can be turned around). Open 7 days; Sunday is bookable when the engine says a unit is ready. | Nov 25 |
| L17 | **Same-day drop-off is a paid premium slot.** When the engine says today is possible, "Today" is pickable and drop-off time becomes **Same-day drop-off + [PRICE]** (replaces Standard and Early for that day). Fee, cutoff time and how many same-day runs a day can take are admin settings. | Nov 25 |
| L18 | **Returning customers pick up where they left off.** Their build (size, days, date, extras, and info typed so far) comes back like a cart, with a "Pick up where you left off" card on the home page and Continue. No "saved on your device" wording. Works only if they accept cookies (see section 5); dates are re-checked on return. | Nov 25 |

## 2a. Proposed in rev 6 (needs Marcus's OK)

| # | Proposal | Changes | Evidence |
| --- | --- | --- | --- |
| P1 | **One checkout page.** "Your info" and "Review and pay" become one step, `/book/checkout`: the L11 order card (bin, drop-off, pickup, extras, each with Edit), then "Where it's going" (street with autocomplete, placement note), "How to reach you" (Home / Business / Contractor, name, mobile with "We text your delivery window here.", email, the L10 consent box unchanged), then Pay. Steps go from 5 to 4: Size · Dates · Extras · Checkout. | L10, L11 (address and contact rows become fields on the same page), L12 ("Step N of 4") | Field count matters more than steps (Baymard); our funnel loses 17 → 11 sessions between saving details and seeing payment |
| P2 | **Wallets first.** Apple Pay and Google Pay as their own buttons above the card form; Klarna and Affirm behind "More ways to pay". | Section 3, step 5 | Baymard payment UX |
| P3 | **Say what can come later, next to Pay.** "You pay $X today. That's everything we know about. The only charges that can come later: $99 a ton if your load goes over [tons], or extra days if you keep it longer." | New copy | Baymard: surprise costs are the top reason people leave; 32% of our rentals with a dump ticket went over included weight |
| P4 | **Weight rule table.** Kitchen or bath remodel → suggest +1 ton. Shed/deck and 2+ appliance rules dropped. Weight card line becomes "Tile, drywall and plaster are heavier than they look." | Section 5 rule table; L15 wording | EPA volume-to-weight factors; our dump tickets |
| P5 | **No days suggestion.** Dates step adds one line: "Not sure how long? Pick your best guess. Running behind, text us before pickup and add days at [PRICE] a day." | Section 3, step 2 | No job-level duration data; longer holds block units (L16) |
| P6 | **After-payment weight add.** Confirmation page card: "Loading something heavy? Your load is covered up to [tons]. Add a ton now for $79 instead of $99 after pickup. One tap, same card." | Confirmation page | Baymard: offers on the confirmation page don't interrupt checkout. Trade-off: $20 a ton less from people who would have gone over |

Rejected after research: asking for the street address earlier. The ZIP already sets price and serviceability on the first screen.

## 3. The flow

### Home (`/`)
Dark hero with the real driveway photo, "Need a **dumpster?**", city/ZIP field and **Book a dumpster**. Size cards below with real photos and 3-day prices.

### 1. Size (`/book/size`)
- Delivery line: "Delivering to [city ZIP] · [delivery fee or Free delivery]".
- **"What are you tossing?"** chips: Garage or one room → 11 · Kitchen or bath remodel → 16 · Shed or deck tear-out → 16 · Whole house or estate → 21 · Not sure → "Text us a photo of the pile." Below them: "Roofing job? Book through our contractor page →" (L14).
- Three size cards (real photos): name, fit line, 3-day price, included weight. The recommended one carries **"Our pick for this job."**

### 2. Dates (`/book/dates`)
1. **"How long do you need it?"** (L6, L7) — number box (type it), − / +, quick picks 3 days · 1 week · 2 weeks · 30 days. "3 days included, plus N extra at [PRICE] a day."
   Under it (P5): "Not sure how long? Pick your best guess. Running behind, text us before pickup and add days at [PRICE] a day."
2. **"Drop-off day"** (L8) — MM/DD field plus a Calendar button with a caret. The calendar opens a month at a time, today (shown as "Today", L17) through 90 days out, all 7 days of the week when the engine allows (L16). Only days where the chosen size is free for the whole rental are tappable; the rest are light gray (screen readers hear "not available"). The picked day is dark and the rest of the rental is shaded pink through pickup. Under it: "Drop-off [day] · Pickup [last day]". A length change that breaks the picked day clears it and reopens the calendar with "Pick a drop-off day that works for N days." Footnote in the calendar: "Gray days aren't open for N days. You can book up to 90 days out."
3. **Drop-off time** (appears once a day is picked):
   - **Standard:** "We text you a delivery window the day before." Included.
   - **Early drop-off:** limited-slots tag (L5). "Start first thing. It's in your driveway before [TIME], so you and your crew aren't waiting on us." + [PRICE].
   - **If the day is today (L17):** only **Same-day drop-off**, tag "Today only": "Need it now? We'll get it to you today, before [TIME]. We text you when we're on the way." + [PRICE].
- **Next** stays disabled until a workable day is picked.

### 3. Extras (`/book/extras`), "Anything to add?" (L9, L15)
1. **Mattresses, tires or appliances?** — counters. "Toss them in with everything else. Add them here so nothing new shows up on your bill at pickup." $35 / $35 / $45 each.
2. **Extra weight** — tag "Save $20 a ton". "Your [size] includes [tons]. Tile, drywall and plaster are heavier than they look. Go over and it's $99 a ton after pickup. Add it now for $79 a ton." No thanks / +1 ton / +2 tons. For a kitchen or bath remodel (P4) the card turns pink with "Remodel debris like tile, drywall and plaster weighs a lot more than household junk. We suggest adding 1 ton. It's cheaper now than after pickup.", and that option carries **"Our pick for your job."** Suggested, never pre-selected.
3. **Size up** (11 → 16, 16 → 21) — unchanged from rev 2.
4. **Driveway boards** — on by default, free.

### 4. Review and pay (`/book/checkout`) (L10, L11, proposed P1–P3)
"Review and pay" / "Check your rental, tell us where it's going, and pay. Tap Edit to change anything."
1. Order card: dumpster photo header ([size]-yard Pink Bin, name, included weight), then drop-off, pickup, extras (only if any), each with Edit.
2. **Where it's going:** street address with autocomplete (city and ZIP carried from the home step), optional "Where should we put it?".
3. **How to reach you:** "This rental is for" Home / Business / Contractor (company name for the last two), name, mobile ("We text your delivery window here."), email. Consent box: rental texts (checked) and deals and news (unchecked, optional), then "Reply STOP to any text to opt out." Autofill and the right phone keyboard on every field.
4. **Pay:** Apple Pay / Google Pay buttons (Stripe Express Checkout Element, shown only on devices that have them), "or pay with a card", the Stripe card form, "More ways to pay (Klarna, Affirm)". Then "You pay today $[total]" with the later-charges line (P3), **Pay $[total]**, "Need to change or cancel? Give us 24 hours before delivery."


### Leaving (any step) (L13)
× in the header, desktop exit intent (cursor heads for the tab bar or address bar) and the phone back button → "Before you go" dialog. See L13. Closing the browser tab itself can't show our dialog (see section 5).

### Returning (L18)
Home hero shows "Pick up where you left off · [size] · [days] · [date] · [total]" with **Continue**, which opens the furthest step reached. If the saved date is no longer open, Continue opens the Dates step instead.

### 5. Confirmation (`/book/confirmed`)
Same header. Dark panel: check mark, **"You're booked."**, "We just texted your confirmation." **What happens next:** the day before we text the window; delivery day we text when we're on the way (you don't need to be home if the spot is clear); pickup on the last day with a text the day before, load level with the top. Then the rental recap and amount paid, the weight add card (P6), Text us, Back to home.

## 4. Prices used and where they come from

| Item | Preview value | Source |
| --- | --- | --- |
| 3-day base 11 / 16 / 21 | $325 / $375 / $425 | Supabase `get-pricing`, Nov 22, 2026 |
| Included weight 11 / 16 / 21 | 1 / 1.5 / 2 tons | Supabase `sizes.includedTons` |
| Delivery by zone A / B / C | Free / $59 / $99 | Supabase `serviceAreas` |
| Prepaid weight | $79/ton | Supabase fee `weight_overage_prepay` |
| Weight over at landfill | $99/ton | Supabase fee `weight_overage_disposal` |
| Mattress / tire / appliance | $35 / $35 / $45 | Supabase fees `prohibited_*` |
| Early drop-off fee and time | [PRICE], [TIME] | **Not set** |
| Days Plus extra-day rate | [PRICE] | **Not set** (Marcus's admin-app pricing PR) |

The live site reads every price from Supabase at runtime. Nothing is typed into the page.

Ticket examples at today's prices: 11-yard + 1 ton = $404 · 16-yard + 1 ton = $454 · 11-yard + 1 mattress = $360.

## 5. What the real build needs (beyond the plan's section 4)

- **Availability by length:** the date list comes from Fleet for the size, start date and number of days together (a unit must be free from drop-off through pickup), and the hold re-checks it server-side.
- **Early drop-off capacity:** an admin setting for how many early drop-offs each day can take, exposed with availability, and counted **server-side when a hold is created** so two people can't take the last slot. The slots-left number shown to customers must come from that real count. Never show a made-up number.
- **Early drop-off price and time** set in Supabase.
- **Upsells on the hold:** prepaid tons and declared items saved as line items on the hold and charged through the existing Stripe flow; repricing on edit.
- **Recommendation logic:** project → size mapping lives in one place the admin can change.
- **Tracking:** an event for each upsell shown, added and removed, so we can measure average ticket and which upsells work.
- **90-day window:** the availability call returns open start dates for size + length across 90 days, plus the closest open day for a typed date. The window length is an admin setting.
- **One availability engine (L16):** the site calls the admin app's existing engine and shows what it returns. No availability rules live in the website. Same-day and Sunday cutoffs, empty/full status and turnaround time stay in the engine.
- **Same-day fee (L17):** fee, latest order time for same-day and same-day capacity are admin settings in Supabase; counted server-side on hold creation like early drop-off.
- **Weight suggestion rules (L15, P4):** one admin-editable table mapping job (and item counts) to a suggested ton amount. Rev 6 rows: kitchen or bath remodel → +1 ton; every other job → no suggestion. Sources per row in the research doc. Re-check against our own tickets once the job is saved (next bullet).
- **Save the job on the hold:** the "What are you tossing?" chip is stored on the hold and the rental, so weight and length can be checked by job. Today it isn't saved anywhere, which is why the rules lean on EPA data.
- **Express pay (P2):** Stripe Express Checkout Element above the Payment Element, same PaymentIntent. Wallets must still hand back a delivery address the customer confirms; the street field stays the source of truth.
- **Address autocomplete:** on the street field, limited to the customer's ZIP.
- **Card saved for this rental (P6, if approved):** Stripe `setup_future_usage` with clear wording at Pay, so the confirmation-page add and overage charges can be charged without chasing. Needs Marcus's decision.
- **Overstays billed:** 28 rentals since Jan 2025 ran two or more days past their booked length and 1 has an extra-day charge. If those are real overstays, billing them belongs in the admin app, not the website (research doc, section 6).
- **Pick up where you left off (L18):** the build is saved as the customer goes. During the visit it always is (the flow needs it to work). Across visits it's kept only if the customer accepted cookies in the site's cookie banner; if they decline, it's gone when they close the browser. Saved locally in the browser: size, days, date, extras, customer type. Name, phone, email and address are only kept across visits if they accepted, are cleared once they pay, and never include card data. Drafts expire after **[ASSUMPTION] 14 days** or once the drop-off date passes. On return, dates and prices are re-checked before anything is shown as available. Needs a cookie-consent banner with a preferences category (check whether one exists before building).
- **Exit interview triggers (L13):** the header ×, desktop exit intent (once per visit) and the phone back button can open our dialog. Browsers don't let a site show its own pop-up when the tab is closed; the most a site can do there is the browser's generic "Leave site?" box, which we won't use. Tab closes are still counted as drop-offs by step.
- **Leave reasons:** log `booking_exit` to `funnel_events` with step, trigger (×, exit intent, back), reason, optional text and the build so far (no card data).

## 6. Open items (next review rounds)

- Marcus is still reviewing and will send more changes.
- Early drop-off price and time.
- Days Plus extra-day rate (admin-app pricing PR).
- Whether to show a Recommended badge on a size from the home page cards too.
- Spanish version of every booking screen.
- Approve or reject P1–P6 (section 2a).
- How `rental_days` is counted and whether pickup is on the last day or the day after (needed to read the overstay data).
- Whether rentals carry sales tax (the total at Pay must include it).
- Same-day fee, latest order time and daily capacity.
- Draft expiry (14 days is a placeholder).
- **Next preview: contractor flow** (L14). Duplicate of this flow tailored to contractors: roofing with squares → weight, possibly a roofing package (idea from Marcus, Nov 25: 11-yard up to 20 squares for about $500; not decided, needs numbers). Cross-links both ways with residential.
- Leave-reason wording and list.

## 7. Revision history

| Rev | Date | Change |
| --- | --- | --- |
| 1 | Nov 22, 2026 | First clickable preview: home → size → dates → extras → details → pay (placeholder) → confirmed, real photos and Supabase prices. |
| 2 | Nov 22, 2026 | Phone frame with the bottom running-total bar (L3); desktop summary pinned (L2); benefit-led option copy (L4); limited morning slots with grayed-out full days (L5). |
| 3 | Nov 24, 2026 | Dates step reordered: days first, then drop-off day (L6); typeable day count with −/+ and quick picks (L7); dates gray out as Booked when the dumpster isn't free for the whole rental; drop-off time shows after a day is picked; Next disabled until a workable day. |
| 4 | Nov 25, 2026 | Compact date field with on-demand month calendar, 90 days out, type or tap (L8); no "Booked" label or reason, closed days just gray (L6 updated); extras reordered with a heavy-materials question and a ton recommendation (L9); "Your info" copy and consent footnote (L10); review as one photo card with drop-off, pickup, extras, address and contact (L11); one-line header with tappable steps that keep everything (L12); × with "Before you go" exit survey (L13). |
| 5 | Nov 25, 2026 | Roofing removed from residential, linked to the contractor flow (L14); weight suggestion from the job only, no new questions, heavy household items named in one line (L15); availability defined as the admin app's engine, Sundays open (L16); same-day drop-off premium (L17); pick up where you left off, cookie-consent based (L18); exit dialog × appears after 1 second and goes home, "saved on this device" line removed (L13 updated). |
| 6 | Nov 27, 2026 | Research round (Baymard, NN/g, EPA, competitor pages, our dump tickets and rental lengths). Proposed P1–P6: one checkout page (4 steps), wallets above the card form, later-charges line at Pay, evidence-based weight rules (remodel only), no days suggestion with an extend-later line, after-payment weight add on the confirmation page. Locked items unchanged until approved. |
