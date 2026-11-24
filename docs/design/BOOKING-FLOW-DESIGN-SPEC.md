# Booking Flow Design Spec

**Status:** In owner review. Revision 3 on PR #14 (rev 2 merged via #13). Items marked **Locked** were approved by Marcus in review; everything else is the current draft.
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
| L6 | **Days first, then the drop-off date.** The customer picks how many days (3–30) before picking a date, because length changes what's open: a 3-day rental may fit before an existing booking when a 14-day one won't. Only dates where the chosen size is free for the whole rental can be picked; the rest show as Booked and can't be tapped. Changing the length re-checks the date; if it no longer fits, the customer is told why and picks again. | Nov 24 |
| L7 | **Days are typed or stepped.** A number box the customer can type into, − and + buttons, and quick picks (3 days, 1 week, 2 weeks, 30 days), so nobody taps + eleven times for 14 days. Out-of-range entries snap to 3–30. | Nov 24 |

## 3. The flow

### Home (`/`)
Dark hero with the real driveway photo, "Need a **dumpster?**", city/ZIP field and **Book a dumpster**. Size cards below with real photos and 3-day prices.

### 1. Size (`/book/size`)
- Delivery line: "Delivering to [city ZIP] · [delivery fee or Free delivery]".
- **"What are you tossing?"** chips: Garage or one room → 11 · Kitchen or bath remodel → 16 · Roof tear-off → 11 (tip: shingles are heavy, a bigger dumpster won't help; add weight later) · Whole house or estate → 21 · Not sure → "Text us a photo of the pile."
- Three size cards (real photos): name, fit line, 3-day price, included weight. The recommended one carries **"Our pick for this job."**

### 2. Dates (`/book/dates`)
1. **"How long do you need it?"** (L6, L7) — number box (type it), − / +, quick picks 3 days · 1 week · 2 weeks · 30 days. "3 days included, plus N extra at [PRICE] a day."
2. **"Pick your drop-off day"** — only days where the chosen size is free for the whole rental (Fleet availability for size + start date + length). Unavailable days are dashed, labeled Booked and disabled. Shows "Drop-off [day] · Pickup [last day]". If a length change makes the picked day unworkable: "[Day] doesn't work for N days. That dumpster is booked starting [date]. Pick another day or shorten the rental."
3. **Drop-off time** (appears once a day is picked):
   - **Standard:** "We text you a delivery window the day before." Included.
   - **Early drop-off:** limited-slots tag (L5). "Start first thing. It's in your driveway before [TIME], so you and your crew aren't waiting on us." + [PRICE].
- **Next** stays disabled until a workable day is picked.

### 3. Extras (`/book/extras`), "Anything to add?"
- **Extra weight** — tag "Save $20 a ton". "Skip the surprise bill. Your [size] includes [tons]. Go over and the landfill charge is $99 a ton after pickup. Add it now for $79." Options: No thanks / +1 ton / +2 tons. Roof jobs add: "Shingles get heavy fast. Not sure? Text us how many squares and layers."
- **Mattresses, tires, appliances** — counters. "Add them here and you'll know the full price now, with nothing new on your bill at pickup." $35 / $35 / $45 each.
- **Size up** (11 → 16, 16 → 21) — "Don't run out of room. … Running out halfway means a second dumpster, and that starts at $325." Shows the price difference.
- **Driveway boards** — on by default, free. "Extra care for your concrete."

### 4. Details (`/book/details`), "Who's it for?"
Home / Business / Contractor (company name for the last two). Name, mobile, email, service address, optional placement note. Two separate text consents: rental texts (checked) and deals and news (unchecked, optional), with why they're separate. Filled out once (STRATEGY-ARCHIVE §20.7).

### 5. Review and pay (`/book/pay`)
Four sections with Edit links (dumpster, dates, extras, delivery). Embedded Stripe Payment Element on our page (card, Apple Pay, Google Pay, Klarna, Affirm). One button: **Pay $[total]**. "Need to change or cancel? Give us 24 hours before delivery."

### 6. Confirmation (`/book/confirmed`)
Same header. Dark panel: check mark, **"You're booked."**, "We just texted your confirmation." **What happens next:** the day before we text the window; delivery day we text when we're on the way (you don't need to be home if the spot is clear); pickup on the last day with a text the day before, load level with the top. Then the rental recap and amount paid, Text us, Back to home.

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

## 6. Open items (next review rounds)

- Marcus is still reviewing and will send more changes.
- Early drop-off price and time.
- Days Plus extra-day rate (admin-app pricing PR).
- Whether to show a Recommended badge on a size from the home page cards too.
- Spanish version of every booking screen.

## 7. Revision history

| Rev | Date | Change |
| --- | --- | --- |
| 1 | Nov 22, 2026 | First clickable preview: home → size → dates → extras → details → pay (placeholder) → confirmed, real photos and Supabase prices. |
| 2 | Nov 22, 2026 | Phone frame with the bottom running-total bar (L3); desktop summary pinned (L2); benefit-led option copy (L4); limited morning slots with grayed-out full days (L5). |
| 3 | Nov 24, 2026 | Dates step reordered: days first, then drop-off day (L6); typeable day count with −/+ and quick picks (L7); dates gray out as Booked when the dumpster isn't free for the whole rental; drop-off time shows after a day is picked; Next disabled until a workable day. |
