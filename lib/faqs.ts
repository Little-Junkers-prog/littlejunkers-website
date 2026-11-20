import { company } from "./company";
import { formatTons, formatUsd, startingTier, type Pricing, SIZE_YARDS } from "./pricing";

// FAQ content grouped by customer task (TIER-1 spec §18). Answers that state a
// price, fee, rental length or included weight are built from the canonical
// pricing contract. With no pricing they fall back to a pointer, never a number.
// The per-ton overage rate is deliberately not shown on marketing pages (charter §6).

export type Faq = { id: string; q: string; a: string; link?: { href: string; label: string }; top?: boolean };
export type FaqGroup = { id: string; title: string; items: Faq[] };

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function buildFaqs(pricing: Pricing | null): FaqGroup[] {
  const tier = pricing ? startingTier(pricing) : null;

  const cost =
    pricing && tier
      ? `For ${tier.days} days, the current base price is ${list(
          SIZE_YARDS.map((y) => `${formatUsd(tier.prices[y])} for the ${y}-yard`),
        )}. Your ZIP may add a delivery fee, and extra rental days or disposal weight can change the total. We'll confirm the full price before you reserve.`
      : "The price depends on dumpster size, rental length and your ZIP. Enter your location for the current base rate, or call us for a quote.";
  const included = pricing
    ? `Drop-off, pickup, and disposal up to the included weight: ${list(
        SIZE_YARDS.map((y) => `${formatTons(pricing.sizes[y].includedTons)} with the ${y}-yard`),
      )}. The starting price covers ${pricing.tiers[0].days} days. Outside our core area a delivery fee is added.`
    : "Drop-off, pickup, and disposal up to the included weight for your size. Ask us for the latest rental length and weight allowance.";

  const zones = pricing ? Object.values(pricing.zones).sort((a, b) => a.deliveryFee - b.deliveryFee) : [];
  const paidFees = zones.filter((z) => z.deliveryFee > 0).map((z) => formatUsd(z.deliveryFee));
  const deliveryFee =
    pricing && zones.length > 0
      ? `It depends on your ZIP. ${zones[0].deliveryFee === 0 ? "Delivery is free in our core area." : ""}${
          paidFees.length ? ` Farther out, there's a delivery fee of ${list(paidFees)}, added to the rental price.` : ""
        } Enter your ZIP and we'll show yours.`
      : "It depends on your ZIP. Enter your ZIP and we'll show the delivery fee, if there is one, before you book.";

  return [
    {
      id: "pricing",
      title: "Pricing",
      items: [
        { id: "cost", q: "How much does it cost to rent a dumpster?", a: cost, top: true },
        { id: "included", q: "What's included in the price?", a: included },
        { id: "delivery-fee", q: "Is there a delivery fee?", a: deliveryFee, link: { href: "/service-areas", label: "Check your ZIP" } },
        {
          id: "overweight",
          q: "What happens if my load is over the included weight?",
          a: `Your load is weighed at the disposal site. If it exceeds the included allowance, any additional weight charge is calculated from that scale ticket${
            pricing?.overagePerTon ? ` at ${formatUsd(pricing.overagePerTon)} per ton` : ". Ask us for the current rate"
          }.`,
        },
        {
          id: "extra-days",
          q: "Can I keep the dumpster longer?",
          a: "You can ask about an extension before your scheduled pickup. We’ll check the calendar and tell you the additional-day price before changing your rental.",
        },
      ],
    },
    {
      id: "sizes",
      title: "Sizes",
      items: [
        {
          id: "which-size",
          q: "What size dumpster do I need?",
          a: "For a small garage or one-room cleanout, start with the 11-yard. The 16- and 21-yard bins give you more room for renovations and bigger cleanouts. Tell us what you're throwing away if you're unsure; heavy materials can reach the weight limit first.",
          top: true,
        },
        {
          id: "smallest",
          q: "What's the smallest dumpster you rent?",
          a: "The 11-yard. It holds about 4 to 5 pickup-truck loads.",
          link: { href: "/11-yard-the-little-junker", label: "See the 11-yard" },
        },
        {
          id: "roofing-size",
          q: "Which size is best for roofing?",
          a: "The 11-yard or the 16-yard. Shingles are heavy, so a bigger dumpster doesn't help. Tell us the number of squares and layers and we'll help you choose.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery and pickup",
      items: [
        {
          id: "how-soon",
          q: "How soon can I get a dumpster?",
          a: "Tell us when you'd like it delivered. We'll check the schedule and confirm a date before you book.",
        },
        {
          id: "be-home",
          q: "Do I need to be home for delivery?",
          a: "Often you don't, as long as we've agreed on a drop spot and the driver can reach it. We'll confirm the details before delivery.",
        },
        {
          id: "pickup",
          q: "How does pickup work?",
          a: "We arrange pickup for the end of your rental. Before pickup, load no higher than the top rail and leave a clear path for the truck.",
        },
        {
          id: "early-pickup",
          q: "Can you pick it up early if I finish sooner?",
          a: "Text us when you're finished. We'll check whether an earlier pickup is available. Unused rental days don't carry over to another job.",
        },
        {
          id: "hours",
          q: "What are your hours?",
          a: `You can check a rental estimate online any time. We answer calls and texts ${company.hoursDisplay}.`,
        },
      ],
    },
    {
      id: "loading",
      title: "Loading and weight",
      items: [
        {
          id: "how-full",
          q: "How full can I load it?",
          a: "Level with the top. We can't haul a dumpster with debris sticking up over the sides.",
        },
        {
          id: "heavy",
          q: "Why does weight matter if everything fits?",
          a: "A dumpster can have plenty of room left and still be overweight. Shingles, tile and plaster are heavy, so check the included weight before you choose a size.",
        },
      ],
    },
    {
      id: "materials",
      title: "What can go in",
      items: [
        {
          id: "not-accepted",
          q: "What can't go in the dumpster?",
          a: "Dirt, concrete, compressed cylinders like helium tanks and fire extinguishers, hazardous chemicals, and wet or leaking paint.",
          link: { href: "/what-can-i-put-in-a-dumpster", label: "See the full list" },
          top: true,
        },
        { id: "furniture", q: "Can I put furniture in the dumpster?", a: "Yes. Couches, tables, dressers and other household furniture are fine." },
        {
          id: "shingles",
          q: "Can I put roofing shingles in the dumpster?",
          a: "Yes. They're heavy, so check the weight before you book a roofing job.",
        },
        {
          id: "batteries-oil-paint",
          q: "What should I do with batteries, oil or paint?",
          a: "Keep batteries and motor oil out of the dumpster. Set them outside at the front and tell us, and we'll coordinate recycling. Oil is limited to 10 quarts in sealed containers. Paint is fine if it's dried out or tightly sealed.",
          link: { href: "/what-can-i-put-in-a-dumpster", label: "How to set them out" },
        },
      ],
    },
    {
      id: "property",
      title: "Driveway and property",
      items: [
        {
          id: "driveway",
          q: "Will the dumpster damage my driveway?",
          a: "We deliver with a hook-lift truck instead of a full-size roll-off truck, and we look at access, overhead clearance and the surface before we set the dumpster down. If something about your driveway worries you, tell us before delivery.",
        },
        {
          id: "permit",
          q: "Do I need a permit?",
          a: "A driveway is often the easiest spot. If the bin needs to go in a street or public right-of-way, check with your local government. Your HOA may have placement rules too.",
        },
      ],
    },
    {
      id: "area",
      title: "Service area",
      items: [
        {
          id: "where",
          q: "Do you deliver to my area?",
          a: "We're based in Peachtree City and deliver across Fayette and Coweta County and nearby South Atlanta communities. Enter your ZIP to check.",
          link: { href: "/service-areas", label: "Check your ZIP" },
          top: true,
        },
        {
          id: "not-listed",
          q: "What if my city isn't listed?",
          a: `We may still deliver there. Enter your ZIP, or call or text ${company.phoneDisplay}.`,
        },
      ],
    },
    {
      id: "booking",
      title: "Booking and payment",
      items: [
        {
          id: "how-book",
          q: "How do I book?",
          a: "Start with the online estimate: choose a size, location and rental dates. We'll confirm the final price and availability before you make a reservation.",
          top: true,
        },
        {
          id: "phone",
          q: "Can I book by phone or text?",
          a: `Yes. Call or text ${company.phoneDisplay}, ${company.hoursDisplay}.`,
        },
        { id: "spanish", q: "¿Hablan español?", a: "Sí. Puede llamarnos o enviarnos un mensaje de texto en español." },
        {
          id: "junk-removal",
          q: "Do you haul away single items?",
          a: `Most of our work is dumpster rental. If you only have a few bulky items, text a photo of your pile to ${company.phoneDisplay} and we'll tell you if we can quote a pickup.`,
        },
      ],
    },
  ];
}
