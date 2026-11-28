# Checkout conversion and recommendation logic: research and our own data

**Date:** Nov 27, 2026 · **For:** Booking flow spec rev 6 (PR #14) · **Status:** Findings for Marcus's review. Nothing here is locked until he says so.

Every number about Little Junkers below comes from Supabase (`fobkdakjawryhzkcdbbo`, read-only queries run Nov 27, 2026). Every outside claim links to its source. Anything not verified is marked **[ASSUMPTION]** with the data that would settle it.

---

## 1. What the research says about checkout

**Field count matters more than step count.** Baymard's benchmark puts the average checkout at 5.1 steps and 11.3 form fields, and finds that the number of fields a shopper has to deal with hurts the experience more than the number of steps. Most sites need only about 8 fields. ([Baymard, 2024](https://baymard.com/blog/checkout-flow-average-form-fields))

**Why people abandon (US shoppers, excluding "just browsing"):** extra costs too high 40%, delivery too slow 20%, don't trust the site with a card 19%, forced account 18%, checkout too long or complicated 17%, site errors 17%, total cost not visible up front 12%, not enough payment methods 9%. ([Baymard abandonment list](https://baymard.com/lists/cart-abandonment-rate))

**Fixes Baymard and NN/g recommend that apply to us:**
- Show the full cost early, including every fee. If an exact total isn't possible, say how it's figured. ([Baymard](https://baymard.com/learn/reduce-cart-abandonment))
- Don't force offer decisions mid-checkout. Keep offers passive, or move them to the confirmation page. ([Baymard](https://baymard.com/learn/reduce-cart-abandonment)) Cross-sells that make the shopper accept or reject before going on come across as aggressive. ([Baymard cross-sells](https://baymard.com/checkout-usability/benchmark/step-type/cross-sell)) Offers on the confirmation page can be added without re-entering payment and don't scare off the buyer. ([Baymard confirmation page](https://baymard.com/blog/order-confirmation-page))
- Put wallet buttons (Apple Pay, Google Pay) as separate buttons **above** the card form. Keep less common methods behind a "more payment options" link. Trust comes from clarity and no surprises more than badges; put reassurance next to the main button. ([Baymard payment UX](https://baymard.com/learn/payment-ux))
- On phones, keep the order summary near the top, estimate fees early from the customer's location, use the right keyboard per field, and make every field work with autofill. ([NN/g mobile checkout](https://www.nngroup.com/articles/mobile-checkout-ux/))
- Guest checkout always; account creation, if ever, only after purchase. ([Baymard](https://baymard.com/blog/delayed-account-creation)) We have no accounts, so this is already met.

**Exit and recovery.** Published recovery numbers are small: Klaviyo's own benchmark puts abandoned-cart emails at about 3.33% placed-order rate. ([Klaviyo via WooCommerce](https://woocommerce.com/abandoned-cart-emails/)) Our exit dialog (L13) is a survey, not a discount pop-up. Keep it that way. A follow-up text to someone who left needs marketing consent; the rental-texts box alone doesn't cover it.

## 2. How three competitors start their online order (from their live pages, Nov 27)

| Company | First thing asked | Price shown | Notes |
| --- | --- | --- | --- |
| Bin There Dump That (Peachtree City franchise) | Delivery address ("Can we have the address of where the dumpster will be delivered?") after choosing Find Size / Book Now / Get In Touch | Not on the service-area page | Page says "transparent pricing" and "no hidden fees" but shows no dollar amounts |
| Dumpsters.com | Location, then "What are you throwing away?" (up to two, including "Heavy Stuff") | After "See Your Price" | Page gives a Peachtree City range of $420 to $879; doesn't state included tons, days or overage |
| WM | First name, last name, phone, email, customer type, frequency, address, then "Find Service" | Not stated | No weight allowance or included days stated on the page |

**Added Nov 28: 3G Waste (Indianapolis), `3gwaste.com/cart`, on the iCans booking platform.** Walked with a public address (the Indiana Statehouse); stopped before entering contact details.
1. **Cart page:** delivery address (autocomplete), "What's Going In the Dumpster?" (20+ material types), then a map to pin the exact placement. Prices appear on the size cards right after: 20-yard $450 with 3 tons, 30-yard $525 with 4 tons, both 5 days.
2. **Reserve** opens "Customize Your Rental": drop-off date or an ASAP box, delivery note, gate code, attach a photo. Running receipt on the right.
3. **Personal information:** first and last name, phone, email, SMS consent, Continue (payment follows; not seen).

What's good: price, included tons and rental length show on one screen before any personal details; placement is set on a map; the receipt stays in view. What it leaves out: no length choice (fixed 5 days), no upsells or prepaid weight, no overage rate shown before checkout, and a contractor pop-up covers the cart on load. It's three steps largely because there's nothing to choose beyond size and date. Our Extras step is where the ticket gets raised, so cutting to three would mean folding extras into another step, not dropping them.

I stopped at the first form on each site and did not submit contact details, so later steps aren't known. What's clear: none of the three shows a price before asking for something, and none states included weight on the page. Our flow (ZIP → real prices, included tons and delivery fee on the first screen) is already ahead on Baymard's top two abandonment causes.

## 3. Our own funnel (current booking app, `funnel_events`, Oct 13 – Nov 27)

| Event | Sessions |
| --- | --- |
| Size selected | 75 |
| Continued past date step | 74 |
| Date selected | 19 |
| Hold created | 18 |
| Details saved | 17 |
| Payment shown | 11 |
| Pay clicked | 8 |
| Paid | 7 |

The date step is still the biggest loss (availability, see handoff). The second biggest is **between saving details and seeing payment: 17 → 11**, then 11 → 7 at payment. That is the stretch the merged checkout targets. Small numbers, so treat it as a direction, not a measurement.

## 4. Scoring the rev 5 preview

| Check | Rev 5 | Rev 6 proposal |
| --- | --- | --- |
| Steps | 5 + confirmation | 4 + confirmation (Your info merged into Review and pay) |
| Fields the customer types | Name, mobile, email, street, optional spot, company if business (5 required) + card | Same fields, one page. Street gets address autocomplete. |
| Total first shown | Size step (from ZIP) | Same |
| Express pay | One row with Card, Apple Pay, Google Pay, Klarna, Affirm as equal chips | Apple Pay / Google Pay buttons above the card form; Klarna / Affirm behind "More ways to pay" |
| Reassurance at Pay | "Give us 24 hours before delivery" | Adds "You pay $X today. The only charges that can come later: $99 a ton over [tons], or extra days." |
| Upsell decisions | Extras step: passive, defaults set, Next always works | Same, plus a one-tap "Add 1 ton, $79" on the confirmation page |
| Places a customer can stall | Date step, Your info → Pay hop, card form | Date step, card form |

**Ask for the street address earlier?** No. The ZIP already sets the delivery fee and serviceability on the first screen. The street adds nothing to the price, and asking for it early puts a field in front of the customer before they've seen value.

## 5. Extra weight: what our data shows

Dump tickets linked to rentals (`dump_events` joined to `rentals`), 47 rentals:

| Size | Rentals with a ticket | Went over included | Over by more than 1 ton | Typical overage when over (median) |
| --- | --- | --- | --- | --- |
| 11-yard (1 ton incl.) | 23 | 6 (26%) | 2 | 0.36 ton |
| 16-yard (1.5 tons incl.) | 10 | 5 (50%) | 4 | 1.32 tons |
| 21-yard (2 tons incl.) | 14 | 4 (29%) | 1 | 0.74 ton |
| **All** | **47** | **15 (32%)** | **7** | |

One in three customers gets a weight bill after pickup. Of 12 overweight charges in `charges`, 10 are paid, 1 unpaid and 1 written off.

**What we can't tell from our data: which jobs run heavy.** Project type is not saved on rentals. `booking_surveys` has 11 answers (6 "Home Cleanout", 1 "Moving", 1 "Other", 3 blank), and `funnel_events` has one `project_selected` event. So no rule can be backed by our own job-level data yet. **Build need:** save the job chip on the hold so this can be re-run in 90 days.

**Published weights (EPA, pounds per cubic yard, loose)** ([EPA 2016](https://www.epa.gov/sites/production/files/2016-04/documents/volume_to_weight_conversion_factors_memorandum_04192016_508fnl.pdf)):

| Material | lb / cu yd |
| --- | --- |
| Household trash, uncompacted | 250–300 |
| Clean dimensional lumber, treated or painted wood | 169 |
| Carpet / pad | 147 / 62 |
| Drywall (gypsum board) | 467 |
| Mixed construction and demolition debris | 417–484 |
| Asphalt shingles | 731 |
| Concrete, loose | 860 |
| Appliances (each) | fridge 250 lb, washer 150, stove 150, dryer 125, dishwasher 125 |

Florida's measured C&D average across 10 facilities is the same 484 lb (0.24 ton) per cubic yard. ([Florida DEP](https://floridadep.gov/sites/default/files/cdconversionformulanew.pdf)) Ceramic tile is listed at 1,214 lb per cubic yard in a dumpster company's chart citing landfill data, not EPA. ([Trash Daddy](https://trashdaddydumpsters.com/dumpster-material-weights/))

**Rule table (proposed, goes in the admin-editable table, spec section 5):**

| Job chip (+ counts) | Suggest | Why |
| --- | --- | --- |
| Kitchen or bath remodel | **+1 ton** | Drywall and C&D debris weigh about 1.6 to 1.9 times household trash per yard (EPA). Our 16-yard, the size this chip picks, went over in 5 of 10 rentals, median 1.3 tons over. **[ASSUMPTION]** that those 16-yard rentals were remodels; confirm once the job chip is saved. |
| Shed or deck tear-out | **No suggestion** (was +1 ton) | Lumber is 169 lb per yard, lighter than household trash (EPA). Only concrete footings or a shingled shed roof would make it heavy, and we don't ask about those (L15). |
| 2+ appliances | **No suggestion** (was +1 ton) | Two appliances add about 0.2 ton (EPA unit weights). They're already priced per item. |
| Garage or one room, Whole house or estate | No suggestion | Household trash density. 11-yard median overage when over is 0.36 ton; 21-yard 0.74 ton. Not enough to push a ton on everyone. |

**Weight card copy.** Rev 5 names "sofa beds, solid wood furniture, tile and plaster." The published data supports tile and plaster (and drywall); it doesn't support sofa beds or furniture, which run light per yard (household items are listed around 180 lb per yard in the same industry chart). Rev 6 says "Tile, drywall and plaster are heavier than they look." This changes L15's wording, so it needs Marcus's OK.

**Selling weight after booking.** A one-tap "Add 1 ton, $79" on the confirmation page (and later in the day-before-pickup text) is the Baymard-preferred placement. Trade-off to decide: anyone who would have gone over pays $79 a ton up front instead of $99 after, so it trades $20 a ton for a charge that's already collected, can't go unpaid, and doesn't surprise anyone. It needs the card saved for this rental (Stripe `setup_future_usage`), which would also let overage charges be collected without chasing.

## 6. Extra days: what our data shows

Completed, non-cancelled rentals with a drop-off from Jan 2025 (`rentals`, 129):

- Booked length averages 3.1 days; actual (drop-off to `actual_return`) averages 4.4. Median actual is 3 days; 90th percentile 7.
- 68 ran longer than booked, 28 by two or more days, 22 ended early.
- 7-day bookings (10) ran 8.7 days on average.
- Only **2 extra-day charges** exist in `charges` (1 paid $210, 1 waived $120). Of the 28 rentals that ran two or more days long, 1 has an extra-day charge.

**[ASSUMPTION]** that "ran longer" means the customer kept it. It may instead be how `rental_days` is counted or when we schedule pickup: 2-day bookings (61, average base $299) ran 3.0 days on average, which looks like a counting convention, while 3-day bookings ran 2.9. To confirm: Marcus, does `actual_return` mean the pickup date, and is pickup on the last rental day or the day after?

**What this means.**
1. If the overstays are real, the extra day that would lift the average ticket toward $400 is already being used, just not billed. That's an operations fix (bill overstays automatically), not a website upsell.
2. We have no job-level duration data, so there's nothing to base a "remodels need a week" suggestion on.
3. A longer hold blocks a unit. With 7 units and dates already selling out (Nov 9 onward had 0 date picks because only one unit was open), pushing longer rentals up front costs other bookings. Extensions sold later, only when the engine says the unit isn't needed next, keep the fleet free.

**Proposal:** no days suggestion on the Dates step. Add one line under the day count: "Not sure how long? Pick your best guess. Running behind, text us before pickup and add days at [PRICE] a day." Then offer extensions in the day-before-pickup text when the engine shows the unit free. No new question, nothing pre-selected.

## 7. Open questions for Marcus

1. Approve the one-page checkout (changes L10, L11, L12 from 5 steps to 4)?
2. Approve the weight rule table and the new weight-card line (changes L15 wording)?
3. Post-purchase "Add 1 ton, $79": yes or no, given the $20-a-ton trade-off?
4. Save the card on file for this rental's later charges (needed for 3, and for collecting overage)?
5. How is `rental_days` counted, and is pickup on the last day or the day after?
6. Is sales tax charged on rentals? The total shown must include it if so. **[ASSUMPTION]** none, because `get-pricing` returns no tax line.
